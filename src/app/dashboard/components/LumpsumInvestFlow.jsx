"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Landmark, QrCode, X } from "lucide-react";
import {
  loadPortfolioForSip,
  sendConsentOtp,
  tabMeta,
  userFacingMessage,
  verifyConsentOtp,
} from "../lib/sipInvestApi";
import {
  checkLumpsumReadiness,
  nextLumpsumAction,
  runLumpsumPayment,
  selectInvestmentModel,
} from "../lib/lumpsumApi";
import { WIZARD_INNER } from "../lib/layoutClasses";

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₹0";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function Progress({ step }) {
  return (
    <div className="flex gap-1.5 ml-auto">
      {[1, 2, 3].map((item) => (
        <span
          key={item}
          className={`h-1.5 rounded-full ${item === step ? "w-8 bg-jade" : item < step ? "w-4 bg-jade" : "w-4 bg-border"}`}
        />
      ))}
    </div>
  );
}

function fundPlanConflict(fund, model) {
  if (!fund || !model) return null;
  const text = `${fund.fullName || ""} ${fund.name || ""} ${fund.planType || ""}`.toUpperCase();
  const isDirect = /\bDIRECT\b/.test(text);
  const isRegular = /\bREGULAR\b/.test(text);
  if (model === "RIA" && isRegular) {
    return "This is a Regular plan. Switch to ARN or pick a Direct fund.";
  }
  if (model === "ARN" && isDirect) {
    return "This is a Direct plan. Switch to RIA or pick a Regular fund.";
  }
  return null;
}

/**
 * Home one-time invest: review (amount + method) → readiness → consent → payment gateway.
 */
