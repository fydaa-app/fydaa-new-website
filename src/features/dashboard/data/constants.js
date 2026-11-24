// ─── Product Showcase Data ───
export const products = {
  instafd: {
    headline: "Idle cash. <span>Daily interest.</span>",
    sub: "Park from ₹100 a day, withdraw anytime",
    subLump: "Park a lumpsum at a locked rate, withdraw anytime",
    daily: { min: 100, max: 1000, step: 50, def: 300 },
    monthly: { min: 500, max: 25000, step: 500, def: 5000 },
    lumpsum: { min: 5000, max: 1000000, step: 5000, def: 100000 },
    rate: 7.25,
    fund: "Aditya Birla Sun Life Liquid Fund",
    cta: "Start my InstaFD",
    ctaLump: "Invest Lump-sum",
    options: [
      "Aditya Birla Sun Life Liquid Fund", "SBI Liquid Fund",
      "HDFC Liquid Fund", "ICICI Prudential Liquid Fund",
      "Nippon India Liquid Fund", "Axis Liquid Fund",
      "Kotak Liquid Fund", "UTI Liquid Fund",
    ],
  },
  gold: {
    headline: "A pinch of gold. <span>Every single day.</span>",
    sub: "Buy 24K gold from ₹100 a day, stored and insured",
    subLump: "Buy 24K gold in one go, stored and insured",
    daily: { min: 100, max: 1000, step: 50, def: 100 },
    monthly: { min: 500, max: 25000, step: 500, def: 5000 },
    lumpsum: { min: 5000, max: 500000, step: 5000, def: 50000 },
    rate: 9,
    fund: "24K 999.9 gold — vaulted with SafeGold",
    cta: "Start Gold SIP",
    ctaLump: "Buy Gold Now",
    options: [
      "24K 999.9 gold — vaulted with SafeGold",
      "24K 999.9 gold — vaulted with MMTC-PAMP",
      "24K 999.9 gold — vaulted with Augmont",
    ],
  },
  equity: {
    headline: "Small Habit. <span>Big Corpus.</span>",
    sub: "Invest as little as ₹100/day, see how it compounds",
    subLump: "Put money in once, let the market do the work",
    daily: { min: 100, max: 1000, step: 50, def: 300 },
    monthly: { min: 500, max: 25000, step: 500, def: 5000 },
    lumpsum: { min: 5000, max: 1000000, step: 5000, def: 100000 },
    rate: 12,
    fund: "UTI Nifty 50 Index Fund",
    cta: "Start Equity SIP",
    ctaLump: "Invest Lump-sum",
    options: [
      "UTI Nifty 50 Index Fund", "HDFC Index Fund Nifty 50",
      "Parag Parikh Flexi Cap Fund", "Nippon India Large Cap Fund",
      "Mirae Asset Large Cap Fund", "SBI Bluechip Fund",
      "Motilal Oswal Midcap Fund", "Nippon India Small Cap Fund",
    ],
  },
  multi: {
    headline: "Equity, debt, gold. <span>One holding.</span>",
    sub: "One fund that spreads the risk for you",
    daily: { min: 100, max: 1000, step: 50, def: 500 },
    monthly: { min: 500, max: 25000, step: 500, def: 5000 },
    lumpsum: { min: 5000, max: 1000000, step: 5000, def: 100000 },
    rate: 10,
    fund: "ICICI Prudential Multi-Asset Fund",
    cta: "Start Multi-Asset SIP",
    ctaLump: "Invest Lump-sum",
    options: [
      "ICICI Prudential Multi-Asset Fund", "SBI Multi Asset Allocation Fund",
      "HDFC Multi-Asset Fund", "Quant Multi Asset Fund",
    ],
  },
  debt: {
    headline: "Steady money. <span>Slow and sure.</span>",
    sub: "Bonds and corporate paper, not the market",
    daily: { min: 100, max: 1000, step: 50, def: 500 },
    monthly: { min: 500, max: 25000, step: 500, def: 5000 },
    lumpsum: { min: 5000, max: 1000000, step: 5000, def: 100000 },
    rate: 7,
    fund: "ICICI Prudential Short Term Fund",
    cta: "Start Debt SIP",
    ctaLump: "Invest Lump-sum",
    options: [
      "ICICI Prudential Short Term Fund", "HDFC Corporate Bond Fund",
      "Kotak Bond Short Term Fund", "Axis Banking & PSU Debt Fund",
    ],
  },
  hybrid: {
    headline: "Equity and debt. <span>One balance.</span>",
    sub: "The fund shifts the mix as markets move",
    daily: { min: 100, max: 1000, step: 50, def: 500 },
    monthly: { min: 500, max: 25000, step: 500, def: 5000 },
    lumpsum: { min: 5000, max: 1000000, step: 5000, def: 100000 },
    rate: 10,
    fund: "HDFC Balanced Advantage Fund",
    cta: "Start Hybrid SIP",
    ctaLump: "Invest Lump-sum",
    options: [
      "HDFC Balanced Advantage Fund", "ICICI Prudential Equity & Debt Fund",
      "SBI Equity Hybrid Fund", "Kotak Equity Hybrid Fund",
    ],
  },
  global: {
    headline: "Beyond India. <span>The world too.</span>",
    sub: "US and global companies, from ₹100 a day",
    daily: { min: 100, max: 1000, step: 50, def: 300 },
    monthly: { min: 500, max: 25000, step: 500, def: 5000 },
    lumpsum: { min: 5000, max: 1000000, step: 5000, def: 100000 },
    rate: 11,
    fund: "Motilal Oswal Nasdaq 100 FOF",
    cta: "Start Global SIP",
    ctaLump: "Invest Lump-sum",
    options: [
      "Motilal Oswal Nasdaq 100 FOF", "Motilal Oswal S&P 500 Index Fund",
      "ICICI Prudential US Bluechip Equity Fund",
    ],
  },
};

