"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Headphones } from "lucide-react";
import { jadeGradient } from "../lib/tokens";
import { endSession, getAccessToken } from "../../signup/lib/authApi";
import { STOCK_BASE } from "../../signup/lib/apiHosts";

function inr(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  const sign = n < 0 ? "−" : "";
  const formatted = Math.abs(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}₹${formatted}`;
}

function signedPct(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "";
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `(${sign}${Math.abs(n).toFixed(2)}%)`;
}

export default function HeroCard({ firstName, onAdviserClick, onPortfolioClick }) {
  const [summary, setSummary] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    const token = getAccessToken();
    if (!token) {
      setSummary(null);
      return undefined;
    }
    fetch(`${STOCK_BASE}mutualFund/portfolio/details`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          endSession();
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (!data || data?.error) {
          setSummary(null);
          return;
        }
        const body = data?.summary ? data : data?.data;
        setSummary(body?.summary || null);
      })
      .catch(() => {
        if (!cancelled) setSummary(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const returns = Number(summary?.returns);
  const returnsUp = Number.isFinite(returns) && returns >= 0;
  const loading = summary === undefined;

  return (
    <div
      className="rounded-card overflow-hidden mb-5 sm:mb-7 text-white relative"
      style={{ background: jadeGradient }}
      aria-busy={loading}
    >
      <div className="flex items-center justify-between gap-3 px-4 sm:px-7 pt-5 sm:pt-6 pb-4 relative z-10">
        <span className="text-sm sm:text-[15px] font-medium text-white/85 truncate">
          Hi,{" "}
          <b className="font-bold text-white">
            {firstName && firstName !== "…" ? firstName : loading ? (
              <span className="inline-block w-20 h-4 rounded bg-white/20 animate-pulse align-middle" />
            ) : (
              "—"
            )}
          </b>
        </span>
        <button
          type="button"
          onClick={onAdviserClick}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-white/80 bg-white/10 border border-white/12 px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-white/18 transition-all shrink-0"
        >
          <Headphones size={14} />
          <span className="hidden xs:inline">Adviser</span>
        </button>
      </div>

      {loading ? (
        <div
          className="relative z-10 px-4 sm:px-7 pb-6 sm:pb-7 min-h-[88px] sm:min-h-[100px] flex flex-col items-center justify-center gap-3"
          role="status"
          aria-live="polite"
        >
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white/25 border-t-white animate-spin"
            aria-hidden="true"
          />
          <span className="text-xs sm:text-sm text-white/70 font-medium">Loading portfolio…</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPortfolioClick}
          className="w-full flex items-center gap-1 relative z-10 px-2 sm:px-4 pb-5 sm:pb-6 text-left hover:bg-white/[0.04] transition-colors"
          aria-label="View portfolio"
        >
          <div className="grid grid-cols-3 flex-1 min-w-0">
            {[
              {
                label: "Invested",
                value: inr(summary?.totalInvested),
                sub: null,
                tone: "text-white",
              },
              {
                label: "Current",
                value: inr(summary?.totalCurrentValue),
                sub: null,
                tone: "text-white",
              },
              {
                label: "Returns",
                value: inr(summary?.returns),
                sub: signedPct(summary?.returnsPercentage),
                tone: !summary
                  ? "text-white"
                  : returnsUp
                    ? "text-emerald-300"
                    : "text-[#FC8181]",
              },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`px-2.5 sm:px-4 ${index > 0 ? "border-l border-white/10" : ""}`}
              >
                <div className="text-[10px] sm:text-xs text-white/45 font-medium uppercase tracking-wider mb-1.5">
                  {stat.label}
                </div>
                <div
                  className={`text-[15px] sm:text-[20px] 4xl:text-[22px] font-bold tracking-tight leading-tight break-all ${stat.tone}`}
                >
                  {stat.value}
                </div>
                {stat.sub ? (
                  <div className={`text-[11px] sm:text-xs mt-0.5 font-medium ${stat.tone}`}>
                    {stat.sub}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <span className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 mr-1 sm:mr-2 rounded-full border border-emerald-300/50 bg-white/10 flex items-center justify-center">
            <ArrowRight size={18} className="text-white" strokeWidth={2.2} />
          </span>
        </button>
      )}
    </div>
  );
}
