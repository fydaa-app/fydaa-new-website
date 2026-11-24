import Image from "next/image";
import { SubtleNumber } from "@/components/ui/subtle-number";
import { formatInr, formatInrShort } from "@/lib/format/money";
import { PEOPLE } from "../../data/people";
import type { PlannerGoal } from "../../data/plannerGoals";
import type { GoalPlan } from "../../lib/goal-math";

/**
 * TODO(assets): a mock of the app's goal screen, driven live by the home planner. Swap for a real
 * screenshot (or keep it live) once the app screens are available (TODO.md, section 2).
 */
export function GoalPlanScreen({ goal, plan, years }: { goal: PlannerGoal; plan: GoalPlan; years: number }) {
  const rm = PEOPLE[0]!;
  const byYear = new Date().getFullYear() + years;
  // A gentle compounding curve for the screen, ending at the goal flag.
  const points = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12;
    const y =
      86 - 70 * ((Math.pow(1 + plan.rate / 100, t * years) - 1) / (Math.pow(1 + plan.rate / 100, years) - 1));
    return `${(8 + t * 224).toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <div className="flex h-full flex-col bg-mist px-4 pb-4 pt-11 text-ink">
      <div className="flex items-center justify-between text-xs font-semibold text-grey-500">
        <span>Goals</span>
        <span className="flex gap-0.5">
          <i className="block h-3 w-1.5 -rotate-[38deg] rounded-full bg-jade" />
          <i className="block h-3 w-1.5 -rotate-[38deg] rounded-full bg-jade/40" />
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Image src={goal.icon} alt="" width={40} height={40} className="size-10 rounded-card" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold [font-stretch:104%]">{goal.name}</p>
          <p className="figure text-xs text-grey-600">
            {formatInrShort(plan.futureTarget, 1).replace(/\.0+ /, " ")} by {byYear}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-card bg-white p-3.5 shadow-[0_1px_2px_rgb(14_39_33/0.06)]">
        <p className="text-xs text-grey-600">Monthly SIP</p>
        <p className="figure mt-0.5 text-[1.75rem] font-semibold leading-none">
          <SubtleNumber text={formatInr(plan.monthly)} value={plan.monthly} />
        </p>
        <svg viewBox="0 0 240 92" className="mt-3 block h-20 w-full" preserveAspectRatio="none">
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke="#1A9E6E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="232"
            x2="232"
            y1="86"
            y2="16"
            stroke="#F2A93B"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <p className="mt-2 inline-flex rounded-full bg-jade-tint px-2 py-0.5 text-xs font-semibold text-emerald">
          {plan.categoryLabel} funds
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-card bg-white p-3 shadow-[0_1px_2px_rgb(14_39_33/0.06)]">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-marigold-tint text-xs font-semibold text-ink">
          {rm.name.slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{rm.name}</p>
          <p className="truncate text-xs text-grey-500">Your RM</p>
        </div>
        <span className="rounded-full bg-mist px-2 py-1 text-xs font-semibold text-jade">Call</span>
      </div>

      <dl className="mt-3 divide-y divide-line rounded-card bg-white px-3 text-xs">
        <div className="flex justify-between py-2.5">
          <dt className="text-grey-600">SIP date</dt>
          <dd className="font-semibold">5th of every month</dd>
        </div>
        <div className="flex justify-between py-2.5">
          <dt className="text-grey-600">Pay by</dt>
          <dd className="font-semibold">UPI AutoPay</dd>
        </div>
      </dl>

      <div className="mt-auto rounded-btn bg-jade py-2.5 text-center text-sm font-semibold text-white">
        Start SIP
      </div>
    </div>
  );
}
