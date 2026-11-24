'use client';

import { Check, ChevronRight, CircleDashed } from 'lucide-react';
import { PARTNER_STEPS, StepConfig } from './types';

interface Props {
  currentStep: number;
}

/**
 * Registration progress. Phones and tablets get a one-line "Step n of 4" with a progress
 * bar, so the form starts near the top of the screen; desktops get the full step list.
 */
export default function StepIndicator({ currentStep }: Props) {
  const total = PARTNER_STEPS.length;
  const current = PARTNER_STEPS.find((step) => step.id === currentStep) ?? PARTNER_STEPS[0];

  return (
    <>
      <div className="lg:hidden">
        <p className="text-sm font-medium text-white">
          Step {current?.id} of {total}: <span className="font-semibold">{current?.label}</span>
        </p>
        <div className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden>
          {PARTNER_STEPS.map((step) => (
            <span
              key={step.id}
              className={`h-1.5 rounded-full ${step.id <= currentStep ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      <ol aria-label="Registration steps" className="hidden w-full flex-col space-y-2 lg:flex">
        {PARTNER_STEPS.map((step: StepConfig) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          return (
            <li
              key={step.id}
              aria-current={isActive ? 'step' : undefined}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 ${
                isActive ? 'border border-grey-200 bg-white' : ''
              }`}
            >
              <span className={`flex items-center truncate text-base ${isActive ? 'font-medium text-ink' : 'text-white'}`}>
                <span className="mr-2 whitespace-nowrap">{step.id}.</span>
                <span>{step.label}</span>
              </span>
              {isCompleted ? (
                <Check className="h-4 w-4 shrink-0 text-jade-300" aria-label="Completed" />
              ) : isActive ? (
                <ChevronRight className="h-4 w-4 shrink-0 text-ink" aria-hidden />
              ) : (
                <CircleDashed className="h-4 w-4 shrink-0 text-white" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
