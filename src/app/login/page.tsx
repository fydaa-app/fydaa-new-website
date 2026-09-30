import { Suspense } from "react";
import OnboardingFlow from "../signup/OnboardingFlow";

export default function LoginPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen pt-24 pb-8">
      <Suspense fallback={<div className="max-w-[640px] mx-auto px-6 pt-10 text-sm text-neutral-500">Loading...</div>}>
        <OnboardingFlow mode="login" />
      </Suspense>
    </main>
  );
}
