import { Suspense } from "react";
import AuthFallback from "@/features/onboarding/AuthFallback";
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
    <main className="fydaa-auth-main min-h-dvh bg-paper pb-16 pt-24 sm:pb-20 lg:pt-28">
      <SessionWatch />
      <Suspense fallback={<AuthFallback mode="signup" />}>
        <OnboardingFlow />
      </Suspense>
    </main>
  );
}
