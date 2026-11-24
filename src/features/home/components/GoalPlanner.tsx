"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SubtleNumber } from "@/components/ui/subtle-number";
import { formatInr, formatInrShort, sipFutureValue } from "@/lib/format/money";
import { SIP_CATEGORIES, SIP_CATEGORY_ORDER, SIP_TENURE_OPTIONS } from "../data/sipCategories";

type Category = keyof typeof SIP_CATEGORIES;
type Frequency = "monthly" | "daily";

const LIMITS: Record<Frequency, { min: number; max: number; step: number }> = {
  daily: { min: 100, max: 1000, step: 50 },
  monthly: { min: 1000, max: 100000, step: 500 },
};

const clamp = (value: number, frequency: Frequency) =>
  Math.min(LIMITS[frequency].max, Math.max(LIMITS[frequency].min, value));

const CATEGORY_OPTIONS = SIP_CATEGORY_ORDER.map((key) => ({
  value: key as Category,
  label: SIP_CATEGORIES[key as Category].label,
}));
const FREQUENCY_OPTIONS = [
  { value: "monthly" as const, label: "Monthly" },
  { value: "daily" as const, label: "Daily" },
];
const YEAR_OPTIONS = SIP_TENURE_OPTIONS.map((y) => ({ value: y, label: `${y}y` }));

/* ---- Projection chart ------------------------------------------------------------------- */

const W = 320;
const H = 120;
const PAD = 6;

/** Year-end invested and projected values, 0..years. */
function series(monthly: number, years: number, rate: number) {
  return Array.from({ length: years + 1 }, (_, y) => ({
    invested: monthly * 12 * y,
    value: y === 0 ? 0 : sipFutureValue(monthly, y, rate),
  }));
}

