"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SipSuccessView from "../dashboard/components/SipSuccessView";
import {
  fetchSipSuccessViewData,
  getPendingSipFirstDebit,
  runPendingSipFirstDebit,
  userFacingMessage,
} from "../dashboard/lib/sipInvestApi";

type Phase = "working" | "success" | "error";

export default function MandateSuccessPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("working");
  const [status, setStatus] = useState("Confirming your UPI mandate…");
  const [error, setError] = useState("");
  const [partialNote, setPartialNote] = useState("");
  const [successView, setSuccessView] = useState<Awaited<
    ReturnType<typeof fetchSipSuccessViewData>
  > | null>(null);
  const [successLoading, setSuccessLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const pending = getPendingSipFirstDebit();

      if (!pending?.sipId) {
        if (cancelled) return;
        setPhase("error");
        setError(
          "Mandate may be set, but we could not find the pending SIP on this device. Open Dashboard → Pending SIPs and tap Check again to finish first debit.",
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
    return (
      <div className="fixed inset-0 w-full h-full bg-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-border rounded-card shadow-card p-6 sm:p-8 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-jade border-t-transparent animate-spin mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-ink mb-2">Setting up your SIP</h1>
          <p className="text-sm text-muted">{status}</p>
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="fixed inset-0 w-full h-full bg-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-border rounded-card shadow-card p-6 sm:p-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-ink mb-2">{status}</h1>
          {error ? <p className="text-sm text-red-600 mb-6">{error}</p> : null}
          <button
            type="button"
            onClick={goDashboard}
            className="w-full h-12 rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg flex items-start sm:items-center justify-center py-8 sm:py-12">
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
