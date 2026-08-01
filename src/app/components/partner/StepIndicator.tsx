'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PARTNER_STEPS } from './types';

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
}

export default function StepIndicator({
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="space-y-2 w-full">
      {PARTNER_STEPS.map((step) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;

        return (
          <motion.div
            key={step.id}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              isCurrent
                ? 'bg-white shadow-md'
                : isCompleted
                ? 'bg-white/50'
                : 'hover:bg-white/30'
            }`}
            whileHover={{ scale: isCurrent ? 1 : 1.02 }}
          >
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-gilroy flex-shrink-0 transition-all ${
                isCompleted
                  ? 'bg-[#1AAA70] text-white'
                  : isCurrent
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span
              className={`font-inter text-sm transition-all ${
                isCurrent || isCompleted
                  ? 'font-bold text-[#001E3C]'
                  : 'font-normal text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
