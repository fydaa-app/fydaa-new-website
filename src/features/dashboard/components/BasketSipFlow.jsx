"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, MoreVertical, X } from "lucide-react";
import { compact, getOrdinal, sipFV } from "../lib/utils";
import {
  BASKET_BAR_COLORS,
  canDeleteBasket,
  canEditBasketFunds,
  deleteCustomBasket,
  getBasket,
} from "../lib/basketApi";
import {
  checkInvestReadiness,
  horizonLabel,
  loadPortfolioForSip,
  nextReviewAction,
} from "../lib/sipInvestApi";
import { PAGE_SHELL } from "../lib/layoutClasses";

const TENURE_CHIPS = [1, 5, 10, 20];
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

function nextDebitLabel(day) {
  const first = firstDebitDate(day);
  const next = new Date(first.getFullYear(), first.getMonth() + 1, first.getDate());
  return formatDebitDate(next);
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

/**
 * Basket SIP: detail → amount/tenure → date → review (no advisory) → SipInvestWizard.
 */
export default function BasketSipFlow({ basket: seed, onBack, onContinue, onEdit, onDeleted, onCompleteKyc }) {
  const [step, setStep] = useState(0);
  const [basket, setBasket] = useState(seed || null);
  const [amount, setAmount] = useState(() => {
    const locked = Number(seed?.investAmount);
    if (Number.isFinite(locked) && locked > 0) return locked;
    return Math.max(1000, Number(seed?.minInvestment) || 5000);
  });
  const [years, setYears] = useState(10);
  const [sipDay, setSipDay] = useState(10);
  const [autoOpen, setAutoOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [readiness, setReadiness] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const amountLocked = Number(basket?.investAmount) > 0;
  const isLumpsumBasket = String(basket?.investmentMode || "").toUpperCase() === "LUMPSUM";
  const liveSip = String(basket?.sipStatus || "").toUpperCase() === "ACTIVE";
  const showEdit = canEditBasketFunds(basket);
  const showDelete = canDeleteBasket(basket);
  const showMenu = showEdit || showDelete;
  const funds = useMemo(() => {
    if (portfolio?.funds?.length) return portfolio.funds;
    return (basket?.funds || []).map((fund) => ({
      name: fund.name,
      fullName: fund.name,
      weight: fund.weight,
      cagr: null,
      risk: null,
      assetClass: "Equity",
      minInitial: null,
      minSip: null,
    }));
  }, [portfolio, basket]);

  const yearsNum = (() => {
    const n = Number(years);
    if (!Number.isFinite(n)) return 10;
    return Math.min(30, Math.max(1, Math.round(n)));
  })();
  const corpus = sipFV(amount, ASSUMED_CAGR, yearsNum);
  const invested = amount * yearsNum * 12;
  const gains = Math.max(0, corpus - invested);
  const growthPct = invested > 0 ? Math.round((gains / invested) * 100) : 0;

  const reviewAction = useMemo(
    () => nextReviewAction({ readiness, consentDone: false, mandateDone: false }),
    [readiness],
  );
  // Basket review checklist — KYC, consent, mandate only (no advisory plan).
  const checklist = useMemo(
    () => (readiness?.checklist || []).filter((item) => item.id !== "advisory"),
    [readiness],
  );

  useEffect(() => {
    const id = Number(seed?.id);
    if (!Number.isFinite(id) || id <= 0) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      const detail = await getBasket(id).catch(() => null);
      if (cancelled) return;
      const next = detail || seed;
      setBasket(next);
      const locked = Number(next?.investAmount);
      if (Number.isFinite(locked) && locked > 0) setAmount(locked);
      else setAmount((prev) => Math.max(1000, prev || next?.minInvestment || 5000));

      const port = await loadPortfolioForSip(null, null, id);
      if (cancelled) return;
      if (port?.funds?.length) setPortfolio(port);
      else if (next?.funds?.length) {
        setPortfolio({
          portfolioId: null,
          funds: next.funds.map((fund) => ({
            name: fund.name,
            fullName: fund.name,
            weight: fund.weight,
            cagr: null,
            risk: "Moderate",
            assetClass: "Equity",
          })),
          rate: ASSUMED_CAGR,
        });
      }
      const ready = await checkInvestReadiness();
      if (!cancelled) {
        setReadiness(ready);
        setLoading(false);
        // After create → jump into amount/tenure (monthly SIP invest).
        if (seed?.autoStart && String(next?.investmentMode || "").toUpperCase() !== "LUMPSUM") {
          setStep(1);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [seed?.id, seed?.autoStart]);

  async function openReviewSheet() {
    setError("");
    setBusy(true);
    const ready = await checkInvestReadiness();
    setReadiness(ready);
    setBusy(false);
    setReviewOpen(true);
  }

  function continueLumpsum() {
    onContinue?.({
      basketId: basket.id,
      basketName: basket.name,
      goalName: basket.name,
      amount: amountLocked ? Number(basket.investAmount) || amount : amount,
      investAmount: basket.investAmount,
      minInvestment: basket.minInvestment,
      tenureYears: 3,
      frequency: "lumpsum",
      fundMode: "rec",
      fund: null,
      fromBasket: true,
      fromGoals: false,
    });
  }

  async function onReviewPrimary() {
    setError("");
    if (reviewAction.step === "kyc" || reviewAction.step === "bank" || reviewAction.step === "nominee") {
      onCompleteKyc?.({
        basketId: basket?.id,
        basketName: basket?.name,
        goalName: basket?.name,
        amount,
        tenureYears: yearsNum,
        frequency: "monthly",
        fundMode: "rec",
        fund: null,
        monthlyDay: sipDay,
        fromBasket: true,
        openReview: true,
        resumeReview: true,
      });
      return;
    }
    setBusy(true);
    setReviewOpen(false);
    onContinue?.({
      basketId: basket.id,
      basketName: basket.name,
      goalName: basket.name,
      amount,
      tenureYears: yearsNum,
      frequency: "monthly",
      fundMode: "rec",
      fund: null,
      monthlyDay: sipDay,
      fromBasket: true,
      fromGoals: true,
      openReview: false,
      startSetup: true,
    });
    setBusy(false);
  }

  async function confirmDelete() {
    setError("");
    setBusy(true);
    const result = await deleteCustomBasket(basket.id);
    setBusy(false);
    if (!result.ok) {
      setError(result.message || "Could not delete basket");
      setDeleteOpen(false);
      return;
    }
    setDeleteOpen(false);
    setMenuOpen(false);
    onDeleted?.(basket);
  }

  if (!basket?.id && !loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6">
        <p className="text-sm text-muted mb-4">Basket not found.</p>
        <button type="button" onClick={onBack} className="text-sm text-jade underline">
          Back
        </button>
      </div>
    );
  }

  const allocationFunds = (basket?.funds?.length ? basket.funds : funds) || [];

  return (
    <div className={`${PAGE_SHELL} min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] flex flex-col`}>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 mb-3 sm:mb-4 lg:mb-2 relative">
          <button
            type="button"
            onClick={() => {
              if (step > 0) setStep(step - 1);
              else onBack?.();
            }}
            className="w-10 h-10 4xl:w-11 4xl:h-11 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          {step === 0 ? (
            <div className="flex-1 min-w-0 text-center px-1 sm:px-3">
              <div className="text-[15px] sm:text-lg 4xl:text-xl font-bold text-ink truncate">
                {basket?.name || "Basket"}
              </div>
              <div className="text-[11px] sm:text-xs 4xl:text-sm text-muted mt-0.5">
                {isLumpsumBasket ? "Lumpsum basket" : "SIP basket"}
              </div>
            </div>
          ) : (
            <Progress step={step} total={3} />
          )}
          {step === 0 && showMenu ? (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="w-10 h-10 4xl:w-11 4xl:h-11 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface"
                aria-label="Basket options"
              >
                <MoreVertical size={18} />
              </button>
              {menuOpen ? (
                <>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-11 4xl:top-12 z-20 min-w-[200px] sm:min-w-[220px] rounded-xl border border-border bg-white shadow-elevated py-1.5 overflow-hidden">
                    {showEdit ? (
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onEdit?.(basket);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface"
                      >
                        Edit funds & amount
                      </button>
                    ) : null}
                    {showDelete ? (
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          setDeleteOpen(true);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete basket
                      </button>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
          ) : step === 0 ? (
            <div className="w-10 4xl:w-11 shrink-0" aria-hidden />
          ) : null}
        </div>

        {loading && (
          <div className="flex-1 flex items-center justify-center text-sm text-muted">Loading basket…</div>
        )}

        {!loading && step === 0 && (
          <div className="flex-1 flex flex-col w-full min-w-0 lg:justify-center lg:py-4 4xl:py-8">
            <div
              className="w-full max-w-[920px] xl:max-w-[980px] 4xl:max-w-[1120px] mx-auto rounded-2xl 4xl:rounded-3xl border border-border/80 overflow-hidden shadow-card"
              style={{
                background:
                  "linear-gradient(165deg, #F7FAF8 0%, #FFFFFF 42%, #F3F7F5 100%)",
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,380px)] 4xl:grid-cols-[minmax(0,1.4fr)_420px] items-stretch">
                {/* Left — allocation composition */}
                <div className="min-w-0 p-5 sm:p-6 lg:p-8 4xl:p-10 border-b lg:border-b-0 lg:border-r border-border/70">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-tint text-jade">
                      {isLumpsumBasket ? "Lumpsum" : "SIP"}
                    </span>
                    <span className="text-sm text-muted">
                      {allocationFunds.length}{" "}
                      {allocationFunds.length === 1 ? "fund" : "funds"}
                    </span>
                  </div>
                  {basket.description ? (
                    <p className="text-sm text-muted mb-5 leading-relaxed max-w-xl">
                      {basket.description}
                    </p>
                  ) : null}

                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-3">
                    Allocation
                  </div>

                  {allocationFunds.length > 0 ? (
                    <div className="h-2.5 rounded-full overflow-hidden flex bg-white/80 border border-border/60 mb-4">
                      {allocationFunds.map((fund, index) => {
                        const w = Math.max(0, Number(fund.weight) || 0);
                        if (!(w > 0)) return null;
                        return (
                          <div
                            key={`bar-${fund.name}-${index}`}
                            className="h-full first:rounded-l-full last:rounded-r-full"
                            style={{
                              width: `${w}%`,
                              background: BASKET_BAR_COLORS[index % BASKET_BAR_COLORS.length],
                            }}
                          />
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="space-y-2.5 sm:space-y-3">
                    {allocationFunds.map((fund, index) => (
                      <div
                        key={`${fund.name}-${index}`}
                        className="bg-white border border-border rounded-xl px-4 py-3.5 sm:py-4 flex items-start justify-between gap-3 shadow-sm"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span
                            className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              background: BASKET_BAR_COLORS[index % BASKET_BAR_COLORS.length],
                            }}
                          />
                          <div className="text-[12px] sm:text-[13px] 4xl:text-sm font-medium text-ink leading-snug min-w-0 break-words uppercase">
                            {(fund.fullName || fund.name || "").toUpperCase()}
                          </div>
                        </div>
                        <div className="text-[15px] sm:text-base font-bold text-jade shrink-0 tabular-nums">
                          {Math.round(Number(fund.weight) || 0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — invest panel (fills column height on desktop) */}
                <aside className="min-w-0 bg-white/90 lg:bg-white p-5 sm:p-6 lg:p-8 4xl:p-10 flex flex-col">
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                    {isLumpsumBasket ? "One-time amount" : "Monthly SIP"}
                  </div>
                  <div className="text-[32px] sm:text-[36px] 4xl:text-[42px] font-bold text-ink tracking-tight leading-none mb-2">
                    {money(amount)}
                  </div>
                  <p className="text-sm text-muted leading-relaxed mb-6 lg:mb-8">
                    {amountLocked
                      ? "Mode cannot be changed."
                      : isLumpsumBasket
                        ? "Invest a one-time amount into this mix."
                        : "Invest monthly into this mix."}
                  </p>

                  <div className="mt-auto space-y-3">
                    {error ? <div className="text-sm text-red-600">{error}</div> : null}
                    {!isLumpsumBasket && liveSip ? (
                      <div className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-btn px-4 py-3">
                        SIP already running on this basket.
                      </div>
                    ) : null}

                    <button
                      type="button"
                      disabled={(!isLumpsumBasket && liveSip) || !allocationFunds.length}
                      onClick={() => {
                        if (isLumpsumBasket) continueLumpsum();
                        else setStep(1);
                      }}
                      className="w-full h-12 4xl:h-[52px] rounded-btn bg-jade text-white text-[15px] 4xl:text-base font-semibold hover:bg-jade-hover disabled:opacity-50"
                    >
                      {isLumpsumBasket ? "Invest one-time →" : "Start SIP →"}
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        )}

        {!loading && step === 1 && (
          <div className="flex-1 flex flex-col w-full min-w-0">
            <h1 className="text-[26px] sm:text-[34px] lg:text-[36px] 4xl:text-[40px] font-bold text-ink tracking-tight leading-tight max-w-3xl 4xl:max-w-4xl">
              How much & for <span className="text-jade">how long?</span>
            </h1>
            <p className="text-sm sm:text-base 4xl:text-[17px] text-muted mt-2 mb-6 sm:mb-8 max-w-2xl 4xl:max-w-3xl">
              {amountLocked
                ? "Amount is set on this basket — watch the corpus grow live."
                : "Set your monthly SIP — watch the corpus grow live."}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 xl:gap-8 4xl:gap-10 items-start">
              <div className="min-w-0 space-y-5 order-1">
                <div>
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Monthly SIP</div>
                  <div className="bg-white border border-border rounded-card px-5 py-4 shadow-card mb-2">
                    <div className="text-[32px] font-bold text-ink tracking-tight">{money(amount)}</div>
                    {!amountLocked && (
                      <input
                        type="range"
                        min={Math.max(1000, basket?.minInvestment || 1000)}
                        max={100000}
                        step={500}
                        value={amount}
                        onChange={(event) => setAmount(Number(event.target.value))}
                        className="w-full mt-3 accent-[#0C4A3E]"
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    {amountLocked ? "Amount is set on this basket." : `Minimum ${money(basket?.minInvestment || 1000)}`}
                  </p>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Tenure</div>
                  <p className="text-xs text-muted mb-2">
                    Quick picks are in years; you can type any horizon from 1 to 30.
                  </p>
                  <div className="bg-white border border-border rounded-card px-5 py-4 shadow-card mb-3 flex items-end gap-2">
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
                        if (raw.length === 1) {
                          if (n >= 1 && n <= 9) setYears(n === 0 ? "" : n);
                          return;
                        }
                        if (n >= 1 && n <= 30) setYears(n);
                        else if (n > 30) setYears(30);
                      }}
                      onBlur={() => {
                        const n = Number(years);
                        if (!Number.isFinite(n) || n < 1) setYears(1);
                        else if (n > 30) setYears(30);
                        else setYears(Math.round(n));
                      }}
                      className="w-24 text-[32px] font-bold text-ink bg-transparent border-0 outline-none ring-0 shadow-none leading-none appearance-none focus:border-0 focus:outline-none focus:ring-0"
                      aria-label="Tenure in years"
                    />
                    <div className="text-sm text-muted mb-1.5">years</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TENURE_CHIPS.map((option) => (
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
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover"
                >
                  Choose SIP date →
                </button>
              </div>

              <div className="min-w-0 space-y-4 order-2 lg:sticky lg:top-6 xl:top-8">
                <div
                  className="rounded-card overflow-hidden text-white shadow-card p-5 sm:p-6 4xl:p-7"
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
                <p className="text-[11px] text-muted leading-relaxed">
                  Assumption: Illustrative corpus at {ASSUMED_CAGR}% p.a. blended. Returns not guaranteed.
                </p>

                <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                  Split across {funds.length || 0} funds
                </div>
                <div className="space-y-2">
                  {funds.map((fund, index) => (
                    <div
                      key={`${fund.name}-${index}`}
                      className="bg-white border border-border rounded-btn px-3.5 py-3 flex items-center gap-2.5"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: BASKET_BAR_COLORS[index % BASKET_BAR_COLORS.length] }}
                      />
                      <span className="text-[13px] text-ink truncate flex-1">
                        {[fund.assetClass || "Equity", fund.fullName || fund.name].filter(Boolean).join(" · ")}
                      </span>
                      <span className="text-[13px] font-semibold text-ink shrink-0">
                        {Math.round(Number(fund.weight) || 0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && step === 2 && (
          <div className="flex-1 flex flex-col w-full">
            <div className="mb-6 sm:mb-8 max-w-3xl">
              <h1 className="text-[28px] sm:text-[34px] lg:text-[36px] font-bold text-ink tracking-tight leading-tight">
                Pick your <span className="text-jade">SIP date</span>
              </h1>
              <p className="text-sm sm:text-base text-muted mt-2">When should we debit each month?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-6 xl:gap-8 items-start">
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

                <div className="bg-white border border-border rounded-card overflow-hidden shadow-card">
                  <button
                    type="button"
                    onClick={() => setAutoOpen((value) => !value)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-surface/60"
                  >
                    <span className="w-9 h-9 rounded-lg bg-tint text-jade text-sm font-bold flex items-center justify-center shrink-0">i</span>
                    <span className="flex-1 text-sm font-semibold text-ink">How the auto-debit works</span>
                    <ChevronDown size={16} className={`text-muted transition-transform ${autoOpen ? "rotate-180" : ""}`} />
                  </button>
                  {autoOpen && (
                    <div className="px-5 pb-5 pt-1 grid sm:grid-cols-3 gap-4">
                      {[
                        { title: "Set up UPI AutoPay", detail: "One-time mandate approval via your UPI app" },
                        { title: "First debit", detail: `${money(amount)} on ${firstDebitLabel(sipDay)} after mandate approval` },
                        { title: "Auto-debit monthly", detail: `${money(amount)} on the ${sipDay}${getOrdinal(sipDay)} each month` },
                      ].map((item, index) => (
                        <div key={item.title} className="flex sm:flex-col gap-3">
                          <span className="w-7 h-7 rounded-full bg-tint text-jade text-xs font-bold flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <div>
                            <div className="text-sm font-semibold text-ink">{item.title}</div>
                            <div className="text-xs text-muted mt-1">{item.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Your portfolio</div>
                  <div
                    className="rounded-card overflow-hidden text-white shadow-card"
                    style={{ background: "linear-gradient(160deg,#0C4A3E,#047857)" }}
                  >
                    <div className="px-5 pt-5 pb-3">
                      <div className="text-lg font-bold">{basket.name}</div>
                      <div className="text-sm text-white/70 mt-1">
                        {basket.name} · {funds.length || 1} funds · {money(amount)}/mo
                      </div>
                    </div>
                    <div className="px-4 pb-4 space-y-2.5">
                      <div className="px-1">
                        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden mb-2 flex">
                          {funds.map((fund, index) => (
                            <div
                              key={`${fund.name}-bar-${index}`}
                              className="h-full"
                              style={{
                                width: `${Math.max(4, Number(fund.weight) || 0)}%`,
                                background: BASKET_BAR_COLORS[index % BASKET_BAR_COLORS.length],
                              }}
                            />
                          ))}
                        </div>
                        <div className="text-[11px] font-semibold tracking-wider text-emerald-200">
                          {(basket.assetClassName || "EQUITY").toUpperCase()} 100%
                        </div>
                      </div>
                      {funds.map((fund, index) => (
                        <div key={`${fund.name}-row-${index}`} className="bg-white/10 rounded-btn px-4 py-3.5">
                          <div className="text-sm font-semibold uppercase leading-snug">
                            {fund.fullName || fund.name}
                          </div>
                          <div className="text-xs text-white/65 mt-1">
                            {[
                              fund.cagr != null ? `3yr CAGR ${fund.cagr}%` : null,
                              fund.risk ? `Risk ${fund.risk}` : "Risk Moderate",
                              Math.round(Number(fund.weight) || 0) ? `${Math.round(Number(fund.weight))}%` : null,
                            ].filter(Boolean).join(" · ")}
                          </div>
                        </div>
                      ))}
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

                {error ? <div className="text-sm text-red-600">{error}</div> : null}

                <button
                  type="button"
                  disabled={busy}
                  onClick={openReviewSheet}
                  className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover disabled:opacity-60"
                >
                  {busy ? "Preparing…" : "Review & confirm →"}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-ink underline">
                  Back to edit amount
                </button>
                <div className="text-center text-xs text-muted">
                  Invested with · {funds.slice(0, 5).map((f) => (f.name || "").split(" ")[0]).filter(Boolean).join(", ") || "fydaa"}
                </div>
              </aside>
            </div>
          </div>
        )}

      {reviewOpen && (
        <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center p-3 sm:p-5">
          <div
            className="bg-white w-full max-w-[min(100%,520px)] sm:max-w-[540px] rounded-2xl shadow-elevated overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-4 sm:px-5 pt-4 pb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-ink leading-tight">Review & confirm</h2>
                <p className="text-xs text-muted mt-1 leading-snug">Check your SIP details before starting.</p>
              </div>
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center shrink-0"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-4 sm:px-5 pb-0">
              <div className="border-t border-border">
                {[
                  ["Monthly SIP", `${money(amount)}/mo`],
                  ["Horizon", horizonLabel("monthly", yearsNum)],
                  ["Basket", basket.name],
                  ["SIP date each month", `${sipDay}${getOrdinal(sipDay)}`],
                  ["First debit", `${firstDebitLabel(sipDay)} · ${money(amount)}`],
                  ["Next debit", nextDebitLabel(sipDay)],
                ].map(([label, value]) => {
                  if (label === "Basket") {
                    return (
                      <div key={label} className="py-2 border-b border-border text-[13px]">
                        <div className="text-ink mb-1">{label}</div>
                        <div className="text-ink font-medium leading-snug break-words w-full">{value}</div>
                      </div>
                    );
                  }
                  return (
                    <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-border text-[13px]">
                      <span className="text-ink shrink-0">{label}</span>
                      <span className="text-ink text-right leading-snug break-words min-w-0 max-w-[68%]">{value}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 border border-border rounded-xl px-3 py-2.5">
                <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
                  Setup checklist
                </div>
                <div className="space-y-2">
                  {checklist.map((item) => (
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
                disabled={busy}
                onClick={onReviewPrimary}
                className="w-full h-11 rounded-btn bg-jade text-white text-[14px] font-semibold disabled:opacity-60"
              >
                {busy ? "Working…" : reviewAction.label}
              </button>
              <button type="button" onClick={() => setReviewOpen(false)} className="w-full text-[13px] text-ink underline py-0.5">
                Back to edit date
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOpen && (
        <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center p-4 sm:p-6">
          <div
            className="bg-white w-full max-w-[400px] rounded-2xl shadow-elevated overflow-hidden px-5 pt-5 pb-5"
            role="dialog"
            aria-modal="true"
          >
            <h2 className="text-xl font-bold text-ink">Delete basket?</h2>
            <p className="text-sm text-muted mt-2">
              “{basket?.name}” will be removed. This cannot be undone.
            </p>
            {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}
            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                disabled={busy}
                onClick={confirmDelete}
                className="w-full h-12 rounded-btn bg-red-600 text-white text-[15px] font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                {busy ? "Deleting…" : "Delete basket"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setDeleteOpen(false)}
                className="w-full text-sm text-ink underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
