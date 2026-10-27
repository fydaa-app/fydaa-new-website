"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import HeroCard from "../components/HeroCard";
import ProductShowcase from "../components/ProductShowcase";
import SipInvestWizard from "../components/SipInvestWizard";
import { AllocationBar, AMCStrip, RMCard, RecommendedGoals } from "../components/DashboardWidgets";
import { getUserStage } from "../../signup/lib/authApi";
import { isHomeKycComplete } from "../../signup/lib/kycApi";
import { deletePendingSip, loadHomePending } from "../lib/dreamsApi";
import { PRODUCT_TABS } from "../lib/investmentApi";
import { userFacingMessage } from "../lib/sipInvestApi";

function tabKeyFromGoalId(goalId) {
  const id = Number(goalId);
  const tab = PRODUCT_TABS.find((item) => item.goalId === id);
  return tab?.key || "equity";
}

export default function HomePage({ setActivePage, user }) {
  const [showcase, setShowcase] = useState(null);
  const [investDraft, setInvestDraft] = useState(null);
  const [pendingTick, setPendingTick] = useState(0);

  const startProduct = (key) => {
    setShowcase({ key, at: Date.now() });
    document.getElementById("product-showcase")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 xl:px-12 4xl:px-16 py-5 sm:py-8 max-w-[1200px] 4xl:max-w-[1600px] mx-auto w-full">
      <HeroCard firstName={user === undefined ? "…" : user?.firstName} />
      <CompleteKycBanner />
      <PendingList
        refreshKey={pendingTick}
        onResume={(row) => {
          setInvestDraft({
            sipId: row.sipId || row.id,
            tab: tabKeyFromGoalId(row.goalId),
            goalId: row.goalId || PRODUCT_TABS.find((item) => item.key === "equity")?.goalId,
            amount: row.amount || 300,
            tenureYears: row.tenureYears || 3,
            frequency: row.frequency === "monthly" ? "monthly" : "daily",
            monthlyDay: row.monthlyDay || 10,
            fundMode: row.fundMode || "rec",
            fund: row.fund,
            goalName: row.goalName || row.name,
            fromGoals: false,
            resumeExisting: true,
          });
        }}
        onDeleted={() => setPendingTick((value) => value + 1)}
      />
      <ProductShowcase
        focusKey={showcase?.key}
        focusAt={showcase?.at}
        onViewHolding={() => setActivePage("dreams")}
        onStartInvest={(draft) => setInvestDraft({ ...draft, fromGoals: false })}
      />
      <SipInvestWizard
        open={!!investDraft}
        draft={investDraft}
        onClose={() => {
          setInvestDraft(null);
          setPendingTick((value) => value + 1);
        }}
        onDone={() => {
          setPendingTick((value) => value + 1);
          setActivePage("home");
        }}
      />
      <AllocationBar onStart={startProduct} />
      <AMCStrip />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(280px,380px)] 4xl:grid-cols-[1fr_420px] gap-5 items-stretch mb-8">
        <RecommendedGoals
          onExplore={() => setActivePage("dreams")}
          onGoalClick={(goal) => setActivePage("dreams", goal)}
        />
        <RMCard manager={user?.manager} />
      </div>

      <div className="pt-6 border-t border-border text-xs text-muted leading-relaxed pb-20 lg:pb-6">
        fydaa · Multistrato Capital Advisors Pvt. Ltd · SEBI RIA INA000015969 · ARN 358522
      </div>
    </div>
  );
}

function PendingList({ refreshKey, onResume, onDeleted }) {
  const [rows, setRows] = useState(undefined);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

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
  }, [refreshKey]);

  if (!rows?.length) return null;

  async function onDelete(event, row) {
    event.stopPropagation();
    if (deletingId) return;
    const ok = window.confirm(`Remove pending SIP “${row.name}”? You can start a new one anytime.`);
    if (!ok) return;
    setError("");
    setDeletingId(row.id);
    const result = await deletePendingSip(row.sipId || row.id);
    setDeletingId(null);
    if (!result.ok) {
      setError(userFacingMessage(result.message, "Failed to delete pending SIP"));
      return;
    }
    setRows((prev) => (prev || []).filter((item) => item.id !== row.id));
    onDeleted?.();
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-ink mb-1">Pending SIPs</h2>
      <p className="text-sm text-muted mb-4">Finish setup to start auto-debit, or remove if you no longer need it.</p>
      {error ? <div className="text-sm text-red-600 mb-3">{error}</div> : null}
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {rows.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => onResume?.(row)}
            className="flex items-center gap-3 px-4 py-3.5 bg-white border border-border rounded-card shadow-card shrink-0 flex-1 min-w-[min(100%,280px)] sm:min-w-[300px] text-left hover:border-jade hover:shadow-elevated transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-ink truncate">{row.name}</div>
              {row.forLabel ? <div className="text-xs text-muted mt-0.5 truncate">{row.forLabel}</div> : null}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 shrink-0">
              {row.badge || "INACTIVE"}
            </span>
            <span
              role="button"
              tabIndex={0}
              aria-label={`Delete ${row.name}`}
              onClick={(event) => onDelete(event, row)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onDelete(event, row);
                }
              }}
              className={`w-9 h-9 rounded-full border border-border bg-white flex items-center justify-center shrink-0 hover:bg-red-50 hover:border-red-200 hover:text-red-600 ${
                deletingId === row.id ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Trash2 size={15} />
            </span>
          </button>
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
