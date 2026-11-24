/**
 * Server-rendered stand-in shown until the client onboarding flow mounts. It mirrors
 * the first screen's heading so the page always has an H1 (no-JS, slow networks).
 */
export default function AuthFallback({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="mx-auto max-w-[640px] px-6 pt-10">
      <h1 className="text-heading mb-1.5 font-bold text-ink">
        {mode === "login" ? "Log in to Fydaa" : "Create your Fydaa account"}
      </h1>
      <p role="status" className="text-sm text-neutral-600">
        Loading…
      </p>
    </div>
  );
}
