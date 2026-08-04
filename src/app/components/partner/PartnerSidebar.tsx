'use client';

import StepIndicator from './StepIndicator';

interface Props {
  currentStep: number;
}

export default function PartnerSidebar({ currentStep }: Props) {
  return (
    <aside className="w-full lg:w-72 xl:w-[28%] bg-[#000000] p-6 lg:p-8 lg:border-r lg:border-gray-200">
      <h1 className="font-gilroy font-bold text-[22px] text-white mb-8">
        Become a Partner
      </h1>
      <StepIndicator currentStep={currentStep} />
    </aside>
  );
}