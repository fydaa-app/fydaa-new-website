"use client";

import { Check } from "lucide-react";
import { WIZARD_CTA, WIZARD_STAGE, WIZARD_SUB, WIZARD_TITLE } from "../lib/layoutClasses";

/**
 * Flutter-parity SIP success layout (getMySipMf + buyOrderMf numbers).
 */
export default function SipSuccessView({
  successView,
  loading = false,
  error = "",
  partialNote = "",
  fallbackDaily = false,
  fallbackAmountLabel = "",
  fallbackFirstAmountLabel = "",
  fallbackScheduleLine = "",
  fallbackChips = [],
  onContinue,
  continueLabel = "Continue to Dashboard",
}) {
  const daily = successView?.daily ?? fallbackDaily;
  const subtitle =
    successView?.subtitle ||
    (daily
      ? "First payment initiated. Daily auto-debit on each business day."
      : "First payment initiated. Monthly SIP set for next month.");

  const recurringChips =
    successView?.recurringChips?.length > 0
      ? successView.recurringChips
      : fallbackChips.length
        ? fallbackChips.map((c) => (daily ? `${c}${c.includes("/") ? "" : "/day"}` : `${c}${c.includes("/") ? "" : "/mo"}`))
        : [];

  const firstChips =
    successView?.firstChips?.length > 0
      ? successView.firstChips
      : fallbackChips.length
        ? fallbackChips
        : [];

  return (
    <div className={`${WIZARD_STAGE} py-4 sm:py-8 4xl:py-10 px-4 sm:px-0`}>
      <div className="text-center mb-6 4xl:mb-8">
        <div className="w-14 h-14 4xl:w-16 4xl:h-16 rounded-full bg-tint text-jade flex items-center justify-center mx-auto mb-4">
          <Check size={28} />
        </div>
        <h1 className={`${WIZARD_TITLE} mb-2`}>Your SIP is set up!</h1>
        <p className={`${WIZARD_SUB} max-w-md 4xl:max-w-lg mx-auto`}>{subtitle}</p>
        {partialNote ? <p className="text-sm 4xl:text-base text-amber-700 mt-3">{partialNote}</p> : null}
        {error ? <p className="text-sm 4xl:text-base text-red-600 mt-3">{error}</p> : null}
      </div>

      {loading && !successView ? (
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
                  {successView?.scheduleLine ||
                    fallbackScheduleLine ||
                    (daily ? "Next: each business day" : "")}
                </div>
              </div>
              <div className="text-lg sm:text-xl 4xl:text-2xl font-bold text-jade shrink-0">
                {successView?.amountLabel || fallbackAmountLabel}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {recurringChips.map((chip) => (
                <span
                  key={`r-${chip}`}
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
                <div className="text-xs sm:text-[13px] 4xl:text-sm text-amber-800/80 mt-1">
                  Today · at today&apos;s NAV
                </div>
              </div>
              <div className="text-lg sm:text-xl 4xl:text-2xl font-bold text-amber-900 shrink-0">
                {successView?.firstAmountLabel || fallbackFirstAmountLabel}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {firstChips.map((chip) => (
                <span
                  key={`f-${chip}`}
                  className="inline-flex px-2.5 py-1 rounded-full bg-tint text-jade text-xs 4xl:text-[13px] font-semibold"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {onContinue ? (
        <button
          type="button"
          onClick={onContinue}
          className={`${WIZARD_CTA} max-w-md 4xl:max-w-lg mx-auto block`}
        >
          {continueLabel}
        </button>
      ) : null}
    </div>
  );
}
