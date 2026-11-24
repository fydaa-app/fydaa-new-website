import Image from "next/image";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

export type StatusTone = "success" | "failure" | "pending";

/**
 * The tone's mark. Success draws the transitions.dev check (`t-check`: ring, then tick); failure
 * is a cross on the danger tint; pending is a clock (or a spinner while work is in progress).
 */
function ToneMark({ tone, busy }: { tone: StatusTone; busy: boolean }) {
  if (tone === "success" && !busy) {
    return (
      <svg className="t-check size-16" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r="26" className="t-check-ring" />
        <path d="M17 29.5l7 7 15-16" className="t-check-path" />
      </svg>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-16 items-center justify-center rounded-full",
        tone === "failure" ? "bg-danger/10 text-danger" : "bg-mist text-grey-600",
      )}
    >
      {busy ? (
        <span className="size-7 animate-spin rounded-full border-[3px] border-current border-r-transparent motion-reduce:animate-none" />
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="size-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {tone === "failure" ? (
            <>
              <line x1="17" y1="7" x2="7" y2="17" />
              <line x1="7" y1="7" x2="17" y2="17" />
            </>
          ) : (
            <>
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </>
          )}
        </svg>
      )}
    </span>
  );
}

export interface StatusScreenProps {
  tone: StatusTone;
  title: string;
  message: ReactNode;
  actions?: ReactNode;
  /** Show an indeterminate spinner instead of the tone icon (work in progress). */
  busy?: boolean;
  children?: ReactNode;
}

/**
 * Full-screen, announced status message for payment, mandate and KYC callbacks. These pages have
 * no site header, so the logo sits above the message to show where you are. Left-aligned on the
 * same measure as the rest of the site; the outcome itself comes from the caller, which only
 * reports success on a verified signal.
 */
export function StatusScreen({ tone, title, message, actions, busy = false, children }: StatusScreenProps) {
  return (
    <main className="flex min-h-dvh flex-col bg-white px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-md">
        <Image
          src="/fydaa-logo.png"
          alt={siteConfig.name}
          width={409}
          height={147}
          priority
          className="h-7 w-auto"
        />
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 items-center py-12">
        <div role="status" aria-live="polite" className="flex w-full flex-col items-start">
          <ToneMark tone={tone} busy={busy} />
          <h1 className="mt-6 text-heading text-ink">{title}</h1>
          <div className="mt-3 text-base leading-relaxed text-grey-600">{message}</div>
          {children}
          {actions ? (
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
