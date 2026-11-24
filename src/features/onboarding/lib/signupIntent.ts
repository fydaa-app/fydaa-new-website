import { SIP_CATEGORIES, SIP_TENURE_OPTIONS } from "@/features/home/data/sipCategories";

/**
 * The SIP a visitor picked in the home goal planner, carried to /signup as
 * `?intent=sip&category=&frequency=&amount=&years=`. Anything outside the planner's own limits is
 * ignored rather than shown.
 */
export type SignupPlan = {
  category: string;
  categoryLabel: string;
  frequency: "monthly" | "daily";
  amount: number;
  years: number;
};

/** Same limits as the home calculator (src/features/home/components/HeroCalculator.jsx). */
const LIMITS = {
  daily: { min: 100, max: 1000 },
  monthly: { min: 1000, max: 100000 },
} as const;

type Params = Pick<URLSearchParams, "get"> | null | undefined;

export function planFromParams(params: Params): SignupPlan | null {
  if (!params || params.get("intent") !== "sip") return null;

  const category = params.get("category") ?? "";
  const info = (SIP_CATEGORIES as Record<string, { label: string }>)[category];
  if (!info) return null;

  const frequency = params.get("frequency");
  if (frequency !== "monthly" && frequency !== "daily") return null;

  const amount = Number(params.get("amount"));
  const { min, max } = LIMITS[frequency];
  if (!Number.isInteger(amount) || amount < min || amount > max) return null;

  const years = Number(params.get("years"));
  if (!(SIP_TENURE_OPTIONS as number[]).includes(years)) return null;

  return { category, categoryLabel: info.label, frequency, amount, years };
}
