'use client';

import { Check } from 'lucide-react';
import {
  PARTNER_STEPS,
  StepConfig,
} from './types';

interface Props {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex flex-col w-full">
      {PARTNER_STEPS.map((step: StepConfig, index: number) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-start mb-4 last:mb-0">
            <div className="flex flex-col items-center w-6">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                  isCompleted
                    ? 'bg-black border-black text-white'
                    : isActive
                      ? 'border-black text-black'
                      : 'border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-inter font-medium">
                    {step.id}
                  </span>
                )}
              </div>
              {index < PARTNER_STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-full mt-6 mb-0 min-h-[40px] ${
                    isCompleted ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            <div className="ml-3 pb-1">
              <span
                className={`text-sm font-inter ${
                  isActive || isCompleted
                    ? 'text-[#001E3C] font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
