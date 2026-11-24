"use client";

import type { CSSProperties } from "react";
import StepIndicator from "./StepIndicator";

interface Props {
  currentStep: number;
}

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * The page title, who registration is for, and where you are in it. Sticks beside the form on
 * desktops; sits above it on phones.
 */
export default function PartnerSidebar({ currentStep }: Props) {
  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:gap-8 lg:pt-4">
      <div className="flex flex-col gap-4">
        <h1 id="partner-title" className="max-w-[12ch] text-display text-ink" data-enter-item style={step(0)}>
          Become a partner
        </h1>
        <p className="max-w-[44ch] text-lead text-grey-600" data-enter-item style={step(1)}>
          For AMFI-registered mutual fund distributors. Register with your ARN, verify your email and mobile,
          then add your partner, bank and nominee details.
        </p>
      </div>
      <div data-enter-item style={step(2)}>
        <StepIndicator currentStep={currentStep} />
      </div>
    </div>
  );
}
