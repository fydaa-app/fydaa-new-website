"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { compact, getOrdinal, sipFV } from "../lib/utils";
import { loadGoals, loadRecommendedForGoal } from "../lib/investmentApi";
import { loadPortfolioForSip, tabMeta } from "../lib/sipInvestApi";

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

function firstDebitLabel(day) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), day);
  if (now.getDate() >= day) d.setMonth(d.getMonth() + 1);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

/**
 * Goal SIP setup (amount → date). Consent / mandate stay in SipInvestWizard.
 */
export default function GoalSipFlow({ goal, onBack, onContinue }) {
  const tenureOptions = useMemo(
    () => tenureOptionsForBadge(goal?.badge),
    [goal?.badge],
  );
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(10000);
  const [years, setYears] = useState(() => clampTenure(goal?.years, tenureOptionsForBadge(goal?.badge)));
  const [sipDay, setSipDay] = useState(10);
  const [autoOpen, setAutoOpen] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [goalId, setGoalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const cagr = assumedCagrForBadge(goal?.badge);
  const corpus = sipFV(amount, cagr, years);
  const invested = amount * years * 12;
  const gains = Math.max(0, corpus - invested);
  const growthPct = invested > 0 ? Math.round((gains / invested) * 100) : 0;
  const funds = portfolio?.funds || [];
  const splitLabel = funds[0]?.assetClass
    || funds[0]?.label?.split("·")[0]?.trim()
    || "Equity";

  useEffect(() => {
    setYears(clampTenure(goal?.years, tenureOptions));
  }, [goal?.years, tenureOptions]);

  useEffect(() => {
    if (!goal?.name) return undefined;
    let cancelled = false;
    setLoading(true);
    setError("");
    loadGoals()
      .then(async (goalsById) => {
        if (cancelled) return;
        const target = String(goal.name || "").trim().toLowerCase();
        const list = Object.values(goalsById || {});
        const match = list.find((item) => String(item.name || "").trim().toLowerCase() === target)
          || list.find((item) => {
            const name = String(item.name || "").trim().toLowerCase();
            return name.includes(target) || target.includes(name);
          });
        const id = match?.id ?? null;
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
  }, [goal?.name]);

  function continueToWizard() {
    if (!goalId) {
      setError("This goal is not available yet.");
      return;
    }
    setBusy(true);
    onContinue?.({
      tab: "equity",
      goalId,
      goalName: goal.name,
      goalBadge: goal.badge,
      amount,
      tenureYears: years,
      frequency: "monthly",
      fundMode: "rec",
      fund: null,
      monthlyDay: sipDay,
      openReview: true,
    });
    setBusy(false);
  }

  return (
    <div className="px-10 py-8 max-w-[720px]">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else onBack?.();
          }}
          className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center"
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

      {step === 1 && (
        <>
          <h1 className="text-[28px] font-bold text-ink tracking-tight leading-tight">
            How much & for <span className="text-jade">how long?</span>
          </h1>
          <p className="text-sm text-muted mt-1 mb-6">Set your monthly SIP — watch the corpus grow live.</p>

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
          <h1 className="text-[28px] font-bold text-ink tracking-tight">
            Pick your <span className="text-jade">SIP date</span>
          </h1>
          <p className="text-sm text-muted mt-1 mb-6">When should we debit each month?</p>

          <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Debit date</div>
          <div className="flex flex-wrap gap-2 mb-2">
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
          <p className="text-sm text-muted mb-5">
            Your SIP runs on the {sipDay}{getOrdinal(sipDay)} of every month · first debit {firstDebitLabel(sipDay)}
          </p>

          <div className="mb-5 bg-white border border-border rounded-card overflow-hidden">
            <button
              type="button"
              onClick={() => setAutoOpen((value) => !value)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
            >
              <span className="w-8 h-8 rounded-lg bg-tint text-jade text-sm font-bold flex items-center justify-center shrink-0">i</span>
              <span className="flex-1 text-sm font-semibold text-ink">How the auto-debit works</span>
              <ChevronDown size={16} className={`text-muted shrink-0 transition-transform ${autoOpen ? "rotate-180" : ""}`} />
            </button>
            {autoOpen && (
              <div className="px-4 pb-4">
                {([
                  {
                    title: "Set up UPI AutoPay",
                    detail: "One-time mandate approval via your UPI app",
                  },
                  {
                    title: "First debit today",
                    detail: `${money(amount)} debited automatically after mandate approval`,
                  },
                  {
                    title: "Auto-debit monthly",
                    detail: `${money(amount)} on the ${sipDay}${getOrdinal(sipDay)} each month · pause or cancel anytime`,
                  },
                ]).map((item, index, list) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="flex flex-col items-center w-6 shrink-0">
                      <span className="w-6 h-6 rounded-full bg-tint text-jade text-[11px] font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      {index < list.length - 1 ? (
                        <span className="w-px flex-1 min-h-[16px] bg-border my-1" />
                      ) : null}
                    </div>
                    <div className={`flex-1 min-w-0 ${index < list.length - 1 ? "pb-4" : ""}`}>
                      <div className="text-sm font-semibold text-ink leading-6">{item.title}</div>
                      <div className="text-xs text-muted mt-0.5 leading-relaxed">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Your portfolio</div>
          <div className="rounded-card overflow-hidden mb-5 text-white" style={{ background: "linear-gradient(160deg,#0C4A3E,#047857)" }}>
            <div className="px-5 pt-5 pb-3">
              <div className="text-lg font-bold">{goal?.name}</div>
              <div className="text-sm text-white/70 mt-0.5">
                {goal?.badge || "Goal"} · {Math.max(funds.length, 1)} fund
              </div>
            </div>
            <div className="px-5 pb-3">
              <div className="h-1.5 rounded-full bg-white/20 overflow-hidden mb-2">
                <div className="h-full bg-emerald-300 rounded-full" style={{ width: "100%" }} />
              </div>
              <div className="text-[11px] font-semibold tracking-wider text-emerald-200">
                {(splitLabel || tabMeta("equity")?.label || "EQUITY").toUpperCase()} 100%
              </div>
            </div>
            <div className="px-4 pb-4 space-y-2">
              {loading && (
                <div className="bg-white/10 rounded-btn px-4 py-3 text-sm text-white/80">Loading fund…</div>
              )}
              {!loading && funds.map((fund) => (
                <div key={`${fund.scheme || fund.name}`} className="bg-white/10 rounded-btn px-4 py-3">
                  <div className="text-sm font-semibold leading-snug break-words uppercase">
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
              {!loading && !funds.length && (
                <div className="bg-white/10 rounded-btn px-4 py-3">
                  <div className="text-sm font-semibold leading-snug">Recommended fund</div>
                  <div className="text-xs text-white/65 mt-1">Risk Moderate</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-border rounded-card px-5 py-2 shadow-card mb-6">
            <div className="flex justify-between py-3 text-sm">
              <span className="text-secondary">Monthly SIP</span>
              <span className="font-semibold text-ink">{money(amount)}</span>
            </div>
            <div className="flex justify-between py-3 text-sm border-t border-border">
              <span className="text-secondary">Transaction charges</span>
              <span className="font-semibold text-ink">₹0</span>
            </div>
            <div className="flex justify-between py-3 text-sm border-t border-border">
              <span className="font-bold text-ink">First debit</span>
              <span className="font-bold text-emerald">{money(amount)}</span>
            </div>
          </div>

          {error ? <div className="text-sm text-red-600 mb-3">{error}</div> : null}

          <button
            type="button"
            disabled={busy || !goalId}
            onClick={continueToWizard}
            className="w-full py-3.5 rounded-btn bg-jade text-white text-[15px] font-semibold disabled:opacity-60"
          >
            Review & confirm →
          </button>
          <button type="button" onClick={() => setStep(1)} className="w-full mt-3 text-sm text-ink underline">
            Back to edit amount
          </button>
          <div className="text-center text-xs text-muted mt-4">
            Invested with · {funds[0]?.name?.split(" ")[0] || "fydaa"}
          </div>
        </>
      )}
    </div>
  );
}
