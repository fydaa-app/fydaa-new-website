"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, X } from "lucide-react";
import { compact, getOrdinal, sipFV } from "../lib/utils";
import { loadGoals, loadRecommendedForGoal, PRODUCT_TABS } from "../lib/investmentApi";
import {
  checkInvestReadiness,
  horizonLabel,
  loadPortfolioForSip,
  nextReviewAction,
  tabMeta,
} from "../lib/sipInvestApi";
import { FLOW_SHELL } from "../lib/layoutClasses";

const AMOUNT_CHIPS = [1000, 5000, 10000, 20000];
const SIP_DAYS = [1, 5, 10, 15, 20, 25, 28];

export function tenureOptionsForBadge(badge) {
  const text = String(badge || "").toLowerCase();
  if (text.includes("up to 3")) return [1, 2, 3];
  if (text.includes("3 to 7")) return [3, 4, 5, 6, 7];
  return [7, 10, 15, 20, 25];
}

/** Short 6% · Medium 10% · Long 12% — fixed illustrative rates by goal band. */
export function assumedCagrForBadge(badge) {
  const text = String(badge || "").toLowerCase();
  if (text.includes("up to 3")) return 6;
  if (text.includes("3 to 7")) return 10;
  return 12;
}

function clampTenure(years, options) {
  const list = options?.length ? options : [3];
  const n = Number(years);
  if (list.includes(n)) return n;
  return list.reduce((best, opt) => (Math.abs(opt - n) < Math.abs(best - n) ? opt : best), list[0]);
}

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

function nextDebitLabel(day) {
  const first = firstDebitDate(day);
  const next = new Date(first.getFullYear(), first.getMonth() + 1, first.getDate());
  return formatDebitDate(next);
}

/**
 * Goal SIP setup (amount → date). Consent / mandate stay in SipInvestWizard.
 */
