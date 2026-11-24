"use client";

import { useEffect, useState } from "react";
import { amcPartners } from "../data/constants";
import { Phone, Video, Mail, ChevronDown, ArrowDown, ArrowUp } from "lucide-react";
import { jadeGradient } from "../lib/tokens";
import { loadMySips, loadPortfolio } from "../lib/dreamsApi";

const PRODUCTS = [
  { key: "instafd", label: "InstaFD", emptyHint: "Liquid", test: /liquid|overnight|insta\s*fd/i },
  { key: "gold", label: "Digital Gold", emptyHint: "", test: /gold/i },
  { key: "equity", label: "Equity", emptyHint: "12% CAGR", test: /equity|nifty|index|flexi|large|mid|small|\bcap\b/i },
  { key: "multi", label: "Multi-Asset", emptyHint: "10% CAGR", test: /multi[-\s]?asset/i },
  { key: "debt", label: "Debt", emptyHint: "7% CAGR", fundedOnly: true, test: /gilt|debt|bond|psu|money market|short term|corporate bond/i },
  { key: "hybrid", label: "Hybrid", emptyHint: "10% CAGR", fundedOnly: true, test: /hybrid|balanced advantage/i },
  { key: "global", label: "Global", emptyHint: "11% CAGR", fundedOnly: true, test: /nasdaq|global|s&p|us bluechip|international/i },
];

const COLORS = ["#0C4A3E", "#047857", "#065F46", "#10B981", "#34D399"];

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `₹${Math.round(Math.abs(n)).toLocaleString("en-IN")}`;
}

function productKeyFor(name) {
  const text = String(name || "");
  const match = PRODUCTS.find((product) => product.test.test(text));
  return match ? match.key : "equity";
}

function shares(values) {
  const total = values.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return values.map(() => 0);
  const raw = values.map((value) => (value / total) * 100);
  const rounded = raw.map((value) => Math.round(value));
  const drift = 100 - rounded.reduce((sum, value) => sum + value, 0);
  if (drift !== 0) {
    const index = raw.indexOf(Math.max(...raw));
    rounded[index] += drift;
  }
  return rounded;
}

function buildAllocation(portfolio, sips) {
  const summary = portfolio?.summary || null;
  const holdings = Array.isArray(portfolio?.holdings) ? portfolio.holdings : [];
  const buckets = Object.fromEntries(PRODUCTS.map((product) => [product.key, {
    invested: 0,
    current: 0,
    monthly: 0,
    funds: [],
  }]));

  const addFund = (key, fund) => {
    const bucket = buckets[key];
    if (!bucket) return;
    const invested = Number(fund.investedAmount);
    const current = Number(fund.currentValue);
    if (Number.isFinite(invested)) bucket.invested += invested;
    if (Number.isFinite(current)) bucket.current += current;
    const name = fund.schemeName || fund.name;
    if (name && !bucket.funds.includes(name)) bucket.funds.push(name);
  };

  if (holdings.length) {
    holdings.forEach((holding) => addFund(productKeyFor(holding.schemeName), holding));
  } else {
    (Array.isArray(portfolio?.sips) ? portfolio.sips : []).forEach((sip) => {
      (sip.funds || []).forEach((fund) => addFund(productKeyFor(fund.schemeName), fund));
    });
  }

  (sips || []).forEach((sip) => {
    const funds = sip.funds || [];
    const weights = funds.map((fund) => {
      const invested = Number(fund.investedAmount);
      return Number.isFinite(invested) && invested > 0 ? invested : 0;
    });
    const weightTotal = weights.reduce((sum, value) => sum + value, 0) || funds.length || 1;
    const monthly = Number(sip.sipAmount);
    if (!Number.isFinite(monthly) || monthly <= 0) return;
    funds.forEach((fund, index) => {
      const key = productKeyFor(fund.schemeName);
      const share = weightTotal === funds.length && weights.every((value) => value === 0) ? 1 / funds.length : weights[index] / weightTotal;
      if (buckets[key]) buckets[key].monthly += monthly * share;
    });
  });

  const rows = PRODUCTS.map((product) => ({ ...product, ...buckets[product.key] }))
    .filter((row) => !row.fundedOnly || row.invested > 0 || row.current > 0)
    .sort((a, b) => {
      const aValue = a.current > 0 ? a.current : a.invested;
      const bValue = b.current > 0 ? b.current : b.invested;
      const aFunded = aValue > 0;
      const bFunded = bValue > 0;
      if (aFunded !== bFunded) return aFunded ? -1 : 1;
      return bValue - aValue;
    });
  const basis = rows.some((row) => row.current > 0) ? "current" : "invested";
  const pcts = shares(rows.map((row) => row[basis]));
  const segments = rows
    .map((row, index) => ({ ...row, pct: pcts[index], color: COLORS[index % COLORS.length] }))
    .filter((row) => row.pct > 0);

  return { summary, rows: rows.map((row, index) => ({ ...row, pct: pcts[index], color: COLORS[index % COLORS.length] })), segments };
}

