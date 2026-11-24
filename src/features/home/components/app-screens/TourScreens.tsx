import Image from "next/image";
import { MONEY_VAULT, WEALTH_SCORE } from "../../data/productPanels";

/*
 * TODO(assets): mock app screens for the "Inside the app" tour, with illustrative data. Replace each
 * with a real screenshot through <PhoneFrame src> once available (TODO.md, section 2).
 */

const GOALS = [
  { name: "Home down payment", icon: "/dreams/goals/10-Home-Purchase.png", pct: 16, saved: "₹4.1 L" },
  { name: "Child's education", icon: "/dreams/goals/15-Children-Education.png", pct: 6, saved: "₹85,200" },
  { name: "Wedding fund", icon: "/dreams/goals/12-Marriage-Fund.png", pct: 38, saved: "₹3.8 L" },
  { name: "Dream trip", icon: "/dreams/goals/01-Vacation.png", pct: 64, saved: "₹96,000" },
];

function ScreenTop({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between text-xs font-semibold text-grey-500">
      <span>{title}</span>
      <span className="flex gap-0.5">
        <i className="block h-3 w-1.5 -rotate-[38deg] rounded-full bg-jade" />
        <i className="block h-3 w-1.5 -rotate-[38deg] rounded-full bg-jade/40" />
      </span>
    </div>
  );
}

export function GoalsScreen() {
  return (
    <div className="flex h-full flex-col gap-3 bg-mist px-4 pb-4 pt-11 text-ink">
      <ScreenTop title="My goals" />
      <div className="rounded-card bg-white p-3.5">
        <p className="text-xs text-grey-600">Invested across 4 goals</p>
        <p className="figure mt-0.5 text-2xl font-semibold">₹9,61,200</p>
      </div>
      {GOALS.map((goal) => (
        <div key={goal.name} className="rounded-card bg-white p-3">
          <div className="flex items-center gap-2.5">
            <Image src={goal.icon} alt="" width={32} height={32} className="size-8 rounded-btn" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{goal.name}</p>
              <p className="figure text-xs text-grey-500">{goal.saved} saved</p>
            </div>
            <p className="figure text-sm font-semibold">{goal.pct}%</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
            <div
              className={goal.pct >= 50 ? "h-full rounded-full bg-marigold" : "h-full rounded-full bg-sprout"}
              style={{ width: `${goal.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WealthScoreScreen() {
  const { score, max, pillars } = WEALTH_SCORE;
  const c = 2 * Math.PI * 40;
  return (
    <div className="flex h-full flex-col gap-3 bg-mist px-4 pb-4 pt-11 text-ink">
      <ScreenTop title="Wealth Score" />
      <div className="flex flex-col items-center rounded-card bg-white p-4">
        <div className="relative size-28">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#EBF0EE" strokeWidth="9" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#1A9E6E"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - score / max)}
            />
          </svg>
          <p className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="figure text-3xl font-semibold">{score}</span>
            <span className="text-xs text-grey-500">of {max}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 rounded-card bg-white p-3.5">
        {pillars.map((p) => (
          <div key={p.key}>
            <div className="flex justify-between text-xs">
              <span className="text-grey-600">{p.key}</span>
              <span
                className={
                  p.tone === "warn"
                    ? "figure font-semibold text-warning"
                    : "figure font-semibold text-emerald"
                }
              >
                {p.value}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-mist">
              <div
                className={
                  p.tone === "warn" ? "h-full rounded-full bg-warning" : "h-full rounded-full bg-sprout"
                }
                style={{ width: `${p.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MoneyVaultScreen() {
  return (
    <div className="flex h-full flex-col gap-3 bg-mist px-4 pb-4 pt-11 text-ink">
      <ScreenTop title="Money Vault" />
      <div className="rounded-card bg-white p-4">
        <p className="text-xs text-grey-600">Net worth</p>
        <p className="figure mt-0.5 text-2xl font-semibold">{MONEY_VAULT.netWorth}</p>
        <p className="mt-2 inline-flex rounded-full bg-jade-tint px-2 py-0.5 text-xs font-semibold text-emerald">
          {MONEY_VAULT.monthChange}
        </p>
      </div>
      <div className="divide-y divide-line rounded-card bg-white px-3.5">
        {MONEY_VAULT.rows.map((row) => (
          <div key={row.key} className="flex justify-between py-3 text-xs">
            <span className="text-grey-600">{row.key}</span>
            <span
              className={
                row.tone === "green"
                  ? "figure font-semibold text-emerald"
                  : row.tone === "error"
                    ? "figure font-semibold text-danger"
                    : "figure font-semibold"
              }
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
