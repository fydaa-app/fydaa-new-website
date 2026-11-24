"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { compact, getOrdinal } from "../lib/utils";
import { cutAtFund, projectSip } from "../lib/investmentApi";
import { horizonLabel } from "../lib/sipInvestApi";
import { FLOW_SHELL } from "../lib/layoutClasses";

const MONTHLY_TENURE = [7, 10, 20, 30];
const DAILY_TENURE = [1, 2, 3, 4];
const SIP_DAYS = [1, 5, 10, 15, 20, 25, 28];
const ASSUMED_CAGR = 12;

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₹0";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function formatDebitDate(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

function firstDebitDate(day) {
  const n = Math.min(28, Math.max(1, Number(day) || 10));
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), n);
  if (now.getDate() >= n) d.setMonth(d.getMonth() + 1);
  return d;
}

function firstDebitLabel(day) {
  return formatDebitDate(firstDebitDate(day));
}

function Progress({ step, total = 3 }) {
  return (
    <div className="flex gap-1.5 ml-auto">
      {Array.from({ length: total }, (_, i) => i + 1).map((item) => (
        <span
          key={item}
          className={`h-1.5 rounded-full ${item === step ? "w-8 bg-jade" : item < step ? "w-4 bg-jade" : "w-4 bg-border"}`}
        />
      ))}
    </div>
  );
}

