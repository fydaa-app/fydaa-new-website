"use client";

import { useEffect, useState } from "react";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import {
  CANCEL_REASONS,
  cancelSipPlan,
  modifyLimits,
  modifySipAmount,
} from "../lib/investmentDetailApi";
import { userFacingMessage } from "../lib/sipInvestApi";

/**
 * SIP options: Modify amount / Cancel SIP (+ withdraw-first gate via parent).
 */
export default function SipOptionsSheet({
  open,
  forLabel,
  sipId,
  frequency,
  currentAmount,
  currentValue,
  onClose,
  onNeedWithdrawFirst,
  onModified,
  onCancelled,
}) {
  const [view, setView] = useState("menu"); // menu | modify | cancel | success | fail
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reasonCode, setReasonCode] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const limits = modifyLimits(frequency);

  useEffect(() => {
    if (!open) return;
    setView("menu");
    setAmount(currentAmount > 0 ? String(Math.round(Number(currentAmount))) : "");
    setBusy(false);
    setError("");
    setReasonCode("");
    setReasonText("");
    setSuccessMsg("");
  }, [open, currentAmount]);

  if (!open) return null;

  const who = String(forLabel || "").trim() || "this SIP";
  const modifyValue = Number(amount);
  const modifyValid = Number.isFinite(modifyValue)
    && modifyValue >= limits.min
    && modifyValue <= limits.max;

  async function submitModify() {
    setError("");
    if (!modifyValid || busy) return;
    setBusy(true);
    const result = await modifySipAmount({ sipId, newAmount: modifyValue });
    setBusy(false);
    if (!result.ok) {
      setError(userFacingMessage(result.message, "Could not modify SIP"));
      setView("fail");
      return;
    }
    setSuccessMsg(`SIP updated to ₹${Math.round(modifyValue).toLocaleString("en-IN")} ${limits.label}`);
    setView("success");
    onModified?.();
  }

  function startCancel() {
    setError("");
    const bal = Number(currentValue) || 0;
    if (bal > 0) {
      onNeedWithdrawFirst?.();
      return;
    }
    setView("cancel");
  }

  async function submitCancel() {
    setError("");
    if (!reasonCode || busy) return;
    setBusy(true);
    const result = await cancelSipPlan({
      sipId,
      cancellationCode: reasonCode,
      cancellationReason: reasonText,
    });
    setBusy(false);
    if (!result.ok) {
      setError(userFacingMessage(result.message, "Could not cancel SIP"));
      setView("fail");
      return;
    }
    setSuccessMsg("SIP cancelled. Units stay invested until redeemed.");
    setView("success");
    onCancelled?.();
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sip-options-title"
        className="relative w-full sm:max-w-[420px] bg-white rounded-t-2xl sm:rounded-2xl shadow-elevated px-5 pt-3 pb-6 sm:pb-5 max-h-[min(90dvh,640px)] overflow-y-auto"
      >
        <div className="flex justify-center sm:hidden mb-2">
          <span className="w-10 h-1 rounded-full bg-border" />
        </div>

        {view === "menu" && (
          <>
            <div className="mb-4">
              <h2 id="sip-options-title" className="text-xl font-bold text-ink leading-tight">
                SIP options
              </h2>
              <p className="text-sm text-muted mt-1">Choose an action for {who}</p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => { setError(""); setView("modify"); }}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-border bg-white hover:border-jade hover:bg-tint/40 text-left transition-colors"
              >
                <span className="w-11 h-11 rounded-xl bg-tint text-jade flex items-center justify-center shrink-0">
                  <SlidersHorizontal size={20} strokeWidth={1.8} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-semibold text-ink">Modify SIP</span>
                  <span className="block text-xs text-muted mt-0.5 leading-snug">Change {limits.label} amount</span>
                </span>
                <ChevronRight size={18} className="text-muted shrink-0" />
              </button>

              <button
                type="button"
                onClick={startCancel}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-red-200 bg-red-50/80 hover:bg-red-50 text-left transition-colors"
              >
                <span className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
                  <X size={18} strokeWidth={2.4} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-semibold text-red-600">Cancel SIP</span>
                  <span className="block text-xs text-muted mt-0.5 leading-snug">
                    Stop future installments for this goal
                  </span>
                </span>
                <ChevronRight size={18} className="text-red-400 shrink-0" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-4 h-12 rounded-xl border border-border bg-white text-[15px] font-semibold text-ink hover:bg-surface transition-colors"
            >
              Dismiss
            </button>
          </>
        )}

        {view === "modify" && (
          <>
            <h2 className="text-xl font-bold text-ink mb-1">Modify SIP</h2>
            <p className="text-sm text-muted mb-4">
              {limits.label === "daily" ? "Daily" : "Monthly"} amount · ₹{limits.min.toLocaleString("en-IN")}–₹{limits.max.toLocaleString("en-IN")}
            </p>
            <div className="rounded-xl bg-surface border border-border px-4 py-3.5">
              <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
                New amount
              </label>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-ink">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))}
                  className="flex-1 bg-transparent border-0 outline-none text-lg font-bold text-ink p-0"
                />
              </div>
            </div>
            {!modifyValid && amount ? (
              <p className="text-xs text-amber-800 mt-2">Enter an amount within the allowed range</p>
            ) : null}
            {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}
            <button
              type="button"
              disabled={!modifyValid || busy}
              onClick={submitModify}
              className="w-full mt-5 h-12 rounded-xl bg-jade text-white text-[15px] font-semibold disabled:opacity-45"
            >
              {busy ? "Saving…" : "Update SIP"}
            </button>
            <button type="button" onClick={() => setView("menu")} className="w-full mt-3 text-sm text-muted underline">
              Back
            </button>
          </>
        )}

        {view === "cancel" && (
          <>
            <h2 className="text-xl font-bold text-ink mb-1">Cancel SIP</h2>
            <p className="text-sm text-muted mb-4">Select a reason to continue</p>
            <div className="space-y-2">
              {CANCEL_REASONS.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setReasonCode(item.code)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    reasonCode === item.code
                      ? "border-jade bg-tint text-ink"
                      : "border-border bg-white text-secondary hover:border-jade"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
            {reasonCode === "custom_reason" && (
              <textarea
                value={reasonText}
                onChange={(event) => setReasonText(event.target.value)}
                rows={3}
                placeholder="Tell us more…"
                className="w-full mt-3 rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-jade resize-none"
              />
            )}
            {error ? <div className="text-sm text-red-600 mt-3">{error}</div> : null}
            <button
              type="button"
              disabled={!reasonCode || busy || (reasonCode === "custom_reason" && !reasonText.trim())}
              onClick={submitCancel}
              className="w-full mt-5 h-12 rounded-xl bg-red-600 text-white text-[15px] font-semibold disabled:opacity-45"
            >
              {busy ? "Cancelling…" : "Confirm cancel"}
            </button>
            <button type="button" onClick={() => setView("menu")} className="w-full mt-3 text-sm text-muted underline">
              Back
            </button>
          </>
        )}

        {(view === "success" || view === "fail") && (
          <>
            <h2 className="text-xl font-bold text-ink mb-2">{view === "success" ? "Done" : "Something went wrong"}</h2>
            <p className={`text-sm mb-6 ${view === "fail" ? "text-red-600" : "text-muted"}`}>
              {view === "success" ? successMsg : error}
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
      </div>
    </div>
  );
}
