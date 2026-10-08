"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserStage } from "../../signup/lib/authApi";
import { kycChecklist } from "../../signup/lib/kycApi";

export default function KycPage() {
  const router = useRouter();
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getUserStage()
      .then((stage) => {
        if (!cancelled) setSteps(kycChecklist(stage));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load KYC status.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const left = steps.filter((step) => !step.done).length;

  return (
    <div className="px-10 py-8 max-w-[720px]">
      <h2 className="text-lg font-semibold text-ink">Complete Your KYC</h2>
      <p className="text-sm text-muted mt-1 mb-6">
        {steps.length ? `${left} step${left === 1 ? "" : "s"} left` : "Checking your KYC status…"}
      </p>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="flex flex-col gap-2">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center justify-between bg-white border border-border rounded-card px-4 py-3">
            <span className="text-sm font-medium text-ink">{step.label}</span>
            <span className={`text-xs font-semibold ${step.done ? "text-emerald" : "text-amber-700"}`}>
              {step.done ? "Done" : "Left"}
            </span>
          </div>
        ))}
      </div>
      {left > 0 && (
        <button
          type="button"
          onClick={() => router.push("/signup?start=kyc")}
          className="mt-6 h-12 px-6 rounded-xl bg-[#0C4A3E] text-white text-sm font-bold"
        >
          Continue
        </button>
      )}
    </div>
  );
}
