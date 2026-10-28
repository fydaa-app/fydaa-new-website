"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import FundSearchOverlay from "./FundSearchOverlay";
import InvestModeSheet from "./InvestModeSheet";
import {
  createCustomBasket,
  equalWeights,
  firstPurchaseMin,
  requiredBasketAmount,
  seedWeights,
  updateCustomBasket,
  weightsSumOk,
} from "../lib/basketApi";
import { FLOW_SHELL } from "../lib/layoutClasses";

const MIN_FUNDS = 2;
const MAX_FUNDS = 5;
const AMOUNT_FLOOR = 1000;

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₹0";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function fundMfId(fund) {
  return Number(fund?.localMfId ?? fund?.mfId ?? fund?.id) || 0;
}

function mapPickedFund(fund) {
  const mfId = fundMfId(fund);
  const name = String(fund?.name || fund?.fullName || "").trim() || `Fund ${mfId}`;
  return {
    mfId,
    name,
    fullName: fund?.name || name,
    scheme: String(fund?.scheme || "").trim(),
    minSip: Number(fund?.minSip) > 0 ? Number(fund.minSip) : null,
    minInitial: Number(fund?.minInitial) > 0 ? Number(fund.minInitial) : null,
    sipAllowed: fund?.sipAllowed !== false,
    purchaseAllowed: fund?.purchaseAllowed !== false,
    weight: 0,
  };
}

function StepBar({ step }) {
  const pct = step === 1 ? "33%" : step === 2 ? "66%" : "100%";
  return (
    <div className="mb-4">
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div className="h-full bg-jade rounded-full transition-all" style={{ width: pct }} />
      </div>
      <div className="text-[13px] font-semibold text-ink mt-2">Step {step} of 3</div>
    </div>
  );
}

function mapBasketFunds(list) {
  return (list || [])
    .map((fund) => {
      const mfId = Number(fund.mfId || fund.localMfId || fund.id) || 0;
      if (mfId <= 0) return null;
      return {
        mfId,
        name: fund.name || fund.fullName || `Fund ${mfId}`,
        fullName: fund.fullName || fund.name || `Fund ${mfId}`,
        scheme: String(fund.scheme || "").trim(),
        minSip: Number(fund.minSip) > 0 ? Number(fund.minSip) : null,
        minInitial: Number(fund.minInitial) > 0 ? Number(fund.minInitial) : null,
        sipAllowed: true,
        purchaseAllowed: true,
        weight: Math.round(Number(fund.weight) || 0),
      };
    })
    .filter(Boolean);
}

/**
 * Create or edit custom basket: mode sheet (create only) → funds → weights → name.
 * Edit: no mode change; save via PATCH (no auto-invest).
 */
