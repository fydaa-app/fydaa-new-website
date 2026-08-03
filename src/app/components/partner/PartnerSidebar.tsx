'use client';

import React from 'react';
import StepIndicator from './StepIndicator';

interface Props {
  currentStep: number;
}

export default function PartnerSidebar({ currentStep }: Props) {
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:items-start lg:pr-8">
      <div className="mb-8">
        <h1 className="font-gilroy font-bold text-2xl text-[#001E3C]">
          Become a Partner
        </h1>
      </div>
      <StepIndicator currentStep={currentStep} />
    </div>
  );
}
