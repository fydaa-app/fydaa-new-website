"use client";

import { useEffect, useState } from "react";
import { goalCategories } from "../data/constants";
import GoalSipFlow from "../components/GoalSipFlow";
import InvestModeSheet from "../components/InvestModeSheet";
import SipInvestWizard from "../components/SipInvestWizard";
import { loadGoals, PRODUCT_TABS } from "../lib/investmentApi";
import { PAGE_SHELL } from "../lib/layoutClasses";

function resolveGoalId(goalsById, goal) {
  const seededId = Number(goal?.productGoalId);
  if (Number.isFinite(seededId) && seededId > 0 && goalsById[seededId]) return seededId;
  const target = String(goal?.name || "").trim().toLowerCase();
  if (!target) return null;
  const list = Object.values(goalsById || {});
  const match =
    list.find((item) => String(item.name || "").trim().toLowerCase() === target)
    || list.find((item) => {
      const name = String(item.name || "").trim().toLowerCase();
      return name.includes(target) || target.includes(name);
    });
  return match?.id ?? null;
}

/**
 * Goals tab — recommended goals catalog + SIP / lumpsum handoff.
 */
export default function GoalsPage({
  setActivePage,
  pendingGoalSip,
  clearPendingGoalSip,
  resumeInvestDraft,
  clearResumeInvestDraft,
}) {
  const [modeGoal, setModeGoal] = useState(null);
  const [flowGoal, setFlowGoal] = useState(null);
  const [investDraft, setInvestDraft] = useState(null);
  const [modeBusy, setModeBusy] = useState(false);
  const [modeError, setModeError] = useState("");

  useEffect(() => {
    if (!pendingGoalSip?.name) return;
    setModeGoal(pendingGoalSip);
    setModeError("");
    clearPendingGoalSip?.();
  }, [pendingGoalSip, clearPendingGoalSip]);

  useEffect(() => {
    if (!resumeInvestDraft) return;
    setFlowGoal(null);
    setInvestDraft(resumeInvestDraft);
    clearResumeInvestDraft?.();
  }, [resumeInvestDraft, clearResumeInvestDraft]);

  const goCompleteKyc = (draft) => {
    setActivePage?.("kyc", {
      start: "kyc",
      returnPage: "goals",
      returnDraft: draft
        ? { ...draft, resumeReview: true, openReview: true, fromGoals: true }
        : null,
    });
  };

  function pickGoal(goal, badge) {
    setModeError("");
    setModeGoal({
      name: goal.name,
      years: goal.years,
      cagr: goal.cagr,
      sub: goal.sub,
      badge,
      icon: goal.icon,
      productGoalId: goal.productGoalId,
      seedAmount: goal.seedAmount,
    });
  }

  function pickSip() {
    if (!modeGoal) return;
    setFlowGoal(modeGoal);
    setModeGoal(null);
    setModeError("");
  }

  async function pickLumpsum() {
    if (!modeGoal || modeBusy) return;
    setModeBusy(true);
    setModeError("");
    try {
      const goalsById = await loadGoals();
      const goalId = resolveGoalId(goalsById, modeGoal);
      if (!goalId) {
        setModeError("This goal is not available yet.");
        return;
      }
      const productTab = PRODUCT_TABS.find((item) => item.goalId === goalId);
      const seed = Number(modeGoal.seedAmount);
      const amount = Number.isFinite(seed) && seed >= 5000 ? seed : 10000;
      setInvestDraft({
        tab: productTab?.key || "equity",
        goalId,
        goalName: modeGoal.name,
        goalBadge: modeGoal.badge,
        amount,
        tenureYears: modeGoal.years || 3,
        frequency: "lumpsum",
        fundMode: "rec",
        fund: null,
        fromGoals: true,
      });
      setModeGoal(null);
    } catch {
      setModeError("Could not start lumpsum. Try again.");
    } finally {
      setModeBusy(false);
    }
  }

  if (flowGoal && !investDraft) {
    return (
      <GoalSipFlow
        goal={flowGoal}
        onBack={() => setFlowGoal(null)}
        onContinue={(draft) => setInvestDraft(draft)}
        onCompleteKyc={(draft) => {
          goCompleteKyc(draft);
          setFlowGoal(null);
        }}
      />
    );
  }

  if (investDraft) {
    return (
      <SipInvestWizard
        open
        draft={investDraft}
        onClose={() => setInvestDraft(null)}
        onDone={() => {
          setInvestDraft(null);
          setFlowGoal(null);
          setModeGoal(null);
          setActivePage?.("home");
        }}
        onCompleteKyc={(draft) => {
          goCompleteKyc(draft || investDraft);
          setInvestDraft(null);
          setFlowGoal(null);
        }}
      />
    );
  }

  return (
    <div className={PAGE_SHELL}>
      <InvestModeSheet
        open={!!modeGoal}
        title={modeGoal?.name || "Invest"}
        subtitle="Start a monthly SIP or invest a one-time amount"
        sipDetail="Monthly SIP from ₹1000"
        lumpDetail="Invest a single amount from ₹5000"
        onClose={() => {
          if (modeBusy) return;
          setModeGoal(null);
          setModeError("");
        }}
        onPickSip={pickSip}
        onPickLumpsum={pickLumpsum}
      />
      {modeError ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[95] max-w-sm px-4 py-2.5 rounded-xl bg-ink text-white text-sm shadow-elevated">
          {modeError}
        </div>
      ) : null}

      <h2 className="text-lg font-semibold text-ink mb-1">Recommended Goals</h2>
      <p className="text-sm text-secondary mb-6">Choose a goal and start planning today</p>

      {goalCategories.map((cat) => (
        <div key={cat.label} className="mb-7">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
              {cat.label}
            </span>
            <span className="text-[10px] font-semibold text-jade bg-tint px-2.5 py-1 rounded-md shrink-0">
              {cat.badge}
            </span>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 gap-2.5">
            {cat.goals.map((g) => (
              <button
                key={g.name}
                type="button"
                onClick={() => pickGoal(g, cat.badge)}
                className="flex items-center gap-3 px-4 py-3.5 bg-white border border-border rounded-card shadow-card hover:shadow-elevated hover:border-border-mid hover:-translate-y-px transition-all text-left"
              >
                <div className="w-[42px] h-[42px] rounded-[11px] bg-tint flex items-center justify-center shrink-0 overflow-hidden">
                  {g.icon ? (
                    <img src={g.icon} alt="" className="w-7 h-7 object-contain" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0C4A3E" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink">{g.name}</div>
                  <div className="text-[10px] text-muted mt-0.5">{g.sub}</div>
                </div>
                <svg width="14" height="14" fill="none" stroke="#D4D4D4" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
