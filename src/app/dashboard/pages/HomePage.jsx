"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroCard from "../components/HeroCard";
import ProductShowcase from "../components/ProductShowcase";
import { AllocationBar, AMCStrip, RMCard, RecommendedGoals } from "../components/DashboardWidgets";
import { getUserStage } from "../../signup/lib/authApi";
import { isHomeKycComplete } from "../../signup/lib/kycApi";

export default function HomePage({ setActivePage }) {
  return (
    <div className="px-10 py-8 max-w-[1200px]">
      <HeroCard />
      <CompleteKycBanner />
      <ProductShowcase />
      <AllocationBar />
      <AMCStrip />

      <div className="grid grid-cols-[1fr_380px] gap-5 items-stretch mb-8">
        <RecommendedGoals
          onExplore={() => setActivePage("dreams")}
          onGoalClick={() => setActivePage("dreams")}
        />
        <RMCard />
      </div>

      <div className="pt-6 border-t border-border text-xs text-muted leading-relaxed">
        fydaa · Multistrato Capital Advisors Pvt. Ltd · SEBI RIA INA000015969 · ARN 358522
      </div>
    </div>
  );
}

function CompleteKycBanner() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getUserStage()
      .then((stage) => {
        if (!cancelled) setShow(!isHomeKycComplete(stage));
      })
      .catch(() => {
        if (!cancelled) setShow(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => router.push("/signup?start=kyc")}
      className="w-full text-left bg-white border border-border rounded-card px-5 py-4 mb-7 shadow-card hover:border-jade"
    >
      <div className="text-sm font-semibold text-ink">Complete Your KYC</div>
      <div className="text-xs text-muted mt-1">Finish the remaining steps to start investing.</div>
    </button>
  );
}
