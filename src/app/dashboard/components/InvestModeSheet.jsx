"use client";

import { Calendar, Banknote, ChevronRight, X } from "lucide-react";

/**
 * Bottom sheet: Start SIP vs One-time Lump-sum (same choice as mobile after fund / goal pick).
 */
export default function InvestModeSheet({ open, title, subtitle, onClose, onPickSip, onPickLumpsum }) {
  if (!open) return null;

  const name = title || "Invest";
  const sub = subtitle || "Start with a SIP or invest a one-time amount";

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invest-mode-title"
        className="relative w-full sm:max-w-[420px] bg-white rounded-t-2xl sm:rounded-2xl shadow-elevated px-5 pt-3 pb-6 sm:pb-5 max-h-[min(90dvh,560px)] overflow-y-auto"
      >
        <div className="flex justify-center sm:hidden mb-2">
          <span className="w-10 h-1 rounded-full bg-border" />
        </div>
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="min-w-0">
            <h2 id="invest-mode-title" className="text-xl font-bold text-ink leading-tight truncate">
              {name}
            </h2>
            <p className="text-sm text-muted mt-1">{sub}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 -mt-0.5 -mr-1 rounded-full hover:bg-surface flex items-center justify-center shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={onPickSip}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-border bg-white hover:border-jade hover:bg-tint/40 text-left transition-colors"
          >
            <span className="w-11 h-11 rounded-xl bg-tint text-jade flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[15px] font-semibold text-ink">Start SIP</span>
              <span className="block text-xs text-muted mt-0.5 leading-snug">
                Invest daily or monthly towards your goal.
              </span>
            </span>
            <ChevronRight size={18} className="text-muted shrink-0" />
          </button>

          <button
            type="button"
            onClick={onPickLumpsum}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-border bg-white hover:border-jade hover:bg-tint/40 text-left transition-colors"
          >
            <span className="w-11 h-11 rounded-xl bg-tint text-jade flex items-center justify-center shrink-0">
              <Banknote size={20} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[15px] font-semibold text-ink">One-time Lump-sum</span>
              <span className="block text-xs text-muted mt-0.5 leading-snug">
                Invest a single amount today.
              </span>
            </span>
            <ChevronRight size={18} className="text-muted shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
