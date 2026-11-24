import { AuthAside } from "./components/AuthAside";
import { AuthLayout } from "./components/AuthLayout";
import { PageHeading, PageSub } from "./components/UI";

/** First-screen title and line, shared with OnboardingFlow so the swap is seamless. */
export const AUTH_TITLES = {
  login: "Log in to Fydaa",
  signup: "Create your Fydaa account",
} as const;

export const AUTH_SUBS = {
  login: "Use your mobile number and 4-digit PIN. We'll then send a one-time code to your phone.",
  signup: "Start with your mobile number. We'll send a one-time code to verify it.",
} as const;

/**
 * Server-rendered stand-in shown until the client onboarding flow mounts. Same layout, title and
 * reassurance column as the first screen, so the page always has an H1 (no-JS, slow networks)
 * and nothing jumps when the form arrives.
 */
export default function AuthFallback({ mode }: { mode: "login" | "signup" }) {
  return (
    <AuthLayout
      heading={
        <>
          <PageHeading>{AUTH_TITLES[mode]}</PageHeading>
          <PageSub>{AUTH_SUBS[mode]}</PageSub>
        </>
      }
      aside={<AuthAside mode={mode} />}
    >
      <p role="status" className="flex min-h-48 items-center gap-3 text-sm text-grey-600">
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-jade border-r-transparent motion-reduce:animate-none"
        />
        Loading…
      </p>
    </AuthLayout>
  );
}
