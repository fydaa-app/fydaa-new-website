"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroCard from "../components/HeroCard";
import ProductShowcase from "../components/ProductShowcase";
import { AllocationBar, AMCStrip, RMCard, RecommendedGoals } from "../components/DashboardWidgets";
import { getUserStage } from "../../signup/lib/authApi";
import { isHomeKycComplete } from "../../signup/lib/kycApi";
import { loadHomePending } from "../lib/dreamsApi";

export default function HomePage({ setActivePage, user }) {
  const [showcase, setShowcase] = useState(null);

  const startProduct = (key) => {
    setShowcase({ key, at: Date.now() });
    document.getElementById("product-showcase")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="px-10 py-8 max-w-[1200px]">
      <HeroCard firstName={user === undefined ? "…" : user?.firstName} />
      <CompleteKycBanner />
      <PendingList />
      <ProductShowcase
        focusKey={showcase?.key}
        focusAt={showcase?.at}
        onViewHolding={() => setActivePage("dreams")}
        onStartInvest={() => setActivePage("dreams")}
      />
      <AllocationBar onStart={startProduct} />
      <AMCStrip />

      <div className="grid grid-cols-[1fr_380px] gap-5 items-stretch mb-8">
        <RecommendedGoals
          onExplore={() => setActivePage("dreams")}
          onGoalClick={() => setActivePage("dreams")}
        />
        <RMCard manager={user?.manager} />
      </div>

      <div className="pt-6 border-t border-border text-xs text-muted leading-relaxed">
        fydaa · Multistrato Capital Advisors Pvt. Ltd · SEBI RIA INA000015969 · ARN 358522
      </div>
    </div>
  );
}

function PendingList() {
  const [rows, setRows] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    loadHomePending()
      .then((list) => {
        if (!cancelled) setRows(list);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!rows?.length) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-ink mb-4">Pending</h2>
      <div className="flex gap-2.5 overflow-x-auto">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-3.5 px-5 py-3.5 bg-white border border-border rounded-card shadow-card shrink-0 flex-1 min-w-[280px]"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-ink whitespace-nowrap">{row.name}</div>
              {row.forLabel ? <div className="text-xs text-muted mt-0.5 whitespace-nowrap">{row.forLabel}</div> : null}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-surface text-muted shrink-0">
              {row.badge}
            </span>
          </div>
        ))}
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