// ─── Recommended Goals ───
export const GOAL_ICONS = {
  Vacation: "/dreams/goals/01-Vacation.png",
  Gadgets: "/dreams/goals/02-Gadgets.png",
  Shopping: "/dreams/goals/03-Shopping.png",
  Wellness: "/dreams/goals/04-Wellness.png",
  "Emergency Fund": "/dreams/goals/05-Emergency-Fund.png",
  Jewellery: "/dreams/goals/06-Jewellery.png",
  "Insurance Premium": "/dreams/goals/07-Insurance.png",
  Insurance: "/dreams/goals/07-Insurance.png",
  Vehicle: "/dreams/goals/08-Vehicle.png",
  Parenting: "/dreams/goals/09-Parenting.png",
  "Home Purchase": "/dreams/goals/10-Home-Purchase.png",
  "Buying a Vehicle": "/dreams/goals/11-Buying-a-Vehicle.png",
  "Marriage Fund": "/dreams/goals/12-Marriage-Fund.png",
  "Wealth Creation": "/dreams/goals/13-Wealth-Creation.png",
  Retirement: "/dreams/goals/14-Retirement.png",
  "Children Education": "/dreams/goals/15-Children-Education.png",
  "Gold Savings": "/dreams/goals/16-Gold-Savings.png",
};

export function goalIconSrc(name) {
  return GOAL_ICONS[name] || null;
}

export const goalCategories = [
  {
    label: "Short Term Goals",
    badge: "Up to 3 years",
    goals: [
      { name: "Vacation", years: 3, cagr: 12, sub: "Explore new places", icon: GOAL_ICONS.Vacation },
      { name: "Gadgets", years: 1, cagr: 12, sub: "Plan your purchase", icon: GOAL_ICONS.Gadgets },
      { name: "Shopping", years: 1, cagr: 10, sub: "For your special needs", icon: GOAL_ICONS.Shopping },
      { name: "Wellness", years: 2, cagr: 10, sub: "Health & wellbeing", icon: GOAL_ICONS.Wellness },
      { name: "Emergency Fund", years: 2, cagr: 8, sub: "Your safety net", icon: GOAL_ICONS["Emergency Fund"] },
      { name: "Jewellery", years: 2, cagr: 10, sub: "Save for special moments", icon: GOAL_ICONS.Jewellery },
      { name: "Insurance Premium", years: 2, cagr: 8, sub: "Stay covered", icon: GOAL_ICONS.Insurance },
      { name: "Vehicle", years: 2, cagr: 12, sub: "Drive your dream", icon: GOAL_ICONS.Vehicle },
    ],
  },
  {
    label: "Medium Term Goals",
    badge: "3 to 7 years",
    goals: [
      { name: "Parenting", years: 5, cagr: 13, sub: "Plan for your child", icon: GOAL_ICONS.Parenting },
      { name: "Home Purchase", years: 7, cagr: 14, sub: "Get your dream house", icon: GOAL_ICONS["Home Purchase"] },
      { name: "Buying a Vehicle", years: 5, cagr: 14, sub: "Get your dream ride", icon: GOAL_ICONS["Buying a Vehicle"] },
      { name: "Marriage Fund", years: 5, cagr: 13, sub: "Your dream wedding", icon: GOAL_ICONS["Marriage Fund"] },
    ],
  },
  {
    label: "Long Term Goals",
    badge: "7+ years",
    goals: [
      { name: "Wealth Creation", years: 10, cagr: 14, sub: "Grow your wealth", icon: GOAL_ICONS["Wealth Creation"] },
      { name: "Retirement", years: 25, cagr: 12, sub: "Peaceful life after work", icon: GOAL_ICONS.Retirement },
      { name: "Children Education", years: 15, cagr: 12, sub: "Secure their future", icon: GOAL_ICONS["Children Education"] },
      { name: "Gold Savings", years: 10, cagr: 10, sub: "Save in gold", icon: GOAL_ICONS["Gold Savings"] },
    ],
  },
];

