"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { endSession, getAccessToken } from "../../signup/lib/authApi";
import { STOCK_BASE } from "../../signup/lib/apiHosts";

const FILTERS = ["All", "Successful", "Pending", "Failed", "Dividend"];

function inr(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function kindOf(type) {
  const value = String(type || "").toLowerCase();
  if (value === "redemption") return "sell";
  if (value === "dividend_reinvestment") return "dividend";
  return "buy";
}

function typeLabel(tx) {
  const value = String(tx?.type || "").toLowerCase();
  if (value === "dividend_reinvestment") return "Dividend reinvested · Direct";
  if (value === "redemption") return "Sell / Withdraw";
  if (value === "additional_purchase") return "SIP · Direct Plan";
  if (value === "purchase") return "Buy · Direct Plan";
  return value.replace(/_/g, " ") || "—";
}

function statusOf(tx) {
  const state = String(tx?.state || tx?.orderStatus || "").toLowerCase();
  if (state === "successful") return { label: "Successful", tone: "ok", filter: "Successful" };
  if (state === "failed") return { label: "Failed", tone: "bad", filter: "Failed" };
  return { label: "Pending", tone: "wait", filter: "Pending" };
}

function matchesFilter(tx, filter) {
  if (filter === "All") return true;
  if (filter === "Dividend") return kindOf(tx?.type) === "dividend";
  return statusOf(tx).filter === filter;
}

function dayLabel(date) {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function monthLabel(year, month) {
  return new Date(year, month, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function monthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export default function HistoryPage() {
  const [rows, setRows] = useState(undefined);
  const [openTx, setOpenTx] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [monthIndex, setMonthIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const token = getAccessToken();
    if (!token) {
      setRows([]);
      return undefined;
    }
    fetch(`${STOCK_BASE}mutualFund/user/transactions`, {
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
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setRows(list);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const months = useMemo(() => {
    const map = new Map();
    (rows || []).forEach((tx) => {
      const created = new Date(tx?.createdAt);
      if (Number.isNaN(created.getTime())) return;
      const key = monthKey(created);
      if (!map.has(key)) {
        map.set(key, { key, year: created.getFullYear(), month: created.getMonth(), items: [] });
      }
      map.get(key).items.push(tx);
    });
    return [...map.values()].sort((a, b) => (a.year - b.year) || (a.month - b.month)).reverse();
  }, [rows]);

  const selected = months[monthIndex] || null;
  const monthItems = selected?.items || [];

  const summary = useMemo(() => {
    let invested = 0;
    let dividends = 0;
    let withdrawn = 0;
    monthItems.forEach((tx) => {
      const amount = Number(tx?.amount);
      if (!Number.isFinite(amount)) return;
      const state = String(tx?.state || tx?.orderStatus || "").toLowerCase();
      if (state !== "successful") return;
      const kind = kindOf(tx?.type);
      if (kind === "buy") invested += amount;
      else if (kind === "dividend") dividends += amount;
      else if (kind === "sell") withdrawn += amount;
    });
    return { count: monthItems.length, invested, dividends, withdrawn };
  }, [monthItems]);

  const groups = useMemo(() => {
    const map = new Map();
    monthItems.forEach((tx) => {
      if (!matchesFilter(tx, activeFilter)) return;
      const created = new Date(tx?.createdAt);
      const key = Number.isNaN(created.getTime()) ? "—" : dayLabel(created);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(tx);
    });
    return [...map.entries()].map(([date, items]) => ({
      date,
      items: items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    }));
  }, [monthItems, activeFilter]);

  const loading = rows === undefined;
  const title = selected ? monthLabel(selected.year, selected.month) : monthLabel(new Date().getFullYear(), new Date().getMonth());

  return (
    <div className="px-10 py-8 max-w-[1200px]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-ink">Transaction History</h2>
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={!selected || monthIndex >= months.length - 1}
            onClick={() => setMonthIndex((index) => Math.min(months.length - 1, index + 1))}
            className="w-9 h-9 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center disabled:opacity-40"
          >
            <ChevronLeft size={16} className="text-tertiary" />
          </button>
          <span className="text-lg font-bold text-ink tracking-tight min-w-[140px] text-center">{title}</span>
          <button
            type="button"
            disabled={!selected || monthIndex <= 0}
            onClick={() => setMonthIndex((index) => Math.max(0, index - 1))}
            className="w-9 h-9 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center disabled:opacity-40"
          >
            <ChevronRight size={16} className="text-tertiary" />
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        {[
          { v: loading ? "…" : String(summary.count), k: "Transactions" },
          { v: loading ? "…" : inr(summary.invested), k: "Invested" },
          { v: loading ? "…" : inr(summary.dividends), k: "Dividends", green: true },
          { v: loading ? "…" : inr(summary.withdrawn), k: "Withdrawn" },
        ].map((s) => (
          <div key={s.k} className="flex-1 bg-white border border-border rounded-card px-4 py-3.5 text-center shadow-card">
            <div className={`text-xl font-bold tracking-tight ${s.green ? "text-emerald" : "text-ink"}`}>{s.v}</div>
            <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-0.5">{s.k}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeFilter === f
                ? "bg-jade text-white border-jade"
                : "bg-white text-secondary border-border hover:border-border-mid"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {!loading && groups.length === 0 && (
        <div className="text-sm text-muted py-8 text-center">No transactions this month</div>
      )}

      {groups.map((group) => (
        <div key={group.date}>
          <div className="text-xs font-medium text-muted mt-4 mb-2">{group.date}</div>
          {group.items.map((tx) => {
            const txKey = String(tx.orderId || tx.id);
            const isOpen = openTx === txKey;
            const kind = kindOf(tx.type);
            const status = statusOf(tx);
            const units = tx.units ?? tx.processed_units;
            const when = tx.succeededAt || tx.failedAt || tx.createdAt;
            const whenDate = when ? new Date(when) : null;
            const whenLabel = whenDate && !Number.isNaN(whenDate.getTime())
              ? whenDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              : "—";
            const unitsLabel = kind === "sell" ? "Units withdrawn" : "Units added";
            return (
              <div key={txKey} className="bg-white border border-border rounded-card mb-2 shadow-card overflow-hidden transition-all">
                <div
                  className="flex items-center gap-3.5 px-4 py-3.5 cursor-pointer hover:bg-bg transition-colors"
                  onClick={() => setOpenTx(isOpen ? null : txKey)}
                >
                  <div className={`w-[38px] h-[38px] rounded-btn flex items-center justify-center shrink-0 ${
                    kind === "buy" ? "bg-tint text-emerald" : kind === "dividend" ? "bg-indigo-50 text-indigo-500" : "bg-red-50 text-red-600"
                  }`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      {kind === "sell" ? (
                        <><circle cx="12" cy="12" r="10" /><polyline points="8 12 12 16 16 12" /><line x1="12" y1="8" x2="12" y2="16" /></>
                      ) : kind === "buy" ? (
                        <><circle cx="12" cy="12" r="10" /><polyline points="16 12 12 8 8 12" /><line x1="12" y1="16" x2="12" y2="8" /></>
                      ) : (
                        <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>
                      )}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink truncate">{tx.schemeName || "—"}</div>
                    <div className="text-xs text-muted mt-0.5">{typeLabel(tx)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-ink">{inr(tx.amount)}</div>
                    <div className={`text-[10px] font-medium mt-0.5 flex items-center justify-end gap-1 ${
                      status.tone === "ok" ? "text-emerald" : status.tone === "bad" ? "text-red-600" : "text-muted"
                    }`}>
                      <span className={`w-[5px] h-[5px] rounded-full ${
                        status.tone === "ok" ? "bg-emerald" : status.tone === "bad" ? "bg-red-600" : "bg-muted"
                      }`} />
                      {status.label}
                    </div>
                  </div>
                </div>
                {isOpen && (
                  <div className="px-4 pb-3.5 border-t border-bg">
                    {[
                      ["Amount", inr(tx.amount)],
                      [unitsLabel, units == null || units === "" ? "—" : String(units)],
                      ["NAV", tx.price == null || tx.price === "" ? "—" : inr(tx.price)],
                      [status.label, whenLabel],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 border-b border-bg last:border-b-0 text-[13px]">
                        <span className="text-muted">{k}</span>
                        <span className="text-ink font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