function toPath(points: number[], max: number) {
  const n = points.length - 1;
  return points
    .map((v, i) => {
      const x = PAD + (i / n) * (W - PAD * 2);
      const y = H - PAD - (v / max) * (H - PAD * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/** Resample to a fixed number of points so paths of different tenures can be tweened. */
function resample(values: number[], count = 26) {
  const n = values.length - 1;
  return Array.from({ length: count }, (_, i) => {
    const t = (i / (count - 1)) * n;
    const lo = Math.floor(t);
    const hi = Math.min(n, lo + 1);
    const lv = values[lo] ?? 0;
    const hv = values[hi] ?? lv;
    return lv + (hv - lv) * (t - lo);
  });
}

/** Tweens the curve between shapes with the motion tokens' smooth-out ease (400ms). */
function useTweened(target: number[]) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current;
    if (start === target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const tick = (now: number) => {
      const t = reduce ? 1 : Math.min(1, (now - t0) / 400);
      const next = target.map((v, i) => (start[i] ?? v) + (v - (start[i] ?? v)) * ease(t));
      from.current = next;
      setShown(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return shown;
}

function ProjectionChart({ monthly, years, rate }: { monthly: number; years: number; rate: number }) {
  const gid = useId();
  const target = useMemo(() => {
    const s = series(monthly, years, rate);
    return [...resample(s.map((p) => p.value)), ...resample(s.map((p) => p.invested))];
  }, [monthly, years, rate]);
  const shown = useTweened(target);
  const value = shown.slice(0, 26);
  const invested = shown.slice(26);
  const max = Math.max(...value, 1) * 1.04;
  const valuePath = toPath(value, max);
  const area = `${valuePath} L${W - PAD} ${H - PAD} L${PAD} ${H - PAD} Z`;
  const endY = H - PAD - ((value[25] ?? 0) / max) * (H - PAD * 2);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-20 w-full sm:h-24"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1A9E6E" stopOpacity="0.18" />
          <stop offset="1" stopColor="#1A9E6E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path
        d={toPath(invested, max)}
        fill="none"
        stroke="#98A6A1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={valuePath}
        fill="none"
        stroke="#1A9E6E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* The goal flag: the logo's round-capped stroke, in marigold. */}
      <line
        x1={W - PAD}
        x2={W - PAD}
        y1={H - PAD}
        y2={Math.max(PAD, endY)}
        stroke="#F2A93B"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ---- Planner -------------------------------------------------------------------------- */

/**
 * The home page's one bold moment: pick a fund type, an amount and a period, and the projected
 * value, its digits and the curve follow. Carries the chosen plan into signup.
 */
export default function GoalPlanner() {
  const amountId = useId();
  const [category, setCategory] = useState<Category>("equity");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [years, setYears] = useState(10);
  const [amount, setAmount] = useState(5000);
  const [amountText, setAmountText] = useState("5,000");

  const info = SIP_CATEGORIES[category];
  const limits = LIMITS[frequency];
  const safeAmount = clamp(amount, frequency);
  const monthly = frequency === "daily" ? safeAmount * 30 : safeAmount;
  const total = sipFutureValue(monthly, years, info.rate);
  const invested = monthly * 12 * years;
  const growth = total - invested;

  const signupHref = `/signup?${new URLSearchParams({
    intent: "sip",
    category,
    frequency,
    amount: String(safeAmount),
    years: String(years),
  })}`;

  function commit(next: number, f: Frequency = frequency) {
    const value = clamp(next, f);
    setAmount(value);
    setAmountText(value.toLocaleString("en-IN"));
  }

  function onType(event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "");
    const next = digits ? Number.parseInt(digits, 10) : 0;
    if (next > limits.max) return;
    setAmount(next);
    setAmountText(digits ? next.toLocaleString("en-IN") : "");
  }

  const progress = ((safeAmount - limits.min) / (limits.max - limits.min)) * 100;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-4xl border border-line bg-white shadow-window">
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-ink [font-stretch:104%]">Fund type</span>
            <SegmentedControl
              label="Fund type"
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={setCategory}
              className="grid grid-cols-3"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <label htmlFor={amountId} className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-ink [font-stretch:104%]">You invest</span>
                <span className="flex items-baseline gap-1 rounded-card border border-line bg-mist px-3 py-2 focus-within:border-jade focus-within:ring-2 focus-within:ring-jade/15">
                  <span className="figure text-xl font-semibold text-grey-500">₹</span>
                  <input
                    id={amountId}
                    inputMode="numeric"
                    autoComplete="off"
                    value={amountText}
                    onChange={onType}
                    onBlur={() => commit(amount || limits.min)}
                    aria-describedby={`${amountId}-range`}
                    className="figure w-[7.5ch] bg-transparent text-xl font-semibold text-ink outline-none"
                  />
                  <span className="text-sm text-grey-500">{frequency === "daily" ? "a day" : "a month"}</span>
                </span>
              </label>
              <SegmentedControl
                label="How often"
                options={FREQUENCY_OPTIONS}
                value={frequency}
                onChange={(f) => {
                  setFrequency(f);
                  commit(f === "daily" ? Math.round(safeAmount / 30 / 50) * 50 : safeAmount * 30, f);
                }}
              />
            </div>
            <input
              type="range"
              min={limits.min}
              max={limits.max}
              step={limits.step}
              value={safeAmount}
              onChange={(event) => commit(Number(event.target.value))}
              aria-label="Investment amount"
              aria-valuetext={formatInr(safeAmount)}
              className="planner-range"
              style={{ ["--p" as string]: `${progress}%` }}
            />
            <p id={`${amountId}-range`} className="flex justify-between text-xs text-grey-500">
              <span>{formatInr(limits.min)}</span>
              <span>{formatInr(limits.max)}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-ink [font-stretch:104%]">For</span>
            <SegmentedControl
              label="Years"
              options={YEAR_OPTIONS}
              value={years}
              onChange={setYears}
              className="grid grid-cols-6"
            />
          </div>
        </div>

        <div className="border-t border-line bg-mist/70 px-4 pb-4 pt-4 sm:px-5 sm:pb-5" aria-live="polite">
          <p className="text-sm text-grey-600">In {years} years this could grow to</p>
          <p className="mt-1 text-figure text-ink">
            <SubtleNumber text={formatInrShort(total)} value={total} />
          </p>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <div className="flex gap-1.5">
              <dt className="text-grey-600">You put in</dt>
              <dd className="figure font-semibold text-ink">{formatInrShort(invested)}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="text-grey-600">Growth</dt>
              <dd className="figure font-semibold text-emerald">+{formatInrShort(growth)}</dd>
            </div>
          </dl>
          <div className="mt-3">
            <ProjectionChart monthly={monthly} years={years} rate={info.rate} />
          </div>
          <Link
            href={signupHref}
            className="btn btn-primary btn-lg mt-3 w-full"
            data-ph-event="Start this SIP"
          >
            Start this SIP
          </Link>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-grey-500">
        Illustration only, at an assumed {info.rate}% a year based on the category&apos;s past returns.
        Returns are not guaranteed. Mutual fund investments are subject to market risks; read all scheme
        documents carefully.
      </p>
    </div>
  );
}
