import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type StatusTone = "success" | "failure" | "pending";

const TONES: Record<StatusTone, { ring: string; icon: ReactNode; label: string }> = {
  success: {
    ring: "bg-jade-tint text-jade",
    label: "Completed",
    icon: <polyline points="20 6 9 17 4 12" />,
  },
  failure: {
    ring: "bg-red-50 text-red-700",
    label: "Not completed",
    icon: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
  },
  pending: {
    ring: "bg-grey-100 text-grey-600",
    label: "Checking status",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 14" />
      </>
    ),
  },
};

export interface StatusScreenProps {
  tone: StatusTone;
  title: string;
  message: ReactNode;
  actions?: ReactNode;
  /** Show an indeterminate spinner instead of the tone icon (work in progress). */
  busy?: boolean;
  children?: ReactNode;
}

/** Full-screen, announced status message for payment and KYC callbacks. */
export function StatusScreen({ tone, title, message, actions, busy = false, children }: StatusScreenProps) {
  const config = TONES[tone];
  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-6 py-12">
      <div role="status" aria-live="polite" className="flex max-w-md flex-col items-center text-center">
        <div className={cn("flex size-20 items-center justify-center rounded-full", config.ring)}>
          {busy ? (
            <span
              aria-hidden="true"
              className="size-9 animate-spin rounded-full border-4 border-current border-r-transparent"
            />
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {config.icon}
            </svg>
          )}
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-grey-600">
          {busy ? "Please wait" : config.label}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
        <div className="mt-3 text-base leading-relaxed text-grey-600">{message}</div>
        {children}
        {actions ? <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div> : null}
      </div>
    </main>
  );
}
