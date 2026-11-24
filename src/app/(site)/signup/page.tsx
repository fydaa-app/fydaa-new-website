import { Suspense } from "react";
import OnboardingFlow from "@/features/onboarding/OnboardingFlow";
import SessionWatch from "@/features/onboarding/SessionWatch";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Sign up",
  description: "Create your Fydaa account in minutes and start investing towards your goals.",
  path: "/signup",
  noIndex: true,
});

export default function SignupPage() {
  return (
    <main className="fydaa-auth-main min-h-screen bg-[#FAFAFA] pb-8 pt-24">
      <SessionWatch />
      <Suspense
        fallback={<div className="mx-auto max-w-[640px] px-6 pt-10 text-sm text-neutral-500">Loading...</div>}
      >
        <OnboardingFlow />
      </Suspense>
    </main>
  );
}
