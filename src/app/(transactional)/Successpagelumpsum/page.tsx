"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import {
  captureLumpsumPayment,
  clearPendingLumpsumPayment,
  getPendingLumpsumPayment,
} from "@/features/dashboard/lib/lumpsumApi";
import { StatusScreen } from "@/features/transactional/status-screen";

type PaymentState =
  | { phase: "checking" }
  | { phase: "success"; amount: number | null }
  | { phase: "submitted" }
  | { phase: "failed"; reason: string }
  | { phase: "unverified" };

const REDIRECT_AFTER_SUCCESS_MS = 2500;

function formatRupees(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

/**
 * Return URL of the lump-sum payment gateway. The payment is captured and verified with
 * the payment service before anything is shown as successful.
 */
export default function LumpsumPaymentStatusPage() {
  const router = useRouter();
  const [state, setState] = useState<PaymentState>({ phase: "checking" });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await Promise.resolve();
      const pending = getPendingLumpsumPayment() as { paymentId?: string } | null;
      if (!pending?.paymentId) {
        // Without the payment reference we cannot verify anything on this device.
        if (!cancelled) setState({ phase: "unverified" });
        return;
      }

      const result = await captureLumpsumPayment(pending.paymentId);
      if (cancelled) return;
      clearPendingLumpsumPayment();

      if (!result.ok || result.fail) {
        setState({
          phase: "failed",
          reason: result.reason || "The payment could not be completed. No units were allotted.",
        });
        return;
      }
      if (result.success) {
        const amount = Number(result.amount);
        setState({ phase: "success", amount: Number.isFinite(amount) ? amount : null });
        window.setTimeout(() => router.replace("/dashboard"), REDIRECT_AFTER_SUCCESS_MS);
        return;
      }
      setState({ phase: "submitted" });
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const dashboardButton = (
    <ButtonLink href="/dashboard" size="lg">
      Go to dashboard
    </ButtonLink>
  );

  switch (state.phase) {
    case "checking":
      return (
        <StatusScreen
          tone="pending"
          busy
          title="Confirming your payment"
          message="This usually takes a few seconds. Please don't close this page."
        />
      );
    case "success":
      return (
        <StatusScreen
          tone="success"
          title={
            state.amount ? `Investment of ${formatRupees(state.amount)} successful` : "Investment successful"
          }
          message="Taking you to your dashboard…"
          actions={dashboardButton}
        />
      );
    case "submitted":
      return (
        <StatusScreen
          tone="pending"
          title="Payment received by the bank"
          message="We're waiting for final confirmation. Your portfolio will update once the fund house confirms the order."
          actions={dashboardButton}
        />
      );
    case "failed":
      return (
        <StatusScreen
          tone="failure"
          title="Payment unsuccessful"
          message={
            <>
              {state.reason} If money was debited, it is refunded automatically by your bank, usually within
              5–7 working days.
            </>
          }
          actions={dashboardButton}
        />
      );
    case "unverified":
      return (
        <StatusScreen
          tone="pending"
          title="We couldn't confirm this payment here"
          message="This can happen if you returned in a different browser or tab. Check Track Orders on your dashboard for the latest status before paying again."
          actions={dashboardButton}
        />
      );
  }
}