// ─── Journey Tracking Data ───
export const journeyGoals = {
  retirement: {
    name: "Retirement", forLabel: "Goal: For self", badge: "Active",
    pct: 0.14, invested: 21889, current: 22265, monthly: 4545,
    duration: "30 yrs", remaining: 352,
    funds: [
      { name: "Zerodha Nifty LargeMidcap 250 Index Fund", type: "Indian Stock", color: "#0C4A3E", pct: 74.3, gain: 651, gainPct: 4.1, val: 16538, up: true },
      { name: "HDFC Gold ETF Fund of Fund", type: "Gold", color: "#047857", pct: 18.9, gain: -302, gainPct: -6.7, val: 4203, up: false },
      { name: "HDFC Gilt Fund", type: "Fixed Income Bonds", color: "#6EE7B7", pct: 6.8, gain: 27, gainPct: 1.8, val: 1524, up: true },
    ],
  },
  emergency: {
    name: "Emergency Fund", forLabel: "Target ₹64,273 by Dec 2026", badge: "Active",
    pct: 21, invested: 13537, current: 13890, monthly: 3000,
    duration: "1.5 yrs", remaining: 14,
    funds: [
      { name: "ICICI Prudential Liquid Fund", type: "Liquid", color: "#0C4A3E", pct: 100, gain: 353, gainPct: 2.6, val: 13890, up: true },
    ],
  },
  instafd: {
    name: "InstaFD", forLabel: "Daily SIP · 7.25% p.a.", badge: "Active",
    pct: 8, invested: 22000, current: 22460, monthly: 9000,
    duration: "3 yrs", remaining: 718,
    funds: [
      { name: "Aditya Birla Sun Life Liquid Fund", type: "Liquid", color: "#0C4A3E", pct: 100, gain: 460, gainPct: 2.1, val: 22460, up: true },
    ],
  },
};

// ─── AMC Partners (logos in /public/amc — same set as marketing site) ───
export const amcPartners = [
  { name: "Aditya Birla", src: "/amc/aditya_birla.png" },
  { name: "Axis", src: "/amc/axis.png" },
  { name: "Bandhan", src: "/amc/bandhan.png" },
  { name: "Canara Robeco", src: "/amc/canara_robeco.png" },
  { name: "DSP", src: "/amc/dsp.png" },
  { name: "Edelweiss", src: "/amc/edelweiss.png" },
  { name: "Franklin Templeton", src: "/amc/franklin.png" },
  { name: "HDFC", src: "/amc/hdfc.png" },
  { name: "ICICI", src: "/amc/icici.png" },
  { name: "Kotak", src: "/amc/kotak.png" },
  { name: "Mirae", src: "/amc/mirae.png" },
  { name: "Motilal Oswal", src: "/amc/motilal.png" },
  { name: "Nippon India", src: "/amc/nippon.png" },
  { name: "Parag Parikh", src: "/amc/parag_parikh.png" },
  { name: "quant", src: "/amc/quant.png" },
  { name: "SBI", src: "/amc/sbi.png" },
  { name: "TATA", src: "/amc/tata.png" },
  { name: "UTI", src: "/amc/uti.png" },
];

// ─── Navigation ───
export const navItems = [
  { id: "home",    label: "Home",    icon: "home" },
  { id: "dreams",  label: "Portfolio",  icon: "target" },
  { id: "goals",   label: "Goals",   icon: "flag" },
  { id: "history", label: "History", icon: "clock" },
  { id: "profile", label: "Profile", icon: "user" },
];
