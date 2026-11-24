"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { jadeGradient } from "../lib/tokens";
import {
  isInstaFdGoal,
  runWithdrawFromSip,
  sendConsentOtp,
  verifyConsentOtp,
} from "../lib/investmentDetailApi";
import { userFacingMessage } from "../lib/sipInvestApi";

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₹0";
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Withdrawals dialog → OTP → complete-from-sip.
 */
export default function WithdrawSheet({
  open,
  goalName,
  available,
  totalWithdrawn = 0,
  sipId,
  portfolioId,
  forceComplete = false,
  onClose,
  onDone,
}) {
  const [mode, setMode] = useState("partial");
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("form"); // form | otp | progress | success | fail
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [instant, setInstant] = useState(false);

  const max = Math.max(0, Number(available) || 0);

  useEffect(() => {
    if (!open) return;
    setMode(forceComplete ? "complete" : "partial");
    setAmount(forceComplete && max > 0 ? String(Math.round(max * 100) / 100) : "");
    setTouched(false);
    setBusy(false);
    setStep("form");
    setOtp("");
    setError("");
    setProgress("");
    setInstant(false);
  }, [open, forceComplete, max]);

  useEffect(() => {
    if (!open || step !== "form") return;
    if (mode === "complete") {
      setAmount(max > 0 ? String(Math.round(max * 100) / 100) : "");
      setTouched(true);
    } else if (!forceComplete) {
      setAmount("");
      setTouched(false);
    }
  }, [mode, max, open, step, forceComplete]);

  if (!open) return null;

  const value = Number(amount);
  const valid = Number.isFinite(value) && value > 0 && value <= max + 0.001
    && (mode === "complete" || value >= 50);
  const showError = touched && !valid;
  const canInstant = isInstaFdGoal(goalName) && value <= 50000;
  const ctaLabel = canInstant ? "Instant Withdrawal" : "Confirm Withdrawal";

  async function goToOtp() {
    setTouched(true);
    setError("");
    if (!valid || busy) return;
    if (!(Number(sipId) > 0)) {
      setError("This investment cannot be withdrawn yet.");
      return;
    }
    setBusy(true);
    const sent = await sendConsentOtp();
    setBusy(false);
    if (!sent.ok) {
      setError(userFacingMessage(sent.message, "otp not delivered, try again later"));
      return;
    }
    setOtp("");
    setStep("otp");
  }

  async function confirmOtp() {
    setError("");
    if (otp.trim().length < 6 || busy) return;
    setBusy(true);
    const verified = await verifyConsentOtp(otp);
    if (!verified.ok) {
      setBusy(false);
      setError(userFacingMessage(verified.message, "Invalid OTP"));
      return;
    }

    setStep("progress");
    setProgress("Preparing withdrawal…");
    const result = await runWithdrawFromSip({
      sipId,
      portfolioId,
      amount: value,
      mode,
      goalName,
      otp,
      onProgress: setProgress,
    });
    setBusy(false);

    if (!result.ok) {
      setError(userFacingMessage(result.message, "Withdrawal failed"));
      setStep("fail");
      return;
    }
    setInstant(!!result.instant);
    setStep("success");
    onDone?.();
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdraw-title"
        className="relative w-full sm:w-[min(100%,720px)] lg:w-[min(100%,820px)] bg-white rounded-t-2xl sm:rounded-2xl shadow-elevated overflow-hidden max-h-[min(100dvh,100%)] sm:max-h-[min(88dvh,560px)] flex flex-col"
      >
        <div
          className="px-5 sm:px-6 pt-3 sm:pt-5 pb-4 sm:pb-5 text-white relative shrink-0 flex items-center justify-between gap-4"
          style={{ background: jadeGradient }}
        >
          <div className="min-w-0">
            <div className="flex justify-center sm:hidden mb-2">
              <span className="w-10 h-1 rounded-full bg-white/30" />
            </div>
            <h2 id="withdraw-title" className="text-xl sm:text-2xl font-bold tracking-tight">
              {step === "otp" ? "Verify Consent OTP" : step === "success" ? "Withdrawal requested" : "Withdrawals"}
            </h2>
            <p className="text-sm text-white/70 mt-0.5 truncate">{goalName || "Goal"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 flex items-center justify-center shrink-0"
            aria-label="Close"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {step === "form" && (
          <div className="px-5 sm:px-6 py-4 sm:py-5 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 items-start">
            <div className="min-w-0 space-y-3">
              {!forceComplete && (
                <div className="flex rounded-xl overflow-hidden border border-border bg-surface p-1">
                  {[
                    { id: "partial", label: "Partial" },
                    { id: "complete", label: "Complete" },
                  ].map((item) => {
                    const active = mode === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMode(item.id)}
                        className={`flex-1 py-2 sm:py-2.5 px-2 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-colors ${
                          active ? "bg-jade text-white shadow-sm" : "text-jade/80 hover:bg-white"
                        }`}
                      >
                        {item.label} Withdrawal
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="rounded-xl border border-emerald-200/80 bg-tint px-4 py-3.5 sm:py-4">
                <div className="text-[10px] font-bold text-jade/70 uppercase tracking-wider mb-1.5">
                  Remaining amount (Available to withdraw)
                </div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="w-8 h-8 rounded-full bg-jade text-white text-sm font-bold flex items-center justify-center shrink-0">
                    ₹
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-jade tracking-tight">{money(max)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3 mb-3">
                  <span className="text-[10px] font-semibold text-jade/60 uppercase tracking-wider">
                    Total withdrawn
                  </span>
                  <span className="text-sm font-bold text-jade">{money(totalWithdrawn)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-jade/10">
                  <div>
                    <div className="text-[12px] font-semibold text-jade">
                      {mode === "complete" ? "Complete Withdrawal" : "Partial Withdrawal"}
                    </div>
                    <div className="text-[11px] text-jade/60 mt-0.5 leading-snug">
                      {mode === "complete" ? "Withdraw full available amount" : "Withdraw specific amount"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-jade">Processing Time</div>
                    <div className="text-[11px] text-jade/60 mt-0.5">
                      {canInstant ? "1–2 hours" : "24-48 hours"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 flex flex-col">
              <p className="text-[13px] sm:text-sm text-jade/80 leading-snug mb-3">
                Choose how much you want to withdraw. You can withdraw any amount up to your available balance.
              </p>

              <div className="rounded-xl bg-surface border border-border px-4 py-3 sm:py-3.5">
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
                  Withdrawal amount
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-ink">₹</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    disabled={mode === "complete"}
                    onChange={(event) => {
                      setAmount(event.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1"));
                      setTouched(true);
                    }}
                    onBlur={() => setTouched(true)}
                    placeholder="0"
                    className="flex-1 bg-transparent border-0 outline-none text-lg font-bold text-ink p-0 disabled:opacity-70"
                  />
                </div>
              </div>
              {showError ? (
                <p className="text-xs text-red-600 mt-1.5">
                  {mode === "partial" && value > 0 && value < 50
                    ? "Minimum withdrawal is ₹50"
                    : "Please enter a valid amount"}
                </p>
              ) : (
                <p className="text-xs text-muted mt-1.5">Max {money(max)}{mode === "partial" ? " · Min ₹50" : ""}</p>
              )}

              {error ? <div className="text-sm text-red-600 mt-2">{error}</div> : null}

              <button
                type="button"
                disabled={!valid || busy || max <= 1}
                onClick={goToOtp}
                className="w-full mt-4 h-11 sm:h-12 rounded-xl bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover disabled:opacity-45 transition-colors"
              >
                {busy ? "Sending OTP…" : ctaLabel}
              </button>

              <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-tint border border-emerald-100 px-3.5 py-2.5">
                <span className="w-5 h-5 rounded-full bg-jade text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} strokeWidth={3} />
                </span>
                <p className="text-[12px] text-jade leading-snug">
                  Your withdrawal request will be processed securely within {canInstant ? "1–2 hours" : "24-48 hours"}
                </p>
              </div>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="px-5 sm:px-6 py-6 max-w-md mx-auto w-full">
            <p className="text-sm text-muted mb-4">
              Enter the 6-digit consent OTP to confirm this withdrawal.
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full h-12 rounded-xl border border-border px-4 text-center text-xl font-bold tracking-[0.35em] outline-none focus:border-jade"
              placeholder="••••••"
            />
            {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}
            <button
              type="button"
              disabled={busy || otp.length < 6}
              onClick={confirmOtp}
              className="w-full mt-5 h-12 rounded-xl bg-jade text-white text-[15px] font-semibold disabled:opacity-45"
            >
              {busy ? "Confirming…" : "Confirm OTP"}
            </button>
            <button type="button" onClick={() => setStep("form")} className="w-full mt-3 text-sm text-muted underline">
              Back
            </button>
          </div>
        )}

        {step === "progress" && (
          <div className="py-12 text-center px-5">
            <div className="text-sm font-medium text-ink">{progress || "Working…"}</div>
          </div>
        )}

        {step === "success" && (
          <div className="px-5 sm:px-6 py-6 max-w-md mx-auto w-full">
            <p className="text-sm text-muted mb-6">
              {money(value)} withdrawal requested.
              {instant
                ? " Instant InstaFD credit typically lands in 1–2 hours."
                : " Credit typically lands in 1–3 working days."}
            </p>
            <button type="button" onClick={onClose} className="w-full h-12 rounded-xl bg-jade text-white text-[15px] font-semibold">
              Done
            </button>
          </div>
        )}

        {step === "fail" && (
          <div className="px-5 sm:px-6 py-6 max-w-md mx-auto w-full">
            <p className="text-sm text-red-600 mb-6">{error || "Something went wrong"}</p>
            <button
              type="button"
              onClick={() => { setStep("form"); setError(""); }}
              className="w-full h-12 rounded-xl bg-jade text-white text-[15px] font-semibold"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
