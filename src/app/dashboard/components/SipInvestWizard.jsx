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
  verifyConsentOtp,
} from "../lib/sipInvestApi";

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

export default function SipInvestWizard({ open, draft, onClose, onDone }) {
  const [page, setPage] = useState("portfolio"); // portfolio | consent | mandate | debit | success
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

  useEffect(() => {
    if (!open || !draft) return undefined;
    let cancelled = false;
    setPage("portfolio");
    setReviewOpen(false);
    setConsentDone(false);
    setMandateDone(false);
    setSipId(null);
    setOtp("");
    setError("");
    setProgressMsg("");
    setPartialNote("");
    setMonthlyDay(Number(draft.monthlyDay) > 0 ? Number(draft.monthlyDay) : 10);
    setLoading(true);
    Promise.all([
      loadPortfolioForSip(draft.goalId, ownFund ? draft.fund : null),
      checkInvestReadiness(),
    ]).then(async ([port, ready]) => {
      if (cancelled) return;
      setPortfolio(port);
      setReadiness(ready);
      setLoading(false);
      if (port.message) setError(port.message);
      if (draft.openReview) {
        setReviewOpen(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open, draft, ownFund]);

  const funds = portfolio?.funds?.length
    ? portfolio.funds
    : draft?.fund
    ? [{ name: draft.fund.name, weight: 100, cagr: null, risk: null }]
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

  function rememberFirstDebit(id) {
    setPendingSipFirstDebit({
      sipId: id,
      amount,
      portfolioId,
      ownFund,
    });
  }

  async function ensureSipCreated() {
    if (sipId) return sipId;
    const goalAmount = illustratedCorpus(amount, rate, tenureYears, daily);
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
      setError(result.message || "Could not create SIP");
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
      setError(result.message || "First debit failed");
      return false;
    }
    if (result.partialMessage) setPartialNote(result.partialMessage);
    setPage("success");
    return true;
  }

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
    if (action.step === "advisory") {
      setError("Set up the advisory fee from your plan, then return here.");
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
        setError(sent.message || "otp not delivered, try again later");
        return;
      }
      setReviewOpen(false);
      setPage("consent");
      return;
    }
    if (action.step === "mandate") {
      setBusy(true);
      try {
        const id = await ensureSipCreated();
        if (!id) {
          setBusy(false);
          return;
        }
        const mandate = await createMandate(id, amount);
        if (!mandate.ok) {
          setBusy(false);
          const statusBit = mandate.status ? ` [${mandate.status}]` : "";
          setError((mandate.message || "Could not start UPI AutoPay") + statusBit);
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
      }
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

  async function confirmOtp() {
    setBusy(true);
    setError("");
    const result = await verifyConsentOtp(otp);
    setBusy(false);
    if (!result.ok) {
      setError(result.message || "Invalid OTP");
      return;
    }
    setConsentDone(true);
    setPage("portfolio");
    setReviewOpen(true);
  }

  if (!open || !draft) return null;

  if (draft.frequency === "lumpsum") {
    return (
      <div className="fixed inset-0 z-[70] bg-bg">
        <div className="max-w-[640px] mx-auto px-6 py-6">
          <button type="button" onClick={onClose} className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center mb-6">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-ink mb-2">Review your investment</h1>
          <p className="text-sm text-muted mb-6">One-time invest continues from readiness and payment next.</p>
          <div className="bg-white border border-border rounded-card p-5 shadow-card mb-4">
            <div className="flex justify-between text-sm py-2"><span className="text-muted">Amount</span><span className="font-semibold">{money(amount)}</span></div>
            <div className="flex justify-between text-sm py-2 border-t border-border"><span className="text-muted">Fund</span><span className="font-semibold text-right max-w-[60%]">{draft.fund?.name || "Recommended fund"}</span></div>
            <div className="flex justify-between text-sm py-2 border-t border-border"><span className="text-muted">Goal</span><span className="font-semibold">{tab?.label}</span></div>
          </div>
          <button type="button" onClick={onClose} className="w-full py-3.5 rounded-btn bg-jade text-white font-semibold">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const progressStep = page === "success" || page === "debit" ? 3 : page === "consent" || page === "mandate" ? 2 : 1;

  return (
    <div className="fixed inset-0 z-[70] bg-bg overflow-y-auto">
      <div className="max-w-[640px] mx-auto px-6 py-6 min-h-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              if (page === "consent" || page === "mandate" || page === "debit") {
                setPage("portfolio");
                setReviewOpen(true);
                return;
              }
              onClose?.();
            }}
            className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>
          <Progress step={progressStep} />
        </div>

        {page === "portfolio" && (
          <>
            <h1 className="text-[28px] font-bold text-ink tracking-tight">{daily ? "Daily SIP payments" : "Monthly SIP payments"}</h1>
            <p className="text-sm text-muted mt-1 mb-5">Review your portfolio and payment schedule.</p>

            <div className="mb-5 bg-white border border-border rounded-card overflow-hidden">
              <button
                type="button"
                onClick={() => setAutoDebitOpen((value) => !value)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              >
                <span className="w-8 h-8 rounded-lg bg-tint text-jade text-sm font-bold flex items-center justify-center shrink-0">i</span>
                <span className="flex-1 text-sm font-semibold text-ink">How the auto-debit works</span>
                <ChevronDown size={16} className={`text-muted shrink-0 transition-transform ${autoDebitOpen ? "rotate-180" : ""}`} />
              </button>
              {autoDebitOpen && (
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
                    daily
                      ? {
                          title: "Auto-debit daily",
                          detail: `${money(amount)} on each business day · pause or cancel anytime`,
                        }
                      : {
                          title: "Auto-debit monthly",
                          detail: `${money(amount)} on the ${monthlyDay}${monthlyDay === 1 ? "st" : monthlyDay === 2 ? "nd" : monthlyDay === 3 ? "rd" : "th"} each month · pause or cancel anytime`,
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

            {!daily && (
              <div className="mb-5">
                <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">SIP date</div>
                <div className="flex flex-wrap gap-2">
                  {[1, 5, 10, 15, 20, 25, 28].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setMonthlyDay(day)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold border ${
                        monthlyDay === day ? "bg-jade text-white border-jade" : "bg-white text-secondary border-border"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-2">Your portfolio</div>
            <div className="rounded-card overflow-hidden mb-5 text-white" style={{ background: "linear-gradient(160deg,#0C4A3E,#047857)" }}>
              <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-bold">{portfolioTitle}</div>
                  <div className="text-sm text-white/70 mt-0.5">
                    {draft?.goalBadge ? `${draft.goalBadge} · ` : ""}
                    {funds.length || 1} fund · {money(amount)}/{daily ? "day" : "month"}
                  </div>
                </div>
              </div>
              <div className="px-5 pb-3">
                <div className="h-1.5 rounded-full bg-white/20 overflow-hidden mb-2">
                  <div className="h-full bg-emerald-300 rounded-full" style={{ width: "100%" }} />
                </div>
                <div className="text-[11px] font-semibold tracking-wider text-emerald-200">
                  {(tab?.label || "EQUITY").toUpperCase()} 100%
                </div>
              </div>
              <div className="px-4 pb-4 space-y-2">
                {loading && <div className="bg-white/10 rounded-btn px-4 py-3 text-sm">Loading fund…</div>}
                {!loading && funds.map((fund) => (
                  <div key={`${fund.scheme || fund.name}`} className="bg-white/10 rounded-btn px-4 py-3">
                    <div className="text-sm font-semibold">{fund.name}</div>
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

            <div className="bg-white border border-border rounded-card px-5 py-2 shadow-card mb-6">
              <div className="flex justify-between py-3 text-sm">
                <span className="text-secondary">{freqLabel}</span>
                <span className="font-semibold text-ink">{money(amount)}</span>
              </div>
              <div className="flex justify-between py-3 text-sm border-t border-border">
                <span className="text-secondary">Transaction charges</span>
                <span className="font-semibold text-ink">₹0</span>
              </div>
              <div className="flex justify-between py-3 text-sm border-t border-border">
                <span className="font-bold text-ink">First debit today</span>
                <span className="font-bold text-emerald">{money(amount)}</span>
              </div>
            </div>

            {error ? <div className="text-sm text-red-600 mb-3">{error}</div> : null}

            <button
              type="button"
              disabled={busy || loading}
              onClick={openReview}
              className="w-full py-3.5 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover disabled:opacity-60"
            >
              {busy ? "Preparing…" : "Review & confirm →"}
            </button>
            <button type="button" onClick={onClose} className="w-full mt-3 text-sm text-ink underline">
              Back to edit amount
            </button>
            <div className="text-center text-xs text-muted mt-4">
              Invested with · {funds[0]?.name?.split(" ")[0] || "fydaa"}
            </div>
          </>
        )}

        {page === "consent" && (
          <div>
            <h1 className="text-2xl font-bold text-ink mb-1">Verify Consent OTP</h1>
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
              className="w-full py-3.5 rounded-btn bg-jade text-white font-semibold disabled:opacity-60"
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
                if (!sent.ok) setError(sent.message || "OTP resend failed");
              }}
              className="w-full mt-3 text-sm text-muted underline"
            >
              Resend OTP
            </button>
          </div>
        )}

        {page === "mandate" && (
          <div>
            <h1 className="text-2xl font-bold text-ink mb-1">UPI AutoPay</h1>
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
              className="w-full py-3.5 rounded-btn bg-jade text-white font-semibold"
            >
              Check again
            </button>
            <button type="button" onClick={() => { setPage("portfolio"); setReviewOpen(true); }} className="w-full mt-3 text-sm text-ink underline">
              Back
            </button>
          </div>
        )}

        {page === "debit" && (
          <div>
            <h1 className="text-2xl font-bold text-ink mb-1">Activating your SIP</h1>
            <p className="text-sm text-muted mb-6">
              Setting up purchase plans and debiting the first installment. This can take up to a couple of minutes.
            </p>
            <div className="bg-white border border-border rounded-card p-5 shadow-card mb-4">
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
                className="w-full py-3.5 rounded-btn bg-jade text-white font-semibold"
              >
                Retry first debit
              </button>
            ) : null}
          </div>
        )}

        {page === "success" && (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-tint text-jade flex items-center justify-center mx-auto mb-4">
              <Check size={28} />
            </div>
            <h1 className="text-2xl font-bold text-ink mb-2">SIP setup successful</h1>
            <div className="inline-flex px-3 py-1 rounded-full bg-tint text-jade text-xs font-bold mb-4">Auto-debit set</div>
            <p className="text-sm text-muted mb-4">
              {daily
                ? "First payment initiated. Daily auto-debit on each business day."
                : "First payment initiated. Monthly SIP set for next month."}
            </p>
            {partialNote ? <p className="text-sm text-amber-700 mb-4">{partialNote}</p> : null}
            <button
              type="button"
              onClick={() => { onDone?.({ sipId }); onClose?.(); }}
              className="w-full py-3.5 rounded-btn bg-jade text-white font-semibold"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>

      {reviewOpen && (
        <div className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white w-full max-w-[480px] rounded-card shadow-elevated overflow-hidden">
            <div className="px-6 pt-5 pb-5">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="min-w-0 pr-2">
                  <h2 className="text-xl font-bold text-ink">Review & confirm</h2>
                  <p className="text-sm text-muted mt-1">Check your SIP details before starting.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="border-t border-border mb-5">
                {[
                  [freqLabel, `${money(amount)}/${daily ? "day" : "month"}`],
                  ["Horizon", horizonLabel(draft.frequency, tenureYears)],
                  ["Fund", funds[0]?.name || draft.fund?.name || "Recommended fund"],
                  ["First debit", `Today · ${money(amount)}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-3 border-b border-border text-sm">
                    <span className="font-normal text-ink shrink-0">{label}</span>
                    <span className="font-normal text-ink text-right leading-snug">{value}</span>
                  </div>
                ))}
              </div>

              <div className="border border-border rounded-card px-4 py-3.5 mb-5">
                <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">Setup checklist</div>
                <div className="space-y-3.5">
                  {checklist.map((item) => (
                    <div key={item.id} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        item.done ? "bg-emerald text-white" : "bg-red-100 text-red-600"
                      }`}>
                        {item.done ? "✓" : "×"}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-ink leading-snug">{item.label}</div>
                        <div className="text-xs text-muted mt-0.5 leading-snug">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error ? <div className="text-sm text-red-600 mb-3">{error}</div> : null}

              <button
                type="button"
                disabled={busy}
                onClick={onReviewPrimary}
                className="w-full py-3.5 rounded-btn bg-jade text-white text-[15px] font-semibold disabled:opacity-60"
              >
                {busy ? "Working…" : action.label}
              </button>
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                className="w-full mt-3 text-sm text-ink font-normal underline"
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
