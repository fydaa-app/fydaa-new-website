'use client';

import { Check, ChevronRight } from 'lucide-react';
import { PARTNER_STEPS, StepConfig } from './types';

interface Props {
  currentStep: number;
}

const STEP_BG_HOVER = 'hover:bg-gray-50';
const STEP_ACTIVE_BG = 'bg-white';
const STEP_ACTIVE_BORDER = 'border border-gray-200';
const STEP_INACTIVE_TEXT = 'text-gray-500';
const STEP_ACTIVE_TEXT = 'text-[#001E3C]';
const STEP_COMPLETE_TEXT = 'text-gray-700';
const CHEVRON_INACTIVE = 'text-gray-300';
const CHEVRON_ACTIVE = 'text-gray-400';

export default function StepIndicator({ currentStep }: Props) {
  return (
    <nav className="flex flex-col w-full space-y-2">
      {PARTNER_STEPS.map((step: StepConfig) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        const isInteractive = !isCompleted && !isActive;
        const baseRowClass =
          'flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200';
        const bgClass = isActive ? STEP_ACTIVE_BG : isCompleted ? '' : STEP_BG_HOVER;
        const borderClass = isActive ? STEP_ACTIVE_BORDER : '';
        const textClass = isActive
          ? `${STEP_ACTIVE_TEXT} font-medium`
          : isCompleted
          ? `${STEP_COMPLETE_TEXT} font-medium`
          : STEP_INACTIVE_TEXT;

        const chevronClass = isActive ? CHEVRON_ACTIVE : CHEVRON_INACTIVE;

        return (
          <div
            key={step.id}
            className={`${baseRowClass} ${bgClass} ${borderClass} cursor-${
              isInteractive ? 'pointer' : 'default'
            }`}
          >
            <span
              className={`flex items-center text-[15px] font-inter ${textClass} truncate`}
            >
              <span className="mr-2 whitespace-nowrap">{step.id}.</span>
              <span>{step.label}</span>
            </span>
            {isCompleted ? (
              <Check className="w-4 h-4 text-[#1AAA70]" />
            ) : (
              <ChevronRight className={`w-4 h-4 ${chevronClass}`} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
