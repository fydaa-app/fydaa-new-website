"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/feedback/status-page";
import { Button, ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

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
          Try again. If it keeps happening, email{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="link">
            {siteConfig.contact.email}
          </a>
          {error.digest ? (
            <>
              {" "}
              and quote reference <span className="break-all font-mono text-base text-ink">{error.digest}</span>
            </>
          ) : null}
          .
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
