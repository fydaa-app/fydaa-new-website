"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { BASKET_BAR_COLORS, loadHomeBaskets } from "../lib/basketApi";

function AllocationBar({ funds }) {
  const rows = (funds || []).filter((fund) => fund.weight > 0);
  const total = rows.reduce((sum, fund) => sum + fund.weight, 0) || 100;
  return (
    <div className="h-2 rounded-full overflow-hidden flex bg-surface mb-3">
      {rows.map((fund, index) => (
        <div
          key={`${fund.mfId}-${index}`}
          className="h-full first:rounded-l-full last:rounded-r-full"
          style={{
            width: `${(fund.weight / total) * 100}%`,
            background: BASKET_BAR_COLORS[index % BASKET_BAR_COLORS.length],
          }}
        />
      ))}
    </div>
  );
}

/* Same width as the old 2-col grid; fixed height so 3 vs 5 funds match. */
const CARD_CLASS =
  "w-full min-w-full sm:w-[calc(50%-0.5rem)] sm:min-w-[calc(50%-0.5rem)] shrink-0 h-[292px] snap-start";

function BasketCard({ basket, onView }) {
  const funds = (basket.funds || []).slice(0, 5);
  return (
    <div className={`${CARD_CLASS} bg-white border border-border rounded-card shadow-card p-4 sm:p-5 flex flex-col`}>
      <div className="text-[15px] font-bold text-ink truncate mb-3 shrink-0">{basket.name}</div>
      {funds.length > 0 ? (
        <>
          <AllocationBar funds={funds} />
          <div className="space-y-2 flex-1 min-h-0 mb-4 overflow-hidden">
            {funds.map((fund, index) => (
              <div key={`${fund.mfId}-${index}`} className="flex items-center justify-between gap-2 text-[12px] sm:text-[13px]">
                <span className="flex items-center gap-2 min-w-0 text-secondary font-medium">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: BASKET_BAR_COLORS[index % BASKET_BAR_COLORS.length] }}
                  />
                  <span className="truncate uppercase tracking-wide">{fund.label}</span>
                </span>
                <span className="font-semibold text-ink shrink-0">{fund.weight}%</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-sm text-muted flex-1 mb-4">Funds will appear after setup.</div>
      )}
      <button
        type="button"
        onClick={() => onView?.(basket)}
        className="w-full py-2.5 rounded-btn border border-border text-[13px] font-semibold text-jade hover:bg-tint transition-colors mt-auto shrink-0"
      >
        View basket
      </button>
    </div>
  );
}

function CreateBasketCard({ onCreate }) {
  return (
    <button
      type="button"
      onClick={onCreate}
      className={`${CARD_CLASS} flex flex-col items-center justify-center gap-2.5 px-5 py-6 rounded-card border-2 border-dashed border-border bg-white hover:border-jade hover:bg-tint/40 transition-all text-center`}
    >
      <span className="w-11 h-11 rounded-full bg-tint text-jade flex items-center justify-center">
        <Plus size={22} strokeWidth={2.2} />
      </span>
      <span className="text-[15px] font-bold text-ink">Create your basket</span>
      <span className="text-[12px] text-muted leading-snug max-w-[220px]">
        Pick 2 to 5 funds and set your weights
      </span>
    </button>
  );
}

/**
 * Home Baskets strip — below AMC, above Recommended Goals / RM.
 */
export default function BasketsHomeSection({ onViewAll, onViewBasket, onCreate, refreshKey = 0 }) {
  const [preview, setPreview] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    setPreview(undefined);
    loadHomeBaskets()
      .then((payload) => {
        if (!cancelled) setPreview(payload.preview || []);
      })
      .catch(() => {
        if (!cancelled) setPreview([]);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const baskets = preview || [];
  const showSkeleton = preview === undefined;

  return (
    <section className="mb-8">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-ink">Baskets</h3>
          <p className="text-sm text-muted mt-0.5">Ready-made mixes, or build your own</p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[13px] font-semibold text-jade hover:underline underline-offset-2 shrink-0 pt-0.5"
        >
          View all →
        </button>
      </div>

      <div className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
        {showSkeleton && (
          <>
            <div className={`${CARD_CLASS} rounded-card border border-border bg-white animate-pulse`} />
            <div className={`${CARD_CLASS} rounded-card border border-border bg-white animate-pulse`} />
            <div className={`${CARD_CLASS} rounded-card border border-dashed border-border bg-white animate-pulse`} />
          </>
        )}

        {!showSkeleton && baskets.map((basket) => (
          <BasketCard key={basket.id} basket={basket} onView={onViewBasket} />
        ))}

        {!showSkeleton && baskets.length === 0 ? (
          <div className={`${CARD_CLASS} bg-white border border-border rounded-card shadow-card p-5 flex flex-col justify-center`}>
            <div className="text-[15px] font-bold text-ink mb-1">No baskets yet</div>
            <div className="text-sm text-muted mb-4">
              Start with a curated mix or build your own allocation.
            </div>
            <button
              type="button"
              onClick={onViewAll}
              className="w-full py-2.5 rounded-btn border border-border text-[13px] font-semibold text-jade hover:bg-tint"
            >
              Browse curated baskets
            </button>
          </div>
        ) : null}

        {!showSkeleton ? <CreateBasketCard onCreate={onCreate} /> : null}
      </div>
    </section>
  );
}
