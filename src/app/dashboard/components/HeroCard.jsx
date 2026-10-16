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
      className="rounded-card overflow-hidden mb-7 text-white relative"
      style={{ background: jadeGradient }}
    >
      <div className="flex items-center justify-between px-7 pt-6 pb-3 relative z-10">
        <span className="text-[15px] font-medium text-white/85">
          Hi, <b className="font-bold text-white">{firstName || "—"}</b>
        </span>
        <button className="flex items-center gap-1.5 text-[11px] font-semibold text-white/80 bg-white/10 border border-white/12 px-3 py-1.5 rounded-full hover:bg-white/18 transition-all">
          <Headphones size={14} />
          Adviser
        </button>
      </div>

      <div className="flex justify-between items-start px-7 relative z-10">
        <div>
          <div className="text-xs text-white/45 font-medium uppercase tracking-wider mb-1">
            Total Portfolio Value
          </div>
          <div className="text-[34px] font-bold tracking-tight leading-none">
            {summary === undefined ? "…" : inr(summary?.totalCurrentValue)}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xl font-semibold flex items-center gap-1.5 justify-end ${!summary ? "text-white" : returnsUp ? "text-emerald-300" : "text-[#FC8181]"}`}>
            {summary ? <ReturnsIcon size={16} /> : null}
            {summary === undefined ? "…" : signedPct(summary?.returnsPercentage)}
          </div>
          <div className="text-xs text-white/50 mt-0.5">
            {summary === undefined ? "…" : `${inr(summary?.returns)} returns`}
          </div>
        </div>
      </div>

      <div className="flex mt-5 border-t border-white/8 relative z-10">
        {[
          { label: "Invested", value: summary === undefined ? "…" : inr(summary?.totalInvested) },
          { label: "Active SIPs", value: activeSips == null ? "…" : String(activeSips) },
          { label: "XIRR", value: summary === undefined ? "…" : signedPct(summary?.xirrPercentage) },
          { label: "Day Change", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="flex-1 py-4 px-5 border-r border-white/6 last:border-r-0">
            <div className="text-[10px] text-white/35 font-medium uppercase tracking-wider">
              {stat.label}
            </div>
            <div className="text-[17px] font-bold tracking-tight mt-0.5 text-white/90">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
