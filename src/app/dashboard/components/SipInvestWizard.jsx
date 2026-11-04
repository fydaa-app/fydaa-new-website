"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown, X } from "lucide-react";
import {
  checkInvestReadiness,
  createMandate,
  createSipSetup,
  fetchSipSuccessViewData,
  horizonLabel,
  illustratedCorpus,
  loadPortfolioForSip,
  nextReviewAction,
  pollMandate,
  pollMandateBySip,
  runPendingSipFirstDebit,
  sendConsentOtp,
  setPendingSipFirstDebit,
  tabMeta,
  userFacingMessage,
  verifyConsentOtp,
} from "../lib/sipInvestApi";
import {
  WIZARD_CARD,
  WIZARD_CTA,
  WIZARD_INNER,
  WIZARD_STAGE,
  WIZARD_SUB,
  WIZARD_TITLE,
} from "../lib/layoutClasses";
import LumpsumInvestFlow from "./LumpsumInvestFlow";

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₹0";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function dayOrdinal(day) {
  const n = Number(day) || 1;
  if (n % 10 === 1 && n % 100 !== 11) return `${n}st`;
  if (n % 10 === 2 && n % 100 !== 12) return `${n}nd`;
  if (n % 10 === 3 && n % 100 !== 13) return `${n}rd`;
  return `${n}th`;
}

function formatDebitDate(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

function goalDebitDates(day) {
  const n = Math.min(28, Math.max(1, Number(day) || 10));
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), n);
  if (now.getDate() >= n) first.setMonth(first.getMonth() + 1);
  const next = new Date(first.getFullYear(), first.getMonth() + 1, n);
  return { first: formatDebitDate(first), next: formatDebitDate(next) };
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

/**
 * Product (Daily/Monthly SIP from Home): portfolio → Review & confirm → consent → mandate → debit
 * Goals (after GoalSipFlow): skip portfolio/review → consent → mandate → debit
 */
