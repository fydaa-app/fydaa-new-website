"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { loginUrl } from "@/lib/auth/session";
import { useAuthStatus } from "@/lib/auth/use-auth-status";

function FullPageLoader({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-dvh items-center justify-center bg-bg">
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-[3px] border-jade border-r-transparent"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Client-side gate for signed-in areas. Data is still protected by the APIs; this only
 * keeps signed-out visitors from landing on an empty, broken-looking app shell.
 * Signed-out users go to /login?next=<current URL> and come back after logging in.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const status = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(loginUrl(`${window.location.pathname}${window.location.search}`));
    }
  }, [status, router]);

  if (status === "authenticated") return <>{children}</>;
  return <FullPageLoader label={status === "unknown" ? "Loading your account" : "Redirecting to login"} />;
}
