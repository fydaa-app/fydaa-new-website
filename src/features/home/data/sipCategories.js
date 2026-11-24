// TODO(backend): these CAGR assumptions are hardcoded for the marketing site.
// If/when this widget needs to reflect live fund performance, swap this for
// an API call and keep the same shape: { rate, tagline, label }.
export const SIP_CATEGORIES = {
  equity: { label: 'Equity', rate: 12, tagline: 'Small habit. Big corpus.', rateLabel: '12% CAGR' },
  debt: { label: 'Debt', rate: 7, tagline: 'Steady money. Slow and sure.', rateLabel: '7% CAGR' },
  gold: { label: 'Gold', rate: 9, tagline: 'A pinch of gold. Every single day.', rateLabel: '9% CAGR' },
  hybrid: { label: 'Hybrid', rate: 10, tagline: 'Equity and debt. One balance.', rateLabel: '10% CAGR' },
  multi: { label: 'Multi-Asset', rate: 10, tagline: 'Equity, debt, gold. One holding.', rateLabel: '10% CAGR' },
  global: { label: 'Global', rate: 11, tagline: 'Beyond India. The world too.', rateLabel: '11% CAGR' },
};

export const SIP_CATEGORY_ORDER = ['equity', 'debt', 'gold', 'hybrid', 'multi', 'global'];
export const SIP_TENURE_OPTIONS = [3, 5, 10, 15, 20, 25];

// Minimum SIP amounts — surfaced in copy on the Goal Investing section & FAQ.
export const SIP_MINIMUMS = { monthly: 1000, daily: 100 };
