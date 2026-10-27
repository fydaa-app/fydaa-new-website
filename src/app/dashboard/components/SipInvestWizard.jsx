"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown, X } from "lucide-react";
import {
  checkInvestReadiness,
  createMandate,
  createSipSetup,
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
export default function SipInvestWizard({ open, draft, onClose, onDone }) {
  const fromGoals = !!draft?.fromGoals || !!draft?.openReview;
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
  const [progressMsg, setProgressMsg] = useState("");
  const [partialNote, setPartialNote] = useState("");

  const tab = tabMeta(draft?.tab);
  const daily = draft?.frequency === "daily";
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
    return base.map((item) => {
      if (item.id === "consent") return { ...item, done: consentDone };
      if (item.id === "mandate") return { ...item, done: mandateDone };
      return item;
    });
  }, [readiness, consentDone, mandateDone]);

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
      goalId: draft.goalId,
      amount,
      tenureYears,
      frequency: draft.frequency,
      sipName: draft.goalName || tab?.label || "SIP",
      fund: ownFund ? draft.fund : null,
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

  async function runFirstDebit(id) {
    setError("");
    setPartialNote("");
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
      return true;
    }
    if (!result.ok) {
      setError(userFacingMessage(result.message, "First debit failed"));
      return false;
    }
    if (result.partialMessage) setPartialNote(result.partialMessage);
    setPage("success");
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
    const next = nextReviewAction({ readiness: ready, consentDone: false, mandateDone: false });
    if (next.step === "kyc") {
      setError("Complete KYC in the signup flow, then return here.");
      setPage("goals");
      return;
    }
    if (next.step === "bank") {
      setError("Add your bank details in KYC, then return here.");
      setPage("goals");
      return;
    }
    setBusy(true);
    const id = await ensureSipCreated(port);
    if (!id) {
      setBusy(false);
      setPage("goals");
      return;
    }
    if (next.step === "consent") {
      const sent = await sendConsentOtp();
      setBusy(false);
      if (!sent.ok) {
        setError(userFacingMessage(sent.message, "otp not delivered, try again later"));
        setPage("goals");
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
    const goals = !!draft.fromGoals;
    const showGoalsReview = goals && !!draft.openReview;
    const startGoalsSetup = goals && (draft.startSetup || !draft.openReview);
    setPage(goals ? (showGoalsReview ? "goals" : "loading") : "portfolio");
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
    setBusy(false);
    setLoading(true);
    Promise.all([
      loadPortfolioForSip(draft.goalId, ownFund ? draft.fund : null),
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
        setPage("goals");
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
    if (action.step === "kyc") {
      setError("Complete KYC in the signup flow, then return here.");
      return;
    }
    if (action.step === "bank") {
      setError("Add your bank details in KYC, then return here.");
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
    setPage("success");
    setReviewOpen(false);
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
    if (fromGoals && (page === "consent" || page === "mandate" || page === "debit" || page === "loading" || page === "goals")) {
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
      <div className="w-full max-w-[1000px] mx-auto px-6 sm:px-10 pt-5 sm:pt-6 shrink-0 flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface"
        >
          <ArrowLeft size={18} />
        </button>
        <Progress step={progressStep} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div
          className={`w-full max-w-[1000px] mx-auto px-6 sm:px-10 py-5 sm:py-8 min-h-full flex flex-col ${
            centerStage ? "justify-center" : ""
          }`}
        >
        {page === "loading" && fromGoals && (
          <div className="max-w-xl mx-auto w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1">Continuing your goal SIP</h1>
            <p className="text-sm text-muted mb-6">Preparing consent and auto-debit…</p>
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
          </div>
        )}

        {page === "goals" && fromGoals && !reviewOpen && (
          <div className="max-w-lg mx-auto w-full bg-white border border-border rounded-card p-6 sm:p-8 shadow-card">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1">Finish setup</h1>
            <p className="text-sm text-muted mb-6">Complete the required step, then continue your goal SIP.</p>
            {error ? <div className="text-sm text-red-600 mb-4">{error}</div> : null}
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
              className="w-full h-12 rounded-btn bg-jade text-white font-semibold disabled:opacity-60"
            >
              {busy ? "Checking…" : "Try again"}
            </button>
            <button type="button" onClick={onClose} className="block mt-4 text-sm text-ink underline">
              Back to edit date
            </button>
          </div>
        )}

        {page === "portfolio" && !fromGoals && (
          <div className="w-full">
            <div className="mb-5 sm:mb-6">
              <h1 className="text-[28px] sm:text-[34px] font-bold text-ink tracking-tight leading-tight">
                {daily ? (
                  <>Daily SIP <span className="text-emerald">payments</span></>
                ) : (
                  <>Monthly SIP <span className="text-emerald">payments</span></>
                )}
              </h1>
              <p className="text-sm sm:text-base text-muted mt-1.5">Review your portfolio and payment schedule.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] gap-5 lg:gap-6 items-stretch">
              <div className="min-w-0 space-y-4 flex flex-col">
                <div className="bg-white border border-border rounded-card overflow-hidden shadow-card">
                  <button
                    type="button"
                    onClick={() => setAutoDebitOpen((value) => !value)}
                    className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-surface/60"
                  >
                    <span className="w-9 h-9 rounded-lg bg-tint text-jade text-sm font-bold flex items-center justify-center shrink-0">i</span>
                    <span className="flex-1 text-sm sm:text-[15px] font-semibold text-ink">How the auto-debit works</span>
                    <ChevronDown size={16} className={`text-muted shrink-0 transition-transform ${autoDebitOpen ? "rotate-180" : ""}`} />
                  </button>
                  {autoDebitOpen && (
                    <div className="px-5 pb-5 pt-1 grid sm:grid-cols-3 gap-4 sm:gap-5">
                      {autoDebitSteps.map((item, index) => (
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

                {!daily && (
                  <div>
                    <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">SIP date</div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 5, 10, 15, 20, 25, 28].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setMonthlyDay(day)}
                          className={`px-3.5 py-2 rounded-full text-xs font-semibold border ${
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
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Your portfolio</div>
                  <div className="rounded-card overflow-hidden text-white shadow-card flex-1 flex flex-col" style={{ background: "linear-gradient(160deg,#0C4A3E,#047857)" }}>
                    <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg sm:text-xl font-bold">{portfolioTitle}</div>
                        <div className="text-sm text-white/70 mt-1">
                          {funds.length || 1} fund · {money(amount)}/{daily ? "day" : "month"}
                        </div>
                      </div>
                    </div>
                    <div className="px-5 sm:px-6 pb-3">
                      <div className="h-1.5 rounded-full bg-white/20 overflow-hidden mb-2">
                        <div className="h-full bg-emerald-300 rounded-full" style={{ width: "100%" }} />
                      </div>
                      <div className="text-[11px] font-semibold tracking-wider text-emerald-200">
                        {(tab?.label || "EQUITY").toUpperCase()} 100%
                      </div>
                    </div>
                    <div className="px-4 sm:px-5 pb-5 space-y-2 mt-auto">
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
                </div>
              </div>

              <aside className="space-y-4 flex flex-col justify-center">
                <div className="bg-white border border-border rounded-card px-5 py-2 shadow-card">
                  <div className="flex justify-between py-3.5 text-sm sm:text-[15px]">
                    <span className="text-secondary">{freqLabel}</span>
                    <span className="font-semibold text-ink">{money(amount)}</span>
                  </div>
                  <div className="flex justify-between py-3.5 text-sm sm:text-[15px] border-t border-border">
                    <span className="text-secondary">Transaction charges</span>
                    <span className="font-semibold text-ink">₹0</span>
                  </div>
                  <div className="flex justify-between py-3.5 text-sm sm:text-[15px] border-t border-border">
                    <span className="font-bold text-ink">First debit today</span>
                    <span className="font-bold text-emerald">{money(amount)}</span>
                  </div>
                </div>

                {error ? <div className="text-sm text-red-600">{error}</div> : null}

                <button
                  type="button"
                  disabled={busy || loading}
                  onClick={openReview}
                  className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover disabled:opacity-60"
                >
                  {busy ? "Preparing…" : "Review & confirm →"}
                </button>
                <button type="button" onClick={onClose} className="w-full text-sm text-ink underline underline-offset-2">
                  Back to edit amount
                </button>
                <div className="text-center text-xs text-muted pt-1">
                  Invested with · {funds[0]?.name?.split(" ")[0] || "fydaa"}
                </div>
              </aside>
            </div>
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

        {page === "mandate" && (
          <div className="max-w-lg mx-auto w-full bg-white border border-border rounded-card p-6 sm:p-8 shadow-card">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1">UPI AutoPay</h1>
            <p className="text-sm text-muted mb-6">
              Approve the mandate in your UPI app. Limit {money(amount)}. First debit starts after approval.
            </p>
            {busy ? <div className="text-sm text-jade mb-4">Waiting for mandate approval…</div> : null}
            {error ? <div className="text-sm text-red-600 mb-3">{error}</div> : null}
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
              className="w-full h-12 rounded-btn bg-jade text-white font-semibold"
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
              className="w-full mt-3 text-sm text-ink underline"
            >
              Open UPI AutoPay again
            </button>
          </div>
        )}

        {page === "debit" && (
          <div className="max-w-lg mx-auto w-full bg-white border border-border rounded-card p-6 sm:p-8 shadow-card">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1">Activating your SIP</h1>
            <p className="text-sm text-muted mb-6">
              Setting up purchase plans and debiting the first installment. This can take up to a couple of minutes.
            </p>
            <div className="bg-surface border border-border rounded-card p-5 mb-4">
              <div className="text-sm font-semibold text-jade mb-1">
                {busy ? (progressMsg || "Working…") : "Ready to retry"}
              </div>
              <div className="text-xs text-muted">SIP #{sipId} · {money(amount)} first debit</div>
            </div>
            {error ? <div className="text-sm text-red-600 mb-3">{error}</div> : null}
            {!busy && error ? (
              <button
                type="button"
                onClick={async () => {
                  const id = sipId || await ensureSipCreated();
                  if (id) await runFirstDebit(id);
                }}
                className="w-full h-12 rounded-btn bg-jade text-white font-semibold"
              >
                Retry first debit
              </button>
            ) : null}
          </div>
        )}

        {page === "success" && (
          <div className="max-w-lg mx-auto text-center py-8 sm:py-14 bg-white border border-border rounded-card px-6 sm:px-10 shadow-card">
            <div className="w-14 h-14 rounded-full bg-tint text-jade flex items-center justify-center mx-auto mb-4">
              <Check size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2">SIP setup successful</h1>
            <div className="inline-flex px-3 py-1 rounded-full bg-tint text-jade text-xs font-bold mb-4">Auto-debit set</div>
            <p className="text-sm text-muted mb-6 max-w-sm mx-auto">
              {daily
                ? "First payment initiated. Daily auto-debit on each business day."
                : "First payment initiated. Monthly SIP set for next month."}
            </p>
            {partialNote ? <p className="text-sm text-amber-700 mb-4">{partialNote}</p> : null}
            <button
              type="button"
              onClick={() => { onDone?.({ sipId }); onClose?.(); }}
              className="w-full h-12 rounded-btn bg-jade text-white font-semibold"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
        </div>
      </div>

      {reviewOpen && (
        <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center p-4 sm:p-6">
          <div
            className="bg-white w-full max-w-[440px] rounded-2xl shadow-elevated overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sip-review-title"
          >
            <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id="sip-review-title" className="text-xl font-bold text-ink leading-none">
                  Review & confirm
                </h2>
                <p className="text-sm text-muted mt-1.5 leading-snug">
                  Check your SIP details before starting.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReviewOpen(false);
                  if (fromGoals) onClose?.();
                }}
                className="w-8 h-8 -mt-0.5 -mr-1 rounded-full hover:bg-surface flex items-center justify-center shrink-0"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-5 pb-1 overflow-y-auto min-h-0">
              <div className="border-t border-border">
                {(fromGoals
                  ? [
                      ["Monthly SIP", `${money(amount)}/mo`],
                      ["Horizon", horizonLabel(draft.frequency, tenureYears)],
                      ["Fund", funds[0]?.fullName || funds[0]?.name || draft.fund?.name || "Recommended fund"],
                      ["SIP date each month", dayOrdinal(monthlyDay)],
                      ["First debit", `${goalDates.first} · ${money(amount)}`],
                      ["Next debit", goalDates.next],
                    ]
                  : [
                      [freqLabel, `${money(amount)}/${daily ? "day" : "month"}`],
                      ["Horizon", horizonLabel(draft.frequency, tenureYears)],
                      ["Fund", funds[0]?.fullName || funds[0]?.name || draft.fund?.name || "Recommended fund"],
                      ["First debit", `Today · ${money(amount)}`],
                    ]
                ).map(([label, value]) => (
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
              {error ? (
                <div className="text-sm text-red-600 leading-5 -mt-1">{error}</div>
              ) : null}
              <button
                type="button"
                disabled={busy}
                onClick={onReviewPrimary}
                className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold disabled:opacity-60"
              >
                {busy ? "Working…" : action.label}
              </button>
              <button
                type="button"
                onClick={() => {
                  setReviewOpen(false);
                  if (fromGoals) onClose?.();
                }}
                className="w-full text-sm text-ink underline underline-offset-2"
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