export default function CreateBasketFlow({ open, onClose, onCreated, onSaved, editBasket }) {
  const [mode, setMode] = useState(null); // SIP | LUMPSUM
  const [step, setStep] = useState(1);
  const [funds, setFunds] = useState([]);
  const [amount, setAmount] = useState(AMOUNT_FLOOR);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isEdit = Number(editBasket?.id) > 0;
  const isSip = mode === "SIP";

  useEffect(() => {
    if (!open) return;
    setSearchOpen(false);
    setError("");
    setBusy(false);
    setStep(1);
    if (isEdit && editBasket) {
      const nextMode = String(editBasket.investmentMode || "").toUpperCase() === "LUMPSUM"
        ? "LUMPSUM"
        : "SIP";
      setMode(nextMode);
      const mapped = mapBasketFunds(editBasket.funds);
      setFunds(mapped.length ? mapped : []);
      setAmount(
        Math.max(
          AMOUNT_FLOOR,
          Number(editBasket.investAmount) || Number(editBasket.minInvestment) || AMOUNT_FLOOR,
        ),
      );
      setName(editBasket.name || "");
      setDescription(editBasket.description || "");
      return;
    }
    setMode(null);
    setFunds([]);
    setAmount(AMOUNT_FLOOR);
    setName("");
    setDescription("");
  }, [open, isEdit, editBasket]);

  const minRequired = useMemo(
    () => requiredBasketAmount(funds, AMOUNT_FLOOR),
    [funds],
  );

  useEffect(() => {
    if (step !== 2) return;
    setAmount((prev) => Math.max(Number(prev) || 0, minRequired));
  }, [minRequired, step]);

  const weightTotal = funds.reduce((sum, fund) => sum + (Number(fund.weight) || 0), 0);
  const weightsOk = weightsSumOk(funds);
  const amountOk = Math.round(Number(amount) || 0) >= minRequired;
  const nameOk = String(name || "").trim().length > 0;

  function applyWeights(nextFunds, weightList) {
    return nextFunds.map((fund, index) => ({
      ...fund,
      weight: weightList[index] ?? 0,
    }));
  }

  function addFund(raw) {
    setError("");
    const picked = mapPickedFund(raw);
    if (picked.mfId <= 0) {
      setError("This fund cannot be added (missing fund id).");
      return;
    }
    if (funds.some((fund) => fund.mfId === picked.mfId)) {
      setError("Fund already added.");
      return;
    }
    if (funds.length >= MAX_FUNDS) {
      setError("Up to 5 funds only.");
      return;
    }
    if (isSip && picked.sipAllowed === false) {
      setError("This fund does not allow SIP.");
      return;
    }
    if (!isSip && picked.purchaseAllowed === false) {
      setError("This fund does not allow purchase.");
      return;
    }
    const next = [...funds, picked];
    const weights = seedWeights(next.length);
    setFunds(applyWeights(next, weights));
    setSearchOpen(false);
  }

  function removeFund(mfId) {
    const next = funds.filter((fund) => fund.mfId !== mfId);
    setFunds(next.length ? applyWeights(next, seedWeights(next.length)) : []);
    setError("");
  }

  function bumpWeight(index, delta) {
    setFunds((prev) => {
      const rows = prev.map((fund) => ({ ...fund }));
      const current = Number(rows[index]?.weight) || 0;
      const nextVal = Math.min(99, Math.max(1, current + delta));
      if (nextVal === current) return prev;
      rows[index] = { ...rows[index], weight: nextVal };
      return rows;
    });
  }

  function setEqualSplit() {
    setFunds((prev) => applyWeights(prev, equalWeights(prev.length)));
  }

  function goWeights() {
    if (funds.length < MIN_FUNDS) {
      setError(`Add at least ${MIN_FUNDS} funds`);
      return;
    }
    setError("");
    setAmount(Math.max(AMOUNT_FLOOR, requiredBasketAmount(funds, AMOUNT_FLOOR)));
    setStep(2);
  }

  function goName() {
    if (!weightsOk) {
      setError("Weights must add up to 100%");
      return;
    }
    if (!amountOk) {
      setError(`Minimum ${money(minRequired)}`);
      return;
    }
    // Soft check each weighted leg covers first purchase.
    for (const fund of funds) {
      const leg = Math.floor((Math.round(Number(amount) || 0) * Number(fund.weight)) / 100);
      const need = firstPurchaseMin(fund);
      if (need > 0 && leg < need) {
        setError(`${fund.name}: allocation ${money(leg)} is below first buy ${money(need)}`);
        return;
      }
    }
    setError("");
    setStep(3);
  }

  async function submitCreate() {
    if (!nameOk) {
      setError("Basket name is required");
      return;
    }
    setBusy(true);
    setError("");
    if (isEdit) {
      const result = await updateCustomBasket({
        basketId: editBasket.id,
        name,
        description,
        investAmount: Math.round(Number(amount) || 0),
        funds,
      });
      setBusy(false);
      if (!result.ok) {
        setError(result.message || "Could not update basket. Please try again.");
        return;
      }
      onSaved?.(result.basket || { ...editBasket, name, description, investAmount: amount, funds });
      return;
    }
    const result = await createCustomBasket({
      name,
      description,
      investmentMode: mode,
      investAmount: Math.round(Number(amount) || 0),
      funds,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.message || "Could not create basket. Please try again.");
      return;
    }
    onCreated?.(result.basket, mode);
  }

  if (!open) return null;

  // Mode picker sheet before the 3-step flow (create only).
  if (!mode) {
    return (
      <InvestModeSheet
        open
        title="Create a basket"
        subtitle="Start a monthly SIP or invest a one-time amount"
        sipDetail="Monthly SIP from ₹1000"
        lumpDetail="Invest a single amount from ₹1000"
        onClose={onClose}
        onPickSip={() => setMode("SIP")}
        onPickLumpsum={() => setMode("LUMPSUM")}
      />
    );
  }

  const titles = {
    1: { title: "Pick funds", sub: "2 to 5 funds" },
    2: {
      title: "Set weights",
      sub: isSip
        ? "Enter SIP amount, then set weights to 100%"
        : "Enter lumpsum amount, then set weights to 100%",
    },
    3: {
      title: "Name your basket",
      sub: isEdit
        ? "Save changes to this basket"
        : isSip
          ? "Then we'll start your monthly SIP"
          : "Then we'll start your one-time investment",
    },
  };

  return (
    <div className="fixed inset-0 z-[80] bg-bg flex flex-col overflow-hidden">
      <div className={`${FLOW_SHELL} flex-1 min-h-0 overflow-y-auto`}>
        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            onClick={() => {
              if (step === 1) {
                if (isEdit) onClose?.();
                else setMode(null);
                return;
              }
              setError("");
              setStep((s) => s - 1);
            }}
            className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0 flex-1 text-center pr-10">
            <h1 className="text-lg sm:text-xl font-bold text-ink">{titles[step].title}</h1>
            <p className="text-xs sm:text-sm text-muted mt-0.5">{titles[step].sub}</p>
          </div>
        </div>

        <StepBar step={step} />

        {step === 1 && (
          <div className="flex flex-col min-h-[60vh]">
            <div className="text-sm text-muted mb-4">
              {funds.length} of {MAX_FUNDS} selected
            </div>

            <div className="space-y-2.5 mb-4">
              {funds.map((fund) => (
                <div
                  key={fund.mfId}
                  className="relative bg-white border border-border rounded-card px-4 py-3.5 shadow-card pr-10"
                >
                  <div className="text-[13px] sm:text-sm font-semibold text-ink uppercase leading-snug">
                    {fund.fullName || fund.name}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    First buy {money(fund.minInitial || firstPurchaseMin(fund) || 0)}
                    {" · "}
                    SIP {money(fund.minSip || 0)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFund(fund.mfId)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full hover:bg-surface flex items-center justify-center text-muted"
                    aria-label="Remove fund"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {funds.length < MAX_FUNDS ? (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-btn border border-border bg-white text-jade text-[15px] font-semibold hover:border-jade hover:bg-tint/40"
              >
                <Plus size={18} />
                {funds.length ? "Add another fund" : "Search and add a fund"}
              </button>
            ) : null}

            {error ? <div className="text-sm text-red-600 mt-4 text-center">{error}</div> : null}

            <div className="mt-auto pt-8">
              <button
                type="button"
                disabled={funds.length < MIN_FUNDS}
                onClick={goWeights}
                className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover disabled:opacity-45 disabled:bg-border disabled:text-white"
              >
                {funds.length >= MIN_FUNDS
                  ? "Set weights →"
                  : funds.length === 1
                    ? "Add one more fund"
                    : "Add at least 2 funds"}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col pb-6">
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
              {isSip ? "Monthly SIP amount" : "Lumpsum amount"}
            </div>
            <div className="bg-white border border-border rounded-card px-4 py-3.5 shadow-card mb-2">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-ink">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount || ""}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 8);
                    setAmount(digits ? Number(digits) : 0);
                    setError("");
                  }}
                  className="flex-1 outline-none text-xl font-bold text-ink bg-transparent border-0 p-0"
                />
              </div>
            </div>
            <p className="text-xs text-muted mb-5">
              Each fund’s share must cover first purchase and monthly SIP. Minimum {money(minRequired)}.
            </p>

            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="text-[11px] font-bold text-muted uppercase tracking-wider">Allocation</div>
              <div className="flex items-center gap-3 text-[13px]">
                <span className={`font-semibold ${Math.abs(weightTotal - 100) <= 0.51 ? "text-jade" : "text-red-600"}`}>
                  Total {Math.round(weightTotal)}%
                </span>
                <button type="button" onClick={setEqualSplit} className="font-semibold text-jade hover:underline">
                  Equal split
                </button>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              {funds.map((fund, index) => {
                const leg = Math.floor((Math.round(Number(amount) || 0) * Number(fund.weight)) / 100);
                return (
                  <div
                    key={fund.mfId}
                    className="bg-white border border-border rounded-card px-4 py-3.5 shadow-card"
                  >
                    <div className="text-[13px] font-semibold text-ink uppercase leading-snug mb-1">
                      {fund.fullName || fund.name}
                    </div>
                    <div className="text-xs text-muted mb-3">
                      {money(leg)} of this {isSip ? "SIP" : "amount"}
                      {" · "}First buy {money(fund.minInitial || firstPurchaseMin(fund) || 0)}
                      {" · "}SIP {money(fund.minSip || 0)}
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => bumpWeight(index, -1)}
                        className="w-9 h-9 rounded-full border border-border text-lg font-semibold text-ink hover:bg-surface"
                      >
                        −
                      </button>
                      <span className="text-base font-bold text-ink w-12 text-center">{fund.weight}%</span>
                      <button
                        type="button"
                        onClick={() => bumpWeight(index, 1)}
                        className="w-9 h-9 rounded-full border border-border text-lg font-semibold text-ink hover:bg-surface"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {error ? <div className="text-sm text-red-600 mb-3 text-center">{error}</div> : null}

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[13px] text-muted underline text-center mb-3"
            >
              Back to funds
            </button>
            <button
              type="button"
              disabled={!weightsOk || !amountOk}
              onClick={goName}
              className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover disabled:opacity-45"
            >
              Name your basket →
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col pb-6 max-w-xl mx-auto w-full">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
              Basket name
            </label>
            <input
              type="text"
              value={name}
              maxLength={48}
              placeholder="e.g. My aggressive mix"
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              className="w-full px-4 py-3 rounded-btn border border-jade bg-white text-[15px] text-ink outline-none mb-4"
            />

            <label className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              maxLength={140}
              placeholder="What this mix is for"
              rows={3}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full px-4 py-3 rounded-btn border border-border bg-white text-[15px] text-ink outline-none resize-none mb-6"
            />

            {error ? <div className="text-sm text-red-600 mb-3 text-center">{error}</div> : null}

            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-[13px] text-muted underline text-center mb-3"
            >
              Back to weights
            </button>
            <button
              type="button"
              disabled={!nameOk || busy}
              onClick={submitCreate}
              className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover disabled:opacity-45 disabled:bg-border"
            >
              {busy
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save basket →"
                  : isSip
                    ? "Create and start SIP →"
                    : "Create and invest lumpsum →"}
            </button>
          </div>
        )}
      </div>

      <FundSearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={addFund}
      />
    </div>
  );
}
