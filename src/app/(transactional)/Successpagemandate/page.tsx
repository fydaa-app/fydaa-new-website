"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SipSuccessView from "@/features/dashboard/components/SipSuccessView";
import {
  fetchSipSuccessViewData,
  getPendingSipFirstDebit,
  runPendingSipFirstDebit,
  userFacingMessage,
} from "@/features/dashboard/lib/sipInvestApi";
import { StatusScreen } from "@/features/transactional/status-screen";

type Phase = "working" | "success" | "error";

export default function MandateSuccessPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("working");
  const [status, setStatus] = useState("Confirming your UPI mandate…");
  const [error, setError] = useState("");
  const [partialNote, setPartialNote] = useState("");
  const [successView, setSuccessView] = useState<Awaited<ReturnType<typeof fetchSipSuccessViewData>> | null>(
    null,
  );
  const [successLoading, setSuccessLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const pending = getPendingSipFirstDebit();

      if (!pending?.sipId) {
        if (cancelled) return;
        setPhase("error");
        setError(
          "Mandate may be set, but we could not find the pending SIP on this device. Open Pending SIPs on your dashboard and tap Check again to finish first debit.",
        );
        setStatus("Could not finish SIP setup");
        return;
      }

      setStatus("Activating your SIP and debiting the first installment…");
      const result = await runPendingSipFirstDebit((msg: string) => {
        if (!cancelled && msg) setStatus(msg);
      });
      if (cancelled) return;

      if (!result.ok && !("skipped" in result && result.skipped)) {
        setPhase("error");
        setError(
          userFacingMessage(
            result.message,
            "First debit failed. Open the dashboard and retry from Pending SIPs.",
          ),
        );
        setStatus("Mandate set — first debit needs a retry");
        return;
      }

      if ("partialMessage" in result && result.partialMessage) {
        setPartialNote(String(result.partialMessage));
      }

      setSuccessLoading(true);
      setStatus("Loading your SIP details…");
      try {
        const view = await fetchSipSuccessViewData({
          sipId: pending.sipId,
          amount: pending.amount,
          portfolioId: pending.ownFund ? null : pending.portfolioId,
        });
        if (cancelled) return;
        setSuccessView(view);
        setPhase("success");
      } catch {
        if (cancelled) return;
        setSuccessView({
          ok: true,
          sipId: pending.sipId,
          sipAmount: Number(pending.amount) || 0,
          daily: false,
          frequency: "monthly",
          title: "Monthly SIP",
          amountLabel: pending.amount
            ? `₹${Math.round(Number(pending.amount)).toLocaleString("en-IN")}/mo`
            : "",
          firstAmountLabel: pending.amount
            ? `₹${Math.round(Number(pending.amount)).toLocaleString("en-IN")}`
            : "",
          scheduleLine: "",
          subtitle: "First payment initiated. Monthly SIP set for next month.",
          recurringChips: [],
          firstChips: [],
          sip: null,
          buyOk: false,
        });
        setPhase("success");
      } finally {
        if (!cancelled) setSuccessLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function goDashboard() {
    router.replace("/dashboard");
  }

  if (phase === "working") {
    return <StatusScreen tone="pending" busy title="Setting up your SIP" message={status} />;
  }

  if (phase === "error") {
    return (
      <StatusScreen
        tone="failure"
        title={status}
        message={error || null}
        actions={
          <Button size="lg" onClick={goDashboard}>
            Go to dashboard
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex min-h-dvh items-start justify-center bg-mist py-8 sm:items-center sm:py-12">
      <SipSuccessView
        successView={successView}
        loading={successLoading}
        error=""
        partialNote={partialNote}
        onContinue={goDashboard}
      />
    </div>
  );
}
