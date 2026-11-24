"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { GetAppButton } from "@/components/app/get-app-button";
import { PhoneFrame } from "@/components/app/phone-frame";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SubtleNumber } from "@/components/ui/subtle-number";
import { formatInr, formatInrShort, formatInrWords } from "@/lib/format/money";
import { INFLATION_PERCENT, PLANNER_GOALS } from "../data/plannerGoals";
import { planGoal } from "../lib/goal-math";
import { GoalPlanScreen } from "./app-screens/GoalPlanScreen";

/* Amount slider: logarithmic from ₹50,000 to ₹5 crore, snapped to round numbers. */
const MIN_TARGET = 50_000;
const MAX_TARGET = 50_000_000;
const STEPS = 200;

function toTarget(step: number) {
  const raw = MIN_TARGET * Math.pow(MAX_TARGET / MIN_TARGET, step / STEPS);
  const unit = raw >= 1e7 ? 5e5 : raw >= 1e6 ? 5e4 : raw >= 1e5 ? 1e4 : 5e3;
  return Math.round(raw / unit) * unit;
}

function toStep(target: number) {
  return Math.round((Math.log(target / MIN_TARGET) / Math.log(MAX_TARGET / MIN_TARGET)) * STEPS);
}

const GOAL_OPTIONS = PLANNER_GOALS.map((goal) => ({
  value: goal.id,
  label: (
    <span className="flex flex-col items-center gap-1 py-1.5">
      <Image src={goal.icon} alt="" width={36} height={36} className="size-8 rounded-btn sm:size-9" />
      <span className="text-xs font-semibold sm:text-sm">{goal.label}</span>
    </span>
  ),
}));

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/** ₹10 L, ₹13.4 L, ₹1.25 Cr: the short form without a trailing ".0". */
const shortInr = (value: number) => formatInrShort(value, value >= 1e7 ? 2 : 1).replace(/\.0+ /, " ");

/**
 * The home page's moment: "What are you saving for?" answered with a goal, an amount in today's
 * rupees and a year. The monthly SIP (and its daily equivalent) updates as you go, and the plan
 * appears live on the phone beside it, ready to be opened in the app.
 */
export default function GoalPlanner({ intro }: { intro: ReactNode }) {
  const amountId = useId();
  const yearsId = useId();
  const [goalId, setGoalId] = useState(PLANNER_GOALS[2]!.id);
  const goal = PLANNER_GOALS.find((g) => g.id === goalId) ?? PLANNER_GOALS[0]!;
  const [target, setTarget] = useState(goal.target);
  const [years, setYears] = useState(goal.years);

  const plan = useMemo(() => planGoal(target, years), [target, years]);
  const goalYear = new Date().getFullYear() + years;

  function pickGoal(id: string) {
    const next = PLANNER_GOALS.find((g) => g.id === id);
    if (!next) return;
    setGoalId(id);
    setTarget(next.target);
    setYears(next.years);
  }

  const linkData = { goal: goal.id, target, years, sip: plan.monthly, category: plan.category };
  const webHref = `/signup?${new URLSearchParams({
    intent: "sip",
    goal: goal.id,
    category: plan.category,
    frequency: "monthly",
    amount: String(Math.min(100_000, Math.max(1_000, plan.monthly))),
    years: String(years),
  })}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 xl:gap-24">
      <div className="flex min-w-0 flex-col gap-6">
        {intro}

        <div className="flex flex-col gap-5" data-enter-item style={step(2)}>
          <SegmentedControl
            label="What are you saving for?"
            options={GOAL_OPTIONS}
            value={goalId}
            onChange={pickGoal}
            className="grid max-w-xl grid-cols-4"
            optionClassName="min-h-[4.5rem] px-1"
          />

          <div className="grid max-w-xl gap-5 sm:grid-cols-2 sm:gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor={amountId} className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-ink">It costs today</span>
                <span className="figure text-lg font-semibold text-ink">{shortInr(target)}</span>
              </label>
              <input
                id={amountId}
                type="range"
                min={0}
                max={STEPS}
                value={toStep(target)}
                onChange={(event) => setTarget(toTarget(Number(event.target.value)))}
                aria-valuetext={formatInrWords(target)}
                className="planner-range"
                style={{ ["--p" as string]: `${(toStep(target) / STEPS) * 100}%` }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={yearsId} className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-ink">I need it in</span>
                <span className="figure text-lg font-semibold text-ink">
                  {years} {years === 1 ? "year" : "years"}
                </span>
              </label>
              <input
                id={yearsId}
                type="range"
                min={1}
                max={30}
                value={years}
                onChange={(event) => setYears(Number(event.target.value))}
                aria-valuetext={`${years} years, in ${goalYear}`}
                className="planner-range"
                style={{ ["--p" as string]: `${((years - 1) / 29) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex max-w-xl flex-col gap-1 border-t border-line pt-5" aria-live="polite">
            <p className="text-sm text-grey-600">
              To have {shortInr(plan.futureTarget)} in {goalYear}, invest
            </p>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-figure text-ink">
                <SubtleNumber text={formatInr(plan.monthly)} value={plan.monthly} />
              </span>
              <span className="text-base text-grey-600">
                a month, or about{" "}
                <span className="figure font-semibold text-ink">{formatInr(plan.daily)}</span> a day
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <GetAppButton data={linkData} side="top" qrTitle="Scan to get this plan in the app">
              Get this plan in the app
            </GetAppButton>
            <Link href={webHref} className="link text-sm" data-ph-event="Start on web">
              or start on the web
            </Link>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-grey-500">
            Illustration only. Assumes prices rise {INFLATION_PERCENT}% a year and{" "}
            {plan.categoryLabel.toLowerCase()} funds return {plan.rate}% a year; returns are not guaranteed.
            Mutual fund investments are subject to market risks.
          </p>
        </div>
      </div>

      <div
        className="hidden justify-center sm:flex lg:sticky lg:top-24 lg:block lg:self-start"
        data-enter-item
        style={step(3)}
      >
        <PhoneFrame className="w-[248px] sm:w-[280px]">
          <GoalPlanScreen goal={goal} plan={plan} years={years} />
        </PhoneFrame>
      </div>
    </div>
  );
}
