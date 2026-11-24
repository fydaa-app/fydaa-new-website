import { Suspense } from "react";
import OnboardingFlow from "../signup/OnboardingFlow";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Log in",
  description: "Log in to your Fydaa account with your mobile number and PIN.",
  path: "/login",
  noIndex: true,
});


export default function LoginPage() {
  return (
    <main className="fydaa-auth-main bg-[#FAFAFA] min-h-screen pt-24 pb-8">
      <Suspense fallback={<div className="max-w-[640px] mx-auto px-6 pt-10 text-sm text-neutral-500">Loading...</div>}>
        <OnboardingFlow mode="login" />
      </Suspense>
    </main>
  );
}
