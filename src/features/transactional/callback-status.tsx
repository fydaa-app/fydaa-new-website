"use client";

import { useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { resolveCallbackOutcome } from "./callback-outcome";
import { StatusScreen } from "./status-screen";

export type CallbackFlow = "digilocker" | "nsdl" | "setu" | "fund";

const FLOW_NAMES: Record<CallbackFlow, string> = {
  digilocker: "DigiLocker",
  nsdl: "Aadhaar e-sign",
  setu: "verification",
  fund: "adding funds",
};

/** True when this page was opened by the app as a popup (KYC/e-sign flows). */
function useIsPopup(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => Boolean(window.opener && !window.opener.closed),
    () => false,
  );
}

/**
 * Landing page for provider redirects. It never claims success without an explicit
 * success signal from the provider; the opener window (or the dashboard) confirms the
 * real status with the backend.
 */
export function CallbackStatus({
  flow,
  continueHref = "/dashboard",
}: {
  flow: CallbackFlow;
  continueHref?: string;
}) {
  const outcome = resolveCallbackOutcome(useSearchParams());
  const isPopup = useIsPopup();
  const name = FLOW_NAMES[flow];

  const actions = isPopup ? (
    <Button size="lg" onClick={() => window.close()}>
      Close this window
    </Button>
  ) : (
    <ButtonLink href={continueHref} size="lg">
      Continue to Fydaa
    </ButtonLink>
  );
  const returnHint = isPopup
    ? "You can close this window and continue in Fydaa."
    : "Continue in Fydaa to see the latest status.";

  if (outcome === "success") {
    return (
      <StatusScreen
        tone="success"
        title={`${capitalise(name)} completed`}
        message={<>We received confirmation from the provider. {returnHint}</>}
        actions={actions}
      />
    );
  }
  if (outcome === "failure") {
    return (
      <StatusScreen
        tone="failure"
        title={`${capitalise(name)} wasn't completed`}
        message={<>Nothing was finalised. Please return to Fydaa and try again.</>}
        actions={actions}
      />
    );
  }
  return (
    <StatusScreen
      tone="pending"
      title="Returning you to Fydaa"
      message={
        <>
          We're confirming the status of your {name}. {returnHint}
        </>
      }
      actions={actions}
    />
  );
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