export default function GoalSipFlow({ goal, onBack, onContinue, onCompleteKyc }) {
  const tenureOptions = useMemo(
    () => tenureOptionsForBadge(goal?.badge),
    [goal?.badge],
  );
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(() => {
    const seed = Number(goal?.seedAmount);
    return Number.isFinite(seed) && seed > 0 ? seed : 10000;
  });
  const [years, setYears] = useState(() => clampTenure(goal?.years, tenureOptionsForBadge(goal?.badge)));
  const [sipDay, setSipDay] = useState(10);
  const [autoOpen, setAutoOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [goalId, setGoalId] = useState(() => {
    const id = Number(goal?.productGoalId);
    return Number.isFinite(id) && id > 0 ? id : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [readiness, setReadiness] = useState(null);

  const cagr = assumedCagrForBadge(goal?.badge);
  const corpus = sipFV(amount, cagr, years);
  const invested = amount * years * 12;
  const gains = Math.max(0, corpus - invested);
  const growthPct = invested > 0 ? Math.round((gains / invested) * 100) : 0;
  const funds = portfolio?.funds || [];
  const splitLabel = funds[0]?.assetClass
    || funds[0]?.label?.split("·")[0]?.trim()
    || "Equity";
  const reviewAction = useMemo(
    () => nextReviewAction({ readiness, consentDone: false, mandateDone: false }),
    [readiness],
  );
  const checklist = useMemo(() => readiness?.checklist || [], [readiness]);

  useEffect(() => {
    setYears(clampTenure(goal?.years, tenureOptions));
  }, [goal?.years, tenureOptions]);

  useEffect(() => {
    if (!goal?.name && !goal?.productGoalId) return undefined;
    let cancelled = false;
    setLoading(true);
    setError("");
    loadGoals()
      .then(async (goalsById) => {
        if (cancelled) return;
        const seededId = Number(goal.productGoalId);
        const target = String(goal.name || "").trim().toLowerCase();
        const list = Object.values(goalsById || {});
        const match = (Number.isFinite(seededId) && seededId > 0 && goalsById[seededId])
          || list.find((item) => String(item.name || "").trim().toLowerCase() === target)
          || list.find((item) => {
            const name = String(item.name || "").trim().toLowerCase();
            return name.includes(target) || target.includes(name);
          });
        const id = match?.id ?? (Number.isFinite(seededId) && seededId > 0 ? seededId : null);
        setGoalId(id);
        if (!id) {
          setPortfolio(null);
          setLoading(false);
          return;
        }
        let port = await loadPortfolioForSip(id, null);
        if ((!port?.funds || port.funds.length === 0)) {
          const fund = await loadRecommendedForGoal(id);
          if (fund?.name) {
            port = {
              ...(port || {}),
              portfolioId: fund.portfolioId ?? port?.portfolioId ?? null,
              funds: [{
                name: fund.name,
                fullName: fund.fullName || fund.name,
                label: fund.name,
                assetClass: null,
                scheme: fund.scheme,
                id: fund.id,
                weight: 100,
                cagr: null,
                risk: null,
              }],
              rate: port?.rate ?? null,
              message: "",
            };
          }
        }
        if (cancelled) return;
        setPortfolio(port);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [goal?.name, goal?.productGoalId]);

  useEffect(() => {
    if (step !== 2) return undefined;
    let cancelled = false;
    checkInvestReadiness().then((ready) => {
      if (!cancelled) setReadiness(ready);
    });
    return () => {
      cancelled = true;
    };
  }, [step]);

  async function openReviewSheet() {
    setError("");
    setBusy(true);
    const ready = readiness || await checkInvestReadiness();
    setReadiness(ready);
    setBusy(false);
    setReviewOpen(true);
  }

  function continueToWizard() {
    if (!goalId) {
      setError("This goal is not available yet.");
      return;
    }
    if (reviewAction.step === "kyc" || reviewAction.step === "bank" || reviewAction.step === "nominee") {
      const productTab = PRODUCT_TABS.find((item) => item.goalId === goalId);
      onCompleteKyc?.({
        tab: productTab?.key || "equity",
        goalId,
        goalName: goal?.name,
        amount,
        tenureYears: years,
        frequency: "monthly",
        fundMode: "rec",
        fund: null,
        monthlyDay: sipDay,
        fromGoals: true,
        openReview: true,
        resumeReview: true,
      });
      return;
    }
    const productTab = PRODUCT_TABS.find((item) => item.goalId === goalId);
    setBusy(true);
    setReviewOpen(false);
    onContinue?.({
      tab: productTab?.key || "equity",
      goalId,
      goalName: goal.name,
      goalBadge: goal.badge,
      amount,
      tenureYears: years,
      frequency: "monthly",
      fundMode: "rec",
      fund: null,
      monthlyDay: sipDay,
      fromGoals: true,
      openReview: false,
      startSetup: true,
    });
    setBusy(false);
  }

  return (
    <div className={FLOW_SHELL}>
      <div className="flex items-center gap-3 shrink-0 mb-4 sm:mb-5">
        <button
          type="button"
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else onBack?.();
          }}
          className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex gap-1.5 ml-auto">
          {[1, 2].map((item) => (
            <span
              key={item}
              className={`h-1.5 rounded-full ${item === step ? "w-8 bg-jade" : item < step ? "w-4 bg-jade" : "w-4 bg-border"}`}
            />
          ))}
        </div>
      </div>
      <div className={`flex-1 flex flex-col ${step === 2 ? "justify-center" : ""}`}>

      {step === 1 && (
        <>
          <h1 className="text-[28px] sm:text-[36px] font-bold text-ink tracking-tight leading-tight max-w-3xl">
            How much & for <span className="text-jade">how long?</span>
          </h1>
          <p className="text-sm sm:text-base text-muted mt-2 mb-6 sm:mb-8">Set your monthly SIP — watch the corpus grow live.</p>

          <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Monthly SIP</div>
          <div className="bg-white border border-border rounded-card px-5 py-4 shadow-card mb-3">
            <div className="text-[32px] font-bold text-ink tracking-tight">{money(amount)}</div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={500}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="w-full mt-3 accent-[#0C4A3E]"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {AMOUNT_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setAmount(chip)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold border ${
                  amount === chip ? "bg-jade text-white border-jade" : "bg-white text-secondary border-border"
                }`}
              >
                {chip >= 1000 ? `₹${chip / 1000}K` : money(chip)}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Tenure</div>
          <div className="bg-white border border-border rounded-card px-5 py-4 shadow-card mb-3 flex items-end justify-between">
            <div className="text-[32px] font-bold text-ink">{years}</div>
            <div className="text-sm text-muted mb-1.5">years</div>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {tenureOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setYears(option)}
                className={`px-3.5 py-2.5 rounded-btn text-xs font-semibold border ${
                  years === option ? "bg-jade text-white border-jade" : "bg-white text-secondary border-border"
                }`}
              >
                {option} {option === 1 ? "year" : "years"}
              </button>
            ))}
          </div>
          {goal?.badge ? (
            <div className="mb-6">
              <span className="inline-flex text-[10px] font-semibold text-jade bg-tint px-2.5 py-1 rounded-md">
                {goal.badge}
              </span>
            </div>
          ) : (
            <div className="mb-6" />
          )}

          <div
            className="rounded-card p-5 mb-4 text-white"
            style={{ background: "linear-gradient(160deg,#0C4A3E,#047857)" }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/70">You&apos;ll have</div>
                <div className="text-2xl font-bold mt-1">{compact(corpus)} <span className="text-base font-semibold text-white/80">in {years} years</span></div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/70">You invest</div>
                <div className="text-lg font-bold mt-1">{compact(invested)}</div>
              </div>
            </div>
            <div className="h-16 mb-4 opacity-80">
              <svg viewBox="0 0 240 64" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0 56 C40 52, 80 48, 120 36 S200 12, 240 4" fill="none" stroke="#6EE7B7" strokeWidth="3" />
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <div className="font-bold">{compact(gains)}</div>
                <div className="text-[11px] text-white/65">Estimated gains</div>
              </div>
              <div>
                <div className="font-bold">{growthPct}%</div>
                <div className="text-[11px] text-white/65">Growth</div>
              </div>
              <div>
                <div className="font-bold">{cagr}%</div>
                <div className="text-[11px] text-white/65">Assumed CAGR</div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted mb-5 leading-relaxed">
            <span className="font-semibold text-secondary">Assumption:</span>{" "}
            Illustrative corpus at {cagr}% p.a. blended. Your live split follows {splitLabel}. Returns not guaranteed.
          </p>

          <div className="mb-5">
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
              {loading
                ? "Split across funds"
                : `Split across ${Math.max(funds.length, 1)} fund${funds.length === 1 || !funds.length ? "" : "s"}`}
            </div>
            {loading && (
              <div className="bg-white border border-border rounded-card px-4 py-3 text-sm text-muted">
                Loading fund…
              </div>
            )}
            {!loading && funds.map((fund) => (
              <div
                key={`${fund.scheme || fund.name}`}
                className="bg-white border border-border rounded-card px-4 py-3 flex items-start gap-2.5 mb-2 last:mb-0"
              >
                <span className="w-2 h-2 rounded-full bg-jade shrink-0 mt-1.5" />
                <span className="text-sm font-medium text-ink flex-1 leading-snug break-words">
                  {fund.label || fund.fullName || fund.name}
                </span>
                <span className="text-sm font-semibold text-ink shrink-0">
                  {Math.round(Number(fund.weight) || 100)}%
                </span>
              </div>
            ))}
          </div>

          {error ? <div className="text-sm text-red-600 mb-3">{error}</div> : null}

          <button
            type="button"
            disabled={loading || !goalId}
            onClick={() => setStep(2)}
            className="w-full py-3.5 rounded-btn bg-jade text-white text-[15px] font-semibold disabled:opacity-60"
          >
            {loading ? "Loading…" : "Choose SIP date →"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="mb-6 sm:mb-8 max-w-3xl">
            <h1 className="text-[28px] sm:text-[36px] font-bold text-ink tracking-tight leading-tight">
              Pick your <span className="text-jade">SIP date</span>
            </h1>
            <p className="text-sm sm:text-base text-muted mt-2">When should we debit each month?</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px] gap-6 lg:gap-8 items-start">
            <div className="min-w-0 space-y-5">
              <div>
                <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Debit date</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {SIP_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSipDay(day)}
                      className={`w-12 h-12 rounded-btn text-sm font-semibold border ${
                        sipDay === day ? "bg-jade text-white border-jade" : "bg-white text-secondary border-border hover:border-jade"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted">
                  Your SIP runs on the {sipDay}{getOrdinal(sipDay)} of every month · first debit {firstDebitLabel(sipDay)}
                </p>
              </div>

              <div className="bg-white border border-border rounded-card overflow-hidden shadow-card">
                <button
                  type="button"
                  onClick={() => setAutoOpen((value) => !value)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-surface/60"
                >
                  <span className="w-9 h-9 rounded-lg bg-tint text-jade text-sm font-bold flex items-center justify-center shrink-0">i</span>
                  <span className="flex-1 text-sm sm:text-[15px] font-semibold text-ink">How the auto-debit works</span>
                  <ChevronDown size={16} className={`text-muted shrink-0 transition-transform ${autoOpen ? "rotate-180" : ""}`} />
                </button>
                {autoOpen && (
                  <div className="px-5 pb-5 pt-1 grid sm:grid-cols-3 gap-4 sm:gap-5">
                    {[
                      {
                        title: "Set up UPI AutoPay",
                        detail: "One-time mandate approval via your UPI app",
                      },
                      {
                        title: "First debit",
                        detail: `${money(amount)} on ${firstDebitLabel(sipDay)} after mandate approval`,
                      },
                      {
                        title: "Auto-debit monthly",
                        detail: `${money(amount)} on the ${sipDay}${getOrdinal(sipDay)} each month · pause or cancel anytime`,
                      },
                    ].map((item, index) => (
                      <div key={item.title} className="flex sm:flex-col gap-3">
                        <span className="w-7 h-7 rounded-full bg-tint text-jade text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-ink leading-5">{item.title}</div>
                          <div className="text-xs text-muted mt-1 leading-relaxed">{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Your portfolio</div>
                <div className="rounded-card overflow-hidden text-white shadow-card" style={{ background: "linear-gradient(160deg,#0C4A3E,#047857)" }}>
                  <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3">
                    <div className="text-lg sm:text-xl font-bold">{goal?.name}</div>
                    <div className="text-sm text-white/70 mt-1">
                      {goal?.badge || "Goal"} · {Math.max(funds.length, 1)} fund · {money(amount)}/mo
                    </div>
                  </div>
                  <div className="px-4 sm:px-5 pb-4 space-y-2.5">
                    <div className="px-1">
                      <div className="h-1.5 rounded-full bg-white/20 overflow-hidden mb-2">
                        <div className="h-full bg-emerald-300 rounded-full" style={{ width: "100%" }} />
                      </div>
                      <div className="text-[11px] font-semibold tracking-wider text-emerald-200">
                        {(splitLabel || tabMeta("equity")?.label || "EQUITY").toUpperCase()} 100%
                      </div>
                    </div>
                    {loading && (
                      <div className="bg-white/10 rounded-btn px-4 py-3.5 text-sm text-white/80">Loading fund…</div>
                    )}
                    {!loading && funds.map((fund) => (
                      <div key={`${fund.scheme || fund.name}`} className="bg-white/10 rounded-btn px-4 py-3.5">
                        <div className="text-sm sm:text-[15px] font-semibold leading-snug break-words uppercase">
                          {fund.fullName || fund.name}
                        </div>
                        <div className="text-xs text-white/65 mt-1">
                          {[
                            fund.assetClass || null,
                            fund.cagr != null ? `3yr CAGR ${fund.cagr}%` : null,
                            fund.risk ? `Risk ${fund.risk}` : "Risk Moderate",
                          ].filter(Boolean).join(" · ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-8 space-y-4">
              <div className="bg-white border border-border rounded-card px-5 py-2 shadow-card">
                <div className="flex justify-between py-3.5 text-sm sm:text-[15px]">
                  <span className="text-secondary">Monthly SIP</span>
                  <span className="font-semibold text-ink">{money(amount)}</span>
                </div>
                <div className="flex justify-between py-3.5 text-sm sm:text-[15px] border-t border-border">
                  <span className="text-secondary">Transaction charges</span>
                  <span className="font-semibold text-ink">₹0</span>
                </div>
                <div className="flex justify-between py-3.5 text-sm sm:text-[15px] border-t border-border">
                  <span className="font-bold text-ink">First debit</span>
                  <span className="font-bold text-emerald">{money(amount)}</span>
                </div>
              </div>

              {error && !reviewOpen ? <div className="text-sm text-red-600">{error}</div> : null}

              <button
                type="button"
                disabled={busy || !goalId || loading}
                onClick={openReviewSheet}
                className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold disabled:opacity-60"
              >
                {busy ? "Preparing…" : "Review & confirm →"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-ink underline underline-offset-2"
              >
                Back to edit amount
              </button>
              <div className="text-center text-xs text-muted pt-1">
                Invested with · {funds[0]?.name?.split(" ")[0] || "fydaa"}
              </div>
            </aside>
          </div>

          {reviewOpen ? (
            <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center p-3 sm:p-5">
              <div
                className="bg-white w-full max-w-[min(100%,520px)] sm:max-w-[540px] rounded-2xl shadow-elevated overflow-hidden flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-labelledby="goal-review-title"
              >
                <div className="px-4 sm:px-5 pt-4 pb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 id="goal-review-title" className="text-lg font-bold text-ink leading-tight">
                      Review & confirm
                    </h2>
                    <p className="text-xs text-muted mt-1 leading-snug">
                      Check your SIP details before starting.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewOpen(false)}
                    className="w-8 h-8 -mt-0.5 -mr-1 rounded-full hover:bg-surface flex items-center justify-center shrink-0"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="px-4 sm:px-5 pb-0">
                  <div className="border-t border-border">
                    {[
                      ["Monthly SIP", `${money(amount)}/mo`],
                      ["Horizon", horizonLabel("monthly", years)],
                      ["Fund", funds[0]?.fullName || funds[0]?.name || "Recommended fund"],
                      ["SIP date each month", `${sipDay}${getOrdinal(sipDay)}`],
                      ["First debit", `${firstDebitLabel(sipDay)} · ${money(amount)}`],
                      ["Next debit", nextDebitLabel(sipDay)],
                    ].map(([label, value]) => {
                      if (label === "Fund") {
                        return (
                          <div key={label} className="py-2 border-b border-border text-[13px]">
                            <div className="text-ink mb-1">{label}</div>
                            <div className="text-ink font-medium leading-snug break-words w-full">
                              {value}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={label}
                          className="flex items-start justify-between gap-4 py-2 border-b border-border text-[13px]"
                        >
                          <span className="text-ink shrink-0 pt-px">{label}</span>
                          <span className="text-ink text-right leading-snug break-words min-w-0 max-w-[68%]">
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 border border-border rounded-xl px-3 py-2.5">
                    <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
                      Setup checklist
                    </div>
                    <div className="space-y-2">
                      {(checklist.length
                        ? checklist
                        : [
                            { id: "kyc", label: "KYC", detail: "Checking…", done: false },
                            { id: "consent", label: "Consent otp", detail: "Required before mandate and first installment", done: false },
                            { id: "mandate", label: "UPI auto-debit mandate", detail: "Each SIP needs its own UPI AutoPay", done: false },
                          ]
                      ).map((item) => (
                        <div key={item.id} className="flex items-start gap-2">
                          <span
                            className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              item.done ? "bg-emerald text-white" : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.done ? "✓" : "×"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-semibold text-ink leading-tight">{item.label}</div>
                            <div className="text-[11px] text-muted mt-0.5 leading-snug line-clamp-1">{item.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pt-3 pb-4 flex flex-col gap-2">
                  {error ? <div className="text-xs text-red-600 leading-snug">{error}</div> : null}
                  <button
                    type="button"
                    disabled={busy || !goalId}
                    onClick={continueToWizard}
                    className="w-full h-11 rounded-btn bg-jade text-white text-[14px] font-semibold disabled:opacity-60"
                  >
                    {busy ? "Working…" : (reviewAction.label || "Continue setup →")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewOpen(false)}
                    className="w-full text-[13px] text-ink underline underline-offset-2 py-0.5"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
      </div>
    </div>
  );
}
