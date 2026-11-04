"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Loader2,
  X,
} from "lucide-react";
import { PAGE_SHELL, SHEET_PANEL, WIZARD_CTA } from "../lib/layoutClasses";
import { rupee } from "../lib/utils";
import {
  executeRepairMonth,
  fetchRepairDashboard,
  fetchUserNeedsRepair,
  formatFailureReasonUpper,
  isMonthActionable,
  isMonthProcessing,
  monthDisplayName,
  monthReasonsLabel,
  monthRepairableAmount,
  monthSchemes,
  setPendingRepairPayment,
} from "../lib/repairOrdersApi";

function money(n) {
  return rupee(Math.round(Number(n) || 0));
}

function compactMoney(n) {
  const value = Number(n) || 0;
  if (value >= 1e5) return `₹${(value / 1e5).toFixed(value % 1e5 === 0 ? 0 : 1)}L`;
  if (value >= 1000) return `₹${Math.round(value / 1000)}K`;
  return money(value);
}

export default function RepairOrdersFlow({ onBack, onHomeRefresh }) {
  const [sips, setSips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [activeSip, setActiveSip] = useState(null);
  const [confirmMonth, setConfirmMonth] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [infoSheet, setInfoSheet] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    const result = await fetchRepairDashboard();
    setLoading(false);
    if (!result.ok) {
      setError(result.message || "Unable to load repair orders");
      setSips([]);
      return;
    }
    setSips(result.sips || []);
    if (activeSip) {
      const next = (result.sips || []).find((sip) => Number(sip.sipId) === Number(activeSip.sipId));
      setActiveSip(next || null);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  async function onRepairConfirm() {
    if (!activeSip || !confirmMonth || processing) return;
    setProcessing(true);
    setProcessStep(0);
    setInfoSheet(null);

    await new Promise((resolve) => setTimeout(resolve, 350));
    setProcessStep(1);

    const result = await executeRepairMonth({
      sipId: activeSip.sipId,
      month: confirmMonth.month,
    });

    if (result.kind === "payment") {
      setProcessStep(1);
      setPendingRepairPayment({
        paymentId: result.paymentId,
        sipId: activeSip.sipId,
        month: confirmMonth.month,
      });
      setProcessStep(2);
      window.location.href = result.paymentUrl;
      return;
    }

    setProcessStep(2);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setProcessing(false);
    setConfirmMonth(null);

    if (!result.ok) {
      if (result.kind === "soft") {
        setInfoSheet({ title: result.title, message: result.message });
      } else {
        setToast({ tone: "error", text: `Repair failed: ${result.message}` });
      }
      await load();
      return;
    }

    setToast({ tone: "success", text: "Repair initiated successfully" });
    setActiveSip(null);
    await load();
    onHomeRefresh?.();
  }

  return (
    <div className={PAGE_SHELL}>
      <div className="flex items-center gap-3 mb-6 4xl:mb-8">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 4xl:w-11 4xl:h-11 rounded-full border border-border bg-white flex items-center justify-center shrink-0 hover:bg-surface"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl sm:text-2xl lg:text-[28px] 4xl:text-[32px] font-bold text-ink tracking-tight">Repair orders</h1>
      </div>

      {toast ? (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
            toast.tone === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.text}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm 4xl:text-base text-muted py-12 4xl:py-16 text-center">Loading repair orders…</div>
      ) : error ? (
        <div className="rounded-2xl 4xl:rounded-3xl border border-red-200 bg-red-50 px-4 sm:px-6 4xl:px-8 py-6 4xl:py-8 text-center max-w-xl mx-auto">
          <p className="text-sm 4xl:text-base text-red-700 mb-3">{error}</p>
          <button
            type="button"
            onClick={load}
            className="inline-flex rounded-full bg-jade text-white text-sm 4xl:text-base font-bold px-4 4xl:px-5 py-2 4xl:py-2.5"
          >
            Retry
          </button>
        </div>
      ) : !sips.length ? (
        <div className="rounded-2xl 4xl:rounded-3xl border border-border bg-white px-4 sm:px-6 4xl:px-8 py-10 4xl:py-14 text-center shadow-card max-w-xl mx-auto">
          <p className="text-sm 4xl:text-base font-semibold text-ink">No SIPs with failed orders</p>
          <p className="text-xs 4xl:text-sm text-muted mt-1">You’re all caught up for now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 4xl:grid-cols-3 gap-4 sm:gap-5 4xl:gap-6">
          {sips.map((sip) => (
            <SipRepairCard
              key={sip.sipId}
              sip={sip}
              onView={() => setActiveSip(sip)}
            />
          ))}
        </div>
      )}

      {activeSip ? (
        <MonthSheet
          sip={activeSip}
          onClose={() => {
            if (!processing) setActiveSip(null);
          }}
          onRepairMonth={(month) => {
            if (isMonthActionable(month)) setConfirmMonth(month);
            else {
              setToast({
                tone: "error",
                text: "This month cannot be repaired yet. Check repairable amount or try again later.",
              });
            }
          }}
        />
      ) : null}

      {confirmMonth && activeSip ? (
        <ConfirmSheet
          sip={activeSip}
          month={confirmMonth}
          onClose={() => {
            if (!processing) setConfirmMonth(null);
          }}
          onConfirm={onRepairConfirm}
        />
      ) : null}

      {processing ? <ProcessingOverlay step={processStep} /> : null}

      {infoSheet ? (
        <InfoSheet
          title={infoSheet.title}
          message={infoSheet.message}
          onClose={() => setInfoSheet(null)}
        />
      ) : null}
    </div>
  );
}

function SipRepairCard({ sip, onView }) {
  return (
    <div className="h-full rounded-2xl 4xl:rounded-3xl border border-border bg-white shadow-card overflow-hidden flex flex-col min-w-0">
      <div className="px-4 4xl:px-5 pt-4 4xl:pt-5 pb-3">
        <div className="text-base 4xl:text-lg font-bold text-ink break-words">{sip.title}</div>
        <div className="text-sm 4xl:text-[15px] text-muted mt-0.5 break-words">{sip.subtitle}</div>
      </div>
      <div className="mx-4 4xl:mx-5 mb-3 rounded-xl bg-red-50 border border-red-100 px-3.5 4xl:px-4 py-3 flex-1">
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <div className="text-sm 4xl:text-[15px] font-bold text-red-700">
              {sip.monthCount} month{sip.monthCount === 1 ? "" : "s"} with failures
            </div>
            <div className="text-sm 4xl:text-[15px] text-red-600 mt-0.5 capitalize break-words">{sip.reasonsLabel}</div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <StatBox value={sip.monthCount} label="Months" />
              <StatBox value={sip.ordersCount} label="Orders" />
              <StatBox value={money(sip.failedAmt)} label="Failed amt" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 4xl:px-5 pb-4 4xl:pb-5 mt-auto">
        <button
          type="button"
          onClick={onView}
          className={`${WIZARD_CTA} inline-flex items-center justify-center gap-1`}
        >
          View repair orders
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function StatBox({ value, label }) {
  return (
    <div className="rounded-lg 4xl:rounded-xl bg-red-100/70 px-2 4xl:px-2.5 py-2 4xl:py-2.5 text-center min-w-0">
      <div className="text-sm 4xl:text-[15px] font-bold text-red-800 break-words">{value}</div>
      <div className="text-[10px] 4xl:text-[11px] text-red-700/80 mt-0.5">{label}</div>
    </div>
  );
}

function MonthSheet({ sip, onClose, onRepairMonth }) {
  const months = sip.months || [];
  const open = months.filter((month) => isMonthActionable(month)).length;
  const repairable = months
    .filter((month) => isMonthActionable(month))
    .reduce((sum, month) => sum + monthRepairableAmount(month), 0);
  const done = months.filter((month) => String(month.repairStatus || "").toLowerCase() === "completed").length;
  const total = Math.max(1, months.length);
  const progress = done / total;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-5 4xl:p-8">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={onClose} />
      <div className={SHEET_PANEL}>
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4 sm:hidden" />
        <h2 className="text-lg sm:text-xl 4xl:text-2xl font-bold text-ink">Repair orders</h2>
        <p className="text-sm 4xl:text-[15px] text-muted mt-1 mb-4 4xl:mb-5">
          One month at a time · confirm schemes, then pay if required
        </p>

        <div className="grid grid-cols-3 gap-2 4xl:gap-3 mb-3 4xl:mb-4">
          <MiniStat value={open} label="Open" tone="text-red-600" />
          <MiniStat value={compactMoney(repairable)} label="Repairable" tone="text-amber-600" />
          <MiniStat value={done} label="Done" tone="text-emerald-700" />
        </div>

        <div className="mb-4 4xl:mb-5">
          <div className="flex items-center justify-between text-xs 4xl:text-sm text-muted mb-1.5">
            <span>Progress</span>
            <span>
              {done} / {total}
            </span>
          </div>
          <div className="h-2 4xl:h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-jade rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <div className="space-y-3 4xl:space-y-4 mb-4 4xl:mb-5">
          {months.map((month) => (
            <MonthCard key={month.month} month={month} onRepair={() => onRepairMonth(month)} />
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full h-12 4xl:h-[52px] rounded-xl border border-border bg-white text-ink font-bold text-sm 4xl:text-base"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function MiniStat({ value, label, tone }) {
  return (
    <div className="rounded-xl 4xl:rounded-2xl border border-border bg-surface px-2 4xl:px-3 py-2.5 4xl:py-3 text-center min-w-0">
      <div className={`text-base sm:text-lg 4xl:text-xl font-bold break-words ${tone}`}>{value}</div>
      <div className="text-[11px] 4xl:text-xs text-muted mt-0.5">{label}</div>
    </div>
  );
}

function MonthCard({ month, onRepair }) {
  const actionable = isMonthActionable(month);
  const processing = isMonthProcessing(month);
  const schemes = monthSchemes(month);
  const amount = monthRepairableAmount(month);

  return (
    <div className="rounded-2xl 4xl:rounded-3xl border border-border bg-white px-3.5 sm:px-4 4xl:px-5 py-3.5 4xl:py-4 min-w-0">
      <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-1.5 xs:gap-3 mb-1">
        <div className="text-sm 4xl:text-[15px] font-bold text-ink">{monthDisplayName(month)}</div>
        <div className="text-sm 4xl:text-[15px] font-semibold text-ink flex items-center gap-1.5 shrink-0 flex-wrap">
          {money(amount)}
          <span className="inline-flex items-center gap-1 text-red-600">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {processing ? "Repairing" : actionable ? "Failed" : "Blocked"}
          </span>
        </div>
      </div>
      <div className="text-xs 4xl:text-sm text-muted mb-2 break-words">
        {monthReasonsLabel(month)} · {schemes.length} fund(s)
      </div>
      <ul className="space-y-1.5 4xl:space-y-2 mb-3">
        {schemes.map((scheme, index) => (
          <li key={`${scheme.schemeName}-${index}`} className="flex items-center justify-between gap-2 text-sm 4xl:text-[15px]">
            <span className="min-w-0 truncate text-ink flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-jade shrink-0" />
              {scheme.schemeName}
            </span>
            <span className="font-semibold text-ink shrink-0">{money(scheme.amount)}</span>
          </li>
        ))}
      </ul>
      {actionable ? (
        <button
          type="button"
          onClick={onRepair}
          className="w-full h-11 4xl:h-12 rounded-xl bg-jade text-white font-bold text-sm 4xl:text-base hover:bg-jade/90"
        >
          Repair this order
        </button>
      ) : processing ? (
        <div className="w-full h-11 4xl:h-12 rounded-xl bg-amber-50 text-amber-800 font-semibold text-sm 4xl:text-base flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Repairing…
        </div>
      ) : (
        <div className="text-xs 4xl:text-sm text-muted">
          {numSafe(month.repairableAmount) <= 0
            ? "Not repairable online right now."
            : "This month cannot be repaired yet."}
        </div>
      )}
    </div>
  );
}

function numSafe(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function ConfirmSheet({ sip, month, onClose, onConfirm }) {
  const schemes = monthSchemes(month);
  const amount = monthRepairableAmount(month);
  const assetLabel = sip.portfolio?.portfolioName || sip.title || "Equity";

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-5 4xl:p-8">
      <button type="button" className="absolute inset-0 bg-black/45" aria-label="Close" onClick={onClose} />
      <div className={SHEET_PANEL}>
        <div className="flex items-center justify-between mb-3 4xl:mb-4">
          <h2 className="text-lg sm:text-xl 4xl:text-2xl font-bold text-ink">Repair Assets</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 4xl:w-9 4xl:h-9 rounded-full hover:bg-surface flex items-center justify-center" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="text-sm 4xl:text-[15px] text-muted mb-1">{assetLabel}</div>
        <div className="flex items-end justify-between gap-3 mb-4">
          <div className="text-3xl sm:text-4xl 4xl:text-5xl font-bold text-ink tracking-tight">{money(amount)}</div>
          <div className="text-sm 4xl:text-base font-semibold text-muted pb-1">
            {schemes.length} order{schemes.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="text-xs 4xl:text-[13px] font-bold uppercase tracking-[0.06em] text-muted mb-2">Failed Schemes</div>
        <div className="space-y-2 mb-5">
          {schemes.map((scheme, index) => (
            <div
              key={`${scheme.schemeName}-${index}`}
              className="rounded-xl border border-border bg-surface px-3.5 4xl:px-4 py-3 4xl:py-3.5 flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-sm 4xl:text-[15px] font-bold text-ink truncate">{scheme.schemeName}</div>
                {scheme.failureReason ? (
                  <div className="text-[11px] 4xl:text-xs font-bold text-red-600 mt-1 tracking-wide">
                    {formatFailureReasonUpper(scheme.failureReason)}
                  </div>
                ) : null}
              </div>
              <div className="text-sm 4xl:text-[15px] font-bold text-red-600 shrink-0">{money(scheme.amount)}</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className={WIZARD_CTA}
        >
          Repair Order ({money(amount)})
        </button>
      </div>
    </div>
  );
}

function ProcessingOverlay({ step }) {
  const steps = [
    { id: 0, label: "Validating repair request" },
    { id: 1, label: "Processing payment" },
    { id: 2, label: "Updating order status" },
  ];

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md 4xl:max-w-lg rounded-2xl 4xl:rounded-3xl bg-white px-5 4xl:px-7 py-6 4xl:py-8 shadow-elevated mx-4 sm:mx-0">
        <h3 className="text-lg sm:text-xl 4xl:text-2xl font-bold text-ink text-center mb-1">Processing Repair Order</h3>
        <p className="text-sm 4xl:text-[15px] text-muted text-center mb-5">
          Please wait while we process your repair order…
        </p>
        <ul className="space-y-3 4xl:space-y-4">
          {steps.map((item) => {
            const done = step > item.id;
            const active = step === item.id;
            return (
              <li key={item.id} className="flex items-center gap-3 text-sm 4xl:text-[15px]">
                <span
                  className={`w-7 h-7 4xl:w-8 4xl:h-8 rounded-full flex items-center justify-center shrink-0 ${
                    done
                      ? "bg-jade text-white"
                      : active
                        ? "bg-emerald-50 text-jade"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? (
                    <Check size={14} strokeWidth={3} />
                  ) : active ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Clock size={14} />
                  )}
                </span>
                <span className={done || active ? "font-semibold text-ink" : "text-muted"}>
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function InfoSheet({ title, message, onClose }) {
  return (
    <div className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-0 sm:p-5 4xl:p-8">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close" onClick={onClose} />
      <div className="relative w-full sm:max-w-md lg:max-w-lg 4xl:max-w-xl rounded-t-3xl sm:rounded-3xl bg-white px-5 4xl:px-7 pt-5 4xl:pt-7 pb-6 4xl:pb-7 shadow-elevated">
        <h3 className="text-lg sm:text-xl 4xl:text-2xl font-bold text-ink mb-2">{title}</h3>
        <p className="text-sm 4xl:text-[15px] text-muted mb-5">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className={WIZARD_CTA}
        >
          OK
        </button>
      </div>
    </div>
  );
}

/** Home banner — only when auth stage `isRepair === true`. */
export function RepairOrdersBanner({ onOpen }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchUserNeedsRepair()
      .then((needs) => {
        if (!cancelled) setShow(needs === true);
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
      onClick={async () => {
        const preflight = await fetchRepairDashboard();
        if (!preflight.ok) {
          window.alert(preflight.message || "Unable to open repair orders");
          return;
        }
        onOpen(preflight.sips);
      }}
      className="group w-full mb-4 flex items-center gap-3 sm:gap-4 text-left rounded-card 4xl:rounded-2xl border border-border bg-white px-4 sm:px-5 4xl:px-6 py-4 4xl:py-5 shadow-card transition-all hover:border-jade hover:shadow-elevated active:scale-[0.99] cursor-pointer"
    >
      <span className="w-11 h-11 4xl:w-12 4xl:h-12 rounded-full bg-slate-100 text-ink flex items-center justify-center shrink-0">
        <Clock size={20} className="text-jade" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm 4xl:text-base font-bold text-ink group-hover:text-jade transition-colors">
          Complete Your Repair Order
        </span>
        <span className="block text-xs 4xl:text-sm text-muted mt-0.5">
          Fix failed SIP instalments and resume investing.
        </span>
      </span>
      <ChevronRight size={18} className="text-muted group-hover:text-jade shrink-0" />
    </button>
  );
}
