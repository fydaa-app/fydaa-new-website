import OnboardingFlow from "../signup/OnboardingFlow";

export default function LoginPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen pt-24 pb-8">
      <OnboardingFlow mode="login" />
    </main>
  );
}
