import { useState } from "react";
import { goalCategories, journeyGoals } from "../data/constants";
import { rupee, compact, sipFV, getOrdinal } from "../lib/utils";
import { jadeGradient } from "../lib/tokens";
import { Plus, ArrowUp, Pause, X, ChevronLeft } from "lucide-react";

// ─── Journey Card (compact in split mode) ───
function JourneyCard({ id, goal, isActive, onClick, compact: isCompact }) {
  return (
    <div
      onClick={() => onClick(id)}
      className={`bg-white border rounded-card shadow-card cursor-pointer transition-all hover:shadow-elevated hover:border-border-mid ${
        isActive ? "border-jade bg-tint" : "border-border"
      }`}
    >
      <div className="flex items-center gap-3.5 px-5 py-3.5">
        <div className="w-11 h-11 rounded-xl bg-tint flex items-center justify-center shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0C4A3E" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-ink ${isCompact ? "text-sm" : "text-base"}`}>
            {goal.name}
          </div>
          <div className={`text-muted mt-0.5 ${isCompact ? "text-[11px]" : "text-xs"}`}>
            {goal.forLabel}
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-tint text-emerald shrink-0">
          {goal.badge}
        </span>
      </div>
      {!isCompact && (
        <div className="px-5 pb-4">
          <div className="h-[5px] rounded-full bg-surface mb-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-jade to-emerald"
              style={{ width: `${Math.max(goal.pct, 0.5)}%` }}
            />
          </div>
          <div className="flex gap-6 flex-wrap text-[13px]">
            <span className="flex items-baseline gap-1.5">
              <span className="text-muted font-medium">Invested</span>
              <span className="font-bold text-ink">{rupee(goal.invested)}</span>
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-muted font-medium">Current</span>
              <span className="font-bold text-ink">{rupee(goal.current)}</span>
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-muted font-medium">Returns</span>
              <span className="font-bold text-emerald">
                +{rupee(goal.current - goal.invested)} ({goal.pct > 1 ? ((goal.current - goal.invested) / goal.invested * 100).toFixed(1) : goal.pct}%)
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Goal Detail Panel ───
function GoalDetail({ goal, onClose }) {
  if (!goal) return null;
  const circ = 238.8;
  return (
    <div className="bg-white border border-border rounded-card shadow-card overflow-visible relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-[-52px] w-9 h-9 rounded-full bg-white border border-border text-ink flex items-center justify-center shadow-elevated hover:bg-surface transition-all z-10"
      >
        <X size={16} />
      </button>
      {/* Hero */}
      <div className="rounded-t-card overflow-hidden p-6 text-white" style={{ background: jadeGradient }}>
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="text-[22px] font-bold tracking-tight">{goal.name}</div>
            <div className="text-[11px] text-white/45 mt-0.5">{goal.forLabel}</div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md bg-emerald-300/15 text-emerald-300">
            {goal.badge}
          </span>
        </div>
        <div className="flex items-center gap-5">
          {/* Ring */}
          <div className="relative w-[90px] h-[90px] shrink-0">
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="7" />
              <circle cx="45" cy="45" r="38" fill="none" stroke="#6EE7B7" strokeWidth="7" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ * (1 - goal.pct / 100)}
                transform="rotate(-90 45 45)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-lg font-extrabold text-white">{goal.pct}%</div>
              <div className="text-[8px] font-semibold text-white/40 uppercase tracking-wider">Complete</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 flex-1">
            {[
              { k: "Invested", v: rupee(goal.invested) },
              { k: "Current", v: rupee(goal.current) },
              { k: "Monthly", v: rupee(goal.monthly) },
              { k: "Duration", v: goal.duration },
            ].map((s) => (
              <div key={s.k} className="px-3 py-2 rounded-lg bg-white/7">
                <div className="text-[9px] font-medium text-white/40 uppercase tracking-wider">{s.k}</div>
                <div className="text-[15px] font-bold text-white mt-0.5">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="p-5">
        <div className="flex gap-2 mb-5">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-btn bg-jade text-white text-[13px] font-semibold hover:bg-jade-hover transition-colors">
            <Plus size={14} /> Add
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-btn border border-border bg-white text-ink text-[13px] font-semibold hover:bg-surface transition-colors">
            <ArrowUp size={14} /> Withdraw
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-btn border border-border bg-white text-ink text-[13px] font-semibold hover:bg-surface transition-colors">
            <Pause size={14} /> Pause
          </button>
        </div>

        {/* Progress */}
        <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2.5">Progress</div>
        <div className="bg-surface rounded-btn p-3.5 mb-5">
          <div className="h-1.5 rounded-full bg-border mb-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-jade to-emerald" style={{ width: `${Math.max(goal.pct, 0.5)}%` }} />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted font-medium">{goal.remaining} remaining installments</span>
            <span className="text-ink font-semibold">{goal.pct}%</span>
          </div>
        </div>

        {/* Allocation */}
        <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2.5">Allocation</div>
        <div className="space-y-0">
          {goal.funds.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5 py-3.5 border-t border-bg first:border-0 first:pt-0">
              <span className="w-1.5 h-1.5 rounded-sm mt-1.5 shrink-0" style={{ background: f.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink leading-snug">{f.name}</div>
                <div className="text-[11px] text-muted mt-0.5">{f.type}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-[13px] font-bold ${f.up ? "text-emerald" : "text-red-600"}`}>
                  {f.up ? "+" : ""}{rupee(f.gain)} ({f.up ? "+" : ""}{f.gainPct}%)
                </div>
                <div className="text-[11px] text-muted mt-0.5">{rupee(f.val)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dreams Page ───
export default function DreamsPage() {
  const [activeGoalId, setActiveGoalId] = useState(null);
  const [flowGoal, setFlowGoal] = useState(null); // { name, years, cagr }
  const [flowStep, setFlowStep] = useState(1);
  const [sipAmt, setSipAmt] = useState(10000);
  const [sipYrs, setSipYrs] = useState(10);
  const [sipDate, setSipDate] = useState(null);

  const hasDetail = !!activeGoalId;
  const inFlow = !!flowGoal;

  const startGoalFlow = (name, years, cagr) => {
    setFlowGoal({ name, years, cagr });
    setSipYrs(years);
    setFlowStep(1);
    setSipDate(null);
  };

  // TODO: Implement full 3-step flow UI — reference the HTML prototype for exact layout.
  // Steps: 1) Amount + Tenure with projection card, 2) SIP date picker, 3) Review + confirm.

  if (inFlow) {
    const cagr = flowGoal.cagr;
    const corpus = sipFV(sipAmt, cagr, sipYrs);
    return (
      <div className="px-10 py-8 max-w-[1000px]">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { if (flowStep > 1) setFlowStep(flowStep - 1); else setFlowGoal(null); }}
            className="w-9 h-9 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-lg font-bold text-ink">{flowGoal.name}</h2>
          <div className="flex gap-1.5 ml-auto">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`inline-block h-2 rounded-full ${s === flowStep ? "w-6 bg-jade" : "w-2 " + (s < flowStep ? "bg-jade" : "bg-border")}`} />
            ))}
          </div>
        </div>

        {/* Step 1 placeholder — use ProductShowcase-style SIP config with projection card */}
        <div className="bg-white border border-border rounded-card p-8 shadow-card">
          <p className="text-secondary text-sm mb-4">
            Step {flowStep} of 3 — {flowStep === 1 ? "Configure SIP amount and tenure" : flowStep === 2 ? "Pick your SIP date" : "Review and confirm"}
          </p>
          <p className="text-muted text-xs">
            See the HTML reference file for the complete step-by-step UI with sliders, projection cards, date pickers, and review checklists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-10 py-8 max-w-[1000px]">
      {/* Journey */}
      <h2 className="text-lg font-semibold text-ink mb-4">Journey</h2>
      <div className="flex gap-1 bg-surface rounded-btn p-0.5 w-fit mb-4">
        <button className="px-5 py-2 rounded-lg text-[13px] font-semibold bg-white text-ink shadow-sm">Active · 3</button>
        <button className="px-5 py-2 rounded-lg text-[13px] font-semibold text-muted">Paused</button>
        <button className="px-5 py-2 rounded-lg text-[13px] font-semibold text-muted">Completed</button>
      </div>

      <div className={`flex gap-5 items-start transition-all ${hasDetail ? "" : ""}`}>
        <div className={`flex flex-col gap-3 transition-all ${hasDetail ? "w-[380px] shrink-0" : "flex-1"}`}>
          {Object.entries(journeyGoals).map(([id, goal]) => (
            <JourneyCard
              key={id}
              id={id}
              goal={goal}
              isActive={activeGoalId === id}
              onClick={setActiveGoalId}
              compact={hasDetail}
            />
          ))}
        </div>
        {hasDetail && (
          <div className="flex-1 min-w-0 pl-4">
            <GoalDetail
              goal={journeyGoals[activeGoalId]}
              onClose={() => setActiveGoalId(null)}
            />
          </div>
        )}
      </div>

      {/* Recommended Goals */}
      <h2 className="text-lg font-semibold text-ink mt-10 mb-1">Recommended Goals</h2>
      <p className="text-sm text-secondary mb-6">Choose a goal and start planning today</p>

      {goalCategories.map((cat) => (
        <div key={cat.label} className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">{cat.label}</span>
            <span className="text-[10px] font-semibold text-jade bg-tint px-2.5 py-1 rounded-md">{cat.badge}</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {cat.goals.map((g) => (
              <button
                key={g.name}
                onClick={() => startGoalFlow(g.name, g.years, g.cagr)}
                className="flex items-center gap-3 px-4 py-3.5 bg-white border border-border rounded-card shadow-card hover:shadow-elevated hover:border-border-mid hover:-translate-y-px transition-all text-left"
              >
                <div className="w-[42px] h-[42px] rounded-[11px] bg-tint flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0C4A3E" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
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
