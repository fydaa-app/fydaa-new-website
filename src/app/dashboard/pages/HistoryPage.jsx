"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { endSession, getAccessToken } from "../../signup/lib/authApi";
import { STOCK_BASE } from "../../signup/lib/apiHosts";

const FILTERS = [
  { id: "All", dot: "" },
  { id: "Successful", dot: "bg-emerald" },
  { id: "Pending", dot: "bg-indigo-500" },
  { id: "Failed", dot: "bg-red-600" },
  { id: "External", dot: "bg-neutral-400" },
];

const SUCCESS = new Set(["SUCCESSFUL", "COMPLETED", "SUCCESS"]);
const FAILED = new Set(["FAILED", "ERRORED", "ERROR"]);

let realityChecked = false;

function createdDate(tx) {
  const date = new Date(tx?.createdAt);
  return Number.isNaN(date.getTime()) ? null : date;
}

function stateOf(tx) {
  return String(tx?.state ?? "").trim().toUpperCase();
}

function isExternal(tx) {
  return tx?.isExternal === true || String(tx?.source || "").toLowerCase() === "external";
}

function isBuyLike(type) {
  return !/REDEEM|SELL|WITHDRAW/i.test(String(type || ""));
}

function inMonth(tx, year, month) {
  const date = createdDate(tx);
  if (!date) return true;
  return date.getFullYear() === year && date.getMonth() === month;
}

function asTransactions(data) {
  if (!data || typeof data !== "object") return [];
  if (data.error) return [];
  const lists = [
    data,
    data.data,
    data.data?.transactions,
    data.transactions,
    Object.values(data).find((value) => Array.isArray(value)),
  ];
  const list = lists.find((value) => Array.isArray(value));
  return (list || []).filter((row) => row && typeof row === "object" && !Array.isArray(row));
}

