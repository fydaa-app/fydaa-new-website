'use client';

import StepIndicator from './StepIndicator';

interface Props {
  currentStep: number;
}

export default function PartnerSidebar({ currentStep }: Props) {
  return (
    <aside className="w-full bg-jade px-5 py-5 lg:w-72 lg:border-r lg:border-gray-200 lg:p-8 xl:w-[28%]">
      <h1 className="mb-3 text-title font-bold text-white lg:mb-8 lg:text-heading">
        Become a Partner
      </h1>
      <StepIndicator currentStep={currentStep} />
    </aside>
  );
}