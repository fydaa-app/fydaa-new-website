/**
 * Server-rendered stand-in shown until the client onboarding flow mounts. It mirrors
 * the first screen's heading so the page always has an H1 (no-JS, slow networks).
 */
export default function AuthFallback({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="mx-auto max-w-[640px] px-6 pt-10">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
        {mode === "login" ? "Login" : "Sign up"}
      </p>
      <h1 className="mb-1.5 text-[28px] font-bold leading-tight tracking-tight text-neutral-950">
        Tell us your mobile number
      </h1>
      <p role="status" className="text-sm text-neutral-600">
        Loading…
      </p>
    </div>
  );
}
