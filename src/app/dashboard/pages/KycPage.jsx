"use client";

import { Suspense } from "react";
import OnboardingFlow from "../../signup/OnboardingFlow";
import { PAGE_SHELL_NARROW } from "../lib/layoutClasses";

export default function KycPage({
  setActivePage,
  kycStart = "kyc",
  onKycFinished,
  onKycExit,
}) {
  const leaveToDashboard = () => {
    if (typeof onKycExit === "function") {
      onKycExit();
      return;
    }
    setActivePage?.("home");
  };

  const finishSuccessfully = () => {
    if (typeof onKycFinished === "function") {
      onKycFinished();
      return;
    }
    setActivePage?.("home");
  };

  return (
    <div className={`${PAGE_SHELL_NARROW} max-w-[720px] 4xl:max-w-[900px]`}>
      <Suspense
        fallback={
          <div className="text-sm text-muted pt-6">Loading KYC…</div>
        }
      >
        <OnboardingFlow
          key={kycStart === "risk" ? "risk" : "kyc"}
          mode="signup"
          embedded
          start={kycStart === "risk" ? "risk" : "kyc"}
          onExit={leaveToDashboard}
          onComplete={finishSuccessfully}
        />
      </Suspense>
    </div>
  );
}
