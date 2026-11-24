import { SIP_CATEGORIES } from "../data/sipCategories";
import { INFLATION_PERCENT } from "../data/plannerGoals";

type CategoryKey = "debt" | "hybrid" | "equity";

/** The fund type a horizon suggests: debt up to 3 years, hybrid up to 7, equity beyond. */
export function categoryFor(years: number): CategoryKey {
  if (years <= 3) return "debt";
  if (years <= 7) return "hybrid";
  return "equity";
}

export interface GoalPlan {
  /** Today's amount grown by inflation to the goal year. */
  futureTarget: number;
  /** Monthly SIP needed, rounded up to the nearest ₹100. */
  monthly: number;
  /** The same as a daily SIP, rounded up to the nearest ₹10. */
  daily: number;
  category: CategoryKey;
  rate: number;
  categoryLabel: string;
}

/**
 * Monthly SIP (paid at the start of each month) that grows to the inflation-adjusted target at the
 * category's assumed rate.
 */
export function planGoal(todayTarget: number, years: number): GoalPlan {
  const category = categoryFor(years);
  const { rate, label } = SIP_CATEGORIES[category];
  const futureTarget = todayTarget * Math.pow(1 + INFLATION_PERCENT / 100, years);
  const r = rate / 100 / 12;
  const n = years * 12;
  const raw = (futureTarget * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
  const monthly = Math.max(100, Math.ceil(raw / 100) * 100);
  return {
    futureTarget,
    monthly,
    daily: Math.ceil(monthly / 30 / 10) * 10,
    category,
    rate,
    categoryLabel: label,
  };
}