export default function LumpsumInvestFlow({ open, draft, onClose, onDone, onCompleteKyc }) {
  const [page, setPage] = useState("review");
  const [readyOpen, setReadyOpen] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [readiness, setReadiness] = useState(null);
  const [consentDone, setConsentDone] = useState(false);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [editAmount, setEditAmount] = useState("");
  const [progressMsg, setProgressMsg] = useState("");
  const [failReason, setFailReason] = useState("");

  const tab = tabMeta(draft?.tab);
  const amount = Math.round(Number(editAmount || draft?.amount) || 0);
  const basketId = Number(draft?.basketId) > 0 ? Number(draft.basketId) : null;
  const fromBasket = !!basketId || !!draft?.fromBasket;
  const fundMinLump = (() => {
    const n = Number(draft?.fund?.minInitial);
    return Number.isFinite(n) && n > 0 ? n : null;
  })();
  const basketFloor = Math.max(
    1000,
    Number(draft?.minInvestment) > 0 ? Number(draft.minInvestment) : 0,
    Number(draft?.investAmount) > 0 ? Number(draft.investAmount) : 0,
  );
  const minLumpsum = fromBasket
    ? basketFloor
    : Math.max(5000, fundMinLump || 0);
  const amountLocked = fromBasket && Number(draft?.investAmount) > 0;
  const ownFund = draft?.fundMode === "own" && !fromBasket;
  const portfolioTitle = draft?.basketName || draft?.goalName || (tab?.label === "Equity" ? "Equities" : tab?.label);

  const funds = portfolio?.funds?.length
    ? portfolio.funds
    : draft?.fund
      ? [{ name: draft.fund.name, fullName: draft.fund.fullName || draft.fund.name, weight: 100, cagr: null, risk: null }]
      : [{ name: "Recommended fund", fullName: "Recommended fund", weight: 100 }];

  const conflict = fromBasket ? null : fundPlanConflict(draft?.fund || funds[0], readiness?.model);
  const action = useMemo(
    () => nextLumpsumAction({ readiness, consentDone }),
    [readiness, consentDone],
  );

  const checklist = useMemo(() => {
    if (!readiness?.checklist) return [];
    return readiness.checklist.map((item) => {
      if (item.id === "consent") return { ...item, done: consentDone };
      return item;
    });
  }, [readiness, consentDone]);

  useEffect(() => {
    if (!open || !draft) return;
    setPage("review");
    setReadyOpen(false);
    setError("");
    setConsentDone(false);
    setOtp("");
    setPaymentMethod("UPI");
    const seed = Math.round(Number(draft.amount) || 0);
    const isBasket = Number(draft.basketId) > 0;
    const floor = isBasket
      ? Math.max(
        1000,
        Number(draft.minInvestment) > 0 ? Number(draft.minInvestment) : 0,
        Number(draft.investAmount) > 0 ? Number(draft.investAmount) : 0,
      )
      : Math.max(5000, Number(draft.fund?.minInitial) > 0 ? Number(draft.fund.minInitial) : 0);
    setEditAmount(String(Math.max(seed, floor)));
    setFailReason("");
    setProgressMsg("");

    let cancelled = false;
    (async () => {
      setLoading(true);
      if (isBasket) {
        const port = await loadPortfolioForSip(null, null, draft.basketId);
        if (!cancelled) setPortfolio(port);
      } else if (!ownFund && draft.goalId) {
        const port = await loadPortfolioForSip(draft.goalId, null);
        if (!cancelled) setPortfolio(port);
      } else if (!cancelled) {
        setPortfolio(null);
      }
      if (!cancelled) setLoading(false);

      // Returning from KYC: show checklist once so user can continue (consent/pay).
      if (!cancelled && (draft.resumeReview || draft.openReview)) {
        setBusy(true);
        const ready = await checkLumpsumReadiness();
        if (cancelled) return;
        setReadiness(ready);
        setBusy(false);
        setReadyOpen(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, draft, ownFund]);

  if (!open || !draft) return null;

  async function refreshReadiness() {
    const ready = await checkLumpsumReadiness();
    setReadiness(ready);
    return ready;
  }

  async function openReadiness() {
    setError("");
    if (amount < minLumpsum) {
      setError(
        fromBasket
          ? `Minimum for this basket is ₹${minLumpsum.toLocaleString("en-IN")}`
          : `Minimum lumpsum for this fund is ₹${minLumpsum.toLocaleString("en-IN")}`,
      );
      return;
    }
    setBusy(true);
    await refreshReadiness();
    setBusy(false);
    setReadyOpen(true);
  }

  async function onReadyPrimary() {
    setError("");
    setBusy(true);
    const ready = readiness || (await refreshReadiness());
    const next = nextLumpsumAction({ readiness: ready, consentDone });

    if (next.step === "model") {
      setBusy(false);
      setPage("model");
      setReadyOpen(false);
      return;
    }
    if (next.step === "kyc" || next.step === "bank" || next.step === "nominee") {
      setBusy(false);
      onCompleteKyc?.(draft);
      return;
    }
    if (next.step === "consent") {
      const sent = await sendConsentOtp();
      setBusy(false);
      if (!sent.ok) {
        setError(userFacingMessage(sent.message, "otp not delivered, try again later"));
        return;
      }
      setReadyOpen(false);
      setPage("consent");
      return;
    }
    setBusy(false);
    setReadyOpen(false);
    await startPayment();
  }

  async function confirmOtp() {
    setError("");
    setBusy(true);
    const result = await verifyConsentOtp(otp);
    if (!result.ok) {
      setBusy(false);
      setError(userFacingMessage(result.message, "Invalid OTP"));
      return;
    }
    setConsentDone(true);
    setBusy(false);
    setPage("preparing");
    await startPayment();
  }

  async function startPayment() {
    if (conflict) {
      setError(conflict);
      setPage("review");
      return;
    }
    setError("");
    setBusy(true);
    setPage("preparing");
    setProgressMsg("Preparing payment…");
    const result = await runLumpsumPayment({
      goalId: draft.goalId,
      amount,
      fund: draft.fund,
      fundMode: draft.fundMode,
      paymentMethod,
      basketId: draft.basketId,
      onProgress: (msg) => setProgressMsg(msg || "Preparing payment…"),
    });
    setBusy(false);
    if (!result.ok) {
      if (result.submitted) {
        setPage("success");
        return;
      }
      setFailReason(userFacingMessage(result.message, "Payment could not be started"));
      setPage("fail");
      return;
    }
    if (result.paymentUrl) {
      window.location.assign(result.paymentUrl);
      return;
    }
    setPage("success");
  }

  function goBack() {
    if (page === "consent" || page === "model" || page === "preparing") {
      setPage("review");
      setReadyOpen(true);
      return;
    }
    if (page === "fail") {
      setPage("review");
      return;
    }
    onClose?.();
  }

  const progressStep = page === "success" || page === "fail" ? 3 : page === "consent" || page === "preparing" || page === "model" ? 2 : 1;
  const centerStage = true;

  return (
    <div className="fixed inset-0 z-[70] bg-bg flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div
          className={`${WIZARD_INNER} py-5 sm:py-8 min-h-full flex flex-col ${
            centerStage ? "justify-center" : ""
          }`}
        >
          <div className="w-full max-w-2xl mx-auto mb-5 flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface"
            >
              <ArrowLeft size={18} />
            </button>
            <Progress step={progressStep} />
          </div>

          {page === "review" && (
            <div className="w-full max-w-2xl mx-auto">
              <div className="mb-6">
                <h1 className="text-[28px] sm:text-[34px] font-bold text-ink tracking-tight leading-tight">
                  Review your <span className="text-emerald">investment</span>
                </h1>
                <p className="text-sm sm:text-base text-muted mt-1.5">
                  One-time purchase · pay once via UPI or netbanking.
                </p>
              </div>

              <div
                className="rounded-card overflow-hidden text-white shadow-card mb-5"
                style={{ background: "linear-gradient(160deg,#0C4A3E,#047857)" }}
              >
                <div className="px-5 sm:px-6 pt-5 pb-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-lg sm:text-xl font-bold">{portfolioTitle}</div>
                    <div className="text-sm text-white/70 mt-1">
                      {funds.length || 1} fund · {money(amount)} one-time
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider text-emerald-200 shrink-0 pt-1">
                    {(tab?.label || "EQUITY").toUpperCase()} 100%
                  </div>
                </div>
                <div className="px-4 sm:px-5 pb-4 pt-1 space-y-2.5">
                  <div className="h-1.5 rounded-full bg-white/20 overflow-hidden mx-1 sm:mx-1">
                    <div className="h-full bg-emerald-300 rounded-full" style={{ width: "100%" }} />
                  </div>
                  {loading && <div className="bg-white/10 rounded-btn px-4 py-3.5 text-sm">Loading fund…</div>}
                  {!loading && funds.map((fund) => (
                    <div key={`${fund.scheme || fund.name}`} className="bg-white/10 rounded-btn px-4 py-3.5">
                      <div className="text-sm sm:text-[15px] font-semibold uppercase leading-snug">
                        {fund.fullName || fund.name}
                      </div>
                      <div className="text-xs text-white/65 mt-1">
                        {[
                          fund.cagr != null ? `3yr CAGR ${fund.cagr}%` : null,
                          fund.risk ? `Risk ${fund.risk}` : "Risk Moderate",
                        ].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-border rounded-card px-5 py-5 shadow-card mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Amount</div>
                    <div className="flex items-center gap-1 border border-border rounded-btn px-3 py-2.5">
                      <span className="text-ink font-bold text-lg">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editAmount}
                        disabled={amountLocked}
                        onChange={(event) => setEditAmount(event.target.value.replace(/\D/g, ""))}
                        className="flex-1 outline-none text-lg font-bold text-ink bg-transparent p-0 m-0 border-0 disabled:opacity-70"
                      />
                    </div>
                    <p className="text-xs text-muted mt-1.5">
                      {amountLocked
                        ? "Amount is set on this basket."
                        : fromBasket
                          ? `Minimum ₹${minLumpsum.toLocaleString("en-IN")}`
                          : fundMinLump
                            ? `Minimum for this fund ₹${minLumpsum.toLocaleString("en-IN")}`
                            : `Minimum ₹${minLumpsum.toLocaleString("en-IN")}`}
                    </p>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Pay with</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "UPI", title: "UPI", detail: "Any UPI app", Icon: QrCode },
                        { id: "NETBANKING", title: "Netbanking", detail: "Your bank login", Icon: Landmark },
                      ].map((method) => {
                        const selected = paymentMethod === method.id;
                        const Icon = method.Icon;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            className={`relative text-left rounded-btn border px-3 py-2.5 ${
                              selected
                                ? "border-jade bg-tint"
                                : "border-border bg-white hover:border-jade"
                            }`}
                          >
                            {selected ? (
                              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-jade text-white flex items-center justify-center">
                                <Check size={10} strokeWidth={3} />
                              </span>
                            ) : null}
                            <div className="flex items-start gap-2.5 pr-4">
                              <Icon size={20} strokeWidth={1.8} className="text-ink shrink-0 mt-0.5" />
                              <span className="min-w-0">
                                <span className="block text-sm font-semibold text-ink leading-tight">{method.title}</span>
                                <span className="block text-[11px] text-muted mt-0.5 leading-snug">{method.detail}</span>
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">One-time</span>
                    <span className="font-semibold text-ink">{money(amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Transaction charges</span>
                    <span className="font-semibold text-ink">₹0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-ink">You pay today</span>
                    <span className="font-bold text-emerald">{money(amount)}</span>
                  </div>
                </div>
              </div>

              {conflict ? <div className="text-sm text-amber-700 mb-3">{conflict}</div> : null}
              {error ? <div className="text-sm text-red-600 mb-3">{error}</div> : null}

              <button
                type="button"
                disabled={busy || loading || !!conflict || amount < 1}
                onClick={openReadiness}
                className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover disabled:opacity-60"
              >
                {busy ? "Preparing…" : "Continue →"}
              </button>
              <button type="button" onClick={onClose} className="w-full mt-3 text-sm text-ink underline underline-offset-2">
                Back to edit amount
              </button>
            </div>
          )}

          {page === "model" && (
            <div className="max-w-lg mx-auto w-full bg-white border border-border rounded-card p-6 sm:p-8 shadow-card">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1">Choose investment model</h1>
              <p className="text-sm text-muted mb-6">Direct (RIA) or Regular (ARN). This cannot be changed later from here.</p>
              <div className="space-y-3 mb-4">
                {[
                  { id: "RIA", title: "Direct (RIA)", detail: "Lower expense ratio · Direct plans" },
                  { id: "ARN", title: "Regular (ARN)", detail: "Distributor / Regular plans" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      setError("");
                      const result = await selectInvestmentModel(option.id);
                      if (!result.ok) {
                        setBusy(false);
                        setError(userFacingMessage(result.message, "Could not save investment model"));
                        return;
                      }
                      await refreshReadiness();
                      setBusy(false);
                      setPage("review");
                      setReadyOpen(true);
                    }}
                    className="w-full text-left rounded-btn border border-border px-4 py-3.5 hover:border-jade"
                  >
                    <div className="text-sm font-semibold text-ink">{option.title}</div>
                    <div className="text-xs text-muted mt-0.5">{option.detail}</div>
                  </button>
                ))}
              </div>
              {error ? <div className="text-sm text-red-600">{error}</div> : null}
            </div>
          )}

          {page === "consent" && (
            <div className="max-w-lg mx-auto w-full bg-white border border-border rounded-card p-6 sm:p-8 shadow-card">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1">Verify Consent OTP</h1>
              <p className="text-sm text-muted mb-6">Enter the 6-digit OTP sent to your registered mobile.</p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-4 py-3.5 rounded-btn border border-border text-center text-2xl tracking-[0.4em] font-bold mb-4"
                placeholder="••••••"
              />
              {error ? <div className="text-sm text-red-600 mb-3">{error}</div> : null}
              <button
                type="button"
                disabled={busy || otp.length < 6}
                onClick={confirmOtp}
                className="w-full h-12 rounded-btn bg-jade text-white font-semibold disabled:opacity-60"
              >
                {busy ? "Verifying…" : "Confirm OTP"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  const sent = await sendConsentOtp();
                  setBusy(false);
                  if (!sent.ok) setError(userFacingMessage(sent.message, "OTP resend failed"));
                }}
                className="w-full mt-3 text-sm text-muted underline"
              >
                Resend OTP
              </button>
            </div>
          )}

          {page === "preparing" && (
            <div className="max-w-lg mx-auto w-full bg-white border border-border rounded-card p-6 sm:p-8 shadow-card">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1">Preparing payment</h1>
              <p className="text-sm text-muted mb-6">Creating your investment and opening the payment page…</p>
              <div className="bg-surface border border-border rounded-card p-5">
                <div className="text-sm font-semibold text-jade mb-1">{progressMsg || "Working…"}</div>
                <div className="text-xs text-muted">{money(amount)} · {paymentMethod === "NETBANKING" ? "Netbanking" : "UPI"}</div>
              </div>
              {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}
            </div>
          )}

          {page === "success" && (
            <div className="max-w-lg mx-auto text-center py-8 sm:py-14 bg-white border border-border rounded-card px-6 sm:px-10 shadow-card">
              <div className="w-14 h-14 rounded-full bg-tint text-jade flex items-center justify-center mx-auto mb-4">
                <Check size={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2">Investment submitted</h1>
              <p className="text-sm text-muted mb-6 max-w-sm mx-auto">
                {money(amount)} one-time in {funds[0]?.fullName || funds[0]?.name || tab?.label}. We will update your portfolio shortly.
              </p>
              <button
                type="button"
                onClick={() => { onDone?.(); onClose?.(); }}
                className="w-full h-12 rounded-btn bg-jade text-white font-semibold"
              >
                Continue to Dashboard
              </button>
            </div>
          )}

          {page === "fail" && (
            <div className="max-w-lg mx-auto text-center py-8 sm:py-14 bg-white border border-border rounded-card px-6 sm:px-10 shadow-card">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2">Payment could not start</h1>
              <p className="text-sm text-muted mb-2">{money(amount)} · {tab?.label}</p>
              {failReason ? <p className="text-sm text-red-600 mb-6">{failReason}</p> : null}
              <button
                type="button"
                onClick={() => { setPage("review"); setError(""); }}
                className="w-full h-12 rounded-btn bg-jade text-white font-semibold"
              >
                Try again
              </button>
              <button type="button" onClick={onClose} className="w-full mt-3 text-sm text-ink underline">
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>

      {readyOpen && (
        <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center p-4 sm:p-6">
          <div
            className="bg-white w-full max-w-[440px] rounded-2xl shadow-elevated overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lump-ready-title"
          >
            <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id="lump-ready-title" className="text-xl font-bold text-ink leading-none">
                  Review & confirm
                </h2>
                <p className="text-sm text-muted mt-1.5 leading-snug">
                  Finish setup before payment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReadyOpen(false)}
                className="w-8 h-8 -mt-0.5 -mr-1 rounded-full hover:bg-surface flex items-center justify-center shrink-0"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-5 pb-1 overflow-y-auto min-h-0">
              <div className="border-t border-border">
                {[
                  ["One-time", money(amount)],
                  ["Fund", funds[0]?.fullName || funds[0]?.name || draft.fund?.name || "Recommended fund"],
                  ["Pay with", paymentMethod === "NETBANKING" ? "Netbanking" : "UPI"],
                  ["Goal", tab?.label || "—"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 py-3 border-b border-border text-sm"
                  >
                    <span className="text-ink shrink-0 pt-px">{label}</span>
                    <span className="text-ink text-right leading-5 break-words min-w-0 max-w-[62%]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border border-border rounded-xl px-4 py-3.5">
                <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">
                  Setup checklist
                </div>
                <div className="space-y-3.5">
                  {checklist.map((item) => (
                    <div key={item.id} className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          item.done ? "bg-emerald text-white" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.done ? "✓" : "×"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-ink leading-5">{item.label}</div>
                        <div className="text-xs text-muted mt-0.5 leading-4">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 pt-4 pb-5 flex flex-col gap-3">
              {error ? <div className="text-sm text-red-600 leading-5 -mt-1">{error}</div> : null}
              <button
                type="button"
                disabled={busy}
                onClick={onReadyPrimary}
                className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold disabled:opacity-60"
              >
                {busy ? "Working…" : action.label}
              </button>
              <button
                type="button"
                onClick={() => setReadyOpen(false)}
                className="w-full text-sm text-ink underline underline-offset-2"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
