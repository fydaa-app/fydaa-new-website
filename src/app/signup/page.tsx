import { Suspense } from "react";
import OnboardingFlow from "./OnboardingFlow";

export default function SignupPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen pt-24 pb-8">
      <Suspense fallback={<div className="max-w-[640px] mx-auto px-6 pt-10 text-sm text-neutral-500">Loading...</div>}>
        <OnboardingFlow />
      </Suspense>
    </main>
  );
}
