"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import HeroCard from "../components/HeroCard";
import ProductShowcase from "../components/ProductShowcase";
import SipInvestWizard from "../components/SipInvestWizard";
import BasketSipFlow from "../components/BasketSipFlow";
import CreateBasketFlow from "../components/CreateBasketFlow";
import OwnFundSipFlow from "../components/OwnFundSipFlow";
import AdvisorTalkPage from "../components/AdvisorTalkPage";
import TrackOrdersFlow, { TrackOrdersBanner } from "../components/TrackOrdersFlow";
import RepairOrdersFlow, { RepairOrdersBanner } from "../components/RepairOrdersFlow";
import { AllocationBar, AMCStrip, RMCard, RecommendedGoals } from "../components/DashboardWidgets";
import BasketsHomeSection from "../components/BasketsHomeSection";
import { getUserStage } from "../../signup/lib/authApi";
import { isSignupComplete } from "../../signup/lib/kycApi";
import { deletePendingSip, loadHomePending } from "../lib/dreamsApi";
import { PRODUCT_TABS } from "../lib/investmentApi";
import { userFacingMessage } from "../lib/sipInvestApi";
import { settlePendingRepairPayment } from "../lib/repairOrdersApi";
import { PAGE_SHELL } from "../lib/layoutClasses";

function tabKeyFromGoalId(goalId) {
  const id = Number(goalId);
  const tab = PRODUCT_TABS.find((item) => item.goalId === id);
  return tab?.key || "equity";
}

