"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  addMoneyMinForTerm,
  openPaymentAndCapture,
  runAddMoney,
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
 * Add Money sheet → OTP → buy complete → payment.
 */
export default function AddMoneySheet({
  open,
  goalName,
  currentValue,
  sipId,
  portfolioId,
  investmentTerm,
  onClose,
  onDone,
}) {
  const [step, setStep] = useState("amount"); // amount | otp | progress | success | fail
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  const minAmount = addMoneyMinForTerm(investmentTerm);

  useEffect(() => {
    if (!open) return;
    setStep("amount");
    setAmount("");
    setTouched(false);
    setBusy(false);
    setOtp("");
    setError("");
    setProgress("");
  }, [open]);

  if (!open) return null;

  const value = Number(amount);
  const valid = Number.isFinite(value) && value >= minAmount;
  const showError = touched && !valid;

  async function goToOtp() {
    setTouched(true);
    setError("");
    if (!valid || busy) return;
    if (!(Number(sipId) > 0)) {
      setError("This investment cannot accept top-ups yet.");
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
    setProgress("Preparing…");
    const result = await runAddMoney({
      sipId,
      portfolioId,
      amount: value,
      onProgress: setProgress,
    });

    if (!result.ok) {
      setBusy(false);
      setError(userFacingMessage(result.message, "Could not add money"));
      setStep("fail");
      return;
    }

    if (result.paymentUrl) {
      setProgress("Complete payment in the new window…");
      const pay = await openPaymentAndCapture(result.paymentUrl, result.paymentId);
      setBusy(false);
      if (pay.failed) {
        setError(userFacingMessage(pay.message, "Payment failed"));
        setStep("fail");
        return;
      }
      setStep("success");
      onDone?.();
      return;
    }

    setBusy(false);
    setStep("success");
    onDone?.();
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-money-title"
        className="relative w-full sm:max-w-[420px] bg-white rounded-t-2xl sm:rounded-2xl shadow-elevated px-5 pt-3 pb-6 sm:pb-5 max-h-[min(92dvh,640px)] overflow-y-auto"
      >
        <div className="flex justify-center sm:hidden mb-2">
          <span className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="min-w-0">
            <h2 id="add-money-title" className="text-xl font-bold text-ink leading-tight">
              {step === "otp" ? "Verify Consent OTP" : step === "success" ? "Money added" : step === "fail" ? "Could not add" : "Add Money"}
            </h2>
            <p className="text-sm text-muted mt-1 truncate">{goalName || "Goal"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-border bg-white hover:bg-surface flex items-center justify-center shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {step === "amount" && (
          <>
            <div className="rounded-xl bg-surface border border-border px-4 py-4 mb-4">
              <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">
                Your current portfolio value
              </div>
              <div className="text-2xl font-bold text-ink tracking-tight">{money(currentValue)}</div>
            </div>

            <div>
              <div className="rounded-xl bg-surface border border-border px-4 py-3.5">
                <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
                  Add amount
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-ink">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value.replace(/\D/g, ""));
                      setTouched(true);
                    }}
                    onBlur={() => setTouched(true)}
                    placeholder="0"
                    className="flex-1 bg-transparent border-0 outline-none text-lg font-bold text-ink p-0"
                  />
                </div>
              </div>
              {showError ? (
                <p className="text-xs text-amber-800 mt-2">
                  Please enter a valid amount (min ₹{minAmount.toLocaleString("en-IN")})
                </p>
              ) : (
                <p className="text-xs text-muted mt-2">Minimum ₹{minAmount.toLocaleString("en-IN")}</p>
              )}
            </div>

            {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}

            <button
              type="button"
              disabled={!valid || busy}
              onClick={goToOtp}
              className="w-full mt-6 h-12 rounded-xl bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover disabled:opacity-45 transition-colors"
            >
              {busy ? "Sending OTP…" : "Verify & Add"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <p className="text-sm text-muted mb-4">
              Enter the 6-digit consent OTP sent to your registered mobile / email.
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
              className="w-full mt-5 h-12 rounded-xl bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover disabled:opacity-45"
            >
              {busy ? "Verifying…" : "Confirm OTP"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setError("");
                setBusy(true);
                const sent = await sendConsentOtp();
                setBusy(false);
                if (!sent.ok) setError(userFacingMessage(sent.message, "otp not delivered, try again later"));
              }}
              className="w-full mt-3 text-sm text-jade font-semibold"
            >
              Resend OTP
            </button>
            <button type="button" onClick={() => setStep("amount")} className="w-full mt-2 text-sm text-muted underline">
              Back
            </button>
          </>
        )}

        {step === "progress" && (
          <div className="py-8 text-center">
            <div className="text-sm font-medium text-ink">{progress || "Working…"}</div>
            <div className="text-xs text-muted mt-2">Please keep this window open</div>
          </div>
        )}

        {step === "success" && (
          <>
            <p className="text-sm text-muted mb-6">
              {money(value)} will reflect in your portfolio after payment settlement.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-12 rounded-xl bg-jade text-white text-[15px] font-semibold"
            >
              Done
            </button>
          </>
        )}

        {step === "fail" && (
          <>
            <p className="text-sm text-red-600 mb-6">{error || "Something went wrong"}</p>
            <button
              type="button"
              onClick={() => { setStep("amount"); setError(""); }}
              className="w-full h-12 rounded-xl bg-jade text-white text-[15px] font-semibold"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
