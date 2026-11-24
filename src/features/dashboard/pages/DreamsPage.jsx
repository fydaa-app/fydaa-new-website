import { useEffect, useMemo, useState } from "react";
import { jadeGradient } from "../lib/tokens";
import { loadJourney, loadSipStatus, mapJourney, remainingInstallments } from "../lib/dreamsApi";
import SipOptionsSheet from "../components/SipOptionsSheet";
import AddMoneySheet from "../components/AddMoneySheet";
import WithdrawSheet from "../components/WithdrawSheet";
import { pendingWithdrawalCovers } from "../lib/investmentDetailApi";
import { Plus, ArrowUp, MoreHorizontal, X } from "lucide-react";

const PAGE_SHELL_FULL =
  "px-4 sm:px-6 lg:px-10 xl:px-12 4xl:px-16 py-5 sm:py-8 w-full max-w-none mx-auto min-w-0 pb-[max(5rem,env(safe-area-inset-bottom))] lg:pb-8";

const TABS = [
  { id: "ACTIVE", label: "Active" },
  { id: "CANCELLED", label: "Cancelled" },
  { id: "COMPLETED", label: "Completed" },
];

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function signedMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${money(Math.abs(n))}`;
}

function signedPct(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(2)}%`;
}

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
              style={{ width: `${Math.min(100, Math.max(goal.pct || 0, 0))}%` }}
            />
          </div>
          <div className="flex gap-6 flex-wrap text-[13px]">
            <span className="flex items-baseline gap-1.5">
              <span className="text-muted font-medium">Invested</span>
              <span className="font-bold text-ink">{money(goal.invested)}</span>
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-muted font-medium">Current</span>
              <span className="font-bold text-ink">{money(goal.current)}</span>
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-muted font-medium">Returns</span>
              <span className={`font-bold ${Number(goal.returns) < 0 ? "text-red-600" : "text-emerald"}`}>
                {signedMoney(goal.returns)} {signedPct(goal.returnsPct)}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Goal Detail Panel ───