export default function HomePage({
  setActivePage,
  user,
  resumeInvestDraft,
  clearResumeInvestDraft,
}) {
  const [showcase, setShowcase] = useState(null);
  const [investDraft, setInvestDraft] = useState(null);

  useEffect(() => {
    if (!resumeInvestDraft) return;
    setInvestDraft(resumeInvestDraft);
    clearResumeInvestDraft?.();
  }, [resumeInvestDraft, clearResumeInvestDraft]);

  const goCompleteKyc = (draft) => {
    setActivePage?.("kyc", {
      start: "kyc",
      returnPage: "home",
      returnDraft: draft
        ? { ...draft, resumeReview: true, openReview: true }
        : null,
    });
  };
  const [basketFlow, setBasketFlow] = useState(null);
  const [createBasketOpen, setCreateBasketOpen] = useState(false);
  const [editBasket, setEditBasket] = useState(null);
  const [basketTick, setBasketTick] = useState(0);
  const [ownFundFlow, setOwnFundFlow] = useState(null);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [trackOrdersOpen, setTrackOrdersOpen] = useState(false);
  const [repairOrdersOpen, setRepairOrdersOpen] = useState(false);
  const [homeToast, setHomeToast] = useState(null);
  const [pendingTick, setPendingTick] = useState(0);
  const [bannerTick, setBannerTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    settlePendingRepairPayment().then((result) => {
      if (cancelled || result?.skipped) return;
      if (result.ok) {
        setHomeToast({ tone: "success", text: "Payment completed successfully!" });
      } else {
        setHomeToast({
          tone: "error",
          text: `Payment unsuccessful: ${result.message || "Please try again"}`,
        });
      }
      setBannerTick((value) => value + 1);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!homeToast) return undefined;
    const id = setTimeout(() => setHomeToast(null), 3500);
    return () => clearTimeout(id);
  }, [homeToast]);

  const startProduct = (key) => {
    setShowcase({ key, at: Date.now() });
    document.getElementById("product-showcase")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (basketFlow) {
    return (
      <>
        <BasketSipFlow
          basket={basketFlow}
          onBack={() => setBasketFlow(null)}
          onContinue={(draft) => {
            setBasketFlow(null);
            setInvestDraft(draft);
          }}
          onEdit={(basket) => setEditBasket(basket)}
          onDeleted={() => {
            setBasketFlow(null);
            setBasketTick((value) => value + 1);
          }}
          onCompleteKyc={(draft) => {
            goCompleteKyc(draft || null);
            setBasketFlow(null);
          }}
        />
        <CreateBasketFlow
          open={!!editBasket}
          editBasket={editBasket}
          onClose={() => setEditBasket(null)}
          onSaved={(basket) => {
            setEditBasket(null);
            setBasketFlow(basket);
            setBasketTick((value) => value + 1);
          }}
        />
      </>
    );
  }

  if (ownFundFlow) {
    return (
      <OwnFundSipFlow
        seed={ownFundFlow}
        onBack={() => setOwnFundFlow(null)}
        onContinue={(draft) => {
          setOwnFundFlow(null);
          setInvestDraft(draft);
        }}
      />
    );
  }

  if (advisorOpen) {
    return <AdvisorTalkPage onBack={() => setAdvisorOpen(false)} />;
  }

  if (trackOrdersOpen) {
    return <TrackOrdersFlow onBack={() => setTrackOrdersOpen(false)} />;
  }

  if (repairOrdersOpen) {
    return (
      <RepairOrdersFlow
        onBack={() => {
          setRepairOrdersOpen(false);
          setBannerTick((value) => value + 1);
        }}
        onHomeRefresh={() => setBannerTick((value) => value + 1)}
      />
    );
  }

  return (
    <div className={PAGE_SHELL}>
      <HeroCard
        firstName={user === undefined ? "…" : user?.firstName}
        onAdviserClick={() => setAdvisorOpen(true)}
        onPortfolioClick={() => setActivePage("dreams")}
      />
      {homeToast ? (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
            homeToast.tone === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {homeToast.text}
        </div>
      ) : null}
      <CompleteKycBanner setActivePage={setActivePage} />
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
        onStartOwnFundSip={(seed) => setOwnFundFlow(seed)}
      />
      <TrackOrdersBanner key={`track-${bannerTick}`} onOpen={() => setTrackOrdersOpen(true)} />
      <RepairOrdersBanner key={`repair-${bannerTick}`} onOpen={() => setRepairOrdersOpen(true)} />
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
        onCompleteKyc={(draft) => {
          goCompleteKyc(draft || investDraft);
          setInvestDraft(null);
        }}
      />
      <AllocationBar onStart={startProduct} />
      <AMCStrip />

      <BasketsHomeSection
        refreshKey={basketTick}
        onViewAll={() => setActivePage("dreams")}
        onViewBasket={(basket) => setBasketFlow(basket)}
        onCreate={() => setCreateBasketOpen(true)}
      />
      <CreateBasketFlow
        open={createBasketOpen}
        onClose={() => setCreateBasketOpen(false)}
        onCreated={(basket, mode) => {
          setCreateBasketOpen(false);
          setBasketTick((value) => value + 1);
          if (String(mode).toUpperCase() === "LUMPSUM") {
            setInvestDraft({
              basketId: basket.id,
              basketName: basket.name,
              goalName: basket.name,
              amount: basket.investAmount || basket.minInvestment || 1000,
              investAmount: basket.investAmount,
              minInvestment: basket.minInvestment,
              tenureYears: 3,
              frequency: "lumpsum",
              fundMode: "rec",
              fund: null,
              fromBasket: true,
              fromGoals: false,
            });
            return;
          }
          // SIP → full monthly basket SIP flow (amount locked from create).
          setBasketFlow({ ...basket, autoStart: true });
        }}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(280px,380px)] 4xl:grid-cols-[1fr_420px] gap-5 items-stretch mb-8">
        <RecommendedGoals
          onExplore={() => setActivePage("goals")}
          onGoalClick={(goal) => setActivePage("goals", goal)}
        />
        <RMCard manager={user?.manager} />
      </div>

      <div className="pt-6 border-t border-border text-xs text-muted leading-relaxed pb-20 lg:pb-6">
         Fydaa Analytics Private Limited · AMFI registered ARN 358522
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
      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
        {rows.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => onResume?.(row)}
            className="flex items-center gap-3 px-4 py-3.5 bg-white border border-border rounded-card shadow-card shrink-0 w-[min(100%,300px)] sm:w-[320px] snap-start text-left hover:border-jade hover:shadow-elevated transition-all"
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

function CompleteKycBanner({ setActivePage }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getUserStage()
      .then((stage) => {
        if (!cancelled) setShow(!isSignupComplete(stage));
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
      onClick={() => setActivePage?.("kyc", { start: "kyc" })}
      className="group w-full mb-7 flex items-center gap-4 text-left rounded-card border border-jade/25 bg-tint px-5 py-4 shadow-card transition-all hover:border-jade hover:bg-white hover:shadow-elevated active:scale-[0.99] cursor-pointer"
    >
      <span className="w-11 h-11 rounded-full bg-jade text-white flex items-center justify-center shrink-0 shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-ink group-hover:text-jade transition-colors">
          Complete Your KYC
        </span>
        <span className="block text-xs text-muted mt-0.5">
          Finish the remaining steps to start investing.
        </span>
      </span>
      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-jade text-white text-xs font-bold px-3 py-1.5 group-hover:bg-jade/90">
        Continue
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  );
}
