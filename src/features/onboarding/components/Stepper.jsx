import React from "react";

const STEP_LABELS = ["Risk profile", "Personal info", "E-sign", "Bank"];

/**
 * Where the reader is in KYC: four round-capped bars (the logo's stroke) with their names.
 *
 * activeStep: 1-4 (which macro step is current)
 * progress: optional 0-100, fills the active bar (used during the risk questions)
 */
export default function Stepper({ activeStep, progress }) {
  const current = STEP_LABELS[activeStep - 1];
  return (
    <div className="mb-8">
      <p className="text-sm text-grey-600">
        <span className="font-semibold text-ink">
          Step {activeStep} of {STEP_LABELS.length}
        </span>
        {current ? `: ${current}` : null}
      </p>
      <ol aria-label="KYC steps" className="mt-3 grid grid-cols-4 gap-2">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const state = num < activeStep ? "completed" : num === activeStep ? "active" : "upcoming";
          const fill = state === "completed" ? 100 : state === "active" ? (progress ?? 100) : 0;
          return (
            <li key={label} aria-current={state === "active" ? "step" : undefined} className="min-w-0">
              <span aria-hidden="true" className="block h-1.5 overflow-hidden rounded-full bg-line">
                {fill > 0 ? (
                  <span
                    className={`block h-full w-full rounded-full transition-transform duration-slow ease-smooth-out motion-reduce:transition-none ${
                      state === "completed" ? "bg-jade" : "bg-sprout"
                    }`}
                    style={{ transform: `translateX(${fill - 100}%)` }}
                  />
                ) : null}
              </span>
              <span
                className={`mt-2 block text-xs leading-snug ${
                  state === "active"
                    ? "font-semibold text-ink"
                    : state === "completed"
                      ? "text-grey-600"
                      : "text-grey-500"
                }`}
              >
                {label}
                {state === "completed" ? <span className="sr-only"> (done)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
