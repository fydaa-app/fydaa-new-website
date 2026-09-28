import { amcPartners } from "../data/constants";
import { Phone, Video, Mail } from "lucide-react";
import { jadeGradient } from "../lib/tokens";

// ─── Allocation Bar ───
export function AllocationBar() {
  const segments = [
    { label: "Equity", pct: 62, color: "#0C4A3E" },
    { label: "Debt",   pct: 20, color: "#047857" },
    { label: "Gold",   pct: 12, color: "#F59E0B" },
    { label: "Others", pct: 6,  color: "#3B82F6" },
  ];
  return (
    <div className="bg-white border border-border rounded-card p-5 shadow-card mb-8">
      <div className="text-lg font-semibold text-ink mb-4">Where Your Money Is</div>
      <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-4">
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} className="rounded-full" />
        ))}
      </div>
      <div className="flex flex-wrap gap-5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[13px] text-secondary">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
            {s.label} <span className="font-semibold text-ink ml-0.5">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AMC Strip ───
export function AMCStrip() {
  const doubled = [...amcPartners, ...amcPartners]; // seamless loop
  return (
    <div className="bg-white border border-border rounded-card px-5 py-4 shadow-card mb-8 overflow-hidden">
      <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">
        Invest in Funds from
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-8 animate-marquee">
          {doubled.map((amc, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-medium text-secondary whitespace-nowrap shrink-0">
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: amc.color }}
              >
                {amc.mono}
              </span>
              {amc.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Relationship Manager Card ───
export function RMCard() {
  return (
    <div className="bg-white border border-border rounded-card shadow-card overflow-hidden h-full">
      <div className="h-[72px]" style={{ background: jadeGradient }} />
      <div className="px-6 pb-6 relative">
        <div className="w-16 h-16 rounded-full bg-jade text-white text-[22px] font-bold flex items-center justify-center border-[3px] border-white -mt-8 relative" >
          KB
        </div>
        <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white absolute top-[24px] left-[72px]" />
        <div className="flex items-center gap-1.5 mt-2.5 mb-0.5">
          <span className="text-lg font-bold text-ink">Kuntal Bhansali</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0C4A3E" stroke="none">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mt-0.5">
          Relationship Manager
        </div>
        <p className="text-[13px] text-secondary leading-relaxed mt-2.5">
          Building trust and lasting partnerships through personalized client care and proactive financial guidance.
        </p>
        <div className="flex gap-2 mt-4">
          {[
            { icon: Phone, label: "Call" },
            { icon: Video, label: "GMeet" },
            { icon: Mail, label: "Email" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-btn border border-border bg-white text-[13px] font-semibold text-ink hover:bg-surface transition-colors"
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Recommended Goals (compact, for Home) ───
export function RecommendedGoals({ onExplore, onGoalClick }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-ink">Recommended Goals</h3>
      </div>
      <div className="flex flex-col gap-2.5 flex-1">
        <button
          onClick={() => onGoalClick?.("Emergency Fund", 2, 8)}
          className="flex items-center gap-3 px-4 py-3.5 bg-white border border-border rounded-card shadow-card hover:shadow-elevated hover:border-border-mid hover:-translate-y-px transition-all text-left"
        >
          <div className="w-[42px] h-[42px] rounded-[11px] bg-tint flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0C4A3E" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-ink">Emergency Fund</div>
            <div className="text-[10px] text-muted mt-0.5">Your safety net</div>
          </div>
          <svg width="14" height="14" fill="none" stroke="#D4D4D4" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <button
          onClick={() => onGoalClick?.("Retirement", 25, 12)}
          className="flex items-center gap-3 px-4 py-3.5 bg-white border border-border rounded-card shadow-card hover:shadow-elevated hover:border-border-mid hover:-translate-y-px transition-all text-left"
        >
          <div className="w-[42px] h-[42px] rounded-[11px] bg-tint flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0C4A3E" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-ink">Retirement</div>
            <div className="text-[10px] text-muted mt-0.5">Peaceful life after work</div>
          </div>
          <svg width="14" height="14" fill="none" stroke="#D4D4D4" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <button
          onClick={onExplore}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-card bg-white text-[13px] font-semibold text-secondary hover:border-jade hover:bg-tint hover:text-jade transition-all min-h-[56px]"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" />
          </svg>
          Explore all goals
        </button>
      </div>
    </div>
  );
}
