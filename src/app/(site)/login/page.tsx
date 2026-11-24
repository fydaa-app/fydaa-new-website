import { Suspense } from "react";
import AuthFallback from "@/features/onboarding/AuthFallback";
import OnboardingFlow from "@/features/onboarding/OnboardingFlow";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Log in",
  description: "Log in to your Fydaa account with your mobile number and PIN.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <main className="fydaa-auth-main min-h-screen bg-[#FAFAFA] pb-8 pt-24">
      <Suspense fallback={<AuthFallback mode="login" />}>
        <OnboardingFlow mode="login" />
      </Suspense>
    </main>
  );
}