function GoalDetail({ goal, onClose, onRefresh }) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [forceCompleteWithdraw, setForceCompleteWithdraw] = useState(false);
  if (!goal) return null;
  const circ = 238.8;
  const cancelled = String(goal.tab || goal.badge || "").toUpperCase().includes("CANCEL");
  const available = Number(goal.remainingAmount ?? goal.current) || 0;
  const pendingAmt = Number(goal.pendingWithdrawalAmount) || 0;
  const withdrawBlocked = pendingWithdrawalCovers(available, pendingAmt) || available <= 1;
  const showAdd = !cancelled && !!goal.sipId;
  const showOptions = !cancelled && !!goal.sipId;
  const showWithdraw = !!goal.sipId && (!withdrawBlocked || pendingAmt > 0);

  function refreshAndCloseSheets() {
    onRefresh?.();
  }

  return (
    <div className="bg-white border border-border rounded-card shadow-card overflow-visible relative">
      <SipOptionsSheet
        open={optionsOpen}
        forLabel={goal.forLabel || goal.name}
        sipId={goal.sipId}
        frequency={goal.frequency}
        currentAmount={goal.monthly}
        currentValue={available}
        onClose={() => setOptionsOpen(false)}
        onNeedWithdrawFirst={() => {
          setOptionsOpen(false);
          setForceCompleteWithdraw(true);
          setWithdrawOpen(true);
        }}
        onModified={() => refreshAndCloseSheets()}
        onCancelled={() => {
          refreshAndCloseSheets();
          onClose?.();
        }}
      />
      <AddMoneySheet
        open={addOpen}
        goalName={goal.name}
        currentValue={goal.current}
        sipId={goal.sipId}
        portfolioId={goal.portfolioId}
        investmentTerm={goal.investmentTerm}
        onClose={() => setAddOpen(false)}
        onDone={refreshAndCloseSheets}
      />
      <WithdrawSheet
        open={withdrawOpen}
        goalName={goal.name}
        available={available}
        totalWithdrawn={goal.totalWithdrawn}
        sipId={goal.sipId}
        portfolioId={goal.portfolioId}
        forceComplete={forceCompleteWithdraw}
        onClose={() => {
          setWithdrawOpen(false);
          setForceCompleteWithdraw(false);
        }}
        onDone={refreshAndCloseSheets}
      />
      <button
        type="button"
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
              <div className="text-lg font-extrabold text-white">{Number(goal.pct || 0).toFixed(2)}%</div>
              <div className="text-[8px] font-semibold text-white/40 uppercase tracking-wider">Complete</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 flex-1">
            {[
              { k: "Invested", v: money(goal.invested) },
              { k: "Current", v: money(goal.current) },
              {
                k: String(goal.frequency || "").toLowerCase() === "daily" ? "Daily" : "Monthly",
                v: money(goal.monthly),
              },
              { k: "Duration", v: goal.duration || "—" },
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
        {pendingAmt > 0 ? (
          <div className="mb-4 text-[13px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-btn px-3.5 py-2.5">
            Withdrawal in process · {money(pendingAmt)}
          </div>
        ) : null}
        <div className="flex gap-2 mb-5">
          {showAdd ? (
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-btn bg-jade text-white text-[13px] font-semibold hover:bg-jade-hover transition-colors"
            >
              <Plus size={14} /> Add
            </button>
          ) : null}
          {showWithdraw ? (
            <button
              type="button"
              disabled={withdrawBlocked}
              onClick={() => {
                setForceCompleteWithdraw(false);
                setWithdrawOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-btn border border-border bg-white text-ink text-[13px] font-semibold hover:bg-surface transition-colors disabled:opacity-45 disabled:hover:bg-white"
            >
              <ArrowUp size={14} /> Withdraw
            </button>
          ) : null}
          {showOptions ? (
            <button
              type="button"
              onClick={() => setOptionsOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-btn border border-border bg-white text-ink text-[13px] font-semibold hover:bg-surface transition-colors"
            >
              <MoreHorizontal size={14} /> Options
            </button>
          ) : null}
        </div>

        {/* Progress */}
        <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2.5">Progress</div>
        <div className="bg-surface rounded-btn p-3.5 mb-5">
          <div className="h-1.5 rounded-full bg-border mb-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-jade to-emerald" style={{ width: `${Math.min(100, Math.max(goal.pct || 0, 0))}%` }} />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted font-medium">
              {goal.remaining == null ? "—" : `${goal.remaining} remaining installments`}
            </span>
            <span className="text-ink font-semibold">{Number(goal.pct || 0).toFixed(2)}%</span>
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
                  {f.gain == null && f.gainPct == null ? "—" : `${signedMoney(f.gain)} ${signedPct(f.gainPct)}`.trim()}
                </div>
                <div className="text-[11px] text-muted mt-0.5">{money(f.val)}</div>
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
  const [tab, setTab] = useState("ACTIVE");
  const [cards, setCards] = useState(undefined);
  const [remaining, setRemaining] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadJourney()
      .then((payload) => {
        if (!cancelled) setCards(mapJourney(payload));
      })
      .catch(() => {
        if (!cancelled) setCards([]);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const visible = useMemo(
    () => (cards || []).filter((card) => card.tab === tab),
    [cards, tab],
  );
  const selected = visible.find((card) => card.id === activeGoalId) || null;
  const hasDetail = !!selected;

  useEffect(() => {
    if (!selected?.sipId) {
      setRemaining(null);
      return undefined;
    }
    let cancelled = false;
    loadSipStatus(selected.sipId)
      .then((status) => {
        if (!cancelled) setRemaining(remainingInstallments(status));
      })
      .catch(() => {
        if (!cancelled) setRemaining(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selected?.sipId]);

  return (
    <div className={PAGE_SHELL_FULL}>
      <h2 className="text-lg font-semibold text-ink mb-4">Portfolio</h2>
      <div className="flex gap-1 bg-surface rounded-btn p-0.5 w-full sm:w-fit mb-4 overflow-x-auto">
        {TABS.map((item) => {
          const count = cards ? cards.filter((card) => card.tab === item.id).length : null;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => { setTab(item.id); setActiveGoalId(null); }}
              className={`px-4 sm:px-5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap shrink-0 ${active ? "bg-white text-ink shadow-sm" : "text-muted"}`}
            >
              {item.label}{count == null ? "" : ` · ${count}`}
            </button>
          );
        })}
      </div>

      <div className={`flex flex-col ${hasDetail ? "lg:flex-row" : ""} gap-5 items-stretch lg:items-start`}>
        <div className={`flex flex-col gap-3 transition-all min-w-0 ${hasDetail ? "lg:w-[min(100%,420px)] xl:w-[440px] lg:shrink-0" : "flex-1 w-full"}`}>
          {cards === undefined && <div className="text-sm text-muted py-6">Loading goals…</div>}
          {cards && visible.length === 0 && <div className="text-sm text-muted py-6">No goals in this tab</div>}
          {visible.map((goal) => (
            <JourneyCard
              key={goal.id}
              id={goal.id}
              goal={goal}
              isActive={activeGoalId === goal.id}
              onClick={setActiveGoalId}
              compact={hasDetail}
            />
          ))}
        </div>
        {hasDetail && (
          <div className="flex-1 min-w-0 lg:pl-4">
            <GoalDetail
              goal={{ ...selected, remaining }}
              onClose={() => setActiveGoalId(null)}
              onRefresh={() => setRefreshKey((value) => value + 1)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
