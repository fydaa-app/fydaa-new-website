"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PARTNER_STEPS, StepConfig } from "./types";

interface Props {
  currentStep: number;
}

/**
 * Registration progress. Phones and tablets get a one-line "Step n of 4" over four round-capped
 * bars, so the form starts near the top of the screen; desktops get the full step list, joined by
 * a thin rule that turns green as steps are completed.
 */
export default function StepIndicator({ currentStep }: Props) {
  const total = PARTNER_STEPS.length;
  const current = PARTNER_STEPS.find((step) => step.id === currentStep) ?? PARTNER_STEPS[0];

  return (
    <>
      <div className="lg:hidden">
        <p className="text-sm text-grey-600" aria-live="polite">
          <span className="font-semibold text-ink">
            Step {current?.id} of {total}
          </span>
          : {current?.label}
        </p>
        <div className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden="true">
          {PARTNER_STEPS.map((step) => (
            <span
              key={step.id}
              className={cn(
                "h-1.5 rounded-full transition-colors duration-medium",
                step.id <= currentStep ? "bg-jade" : "bg-line",
              )}
            />
          ))}
        </div>
      </div>

      <ol aria-label="Registration steps" className="hidden w-full flex-col lg:flex">
        {PARTNER_STEPS.map((step: StepConfig, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLast = index === PARTNER_STEPS.length - 1;
          return (
            <li
              key={step.id}
              aria-current={isActive ? "step" : undefined}
              className={cn("relative flex items-center gap-4", !isLast && "pb-6")}
            >
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute bottom-1 left-4 top-10 w-0.5 -translate-x-1/2 rounded-full transition-colors duration-medium",
                    isCompleted ? "bg-sprout" : "bg-line",
                  )}
                />
              ) : null}
              <span
                aria-hidden="true"
                className={cn(
                  "figure flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-medium",
                  isCompleted && "bg-jade text-white",
                  isActive && "border-2 border-jade bg-white text-jade",
                  !isCompleted && !isActive && "border border-line bg-white text-grey-500",
                )}
              >
                {isCompleted ? <Check className="size-4" strokeWidth={2.75} /> : step.id}
              </span>
              <span
                className={cn(
                  "text-base",
                  isActive ? "font-semibold text-ink" : isCompleted ? "text-ink" : "text-grey-500",
                )}
              >
                {step.label}
                {isCompleted ? <span className="sr-only"> (completed)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </>
  );
}