export default function SipInvestWizard({ open, draft, onClose, onDone, onCompleteKyc }) {
  const fromGoals = !!draft?.fromGoals || !!draft?.fromBasket || !!draft?.openReview || !!draft?.resumeReview;
  const [page, setPage] = useState(fromGoals ? "loading" : "portfolio");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [autoDebitOpen, setAutoDebitOpen] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [readiness, setReadiness] = useState(null);
  const [consentDone, setConsentDone] = useState(false);
  const [mandateDone, setMandateDone] = useState(false);
  const [sipId, setSipId] = useState(null);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [monthlyDay, setMonthlyDay] = useState(10);
  const [frequency, setFrequency] = useState(
    () => (draft?.frequency === "daily" ? "daily" : "monthly"),
  );
  const [progressMsg, setProgressMsg] = useState("");
  const [partialNote, setPartialNote] = useState("");
  const [successView, setSuccessView] = useState(null);
  const [successLoading, setSuccessLoading] = useState(false);

  const tab = tabMeta(draft?.tab);
  const daily = frequency === "daily";
  const freqLabel = daily ? "Daily SIP" : "Monthly SIP";
  const amount = Number(draft?.amount) || 0;
  const tenureYears = Number(draft?.tenureYears) || 3;
  const rate = portfolio?.rate || tab?.rate || 12;
  const ownFund = draft?.fundMode === "own";
  const portfolioId = ownFund ? null : portfolio?.portfolioId;
  const portfolioTitle = draft?.goalName || (tab?.label === "Equity" ? "Equities" : tab?.label);

  const funds = portfolio?.funds?.length
    ? portfolio.funds
    : draft?.fund
      ? [{ name: draft.fund.name, fullName: draft.fund.fullName || draft.fund.name, weight: 100, cagr: null, risk: null }]
      : [];

  const action = useMemo(
    () => nextReviewAction({ readiness, consentDone, mandateDone }),
    [readiness, consentDone, mandateDone],
  );

  const checklist = useMemo(() => {
    const base = readiness?.checklist || [];
    // Baskets never show advisory plan in the setup checklist.
    const rows = draft?.fromBasket || draft?.basketId
      ? base.filter((item) => item.id !== "advisory")
      : base;
    return rows.map((item) => {
      if (item.id === "consent") return { ...item, done: consentDone };
      if (item.id === "mandate") return { ...item, done: mandateDone };
      return item;
    });
  }, [readiness, consentDone, mandateDone, draft?.fromBasket, draft?.basketId]);

  const goalDates = useMemo(() => goalDebitDates(monthlyDay), [monthlyDay]);

  function rememberFirstDebit(id) {
    setPendingSipFirstDebit({
      sipId: id,
      amount,
      portfolioId,
      ownFund,
    });
  }

  async function ensureSipCreated(port = portfolio) {
    if (sipId) return sipId;
    const existing = Number(draft?.sipId);
    if (Number.isFinite(existing) && existing > 0) {
      setSipId(existing);
      return existing;
    }
    const useRate = port?.rate || rate;
    const goalAmount = illustratedCorpus(amount, useRate, tenureYears, daily);
    const result = await createSipSetup({
      goalId: draft.basketId ? null : draft.goalId,
      basketId: draft.basketId,
      amount,
      tenureYears,
      frequency,
      sipName: draft.goalName || draft.basketName || tab?.label || "SIP",
      fund: draft.basketId ? null : (ownFund ? draft.fund : null),
      goalAmount,
      sipDateDay: monthlyDay,
    });
    if (!result.ok) {
      setError(userFacingMessage(result.message, "Could not create SIP"));
      return null;
    }
    const id = result.data?.sipData?.id ?? result.data?.data?.sipData?.id ?? result.data?.id;
    if (!id) {
      setError("SIP created but id missing");
      return null;
    }
    setSipId(id);
    return id;
  }

  async function loadSuccessView(id) {
    setSuccessLoading(true);
    try {
      const view = await fetchSipSuccessViewData({
        sipId: id,
        amount,
        portfolioId,
        fallbackLabel: portfolioTitle || tab?.label || "Equity",
      });
      setSuccessView(view);
    } catch {
      setSuccessView({
        ok: true,
        sipAmount: amount,
        daily,
        title: daily ? "Daily SIP" : "Monthly SIP",
        amountLabel: `${money(amount)}${daily ? "/day" : "/mo"}`,
        firstAmountLabel: money(amount),
        scheduleLine: daily
          ? "Next: each business day"
          : `Next: ${goalDates.next} · then ${dayOrdinal(monthlyDay)}/month`,
        subtitle: daily
          ? "First payment initiated. Daily auto-debit on each business day."
          : "First payment initiated. Monthly SIP set for next month.",
        recurringChips: [`${portfolioTitle || tab?.label || "Equity"} ${money(amount)}${daily ? "/day" : "/mo"}`],
        firstChips: [`${portfolioTitle || tab?.label || "Equity"} ${money(amount)}`],
      });
    } finally {
      setSuccessLoading(false);
    }
  }

  async function runFirstDebit(id) {
    setError("");
    setPartialNote("");
    setSuccessView(null);
    setMandateDone(true);
    setReviewOpen(false);
    setPage("debit");
    setBusy(true);
    setProgressMsg("Preparing your transaction…");
    rememberFirstDebit(id);
    const result = await runPendingSipFirstDebit(setProgressMsg);
    setBusy(false);
    if (result.skipped) {
      setPage("success");
      await loadSuccessView(id);
      return true;
    }
    if (!result.ok) {
      setError(userFacingMessage(result.message, "First debit failed"));
      return false;
    }
    if (result.partialMessage) setPartialNote(result.partialMessage);
    setPage("success");
    await loadSuccessView(id);
    return true;
  }

  async function startMandate(id) {
    setBusy(true);
    setError("");
    try {
      const mandate = await createMandate(id, amount);
      if (!mandate.ok) {
        setBusy(false);
        const statusBit = mandate.status ? ` [${mandate.status}]` : "";
        setError(userFacingMessage(mandate.message, "Could not start UPI AutoPay") + statusBit);
        setReviewOpen(false);
        setPage("mandate");
        return;
      }
      const payload = mandate.data?.data && typeof mandate.data.data === "object"
        ? { ...mandate.data, ...mandate.data.data }
        : mandate.data;
      rememberFirstDebit(id);
      if (payload?.alreadyAuthorized) {
        setBusy(false);
        await runFirstDebit(id);
        return;
      }
      const url = payload?.authorizationUrl;
      const mandateId = payload?.mandateId || payload?.mandate_id;
      setBusy(false);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      setReviewOpen(false);
      setPage("mandate");
      if (mandateId) watchMandate(mandateId, id);
    } catch {
      setBusy(false);
      setError("Could not start UPI AutoPay");
      setReviewOpen(false);
      setPage("mandate");
    }
  }

  async function watchMandate(mandateId, id) {
    setBusy(true);
    const started = Date.now();
    while (Date.now() - started < 45000) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      const byId = await pollMandate(mandateId);
      const status = String(
        byId.data?.mandate_status || byId.data?.data?.mandate_status || "",
      ).toUpperCase();
      if (status === "APPROVED") {
        setBusy(false);
        await runFirstDebit(id);
        return;
      }
      if (status === "REJECTED" || status === "CANCELLED") {
        setBusy(false);
        setError("Set up your UPI mandate again");
        return;
      }
      const bySip = await pollMandateBySip(id);
      if (bySip.data?.isApproved === true || bySip.data?.data?.isApproved === true) {
        setBusy(false);
        await runFirstDebit(id);
        return;
      }
    }
    setBusy(false);
    setError("Approve the mandate in your UPI app, then tap Check again.");
  }

  async function beginGoalsSetup(ready, port) {
    const failPage = fromGoals ? "goals" : "portfolio";
    const next = nextReviewAction({ readiness: ready, consentDone: false, mandateDone: false });
    // Let the user open Review & confirm and click Complete KYC themselves.
    if (next.step === "kyc" || next.step === "bank" || next.step === "nominee") {
      setPage(failPage);
      setReviewOpen(true);
      return;
    }
    setBusy(true);
    const id = await ensureSipCreated(port);
    if (!id) {
      setBusy(false);
      setPage(failPage);
      return;
    }
    if (next.step === "consent") {
      const sent = await sendConsentOtp();
      setBusy(false);
      if (!sent.ok) {
        setError(userFacingMessage(sent.message, "otp not delivered, try again later"));
        setPage(failPage);
        return;
      }
      setPage("consent");
      return;
    }
    if (next.step === "mandate") {
      setConsentDone(true);
      await startMandate(id);
      return;
    }
    setConsentDone(true);
    setBusy(false);
    await runFirstDebit(id);
  }

  useEffect(() => {
    if (!open || !draft) return undefined;
    let cancelled = false;
    const goals = !!draft.fromGoals || !!draft.fromBasket;
    const resumeReview = !!draft.resumeReview || !!draft.openReview;
    const showGoalsReview = (goals && !!draft.openReview) || resumeReview;
    const startGoalsSetup = (goals && (draft.startSetup || !draft.openReview) && !resumeReview)
      || (!!draft.fromOwnFund && !!draft.startSetup && !resumeReview);
    const enterLoading = showGoalsReview || startGoalsSetup;
    setPage(enterLoading ? (showGoalsReview ? (goals ? "goals" : "portfolio") : "loading") : "portfolio");
    setReviewOpen(false);
    setConsentDone(false);
    setMandateDone(false);
    const existingId = Number(draft.sipId);
    setSipId(Number.isFinite(existingId) && existingId > 0 ? existingId : null);
    setOtp("");
    setError("");
    setProgressMsg("");
    setPartialNote("");
    setMonthlyDay(Number(draft.monthlyDay) > 0 ? Number(draft.monthlyDay) : 10);
    // Own-fund / product SIP: monthly is the default; allow switch on portfolio step.
    setFrequency(draft.frequency === "daily" ? "daily" : draft.frequency === "lumpsum" ? "lumpsum" : "monthly");
    setBusy(false);
    setLoading(true);
    Promise.all([
      loadPortfolioForSip(draft.goalId, ownFund ? draft.fund : null, draft.basketId),
      checkInvestReadiness(),
    ]).then(async ([port, ready]) => {
      if (cancelled) return;
      setPortfolio(port);
      setReadiness(ready);
      setLoading(false);
      if (showGoalsReview) {
        if (ready.modelSet) {
          setBusy(true);
          await ensureSipCreated(port);
          setBusy(false);
        }
        setPage(goals ? "goals" : "portfolio");
        setReviewOpen(true);
        return;
      }
      if (startGoalsSetup) {
        await beginGoalsSetup(ready, port);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, draft, ownFund]);

  async function openReview() {
    setError("");
    setBusy(true);
    const ready = readiness || await checkInvestReadiness();
    setReadiness(ready);
    if (ready.modelSet) {
      await ensureSipCreated();
    }
    setBusy(false);
    setReviewOpen(true);
  }

  async function onReviewPrimary() {
    setError("");
    if (action.step === "kyc" || action.step === "bank" || action.step === "nominee") {
      onCompleteKyc?.(draft);
      return;
    }
    if (action.step === "consent") {
      setBusy(true);
      const id = await ensureSipCreated();
      if (!id) {
        setBusy(false);
        return;
      }
      const sent = await sendConsentOtp();
      setBusy(false);
      if (!sent.ok) {
        setError(userFacingMessage(sent.message, "otp not delivered, try again later"));
        return;
      }
      setReviewOpen(false);
      setPage("consent");
      return;
    }
    if (action.step === "mandate") {
      const id = sipId || await ensureSipCreated();
      if (!id) return;
      await startMandate(id);
      return;
    }
    if (action.step === "debit") {
      const id = sipId || await ensureSipCreated();
      if (!id) return;
      await runFirstDebit(id);
      return;
    }
    const id = sipId || await ensureSipCreated();
    setReviewOpen(false);
    setPage("success");
    if (id) await loadSuccessView(id);
  }

  async function confirmOtp() {
    setBusy(true);
    setError("");
    const result = await verifyConsentOtp(otp);
    if (!result.ok) {
      setBusy(false);
      setError(userFacingMessage(result.message, "Invalid OTP"));
      return;
    }
    setConsentDone(true);
    const id = sipId || await ensureSipCreated();
    if (!id) {
      setBusy(false);
      setError("Could not create SIP");
      setPage(fromGoals ? "goals" : "portfolio");
      if (!fromGoals) setReviewOpen(true);
      return;
    }
    if (fromGoals) {
      await startMandate(id);
      return;
    }
    setBusy(false);
    setPage("portfolio");
    setReviewOpen(true);
  }

  if (!open || !draft) return null;

  if (draft.frequency === "lumpsum") {
    return (
      <LumpsumInvestFlow
        open={open}
        draft={draft}
        onClose={onClose}
        onDone={onDone}
        onCompleteKyc={onCompleteKyc}
      />
    );
  }

  const progressStep = page === "success" || page === "debit" ? 3 : page === "consent" || page === "mandate" ? 2 : 1;

  const autoDebitSteps = [
    {
      title: "Set up UPI AutoPay",
      detail: "One-time mandate approval via your UPI app",
    },
    {
      title: "First debit today",
      detail: `${money(amount)} debited automatically after mandate approval`,
    },
    daily
      ? {
          title: "Auto-debit daily",
          detail: `${money(amount)} on each business day · pause or cancel anytime`,
        }
      : {
          title: "Auto-debit monthly",
          detail: `${money(amount)} on the ${monthlyDay}${monthlyDay === 1 ? "st" : monthlyDay === 2 ? "nd" : monthlyDay === 3 ? "rd" : "th"} each month · pause or cancel anytime`,
        },
  ];

  function goBack() {
    if (
      (fromGoals || draft?.fromOwnFund)
      && (page === "consent" || page === "mandate" || page === "debit" || page === "loading" || page === "goals")
    ) {
      onClose?.();
      return;
    }
    if (page === "consent" || page === "mandate" || page === "debit") {
      setPage("portfolio");
      setReviewOpen(true);
      return;
    }
    onClose?.();
  }

  const centerStage = page === "portfolio" || page === "consent" || page === "mandate" || page === "debit" || page === "success" || page === "loading" || page === "goals";

  return (
    <div className="fixed inset-0 z-[70] bg-bg flex flex-col overflow-hidden">
      <div className={`${WIZARD_INNER} pt-4 sm:pt-6 4xl:pt-8 shrink-0 flex items-center gap-3`}>
        <button
          type="button"
          onClick={goBack}
          className="w-10 h-10 4xl:w-11 4xl:h-11 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <Progress step={progressStep} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div
          className={`${WIZARD_INNER} py-5 sm:py-8 4xl:py-10 min-h-full flex flex-col ${
            centerStage ? "justify-center" : ""
          }`}
        >
        {page === "loading" && (fromGoals || draft?.fromOwnFund) && (
          <div className={`${WIZARD_STAGE}`}>
            <h1 className={`${WIZARD_TITLE} mb-1`}>
              {draft?.fromBasket || draft?.basketId
                ? "Continuing your basket SIP"
                : draft?.fromOwnFund
                  ? "Continuing your SIP"
                  : "Continuing your goal SIP"}
            </h1>
            <p className={`${WIZARD_SUB} mb-6`}>Preparing consent and auto-debit…</p>
            {error ? <div className="text-sm 4xl:text-base text-red-600">{error}</div> : null}
          </div>
        )}

        {page === "goals" && fromGoals && !reviewOpen && (
          <div className={WIZARD_CARD}>
            <h1 className={`${WIZARD_TITLE} mb-1`}>Finish setup</h1>
            <p className={`${WIZARD_SUB} mb-6`}>Complete the required step, then continue your goal SIP.</p>
            {error ? <div className="text-sm 4xl:text-base text-red-600 mb-4">{error}</div> : null}
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setError("");
                setBusy(true);
                const ready = await checkInvestReadiness();
                setReadiness(ready);
                setBusy(false);
                await beginGoalsSetup(ready, portfolio);
              }}
              className={WIZARD_CTA}
            >
              {busy ? "Checking…" : "Try again"}
            </button>
            <button type="button" onClick={onClose} className="block mt-4 text-sm 4xl:text-[15px] text-ink underline">
              Back to edit date
            </button>
          </div>
        )}

        {page === "portfolio" && !fromGoals && (
          <div className="w-full min-w-0">
            <div className="mb-5 sm:mb-6 4xl:mb-8">
              <h1 className={WIZARD_TITLE}>
                {daily ? (
                  <>Daily SIP <span className="text-emerald">payments</span></>
                ) : (
                  <>Monthly SIP <span className="text-emerald">payments</span></>
                )}
              </h1>
              <p className={`${WIZARD_SUB} mt-1.5`}>Review your portfolio and payment schedule.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,380px)] 4xl:grid-cols-[minmax(0,1.4fr)_420px] gap-5 lg:gap-6 xl:gap-8 4xl:gap-10 items-stretch">
              <div className="min-w-0 space-y-4 4xl:space-y-5 flex flex-col">
                <div className="bg-white border border-border rounded-card 4xl:rounded-3xl overflow-hidden shadow-card">
                  <button
                    type="button"
                    onClick={() => setAutoDebitOpen((value) => !value)}
                    className="w-full flex items-center gap-3 px-4 sm:px-5 4xl:px-6 py-4 4xl:py-5 text-left hover:bg-surface/60"
                  >
                    <span className="w-9 h-9 4xl:w-10 4xl:h-10 rounded-lg bg-tint text-jade text-sm font-bold flex items-center justify-center shrink-0">i</span>
                    <span className="flex-1 text-sm sm:text-[15px] 4xl:text-base font-semibold text-ink">How the auto-debit works</span>
                    <ChevronDown size={16} className={`text-muted shrink-0 transition-transform ${autoDebitOpen ? "rotate-180" : ""}`} />
                  </button>
                  {autoDebitOpen && (
                    <div className="px-4 sm:px-5 4xl:px-6 pb-5 4xl:pb-6 pt-1 grid sm:grid-cols-3 gap-4 sm:gap-5 4xl:gap-6">
                      {autoDebitSteps.map((item, index) => (
                        <div key={item.title} className="flex sm:flex-col gap-3">
                          <span className="w-7 h-7 4xl:w-8 4xl:h-8 rounded-full bg-tint text-jade text-xs 4xl:text-sm font-bold flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm 4xl:text-[15px] font-semibold text-ink leading-5">{item.title}</div>
                            <div className="text-xs 4xl:text-sm text-muted mt-1 leading-relaxed">{item.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {!daily && (
                  <div>
                    <div className="text-[11px] 4xl:text-xs font-bold text-muted uppercase tracking-wider mb-2">SIP date</div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 5, 10, 15, 20, 25, 28].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setMonthlyDay(day)}
                          className={`px-3.5 py-2 4xl:px-4 4xl:py-2.5 rounded-full text-xs 4xl:text-sm font-semibold border ${
                            monthlyDay === day ? "bg-jade text-white border-jade" : "bg-white text-secondary border-border hover:border-jade"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col min-h-0">
                  <div className="text-[11px] 4xl:text-xs font-bold text-muted uppercase tracking-wider mb-2">Your portfolio</div>
                  <div className="rounded-card 4xl:rounded-3xl overflow-hidden text-white shadow-card" style={{ background: "linear-gradient(160deg,#0C4A3E,#047857)" }}>
                    <div className="px-5 sm:px-6 4xl:px-8 pt-5 sm:pt-6 4xl:pt-8 pb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-lg sm:text-xl 4xl:text-2xl font-bold">{portfolioTitle}</div>
                        <div className="text-sm 4xl:text-[15px] text-white/70 mt-1">
                          {funds.length || 1} fund · {money(amount)}/{daily ? "day" : "month"}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 sm:px-5 4xl:px-7 pb-4 4xl:pb-6 space-y-2.5">
                      <div className="px-1">
                        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden mb-2">
                          <div className="h-full bg-emerald-300 rounded-full" style={{ width: "100%" }} />
                        </div>
                        <div className="text-[11px] 4xl:text-xs font-semibold tracking-wider text-emerald-200">
                          {(tab?.label || "EQUITY").toUpperCase()} 100%
                        </div>
                      </div>
                      {loading && <div className="bg-white/10 rounded-btn px-4 py-3.5 text-sm">Loading fund…</div>}
                      {!loading && funds.map((fund) => (
                        <div key={`${fund.scheme || fund.name}`} className="bg-white/10 rounded-btn px-4 4xl:px-5 py-3.5 4xl:py-4">
                          <div className="text-sm sm:text-[15px] 4xl:text-base font-semibold uppercase leading-snug break-words">
                            {fund.fullName || fund.name}
                          </div>
                          <div className="text-xs 4xl:text-sm text-white/65 mt-1">
                            {[
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

              <aside className="space-y-4 4xl:space-y-5 flex flex-col justify-center min-w-0">
                <div className="bg-white border border-border rounded-card 4xl:rounded-3xl px-5 4xl:px-6 py-2 shadow-card">
                  <div className="flex justify-between gap-3 py-3.5 text-sm sm:text-[15px] 4xl:text-base">
                    <span className="text-secondary">{freqLabel}</span>
                    <span className="font-semibold text-ink shrink-0">{money(amount)}</span>
                  </div>
                  <div className="flex justify-between gap-3 py-3.5 text-sm sm:text-[15px] 4xl:text-base border-t border-border">
                    <span className="text-secondary">Transaction charges</span>
                    <span className="font-semibold text-ink shrink-0">₹0</span>
                  </div>
                  <div className="flex justify-between gap-3 py-3.5 text-sm sm:text-[15px] 4xl:text-base border-t border-border">
                    <span className="font-bold text-ink">First debit today</span>
                    <span className="font-bold text-emerald shrink-0">{money(amount)}</span>
                  </div>
                </div>

                {error ? <div className="text-sm 4xl:text-base text-red-600">{error}</div> : null}

                <button
                  type="button"
                  disabled={busy || loading}
                  onClick={openReview}
                  className={WIZARD_CTA}
                >
                  {busy ? "Preparing…" : "Review & confirm →"}
                </button>
                <button type="button" onClick={onClose} className="w-full text-sm 4xl:text-[15px] text-ink underline underline-offset-2">
                  Back to edit amount
                </button>
                <div className="text-center text-xs 4xl:text-sm text-muted pt-1">
                  Invested with · {funds[0]?.name?.split(" ")[0] || "fydaa"}
                </div>
              </aside>
            </div>
          </div>
        )}

        {page === "consent" && (
          <div className={WIZARD_CARD}>
            <h1 className={`${WIZARD_TITLE} mb-1`}>Verify Consent OTP</h1>
            <p className={`${WIZARD_SUB} mb-6`}>Enter the 6-digit OTP sent to your registered mobile.</p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full px-4 py-3.5 4xl:py-4 rounded-btn border border-border text-center text-2xl 4xl:text-3xl tracking-[0.4em] font-bold mb-4"
              placeholder="••••••"
            />
            {error ? <div className="text-sm 4xl:text-base text-red-600 mb-3">{error}</div> : null}
            <button
              type="button"
              disabled={busy || otp.length < 6}
              onClick={confirmOtp}
              className={WIZARD_CTA}
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
              className="w-full mt-3 text-sm 4xl:text-[15px] text-muted underline"
            >
              Resend OTP
            </button>
          </div>
        )}

        {page === "mandate" && (
          <div className={WIZARD_CARD}>
            <h1 className={`${WIZARD_TITLE} mb-1`}>UPI AutoPay</h1>
            <p className={`${WIZARD_SUB} mb-6`}>
              Approve the mandate in your UPI app. Limit {money(amount)}. First debit starts after approval.
            </p>
            {busy ? <div className="text-sm 4xl:text-base text-jade mb-4">Waiting for mandate approval…</div> : null}
            {error ? <div className="text-sm 4xl:text-base text-red-600 mb-3">{error}</div> : null}
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setError("");
                setBusy(true);
                const id = sipId || await ensureSipCreated();
                if (!id) {
                  setBusy(false);
                  return;
                }
                const bySip = await pollMandateBySip(id);
                setBusy(false);
                if (bySip.data?.isApproved === true || bySip.data?.data?.isApproved === true) {
                  await runFirstDebit(id);
                  return;
                }
                setError("Mandate not approved yet. Approve in UPI, then check again.");
              }}
              className={WIZARD_CTA}
            >
              Check again
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                const id = sipId || await ensureSipCreated();
                if (id) await startMandate(id);
              }}
              className="w-full mt-3 text-sm 4xl:text-[15px] text-ink underline"
            >
              Open UPI AutoPay again
            </button>
          </div>
        )}

        {page === "debit" && (
          <div className={WIZARD_CARD}>
            <h1 className={`${WIZARD_TITLE} mb-1`}>Activating your SIP</h1>
            <p className={`${WIZARD_SUB} mb-6`}>
              Setting up purchase plans and debiting the first installment. This can take up to a couple of minutes.
            </p>
            <div className="bg-surface border border-border rounded-card 4xl:rounded-2xl p-5 4xl:p-6 mb-4">
              <div className="text-sm 4xl:text-[15px] font-semibold text-jade mb-1">
                {busy ? (progressMsg || "Working…") : "Ready to retry"}
              </div>
              <div className="text-xs 4xl:text-sm text-muted">SIP #{sipId} · {money(amount)} first debit</div>
            </div>
            {error ? <div className="text-sm 4xl:text-base text-red-600 mb-3">{error}</div> : null}
            {!busy && error ? (
              <button
                type="button"
                onClick={async () => {
                  const id = sipId || await ensureSipCreated();
                  if (id) await runFirstDebit(id);
                }}
                className={WIZARD_CTA}
              >
                Retry first debit
              </button>
            ) : null}
          </div>
        )}

        {page === "success" && (
          <div className={`${WIZARD_STAGE} py-4 sm:py-8 4xl:py-10`}>
            <div className="text-center mb-6 4xl:mb-8">
              <div className="w-14 h-14 4xl:w-16 4xl:h-16 rounded-full bg-tint text-jade flex items-center justify-center mx-auto mb-4">
                <Check size={28} />
              </div>
              <h1 className={`${WIZARD_TITLE} mb-2`}>Your SIP is set up!</h1>
              <p className={`${WIZARD_SUB} max-w-md 4xl:max-w-lg mx-auto`}>
                {successView?.subtitle
                  || (daily
                    ? "First payment initiated. Daily auto-debit on each business day."
                    : "First payment initiated. Monthly SIP set for next month.")}
              </p>
              {partialNote ? <p className="text-sm 4xl:text-base text-amber-700 mt-3">{partialNote}</p> : null}
            </div>

            {successLoading && !successView ? (
              <div className="rounded-card border border-border bg-white px-5 py-8 text-center text-sm 4xl:text-base text-muted shadow-card mb-4">
                Loading your SIP details…
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 4xl:gap-5 mb-6 4xl:mb-8">
                <div className="rounded-card 4xl:rounded-3xl border border-border bg-white px-4 sm:px-5 4xl:px-6 py-4 4xl:py-5 shadow-card text-left min-w-0">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full bg-jade text-white text-[11px] 4xl:text-xs font-bold mb-3">
                    Auto-debit set
                  </span>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg 4xl:text-xl font-bold text-jade">
                        {successView?.title || (daily ? "Daily SIP" : "Monthly SIP")}
                      </div>
                      <div className="text-xs sm:text-[13px] 4xl:text-sm text-muted mt-1 break-words">
                        {successView?.scheduleLine
                          || (daily
                            ? "Next: each business day"
                            : `Next: ${goalDates.next} · then ${dayOrdinal(monthlyDay)}/month`)}
                      </div>
                    </div>
                    <div className="text-lg sm:text-xl 4xl:text-2xl font-bold text-jade shrink-0">
                      {successView?.amountLabel || `${money(amount)}${daily ? "/day" : "/mo"}`}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(successView?.recurringChips?.length
                      ? successView.recurringChips
                      : [`${portfolioTitle || tab?.label || "Equity"} ${money(amount)}${daily ? "/day" : "/mo"}`]
                    ).map((chip) => (
                      <span
                        key={chip}
                        className="inline-flex px-2.5 py-1 rounded-full bg-tint text-jade text-xs 4xl:text-[13px] font-semibold"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-card 4xl:rounded-3xl border border-border bg-white px-4 sm:px-5 4xl:px-6 py-4 4xl:py-5 shadow-card text-left min-w-0">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[11px] 4xl:text-xs font-bold mb-3">
                    Debited · mandate
                  </span>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg 4xl:text-xl font-bold text-amber-900">First instalment</div>
                      <div className="text-xs sm:text-[13px] 4xl:text-sm text-amber-800/80 mt-1">Today · at today&apos;s NAV</div>
                    </div>
                    <div className="text-lg sm:text-xl 4xl:text-2xl font-bold text-amber-900 shrink-0">
                      {successView?.firstAmountLabel || money(amount)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(successView?.firstChips?.length
                      ? successView.firstChips
                      : [`${portfolioTitle || tab?.label || "Equity"} ${money(amount)}`]
                    ).map((chip) => (
                      <span
                        key={chip}
                        className="inline-flex px-2.5 py-1 rounded-full bg-tint text-jade text-xs 4xl:text-[13px] font-semibold"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => { onDone?.({ sipId }); onClose?.(); }}
              className={`${WIZARD_CTA} max-w-md 4xl:max-w-lg mx-auto block`}
            >
              Continue to Dashboard
            </button>
          </div>
        )}
        </div>
      </div>

      {reviewOpen && (
        <div className="fixed inset-0 z-[80] bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-5 4xl:p-8">
          <div
            className="bg-white w-full max-w-[min(100%,520px)] sm:max-w-[540px] lg:max-w-[580px] 4xl:max-w-[640px] rounded-t-2xl sm:rounded-2xl 4xl:rounded-3xl shadow-elevated overflow-hidden flex flex-col max-h-[min(92dvh,900px)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sip-review-title"
          >
            <div className="px-4 sm:px-5 4xl:px-6 pt-4 4xl:pt-5 pb-3 flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <h2 id="sip-review-title" className="text-lg sm:text-xl 4xl:text-2xl font-bold text-ink leading-tight">
                  Review & confirm
                </h2>
                <p className="text-xs sm:text-[13px] 4xl:text-sm text-muted mt-1 leading-snug">
                  Check your SIP details before starting.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReviewOpen(false);
                  if (fromGoals) onClose?.();
                }}
                className="w-8 h-8 4xl:w-9 4xl:h-9 -mt-0.5 -mr-1 rounded-full hover:bg-surface flex items-center justify-center shrink-0"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-4 sm:px-5 4xl:px-6 pb-0 overflow-y-auto min-h-0 flex-1">
              <div className="border-t border-border">
                {(fromGoals
                  ? [
                      ["Monthly SIP", `${money(amount)}/mo`],
                      ["Horizon", horizonLabel(frequency, tenureYears)],
                      ["Fund", funds[0]?.fullName || funds[0]?.name || draft.fund?.name || "Recommended fund"],
                      ["SIP date each month", dayOrdinal(monthlyDay)],
                      ["First debit", `${goalDates.first} · ${money(amount)}`],
                      ["Next debit", goalDates.next],
                    ]
                  : [
                      [freqLabel, `${money(amount)}/${daily ? "day" : "month"}`],
                      ["Horizon", horizonLabel(frequency, tenureYears)],
                      ["Fund", funds[0]?.fullName || funds[0]?.name || draft.fund?.name || "Recommended fund"],
                      ...(!daily ? [["SIP date each month", dayOrdinal(monthlyDay)]] : []),
                      ["First debit", `Today · ${money(amount)}`],
                    ]
                ).map(([label, value]) => {
                  const isFund = label === "Fund" || label === "Basket";
                  if (isFund) {
                    return (
                      <div key={label} className="py-2 4xl:py-2.5 border-b border-border text-[13px] 4xl:text-sm">
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
                      className="flex items-start justify-between gap-4 py-2 4xl:py-2.5 border-b border-border text-[13px] 4xl:text-sm"
                    >
                      <span className="text-ink shrink-0 pt-px">{label}</span>
                      <span className="text-ink text-right leading-snug break-words min-w-0 max-w-[68%]">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 border border-border rounded-xl px-3 4xl:px-4 py-2.5 4xl:py-3">
                <div className="text-[10px] 4xl:text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                  Setup checklist
                </div>
                <div className="space-y-2">
                  {checklist.map((item) => (
                    <div key={item.id} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 w-4 h-4 4xl:w-[18px] 4xl:h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          item.done ? "bg-emerald text-white" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.done ? "✓" : "×"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] 4xl:text-sm font-semibold text-ink leading-tight">{item.label}</div>
                        <div className="text-[11px] 4xl:text-xs text-muted mt-0.5 leading-snug line-clamp-1">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-5 4xl:px-6 pt-3 pb-4 4xl:pb-5 flex flex-col gap-2 shrink-0">
              {error ? (
                <div className="text-xs 4xl:text-sm text-red-600 leading-snug">{error}</div>
              ) : null}
              <button
                type="button"
                disabled={busy}
                onClick={onReviewPrimary}
                className="w-full h-11 4xl:h-12 rounded-btn bg-jade text-white text-[14px] 4xl:text-[15px] font-semibold disabled:opacity-60"
              >
                {busy ? "Working…" : action.label}
              </button>
              <button
                type="button"
                onClick={() => {
                  setReviewOpen(false);
                  if (fromGoals) onClose?.();
                }}
                className="w-full text-[13px] 4xl:text-sm text-ink underline underline-offset-2 py-0.5"
              >
                {fromGoals ? "Back to edit date" : "Back"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