function Donut({ segments }) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden="true">
      <circle cx="56" cy="56" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="14" />
      {segments.map((segment) => {
        const length = (segment.pct / 100) * circ;
        const node = (
          <circle
            key={segment.key}
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth="14"
            strokeDasharray={`${Math.max(length - 1.5, 0)} ${circ}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 56 56)"
          />
        );
        offset += length;
        return node;
      })}
    </svg>
  );
}

export function AllocationBar({ onStart }) {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadPortfolio(), loadMySips()])
      .then(([portfolio, sips]) => {
        if (!cancelled) setModel(buildAllocation(portfolio, sips));
      })
      .catch(() => {
        if (!cancelled) setModel(buildAllocation(null, []));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = model?.summary;
  const segments = model?.segments || [];
  const rows = model?.rows || [];
  const returns = Number(summary?.returns);
  const returnsUp = Number.isFinite(returns) && returns >= 0;
  const ReturnsIcon = returnsUp ? ArrowUp : ArrowDown;
  const productCount = segments.length;

  return (
    <div className="bg-white border border-border rounded-card p-5 shadow-card mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-ink">Where Your Money Is</div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-1 text-[13px] font-medium text-muted hover:text-ink"
        >
          {open ? "Hide breakdown" : "View breakdown"}
          <ChevronDown size={16} className={open ? "rotate-180" : ""} />
        </button>
      </div>
      <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-4 bg-surface">
        {segments.map((segment) => (
          <div key={segment.key} style={{ width: `${segment.pct}%`, background: segment.color }} className="rounded-full" />
        ))}
      </div>
      <div className="flex flex-wrap gap-5">
        {segments.map((segment) => (
          <div key={segment.key} className="flex items-center gap-2 text-[13px] text-secondary">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: segment.color }} />
            {segment.label} <span className="font-semibold text-ink ml-0.5">{segment.pct}%</span>
          </div>
        ))}
      </div>

      {open && (
        <div className="mt-5 pt-5 border-t border-border">
          <div className="flex items-baseline gap-2">
            <div className="text-[28px] font-bold text-ink tracking-tight">
              {summary ? money(summary.totalCurrentValue) : "—"}
            </div>
            {summary && Number.isFinite(returns) && (
              <div className={`flex items-center gap-1 text-sm font-semibold ${returnsUp ? "text-emerald" : "text-red-600"}`}>
                <ReturnsIcon size={14} />
                {money(returns)} · {Math.abs(Number(summary.returnsPercentage) || 0).toFixed(1)}%
              </div>
            )}
          </div>
          <div className="text-sm text-muted mt-1 mb-5">
            {summary ? `${money(summary.totalInvested)} invested across ${productCount} product${productCount === 1 ? "" : "s"}` : "—"}
          </div>

          {segments.length > 0 && (
            <div className="flex flex-col xs:flex-row xs:items-center gap-5 xs:gap-8 bg-surface rounded-card px-4 sm:px-6 py-5 mb-2">
              <Donut segments={segments} />
              <div className="flex flex-col gap-2.5 min-w-0">
                {segments.map((segment) => (
                  <div key={segment.key} className="flex items-center gap-2 text-[13px] text-secondary">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: segment.color }} />
                    <span className="truncate">{segment.label}</span>
                    <span className="font-semibold text-ink shrink-0">{segment.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            {rows.map((row) => {
              const funded = row.invested > 0 || row.current > 0;
              const parts = [
                row.monthly > 0 ? `${money(row.monthly)}/month` : "",
                funded ? `${money(row.invested)} invested` : "",
                funded ? `${row.pct}%` : "",
              ].filter(Boolean);
              return (
                <div key={row.key} className="py-4 border-t border-border">
                  <div className="flex items-start gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: funded ? row.color : "#D4D4D4" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-ink">{row.label}</div>
                      <div className="text-xs text-muted mt-0.5">
                        {funded ? parts.join(" · ") : `Not started${row.emptyHint ? ` · ${row.emptyHint}` : ""}`}
                      </div>
                      {funded && row.funds.length > 0 && (
                        <div className="mt-3 pl-3 border-l border-border space-y-1.5">
                          {row.funds.map((fund) => (
                            <div key={fund} className="text-[13px] text-secondary">{fund}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    {funded ? (
                      <div className="text-sm font-bold text-ink shrink-0">{money(row.current || row.invested)}</div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onStart?.(row.key)}
                        className="text-sm font-semibold text-emerald shrink-0"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AMC Strip ───
export function AMCStrip() {
  const doubled = [...amcPartners, ...amcPartners]; // seamless loop
  return (
    <div className="bg-white border border-border rounded-card px-4 sm:px-5 py-4 shadow-card mb-8 overflow-hidden">
      <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-3">
        Invest in Funds from
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-6 sm:gap-8 animate-marquee">
          {doubled.map((amc, i) => (
            <div
              key={`${amc.name}-${i}`}
              className="flex items-center gap-2 text-sm font-medium text-secondary whitespace-nowrap shrink-0"
            >
              <img
                src={amc.src}
                alt=""
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md object-contain bg-white shrink-0"
              />
              <span>{amc.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Relationship Manager Card ───
export function RMCard({ manager }) {
  const name = manager?.name || "—";
  const initials = manager?.initials || "—";
  const actions = [
    { icon: Phone, label: "Call", href: manager?.phone ? `tel:${manager.phone}` : "" },
    { icon: Video, label: "GMeet", href: "" },
    { icon: Mail, label: "Email", href: manager?.email ? `mailto:${manager.email}` : "" },
  ];

  return (
    <div className="bg-white border border-border rounded-card shadow-card overflow-hidden h-full">
      <div className="h-[72px]" style={{ background: jadeGradient }} />
      <div className="px-6 pb-6 relative">
        <div className="w-16 h-16 rounded-full bg-jade text-white text-[22px] font-bold flex items-center justify-center border-[3px] border-white -mt-8 relative overflow-hidden">
          {manager?.photo ? (
            <img src={manager.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white absolute top-[24px] left-[72px]" />
        <div className="flex items-center gap-1.5 mt-2.5 mb-0.5">
          <span className="text-lg font-bold text-ink">{name}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0C4A3E" stroke="none">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mt-0.5">
          Relationship Manager
        </div>
        {manager?.description ? (
          <p className="text-[13px] text-secondary leading-relaxed mt-2.5">
            {manager.description}
          </p>
        ) : null}
        <div className="flex gap-2 mt-4">
          {actions.map(({ icon: Icon, label, href }) => {
            const className = "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-btn border border-border bg-white text-[13px] font-semibold text-ink hover:bg-surface transition-colors";
            if (!href) {
              return (
                <button key={label} type="button" className={className}>
                  <Icon size={16} />
                  {label}
                </button>
              );
            }
            return (
              <a key={label} href={href} className={className}>
                <Icon size={16} />
                {label}
              </a>
            );
          })}
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
          type="button"
          onClick={() => onGoalClick?.({
            name: "Emergency Fund",
            years: 2,
            cagr: 8,
            sub: "Your safety net",
            badge: "Up to 3 years",
            icon: "/dreams/goals/05-Emergency-Fund.png",
          })}
          className="flex items-center gap-3 px-4 py-3.5 bg-white border border-border rounded-card shadow-card hover:shadow-elevated hover:border-border-mid hover:-translate-y-px transition-all text-left"
        >
          <div className="w-[42px] h-[42px] rounded-[11px] bg-tint flex items-center justify-center shrink-0 overflow-hidden">
            <img src="/dreams/goals/05-Emergency-Fund.png" alt="" className="w-7 h-7 object-contain" />
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
          type="button"
          onClick={() => onGoalClick?.({
            name: "Retirement",
            years: 25,
            cagr: 12,
            sub: "Peaceful life after work",
            badge: "7+ years",
            icon: "/dreams/goals/14-Retirement.png",
          })}
          className="flex items-center gap-3 px-4 py-3.5 bg-white border border-border rounded-card shadow-card hover:shadow-elevated hover:border-border-mid hover:-translate-y-px transition-all text-left"
        >
          <div className="w-[42px] h-[42px] rounded-[11px] bg-tint flex items-center justify-center shrink-0 overflow-hidden">
            <img src="/dreams/goals/14-Retirement.png" alt="" className="w-7 h-7 object-contain" />
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
