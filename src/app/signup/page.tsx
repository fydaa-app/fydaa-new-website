import { Suspense } from "react";
import OnboardingFlow from "./OnboardingFlow";
import SessionWatch from "./SessionWatch";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Sign up",
  description: "Create your Fydaa account in minutes and start investing towards your goals.",
  path: "/signup",
  noIndex: true,
});


export default function SignupPage() {
  return (
    <main className="fydaa-auth-main bg-[#FAFAFA] min-h-screen pt-24 pb-8">
      <SessionWatch />
      <Suspense fallback={<div className="max-w-[640px] mx-auto px-6 pt-10 text-sm text-neutral-500">Loading...</div>}>
        <OnboardingFlow />
      </Suspense>
    </main>
  );
}