async function authed(path, method = "GET") {
  const token = getAccessToken();
  if (!token) return { missing: true };
  const res = await fetch(`${STOCK_BASE}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    endSession();
    return { expired: true };
  }
  const data = await res.json().catch(() => null);
  return { ok: res.ok, data };
}

async function loadActivity() {
  if (!getAccessToken()) return { list: [], message: "Could not load transactions." };
  if (!realityChecked) {
    const details = await authed("mutualFund/portfolio/details");
    if (details.expired) return { list: [], message: "" };
    if (!details.missing) {
      const body = details.data?.summary || details.data?.holdings ? details.data : details.data?.data;
      const holdings = body?.holdings;
      if (!Array.isArray(holdings) || holdings.length === 0) {
        await authed("mutualFund/portfolio/sync-reality", "POST");
      }
    }
    realityChecked = true;
  }
  const result = await authed("mutualFund/user/transactions");
  if (result.missing || result.expired) return { list: [], message: result.missing ? "Could not load transactions." : "" };
  if (!result.ok || result.data?.error) {
    return { list: [], message: result.data?.message || "Could not load transactions." };
  }
  return { list: asTransactions(result.data), message: "" };
}

function compactInr(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  const trim = (value) => value.toFixed(2).replace(/\.?0+$/, "");
  if (abs >= 100000) return `₹${trim(abs / 100000)}L`;
  if (abs >= 1000) return `₹${trim(abs / 1000)}K`;
  return `₹${abs.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function rowInr(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  const digits = Number.isInteger(n) ? 0 : 2;
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: 2 })}`;
}

function typeLabel(type) {
  const raw = String(type || "").replace(/_/g, " ").trim();
  if (!raw) return "—";
  return raw.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function cardStatus(tx) {
  const state = stateOf(tx);
  if (SUCCESS.has(state)) return { label: "Completed", tone: "ok" };
  if (state === "SUBMITTED" || state === "PENDING" || state === "") return { label: "Processing", tone: "wait" };
  if (FAILED.has(state)) return { label: "Failed", tone: "bad" };
  return { label: String(tx?.state || "—"), tone: "muted" };
}

function matchesFilter(tx, filter) {
  if (filter === "External") return isExternal(tx);
  if (isExternal(tx)) return false;
  const state = stateOf(tx);
  if (filter === "All") return true;
  if (filter === "Successful") return SUCCESS.has(state);
  if (filter === "Pending") return state === "PENDING" || state === "SUBMITTED" || state === "";
  if (filter === "Failed") return FAILED.has(state);
  return false;
}

function iconKind(tx) {
  const state = stateOf(tx);
  const type = String(tx?.type || "").toUpperCase();
  if (state === "PENDING" || state === "SUBMITTED" || state === "") return "pending";
  if (/REDEEM|SELL|WITHDRAW/.test(type)) return "sell";
  if (type.includes("DIVIDEND")) return "dividend";
  return "buy";
}

function dayHeading(date) {
  if (!date) return "Unknown date";
  const start = (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const today = new Date();
  const diff = Math.round((start(today) - start(date)) / 86400000);
  const rest = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  if (diff === 0) return `Today, ${rest}`;
  if (diff === 1) return `Yesterday, ${rest}`;
  return rest;
}

function formatWhen(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function sameDay(a, b) {
  const left = new Date(a);
  const right = new Date(b);
  if (Number.isNaN(left.getTime()) || Number.isNaN(right.getTime())) return false;
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

function timeline(state) {
  if (state === "SUBMITTED") {
    return [
      { label: "Placed", done: true },
      { label: "Paid", done: true },
      { label: "Units allotting", active: true },
      { label: "Done" },
    ];
  }
  if (state === "PENDING" || state === "") {
    return [
      { label: "Placed", done: true },
      { label: "Payment", active: true },
      { label: "Units allotting" },
      { label: "Done" },
    ];
  }
  return null;
}

function detailRows(tx) {
  const rows = [];
  if (tx.orderId) rows.push(["Order ID", String(tx.orderId)]);
  if (tx.type) rows.push(["Type", typeLabel(tx.type)]);
  if (tx.amount != null && tx.amount !== "") rows.push(["Amount", rowInr(tx.amount)]);
  if (tx.processed_amount != null && tx.processed_amount !== "" && Number(tx.processed_amount) !== Number(tx.amount)) {
    rows.push(["Processed Amount", rowInr(tx.processed_amount)]);
  }
  if (tx.units != null && tx.units !== "") rows.push(["Units", String(tx.units)]);
  if (tx.processed_units != null && tx.processed_units !== "" && Number(tx.processed_units) !== Number(tx.units)) {
    rows.push(["Processed Units", String(tx.processed_units)]);
  }
  if (tx.price != null && tx.price !== "") rows.push(["Price per Unit", rowInr(tx.price)]);
  if (tx.scheme) rows.push(["Scheme Code", String(tx.scheme)]);
  const created = formatWhen(tx.createdAt);
  if (created) rows.push(["Date", created]);
  const succeeded = formatWhen(tx.succeededAt);
  if (succeeded && !sameDay(tx.succeededAt, tx.createdAt)) rows.push(["Succeeded At", succeeded]);
  return rows;
}

function shiftMonth(cursor, delta) {
  const date = new Date(cursor.year, cursor.month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

export default function HistoryPage() {
  const [rows, setRows] = useState(undefined);
  const [error, setError] = useState("");
  const [openTx, setOpenTx] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [snapped, setSnapped] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadActivity()
      .then((result) => {
        if (cancelled) return;
        setRows(result.list);
        setError(result.message);
      })
      .catch(() => {
        if (!cancelled) {
          setRows([]);
          setError("Could not load transactions.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (rows === undefined || snapped) return;
    const hasCurrent = rows.some((tx) => inMonth(tx, cursor.year, cursor.month));
    if (!hasCurrent && rows.length > 0) {
      let latest = null;
      rows.forEach((tx) => {
        const date = createdDate(tx);
        if (date && (!latest || date > latest)) latest = date;
      });
      if (latest) setCursor({ year: latest.getFullYear(), month: latest.getMonth() });
    }
    setSnapped(true);
  }, [rows, snapped, cursor]);

  const monthItems = useMemo(
    () => (rows || []).filter((tx) => inMonth(tx, cursor.year, cursor.month)),
    [rows, cursor],
  );

  const summary = useMemo(() => {
    let invested = 0;
    let progress = 0;
    monthItems.forEach((tx) => {
      const state = stateOf(tx);
      if (state === "PENDING" || state === "SUBMITTED" || state === "") progress += 1;
      const amount = Number(tx.amount);
      if (SUCCESS.has(state) && isBuyLike(tx.type) && Number.isFinite(amount)) invested += amount;
    });
    return { orders: monthItems.length, invested, progress };
  }, [monthItems]);

  const groups = useMemo(() => {
    const grouped = [];
    const index = new Map();
    monthItems.forEach((tx) => {
      if (!matchesFilter(tx, activeFilter)) return;
      const date = createdDate(tx);
      const label = dayHeading(date);
      if (!index.has(label)) {
        index.set(label, grouped.length);
        grouped.push({ label, stamp: date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() : null, items: [] });
      }
      grouped[index.get(label)].items.push(tx);
    });
    return grouped.sort((a, b) => {
      if (a.stamp == null) return 1;
      if (b.stamp == null) return -1;
      return b.stamp - a.stamp;
    });
  }, [monthItems, activeFilter]);

  const loading = rows === undefined;
  const title = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="px-10 py-8 max-w-[1200px]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-ink">Activity</h2>
          <p className="text-sm text-muted mt-0.5">Your investment transactions</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => { setCursor((current) => shiftMonth(current, -1)); setOpenTx(null); }}
            className="w-9 h-9 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center"
          >
            <ChevronLeft size={16} className="text-tertiary" />
          </button>
          <span className="text-lg font-bold text-ink tracking-tight min-w-[140px] text-center">{title}</span>
          <button
            type="button"
            onClick={() => { setCursor((current) => shiftMonth(current, 1)); setOpenTx(null); }}
            className="w-9 h-9 rounded-btn border border-border bg-white hover:bg-surface flex items-center justify-center"
          >
            <ChevronRight size={16} className="text-tertiary" />
          </button>
        </div>
      </div>

      {error ? <div className="text-sm text-red-600 mb-4">{error}</div> : null}

      <div className="flex gap-3 mb-4">
        {[
          { v: loading ? "…" : String(summary.orders), k: "Orders" },
          { v: loading ? "…" : compactInr(summary.invested), k: "Invested", green: true },
          { v: loading ? "…" : String(summary.progress), k: "In progress" },
        ].map((item) => (
          <div key={item.k} className="flex-1 bg-white border border-border rounded-card px-4 py-3.5 text-center shadow-card">
            <div className={`text-xl font-bold tracking-tight ${item.green ? "text-emerald" : "text-ink"}`}>{item.v}</div>
            <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-0.5">{item.k}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {FILTERS.map((filter) => {
          const selected = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => { setActiveFilter(filter.id); setOpenTx(null); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all inline-flex items-center gap-1.5 ${
                selected ? "bg-jade text-white border-jade" : "bg-white text-secondary border-border hover:border-border-mid"
              }`}
            >
              {filter.dot && !selected ? <span className={`w-1.5 h-1.5 rounded-full ${filter.dot}`} /> : null}
              {filter.id}
            </button>
          );
        })}
      </div>

      {loading && <div className="text-sm text-muted py-8 text-center">Loading transactions…</div>}

      {!loading && groups.length === 0 && (
        <div className="py-10 text-center">
          <div className="text-sm font-medium text-ink">No transactions found</div>
          <div className="text-sm text-muted mt-1">Try adjusting your filters</div>
        </div>
      )}

      {groups.map((group) => (
        <div key={group.label}>
          <div className="text-xs font-medium text-muted mt-4 mb-2">{group.label}</div>
          {group.items.map((tx, index) => {
            const txKey = String(tx.orderId || tx.id || `${group.label}-${index}`);
            const isOpen = openTx === txKey;
            const status = cardStatus(tx);
            const kind = iconKind(tx);
            const state = stateOf(tx);
            const steps = timeline(state);
            const Icon = kind === "pending" ? Clock : kind === "sell" ? ArrowDown : kind === "dividend" ? TrendingUp : ArrowUp;
            const iconClass = kind === "pending"
              ? "bg-amber-50 text-amber-600"
              : kind === "sell"
                ? "bg-red-50 text-red-600"
                : kind === "dividend"
                  ? "bg-indigo-50 text-indigo-500"
                  : "bg-tint text-emerald";
            const tone = status.tone === "ok" ? "text-emerald" : status.tone === "bad" ? "text-red-600" : status.tone === "wait" ? "text-indigo-500" : "text-muted";
            const dot = status.tone === "ok" ? "bg-emerald" : status.tone === "bad" ? "bg-red-600" : status.tone === "wait" ? "bg-indigo-500" : "bg-neutral-400";
            return (
              <div key={txKey} className="bg-white border border-border rounded-card mb-2 shadow-card overflow-hidden">
                <div
                  className="flex items-center gap-3.5 px-4 py-3.5 cursor-pointer hover:bg-bg"
                  onClick={() => setOpenTx(isOpen ? null : txKey)}
                >
                  <div className={`w-[38px] h-[38px] rounded-btn flex items-center justify-center shrink-0 ${iconClass}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink truncate">{tx.schemeName || "Mutual Fund"}</div>
                    <div className="text-xs text-muted mt-0.5">{typeLabel(tx.type)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-ink">{rowInr(tx.amount)}</div>
                    <div className={`text-[10px] font-medium mt-0.5 flex items-center justify-end gap-1 ${tone}`}>
                      <span className={`w-[5px] h-[5px] rounded-full ${dot}`} />
                      {status.label}
                    </div>
                  </div>
                </div>
                {isOpen && (
                  <div className="px-4 pb-3.5 border-t border-bg">
                    {state === "SUBMITTED" && (
                      <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 rounded-btn px-3 py-2 mt-3">
                        <Clock size={14} />
                        In progress · completes in 24–48 hrs
                      </div>
                    )}
                    {steps && (
                      <div className="flex items-center gap-2 mt-3 text-[11px] text-muted">
                        {steps.map((step, stepIndex) => (
                          <div key={step.label} className="flex items-center gap-2">
                            {stepIndex > 0 ? <span className="w-4 h-px bg-border" /> : null}
                            <span className={step.active ? "text-indigo-600 font-semibold" : step.done ? "text-emerald font-medium" : ""}>
                              {step.done ? "✓ " : ""}{step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {detailRows(tx).map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2 border-b border-bg last:border-b-0 text-[13px]">
                        <span className="text-muted">{label}</span>
                        <span className="text-ink font-medium">{value}</span>
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
