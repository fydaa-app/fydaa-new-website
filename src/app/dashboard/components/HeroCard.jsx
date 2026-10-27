"use client";

import { useEffect, useState } from "react";
import { Headphones, ArrowUp, ArrowDown } from "lucide-react";
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
  if (!Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(2)}%`;
}

export default function HeroCard({ firstName }) {
  const [summary, setSummary] = useState(undefined);
  const [activeSips, setActiveSips] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    const token = getAccessToken();
    if (!token) {
      setSummary(null);
      setActiveSips(0);
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
        if (cancelled || data?.error) return;
        const body = data?.summary ? data : data?.data;
        setSummary(body?.summary || null);
        const sips = Array.isArray(body?.sips) ? body.sips : [];
        setActiveSips(sips.filter((sip) => String(sip?.status || "").toUpperCase() === "ACTIVE").length);
      })
      .catch(() => {
        if (!cancelled) {
          setSummary(null);
          setActiveSips(0);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const returns = Number(summary?.returns);
  const returnsUp = Number.isFinite(returns) && returns >= 0;
  const ReturnsIcon = returnsUp ? ArrowUp : ArrowDown;

  return (
    <div
      className="rounded-card overflow-hidden mb-5 sm:mb-7 text-white relative"
      style={{ background: jadeGradient }}
    >
      <div className="flex items-center justify-between gap-3 px-4 sm:px-7 pt-5 sm:pt-6 pb-3 relative z-10">
        <span className="text-sm sm:text-[15px] font-medium text-white/85 truncate">
          Hi, <b className="font-bold text-white">{firstName || "—"}</b>
        </span>
        <button
          type="button"
          className="flex items-center gap-1.5 text-[11px] font-semibold text-white/80 bg-white/10 border border-white/12 px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-white/18 transition-all shrink-0"
        >
          <Headphones size={14} />
          <span className="hidden xs:inline">Adviser</span>
        </button>
      </div>

      <div className="flex flex-col xs:flex-row justify-between items-start gap-4 px-4 sm:px-7 relative z-10">
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs text-white/45 font-medium uppercase tracking-wider mb-1">
            Total Portfolio Value
          </div>
          <div className="text-[28px] sm:text-[34px] 4xl:text-[40px] font-bold tracking-tight leading-none break-all">
            {summary === undefined ? "…" : inr(summary?.totalCurrentValue)}
          </div>
        </div>
        <div className="text-left xs:text-right shrink-0">
          <div className={`text-lg sm:text-xl font-semibold flex items-center gap-1.5 xs:justify-end ${!summary ? "text-white" : returnsUp ? "text-emerald-300" : "text-[#FC8181]"}`}>
            {summary ? <ReturnsIcon size={16} /> : null}
            {summary === undefined ? "…" : signedPct(summary?.returnsPercentage)}
          </div>
          <div className="text-xs text-white/50 mt-0.5">
            {summary === undefined ? "…" : `${inr(summary?.returns)} returns`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:flex mt-4 sm:mt-5 border-t border-white/8 relative z-10">
        {[
          { label: "Invested", value: summary === undefined ? "…" : inr(summary?.totalInvested) },
          { label: "Active SIPs", value: activeSips == null ? "…" : String(activeSips) },
          { label: "XIRR", value: summary === undefined ? "…" : signedPct(summary?.xirrPercentage) },
          { label: "Day Change", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="py-3 sm:py-4 px-4 sm:px-5 border-r border-b sm:border-b-0 border-white/6 last:border-r-0 even:border-r-0 sm:even:border-r sm:[&:nth-child(2)]:border-r sm:last:border-r-0"
          >
            <div className="text-[10px] text-white/35 font-medium uppercase tracking-wider">
              {stat.label}
            </div>
            <div className="text-[15px] sm:text-[17px] font-bold tracking-tight mt-0.5 text-white/90 truncate">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
