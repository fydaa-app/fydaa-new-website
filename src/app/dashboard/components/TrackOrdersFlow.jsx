"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  X,
} from "lucide-react";
import AdvisorTalkPage from "./AdvisorTalkPage";
import { PAGE_SHELL, PAGE_SHELL_NARROW, WIZARD_CTA } from "../lib/layoutClasses";
import { rupee } from "../lib/utils";
import {
  buildOrderTimeline,
  detailHeadline,
  detailHeadlineTone,
  fetchInProgressOrders,
  groupOrdersByGoal,
  orderCardKey,
  orderStatusTone,
  summarizeTrackableOrders,
} from "../lib/trackOrdersApi";

function money(n) {
  return rupee(Math.round(Number(n) || 0));
}

function formatPlacedAt(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function statusChipClass(tone) {
  if (tone === "success") return "bg-emerald-50 text-emerald-800";
  if (tone === "error") return "bg-red-50 text-red-700";
  if (tone === "warning") return "bg-amber-100 text-amber-900";
  return "bg-slate-100 text-slate-700";
}

function fundPaymentLine(fund) {
  const method = fund?.payment?.method || "";
  const status = fund?.payment?.status || fund?.status || "";
  const bits = ["Payment:", String(status || "—").toUpperCase()];
  if (method) bits.push(`· ${String(method).toUpperCase()}`);
  return bits.join(" ");
}

export default function TrackOrdersFlow({
  initialOrders = null,
  onBack,
  onOpenAdvisor,
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(!initialOrders);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [advisorOpen, setAdvisorOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    const result = await fetchInProgressOrders();
    setLoading(false);
    if (!result.ok) {
      setError(result.message || "Unable to load orders");
      setOrders([]);
      return;
    }
    setOrders(result.orders);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = summarizeTrackableOrders(orders || []);
  const groups = useMemo(() => groupOrdersByGoal(orders || []), [orders]);

  if (advisorOpen) {
    return (
      <AdvisorTalkPage
        onBack={() => {
          setAdvisorOpen(false);
          onOpenAdvisor?.();
        }}
      />
    );
  }

  if (selected) {
    return (
      <OrderDetail
        order={selected}
        onBack={() => setSelected(null)}
        onTalkAdvisor={() => setAdvisorOpen(true)}
      />
    );
  }

  return (
    <div className={PAGE_SHELL}>
      <div className="flex items-start gap-3 mb-6 4xl:mb-8">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 4xl:w-11 4xl:h-11 rounded-full border border-border bg-white flex items-center justify-center shrink-0 hover:bg-surface"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0 pt-0.5">
          <h1 className="text-xl sm:text-2xl lg:text-[28px] 4xl:text-[32px] font-bold text-ink tracking-tight">Track your orders</h1>
          <p className="text-sm 4xl:text-[15px] text-muted mt-0.5">Follow your investment order status.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 4xl:grid-cols-4 gap-3 4xl:gap-4 mb-6 4xl:mb-8">
        <div className="rounded-2xl 4xl:rounded-3xl border border-border bg-white px-4 4xl:px-5 py-4 4xl:py-5 shadow-card lg:col-span-1">
          <div className="text-2xl sm:text-3xl 4xl:text-4xl font-bold text-ink">{summary.goals}</div>
          <div className="text-xs 4xl:text-sm text-muted mt-0.5">Goals</div>
        </div>
        <div className="rounded-2xl 4xl:rounded-3xl border border-border bg-white px-4 4xl:px-5 py-4 4xl:py-5 shadow-card lg:col-span-1">
          <div className="text-2xl sm:text-3xl 4xl:text-4xl font-bold text-ink">{summary.orders}</div>
          <div className="text-xs 4xl:text-sm text-muted mt-0.5">Orders</div>
        </div>
      </div>

      {loading ? (
        <div className="text-sm 4xl:text-base text-muted py-10 4xl:py-14 text-center">Loading orders…</div>
      ) : error ? (
        <div className="rounded-2xl 4xl:rounded-3xl border border-red-200 bg-red-50 px-4 sm:px-6 4xl:px-8 py-5 4xl:py-8 text-center max-w-xl mx-auto">
          <p className="text-sm 4xl:text-base text-red-700 mb-3">{error}</p>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center justify-center rounded-full bg-jade text-white text-sm 4xl:text-base font-bold px-4 4xl:px-5 py-2 4xl:py-2.5"
          >
            Retry
          </button>
        </div>
      ) : !(orders || []).length ? (
        <div className="rounded-2xl 4xl:rounded-3xl border border-border bg-white px-4 sm:px-6 4xl:px-8 py-10 4xl:py-14 text-center shadow-card max-w-xl mx-auto">
          <p className="text-sm 4xl:text-base font-semibold text-ink">No in-progress orders</p>
          <p className="text-xs 4xl:text-sm text-muted mt-1">New SIP and lumpsum activity will show up here.</p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-7 4xl:space-y-10">
          {groups.map((group) => (
            <section key={String(group.goalId ?? group.goalName)} className="min-w-0">
              <div className="flex items-baseline justify-between gap-3 mb-2 sm:mb-3 4xl:mb-4 px-0.5">
                <h2 className="text-[11px] sm:text-xs 4xl:text-[13px] font-bold uppercase tracking-[0.08em] text-muted truncate">
                  {group.goalName}
                </h2>
                <div className="text-sm sm:text-[15px] 4xl:text-base font-semibold text-ink shrink-0">{money(group.totalAmount)}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 4xl:grid-cols-3 gap-3 sm:gap-4 4xl:gap-5">
                {group.orders.map((order, index) => (
                  <OrderCard
                    key={orderCardKey(order, index)}
                    order={order}
                    onClick={() => setSelected(order)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, onClick }) {
  const tone = orderStatusTone(order.status);
  const title = order.sipName || order.goalName || "Order";
  const typeLabel = order.type === "lumpsum" ? "Lumpsum" : "SIP";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-full text-left rounded-2xl 4xl:rounded-3xl border border-border bg-white px-4 sm:px-5 4xl:px-6 py-4 sm:py-5 4xl:py-6 shadow-card hover:border-jade/40 hover:shadow-elevated transition-all min-w-0"
    >
      <div className="flex items-start justify-between gap-3 mb-2 4xl:mb-3">
        <div className="min-w-0">
          <div className="text-base sm:text-[17px] 4xl:text-lg font-bold text-ink truncate">{title}</div>
          <div className="text-sm 4xl:text-[15px] text-muted mt-0.5">
            {typeLabel} · {money(order.totalAmount)}
          </div>
        </div>
        <span
          className={`shrink-0 text-[10px] 4xl:text-[11px] font-bold uppercase tracking-wide px-2.5 4xl:px-3 py-1 rounded-full ${statusChipClass(tone)}`}
        >
          {order.status || "Pending"}
        </span>
      </div>
      <div className="text-sm 4xl:text-[15px] text-ink space-y-1">
        <div>
          Funds submitted:{" "}
          <span className="font-semibold">
            {order.submittedFunds}/{order.fundsTotal || order.funds?.length || 0}
          </span>
        </div>
        <div>
          Payment status:{" "}
          <span className="font-bold">{order.paymentStatus || "PENDING"}</span>
        </div>
      </div>
      {order.placedAt ? (
        <div className="text-xs 4xl:text-sm text-muted mt-3">Submitted {formatPlacedAt(order.placedAt)}</div>
      ) : null}
    </button>
  );
}

function OrderDetail({ order, onBack, onTalkAdvisor }) {
  const headline = detailHeadline(order);
  const tone = detailHeadlineTone(order);
  const timeline = buildOrderTimeline(order);
  const funds = Array.isArray(order.funds) ? order.funds : [];
  const defaultOpen =
    funds.findIndex((fund) => String(fund?.orderId || "").trim()) >= 0
      ? funds.findIndex((fund) => String(fund?.orderId || "").trim())
      : 0;
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  const headlineColor =
    tone === "success" ? "text-emerald-700" : tone === "error" ? "text-red-600" : "text-amber-600";

  return (
    <div className={PAGE_SHELL_NARROW}>
      <div className="flex items-center gap-3 mb-5 4xl:mb-7">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 4xl:w-11 4xl:h-11 rounded-full border border-border bg-white flex items-center justify-center shrink-0 hover:bg-surface"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <h1 className="text-lg sm:text-xl lg:text-2xl 4xl:text-[28px] font-bold text-ink tracking-tight">Transaction Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] 4xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] gap-5 4xl:gap-8 items-start">
        <div className="min-w-0 space-y-5 4xl:space-y-6">
          <div className="rounded-2xl 4xl:rounded-3xl border border-border bg-white px-4 sm:px-5 4xl:px-7 py-5 4xl:py-7 shadow-card">
            <div className="flex items-center gap-3 mb-4 4xl:mb-5">
              <span
                className={`w-11 h-11 4xl:w-14 4xl:h-14 rounded-full flex items-center justify-center shrink-0 ${
                  tone === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : tone === "error"
                      ? "bg-red-50 text-red-600"
                      : "bg-amber-50 text-amber-600"
                }`}
              >
                {tone === "success" ? <Check size={22} /> : <Clock size={22} />}
              </span>
              <div className={`text-lg sm:text-xl 4xl:text-2xl font-bold leading-snug ${headlineColor}`}>{headline}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 4xl:gap-6 mb-4">
              <div className="min-w-0">
                <div className="text-[11px] 4xl:text-xs text-muted mb-1">Total amount</div>
                <div className="text-sm sm:text-base 4xl:text-lg font-bold text-ink break-words">{money(order.totalAmount)}</div>
              </div>
              <div className="min-w-0">
                <div className="text-[11px] 4xl:text-xs text-muted mb-1">Processed</div>
                <div className="text-sm sm:text-base 4xl:text-lg font-bold text-emerald-700 break-words">{money(order.processedAmount)}</div>
              </div>
              <div className="min-w-0">
                <div className="text-[11px] 4xl:text-xs text-muted mb-1">Remaining</div>
                <div className="text-sm sm:text-base 4xl:text-lg font-bold text-amber-600 break-words">{money(order.remainingAmount)}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm 4xl:text-[15px] text-muted">
                {order.goalName || "Investment"} · {order.type === "lumpsum" ? "Lumpsum" : "SIP"}
              </span>
              {order.paymentStatus ? (
                <span className={`text-[10px] 4xl:text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${statusChipClass(orderStatusTone(order.paymentStatus))}`}>
                  {order.paymentStatus}
                </span>
              ) : (
                <span className={`text-[10px] 4xl:text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${statusChipClass(orderStatusTone(order.status))}`}>
                  {order.status || "PENDING"}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl 4xl:rounded-3xl border border-border bg-white px-4 sm:px-5 4xl:px-7 py-5 4xl:py-6 shadow-card">
            <div className="text-[11px] 4xl:text-xs font-bold uppercase tracking-[0.08em] text-muted mb-1">
              Need help?
            </div>
            <h3 className="text-base 4xl:text-lg font-bold text-ink mb-1">Contact Customer Care</h3>
            <p className="text-sm 4xl:text-[15px] text-muted mb-4 max-w-2xl">
              Our customer support team will be happy to assist you with any queries you may have.
            </p>
            <button
              type="button"
              onClick={onTalkAdvisor}
              className={`${WIZARD_CTA} sm:max-w-sm`}
            >
              Talk to Advisor
            </button>
          </div>
        </div>

        <div className="min-w-0 mb-6 lg:mb-0">
          <h2 className="text-sm sm:text-[15px] 4xl:text-base font-bold text-ink mb-3 4xl:mb-4">Funds ({funds.length})</h2>
          {funds.length ? (
            <div className="space-y-2 4xl:space-y-3">
              {funds.map((fund, index) => {
                const open = openIndex === index;
                return (
                  <div
                    key={String(fund.orderId || fund.scheme || index)}
                    className="rounded-2xl 4xl:rounded-3xl border border-emerald-100 bg-emerald-50/40 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? -1 : index)}
                      className="w-full flex items-start gap-3 px-4 4xl:px-5 py-3.5 4xl:py-4 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm 4xl:text-[15px] font-bold text-ink leading-snug break-words">
                            {fund.schemeName || fund.scheme || "Fund"}
                          </div>
                          <span className={`shrink-0 text-[10px] 4xl:text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusChipClass(orderStatusTone(fund.status))}`}>
                            {fund.status || "—"}
                          </span>
                        </div>
                        <div className="text-sm 4xl:text-[15px] font-semibold text-ink mt-1">{money(fund.amount)}</div>
                        <div className="text-xs 4xl:text-sm text-muted mt-1">{fundPaymentLine(fund)}</div>
                      </div>
                      {open ? (
                        <ChevronUp size={18} className="text-jade shrink-0 mt-1" />
                      ) : (
                        <ChevronDown size={18} className="text-jade shrink-0 mt-1" />
                      )}
                    </button>
                    {open ? (
                      <div className="px-4 4xl:px-5 pb-4 4xl:pb-5 pt-0 border-t border-emerald-100/80">
                        <Timeline steps={timeline} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl 4xl:rounded-3xl border border-border bg-white px-4 4xl:px-5 py-4 4xl:py-5">
              <Timeline steps={timeline} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Timeline({ steps }) {
  return (
    <ol className="relative mt-4 4xl:mt-5 space-y-4 4xl:space-y-5">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const done = step.state === "done";
        const active = step.state === "active";
        const failed = step.state === "failed";
        return (
          <li key={step.id} className="relative flex gap-3 4xl:gap-3.5">
            {!isLast ? (
              <span
                className={`absolute left-[13px] 4xl:left-[15px] top-7 w-px h-[calc(100%-8px)] ${
                  done ? "bg-emerald-400" : "bg-border"
                }`}
                aria-hidden
              />
            ) : null}
            <span
              className={`relative z-[1] w-7 h-7 4xl:w-8 4xl:h-8 rounded-full flex items-center justify-center shrink-0 ${
                done
                  ? "bg-jade text-white"
                  : failed
                    ? "bg-red-100 text-red-600"
                    : active
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-400"
              }`}
            >
              {done ? (
                <Check size={14} strokeWidth={3} />
              ) : active || failed ? (
                <Clock size={14} />
              ) : (
                <span className="text-[11px] font-bold">{index + 1}</span>
              )}
            </span>
            <div className="min-w-0 pt-0.5 pb-1">
              <div
                className={`text-sm 4xl:text-[15px] font-semibold ${
                  done || active ? "text-ink" : "text-muted"
                }`}
              >
                {step.title}
              </div>
              {step.detail ? <div className="text-xs 4xl:text-sm text-muted mt-0.5">{step.detail}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Home banner — omitted when there are no trackable orders. */
export function TrackOrdersBanner({ onOpen }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchInProgressOrders()
      .then((result) => {
        if (!cancelled) setShow(result.ok && (result.orders?.length || 0) > 0);
      })
      .catch(() => {
        if (!cancelled) setShow(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full mb-4 flex items-center gap-3 sm:gap-4 text-left rounded-card 4xl:rounded-2xl border border-border bg-white px-4 sm:px-5 4xl:px-6 py-4 4xl:py-5 shadow-card transition-all hover:border-jade hover:shadow-elevated active:scale-[0.99] cursor-pointer"
    >
      <span className="w-11 h-11 4xl:w-12 4xl:h-12 rounded-full bg-slate-100 text-ink flex items-center justify-center shrink-0">
        <Clock size={20} className="text-jade" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm 4xl:text-base font-bold text-ink group-hover:text-jade transition-colors">
          Track Your Orders
        </span>
        <span className="block text-xs 4xl:text-sm text-muted mt-0.5">
          Follow SIP and lumpsum orders still in progress.
        </span>
      </span>
      <ChevronRight size={18} className="text-muted group-hover:text-jade shrink-0" />
    </button>
  );
}
