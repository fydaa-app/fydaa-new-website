import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ProductWindow } from "@/components/ui/product-window";
import { routes } from "@/config/routes";
import { ButtonLink } from "@/components/ui/button";
import { formatInr } from "@/lib/format/money";
import { SIP_MINIMUMS } from "../data/sipCategories";

/** Illustrative goals for the product window (not a real account). */
const GOALS = [
  { name: "Home down payment", icon: "/dreams/goals/10-Home-Purchase.png", saved: 412800, target: 2500000, by: "Mar 2031" },
  { name: "Aarav's education", icon: "/dreams/goals/15-Children-Education.png", saved: 85200, target: 1500000, by: "Jun 2038" },
  { name: "Retire at 55", icon: "/dreams/goals/14-Retirement.png", saved: 248000, target: 10000000, by: "2049" },
  { name: "Europe trip", icon: "/dreams/goals/01-Vacation.png", saved: 96000, target: 150000, by: "Oct 2027" },
];

const STEPS = [
  { title: "Name the goal", body: "Say what it's for, how much it needs and by when." },
  { title: "Start or link a SIP", body: "Fydaa suggests funds that fit the timeline and your comfort with risk. Already have a SIP? Link it to the goal." },
  { title: "Track it", body: "See how far along each goal is, and what to change if one falls behind." },
];

/** Goal investing: the steps (a real sequence, so numbered) beside a live goals window. */
export default function GoalsSection() {
  return (
    <section id="products" aria-labelledby="goals-title" className="section scroll-mt-20">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 id="goals-title" className="max-w-[16ch] text-heading text-ink">
              One SIP for each thing you&apos;re saving for
            </h2>
            <p className="max-w-[52ch] text-lead text-grey-600">
              A home, a child&apos;s education, retirement, a trip. Each goal gets its own mutual fund portfolio, matched
              to when you need the money.
            </p>
          </div>
          <ol className="flex flex-col">
            {STEPS.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-t border-line py-5">
                <span className="figure text-title text-jade">{i + 1}</span>
                <div>
                  <h3 className="text-title text-ink">{step.title}</h3>
                  <p className="mt-1 text-base leading-relaxed text-grey-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <ButtonLink href={routes.signup.path} size="lg" data-ph-event="Create a goal">
              Create a goal
            </ButtonLink>
            <p className="text-sm text-grey-500">
              From {formatInr(SIP_MINIMUMS.monthly)} a month or {formatInr(SIP_MINIMUMS.daily)} a day. No lock-in.
            </p>
          </div>
        </div>

        <ProductWindow title="My goals" meta="4 goals" bodyClassName="p-0 sm:p-0">
          <ul aria-label="Example goals" className="divide-y divide-line">
            {GOALS.map((goal) => {
              const pct = Math.round((goal.saved / goal.target) * 100);
              const close = pct >= 50;
              return (
                <li key={goal.name} className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-4 sm:px-6">
                  <Image src={goal.icon} alt="" width={44} height={44} className="size-11 rounded-card" />
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-ink">{goal.name}</p>
                    <p className="figure text-sm text-grey-500">
                      {formatInr(goal.saved)} of {formatInr(goal.target)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={close ? "figure text-lg font-semibold text-emerald" : "figure text-lg font-semibold text-ink"}>{pct}%</p>
                    <p className="text-xs text-grey-500">by {goal.by}</p>
                  </div>
                  <div className="col-span-3 h-1.5 overflow-hidden rounded-full bg-mist" aria-hidden="true">
                    <div
                      className={close ? "h-full rounded-full bg-marigold" : "h-full rounded-full bg-sprout"}
                      style={{ width: `${Math.max(pct, 3)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </ProductWindow>
      </Container>
    </section>
  );
}
