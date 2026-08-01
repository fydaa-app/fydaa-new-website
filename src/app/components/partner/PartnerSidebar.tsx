'use client';

import React from 'react';
import StepIndicator from './StepIndicator';

interface PartnerSidebarProps {
  currentStep: number;
  completedSteps: number[];
}

export default function PartnerSidebar({
  currentStep,
  completedSteps,
}: PartnerSidebarProps) {
  return (
    <aside className="bg-gray-50 p-8 flex flex-col items-center h-full">
      <h2 className="font-gilroy font-semibold text-xl text-[#001E3C] mb-8">
        Become a Partner
      </h2>

      <StepIndicator
        currentStep={currentStep}
        completedSteps={completedSteps}
      />
    </aside>
  );
}
