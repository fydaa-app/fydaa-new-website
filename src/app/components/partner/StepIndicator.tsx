'use client';

import { Check, ChevronRight, CircleDashed } from 'lucide-react';
import { PARTNER_STEPS, StepConfig } from './types';

interface Props {
  currentStep: number;
}

const STEP_ACTIVE_BG = 'bg-white';
const STEP_ACTIVE_BORDER = 'border border-gray-200';

export default function StepIndicator({ currentStep }: Props) {
  return (
    <nav className="flex flex-col w-full space-y-2">
      {PARTNER_STEPS.map((step: StepConfig) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        const baseRowClass =
          'flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200';

        const rowClass = isActive
          ? `${STEP_ACTIVE_BG} ${STEP_ACTIVE_BORDER}`
          : '';

        const textClass = isActive
          ? 'text-[#001E3C] font-medium'
          : isCompleted
          ? 'text-white font-medium'
          : 'text-white';

        return (
          <div
            key={step.id}
            className={`${baseRowClass} ${rowClass} cursor-default`}
          >
            <span
              className={`flex items-center text-[15px] font-inter ${textClass} truncate`}
            >
              <span className="mr-2 whitespace-nowrap">{step.id}.</span>
              <span>{step.label}</span>
            </span>

            {isCompleted ? (
              <Check className="w-4 h-4 text-[#1AAA70] shrink-0" />
            ) : isActive ? (
              <ChevronRight className="w-4 h-4 text-[#001E3C] shrink-0" />
            ) : (
              <CircleDashed className="w-4 h-4 text-white shrink-0" />
            )}
          </div>
        );
      })}
    </nav>
  );
}