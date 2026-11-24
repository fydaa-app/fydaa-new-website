// All sample/placeholder data below is illustrative — wire each panel up to
// the real user session data once the API contracts exist. Shapes are kept
// simple on purpose so swapping in real data is a drop-in replacement.

export const MONEY_VAULT = {
  netWorth: "₹18,42,600",
  monthChange: "+₹3.2 L this month",
  rows: [
    { key: "Assets", value: "₹24,15,000", tone: "green" },
    { key: "Liabilities", value: "₹5,72,400", tone: "error" },
    { key: "Investments", value: "₹8,64,200", tone: "default" },
    { key: "Bank Accounts", value: "3 linked", tone: "default" },
  ],
};

// Wealth Score is on a 0–100 scale. `score` drives the ring; each pillar's
// `value` (0–100) drives its bar. `tone` picks the bar/number color —
// 'good' = jade, 'warn' = amber. Keep this in sync with the real scoring
// engine's pillar names if they change.
export const WEALTH_SCORE = {
  score: 78,
  max: 100,
  pillars: [
    { key: "Net worth strength", value: 81, tone: "good" },
    { key: "Asset quality", value: 74, tone: "good" },
    { key: "Liquidity & safety", value: 88, tone: "good" },
    { key: "Leverage", value: 58, tone: "warn" },
    { key: "Goal readiness", value: 72, tone: "good" },
  ],
};
