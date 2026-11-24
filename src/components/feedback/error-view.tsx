"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/feedback/status-page";
import { Button, ButtonLink } from "@/components/ui/button";

export interface ErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Friendly recovery screen for render errors; never shows technical details. */
export function ErrorView({ error, reset }: ErrorViewProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      eyebrow="Something went wrong"
      title="This page hit a problem"
      description={
        <>
          Please try again. If it keeps happening, contact us and quote reference{" "}
          <span className="font-mono text-ink">{error.digest ?? "N/A"}</span>.
        </>
      }
      actions={
        <>
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/" variant="secondary" size="lg">
            Go to home
          </ButtonLink>
        </>
      }
    />
  );
}
