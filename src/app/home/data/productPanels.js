// All sample/placeholder data below is illustrative — wire each panel up to
// the real user session data once the API contracts exist. Shapes are kept
// simple on purpose so swapping in real data is a drop-in replacement.

export const GOALS = [
  { emoji: '🏠', name: 'Dream Home', current: '₹4,12,800', target: '₹25,00,000', pct: 16 },
  { emoji: '🎓', name: "Child's Education", current: '₹85,200', target: '₹15,00,000', pct: 6 },
  { emoji: '🏖️', name: 'Early Retirement', current: '₹2,48,000', target: '₹1,00,00,000', pct: 2 },
  { emoji: '✈️', name: 'Europe Trip', current: '₹96,000', target: '₹1,50,000', pct: 64, highlight: true },
];

export const MONEY_VAULT = {
  netWorth: '₹18,42,600',
  monthChange: '▲ +3.2L this month',
  rows: [
    { key: 'Assets', value: '₹24,15,000', tone: 'green' },
    { key: 'Liabilities', value: '₹5,72,400', tone: 'error' },
    { key: 'Investments', value: '₹8,64,200', tone: 'default' },
    { key: 'Bank Accounts', value: '3 linked', tone: 'default' },
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
    { key: 'Net worth strength', value: 81, tone: 'good' },
    { key: 'Asset quality', value: 74, tone: 'good' },
    { key: 'Liquidity & safety', value: 88, tone: 'good' },
    { key: 'Leverage', value: 58, tone: 'warn' },
    { key: 'Goal readiness', value: 72, tone: 'good' },
  ],
};

export const DIRECT_PLAN = {
  percentComplete: 78,
  rows: [
    { key: 'Budget & Cash Flow', value: '✓ Complete', tone: 'green' },
    { key: 'Goal Mapping', value: '✓ Complete', tone: 'green' },
    { key: 'Debt Management', value: '✓ Complete', tone: 'green' },
    { key: 'Insurance Review', value: 'In Progress', tone: 'warn' },
    { key: 'Wealth & Investments', value: 'Pending', tone: 'muted' },
  ],
  footnote: 'Direct Plan MFs · Zero distributor commissions · ₹999/year',
  priceLabel: '₹999/year',
};