function fundMinSip(fund) {
  const n = Number(fund?.minSip);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Platform caps + fund API mins (min_sip_amount / min_initial_investment). */
function amountBounds(frequency, fund) {
  const apiSip = fundMinSip(fund);
  if (frequency === "daily") {
    const min = apiSip != null ? Math.max(100, Math.min(apiSip, 1000)) : 100;
    return { min, max: 1000, step: 50 };
  }
  // Monthly SIP — never below fund SIP minimum from API.
  const min = apiSip != null ? Math.max(1000, apiSip) : 1000;
  return { min, max: 100000, step: 500 };
}

function defaultAmount(frequency, fund) {
  const { min } = amountBounds(frequency, fund);
  if (frequency === "daily") return Math.max(min, Math.min(300, 1000));
  return Math.max(min, 5000);
}

/**
 * After fund search → Start SIP: pick Daily/Monthly, amount, tenure (then date if monthly).
 */
export default function OwnFundSipFlow({ seed, onBack, onContinue }) {
  const fund = seed?.fund || null;
  const product = seed?.product || null;
  const fundName = cutAtFund(fund?.fullName || fund?.name) || fund?.name || "Selected fund";

  const [step, setStep] = useState(1);
  const [frequency, setFrequency] = useState("monthly");
  const [amount, setAmount] = useState(() => defaultAmount("monthly", fund));
  const [years, setYears] = useState(10);
  const [sipDay, setSipDay] = useState(10);

  const daily = frequency === "daily";
  const tenureOptions = daily ? DAILY_TENURE : MONTHLY_TENURE;
  const bounds = amountBounds(frequency, fund);

  // Keep amount ≥ fund SIP minimum whenever fund / frequency bounds change.
  useEffect(() => {
    setAmount((prev) => {
      if (prev < bounds.min) return bounds.min;
      if (prev > bounds.max) return bounds.max;
      return prev;
    });
  }, [bounds.min, bounds.max]);
  const yearsNum = (() => {
    const n = Number(years);
    if (!Number.isFinite(n)) return daily ? 3 : 10;
    if (daily) return Math.min(4, Math.max(1, Math.round(n)));
    return Math.min(30, Math.max(7, Math.round(n)));
  })();
  const corpus = projectSip(amount, ASSUMED_CAGR, yearsNum, daily);
  const invested = amount * (daily ? 264 : 12) * yearsNum;
  const gains = Math.max(0, corpus - invested);
  const growthPct = invested > 0 ? Math.round((gains / invested) * 100) : 0;
  const assetLabel = product?.label || "Equity";

  const ctaLabel = useMemo(
    () => (daily ? "Review payments →" : "Choose SIP date →"),
    [daily],
  );

  function switchFrequency(next) {
    if (next === frequency) return;
    setFrequency(next);
    setAmount(defaultAmount(next, fund));
    const options = next === "daily" ? DAILY_TENURE : MONTHLY_TENURE;
    setYears((prev) => (options.includes(prev) ? prev : options.includes(10) ? 10 : options[0]));
    setStep(1);
  }

  function continueToWizard({ startSetup = false } = {}) {
    onContinue?.({
      tab: product?.key || "equity",
      goalId: product?.goalId,
      amount,
      tenureYears: yearsNum,
      frequency,
      fundMode: "own",
      fund,
      monthlyDay: sipDay,
      goalName: fundName,
      fromGoals: false,
      fromOwnFund: true,
      // Monthly already picked debit date → jump to consent/mandate setup.
      startSetup,
      openReview: false,
    });
  }

  function onPrimaryAmount() {
    const clamped = Math.min(bounds.max, Math.max(bounds.min, amount));
    if (clamped !== amount) setAmount(clamped);
    if (daily) {
      // Daily → payments review in SipInvestWizard (no SIP date step).
      continueToWizard({ startSetup: false });
      return;
    }
    setStep(2);
  }

  if (!fund) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6">
        <p className="text-sm text-muted mb-4">Fund not found.</p>
        <button type="button" onClick={onBack} className="text-sm text-jade underline">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className={FLOW_SHELL}>
      <div className="flex items-center gap-3 shrink-0 mb-4 sm:mb-5">
        <button
          type="button"
          onClick={() => {
            if (step > 1) setStep(1);
            else onBack?.();
          }}
          className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface"
        >
          <ArrowLeft size={18} />
        </button>
        <Progress step={step} total={daily ? 2 : 3} />
      </div>

      {step === 1 && (
        <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto">
          <h1 className="text-[28px] sm:text-[34px] font-bold text-ink tracking-tight leading-tight">
            How much & for <span className="text-jade">how long?</span>
          </h1>
          <p className="text-sm text-muted mt-2 mb-5">
            Choose daily or monthly SIP — projected corpus updates live.
          </p>

          <div className="flex rounded-btn overflow-hidden border border-border bg-surface p-0.5 mb-6 w-full sm:w-fit">
            <button
              type="button"
              onClick={() => switchFrequency("daily")}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-[13px] font-semibold rounded-lg ${
                daily ? "bg-jade text-white" : "text-secondary"
              }`}
            >
              Daily
            </button>
            <button
              type="button"
              onClick={() => switchFrequency("monthly")}
              className={`flex-1 sm:flex-none px-5 py-2.5 text-[13px] font-semibold rounded-lg ${
                !daily ? "bg-jade text-white" : "text-secondary"
              }`}
            >
              Monthly
            </button>
          </div>

          <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
            {daily ? "Daily SIP" : "Monthly SIP"}
          </div>
          <div className="bg-white border border-border rounded-card px-5 py-4 shadow-card mb-2">
            <div className="text-[32px] font-bold text-ink tracking-tight">
              {money(amount)}
              <span className="text-base font-semibold text-muted ml-2">
                {daily ? "per day" : "per month"}
              </span>
            </div>
            <input
              type="range"
              min={bounds.min}
              max={bounds.max}
              step={bounds.step}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="w-full mt-3 accent-[#0C4A3E]"
            />
          </div>
          <p className="text-xs text-muted mb-6">
            {fundMinSip(fund)
              ? `Fund minimum SIP ${money(fundMinSip(fund))} · investing from ${money(bounds.min)}`
              : `Min ${money(bounds.min)}`}
            {" · "}Max {money(bounds.max)}
          </p>

          <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Tenure</div>
          <p className="text-xs text-muted mb-2">
            {daily
              ? "Quick picks are in years."
              : "Quick picks are in years; you can type any horizon from 7 to 30."}
          </p>
          <div className="bg-white border border-border rounded-card px-5 py-4 shadow-card mb-3 flex items-end gap-2">
            {daily ? (
              <>
                <div className="text-[32px] font-bold text-ink">{years}</div>
                <div className="text-sm text-muted mb-1.5">years</div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={years}
                  onChange={(event) => {
                    const raw = event.target.value.replace(/\D/g, "").slice(0, 2);
                    if (raw === "") {
                      setYears("");
                      return;
                    }
                    const n = Number(raw);
                    // Only 7–30. Allow "1","2","3" while typing toward 10–30.
                    if (raw.length === 1) {
                      if (n >= 1 && n <= 3) {
                        setYears(raw);
                        return;
                      }
                      if (n >= 7 && n <= 9) {
                        setYears(n);
                        return;
                      }
                      return;
                    }
                    if (n >= 7 && n <= 30) setYears(n);
                    else if (n > 30) setYears(30);
                  }}
                  onBlur={() => {
                    const n = Number(years);
                    if (!Number.isFinite(n) || n < 7) setYears(7);
                    else if (n > 30) setYears(30);
                    else setYears(Math.round(n));
                  }}
                  className="w-24 text-[32px] font-bold text-ink bg-transparent border-0 outline-none ring-0 shadow-none leading-none appearance-none focus:border-0 focus:outline-none focus:ring-0"
                  aria-label="Tenure in years"
                />
                <div className="text-sm text-muted mb-1.5">years</div>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {tenureOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setYears(option)}
                className={`px-3.5 py-2.5 rounded-btn text-xs font-semibold border ${
                  Number(years) === option ? "bg-jade text-white border-jade" : "bg-white text-secondary border-border"
                }`}
              >
                {option} {option === 1 ? "year" : "years"}
              </button>
            ))}
          </div>

          <div
            className="rounded-card overflow-hidden text-white shadow-card mb-4 p-5"
            style={{ background: "linear-gradient(160deg,#0C4A3E,#047857)" }}
          >
            <div className="flex justify-between gap-4 mb-4">
              <div>
                <div className="text-[11px] text-white/60 uppercase tracking-wider">You&apos;ll have</div>
                <div className="text-2xl sm:text-3xl font-bold">{compact(corpus)}</div>
                <div className="text-xs text-white/60 mt-0.5">in {yearsNum} years</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-white/60 uppercase tracking-wider">You invest</div>
                <div className="text-xl font-bold">{compact(invested)}</div>
              </div>
            </div>
            <div className="h-14 mb-3 opacity-80">
              <svg viewBox="0 0 240 64" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0 56 C40 52, 80 48, 120 36 S200 12, 240 4" fill="none" stroke="#6EE7B7" strokeWidth="3" />
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-white/85 border-t border-white/15 pt-3">
              <div>
                <div className="font-bold">{compact(gains)}</div>
                <div className="text-white/55">Estimated gains</div>
              </div>
              <div>
                <div className="font-bold">{growthPct}%</div>
                <div className="text-white/55">Growth</div>
              </div>
              <div>
                <div className="font-bold">{ASSUMED_CAGR}%</div>
                <div className="text-white/55">Assumed CAGR</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-btn px-3.5 py-3 flex items-center gap-2.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-jade shrink-0" />
            <span className="text-[13px] text-ink truncate flex-1">
              {assetLabel} · {(fund.fullName || fund.name || "").toUpperCase()}
            </span>
            <span className="text-[13px] font-semibold text-ink shrink-0">100%</span>
          </div>

          <button
            type="button"
            onClick={onPrimaryAmount}
            className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover"
          >
            {ctaLabel}
          </button>
        </div>
      )}

      {step === 2 && !daily && (
        <div className="flex-1 flex flex-col w-full">
          <div className="mb-6 sm:mb-8 max-w-3xl">
            <h1 className="text-[28px] sm:text-[34px] font-bold text-ink tracking-tight leading-tight">
              Pick your <span className="text-jade">SIP date</span>
            </h1>
            <p className="text-sm text-muted mt-2">When should we debit each month?</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] gap-6 items-start">
            <div className="space-y-4">
              <div>
                <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Debit date</div>
                <div className="flex flex-wrap gap-2">
                  {SIP_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSipDay(day)}
                      className={`w-12 h-12 rounded-btn text-sm font-semibold border ${
                        sipDay === day ? "bg-jade text-white border-jade" : "bg-white text-secondary border-border"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted mt-3">
                  Your SIP runs on the {sipDay}{getOrdinal(sipDay)} of every month · first debit {firstDebitLabel(sipDay)}
                </p>
              </div>

              <div
                className="rounded-card overflow-hidden text-white shadow-card"
                style={{ background: "linear-gradient(160deg,#0C4A3E,#047857)" }}
              >
                <div className="px-5 pt-5 pb-3">
                  <div className="text-lg font-bold">{fundName}</div>
                  <div className="text-sm text-white/70 mt-1">
                    1 fund · {money(amount)}/mo · {horizonLabel("monthly", yearsNum)}
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <div className="bg-white/10 rounded-btn px-4 py-3.5">
                    <div className="text-sm font-semibold uppercase leading-snug">
                      {(fund.fullName || fund.name || "").toUpperCase()}
                    </div>
                    <div className="text-xs text-white/65 mt-1">Risk Moderate · 100%</div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-8">
              <div className="bg-white border border-border rounded-card px-5 py-2 shadow-card">
                <div className="flex justify-between py-3.5 text-sm">
                  <span className="text-secondary">Monthly SIP</span>
                  <span className="font-semibold text-ink">{money(amount)}</span>
                </div>
                <div className="flex justify-between py-3.5 text-sm border-t border-border">
                  <span className="text-secondary">Transaction charges</span>
                  <span className="font-semibold text-ink">₹0</span>
                </div>
                <div className="flex justify-between py-3.5 text-sm border-t border-border">
                  <span className="font-bold text-ink">First debit</span>
                  <span className="font-bold text-emerald">{money(amount)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => continueToWizard({ startSetup: true })}
                className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover"
              >
                Review & confirm →
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-ink underline">
                Back to edit amount
              </button>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
