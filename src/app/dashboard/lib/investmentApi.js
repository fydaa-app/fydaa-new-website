import { endSession, getAccessToken } from "../../signup/lib/authApi";
import { STOCK_BASE } from "../../signup/lib/apiHosts";
import { loadMySips, loadSipStatus, sipHasExecutedTransaction } from "./dreamsApi";

export const PRODUCT_TABS = [
  {
    key: "instafd",
    goalId: 35,
    label: "InstaFD",
    stockType: "InstaFD",
    rate: 7.25,
    rateLabel: "7.25% p.a.",
    headline: "Idle cash. <span>Daily interest.</span>",
    holdingSub: "Interest credited every single day",
    sipSub: "Park from ₹100 a day, withdraw anytime",
    lumpSub: "Park a lumpsum at a locked rate, withdraw anytime",
    holdingList: "FUND",
    allowOwn: false,
  },
  {
    key: "gold",
    goalId: 39,
    label: "Digital Gold",
    stockType: "Gold",
    rate: 9,
    rateLabel: "9% CAGR",
    headline: "A pinch of gold. <span>Every single day.</span>",
    holdingSub: "24K gold, stored and insured since {since}",
    sipSub: "Buy 24K gold from ₹100 a day, stored insured",
    lumpSub: "One payment, vaulted 24K gold today",
    holdingList: "HELD AS",
    allowOwn: true,
  },
  {
    key: "equity",
    goalId: 36,
    label: "Equity",
    stockType: "IndianStock",
    rate: 12,
    rateLabel: "12% CAGR",
    headline: "Small Habit. <span>Big Corpus.</span>",
    holdingSub: "Your money, working even when you sleep",
    sipSub: "Invest as little as ₹100/day, see how it compounds",
    lumpSub: "One cheque, let equity compound for you",
    holdingList: "FUNDS",
    allowOwn: true,
  },
  {
    key: "multi",
    goalId: 38,
    label: "Multi-Asset",
    stockType: "MultiAsset",
    rate: 10,
    rateLabel: "10% CAGR",
    headline: "Equity, debt, gold. <span>One holding.</span>",
    holdingSub: "One fund spreading the risk for you since {since}",
    sipSub: "One fund that spreads the risk for you",
    lumpSub: "One payment across equity, debt and gold",
    holdingList: "FUND",
    allowOwn: true,
  },
  {
    key: "debt",
    goalId: 37,
    label: "Debt",
    stockType: "FixedIncomeBonds",
    rate: 7,
    rateLabel: "7% CAGR",
    headline: "Steady money. <span>Slow and sure.</span>",
    holdingSub: "Bonds and corporate paper, not the market",
    sipSub: "Bonds and corporate paper, not the market",
    lumpSub: "Steady returns, one-time and done",
    holdingList: "FUND",
    allowOwn: true,
  },
  {
    key: "hybrid",
    goalId: 40,
    label: "Hybrid",
    stockType: "Hybrid",
    rate: 10,
    rateLabel: "10% CAGR",
    headline: "Equity and debt. <span>One balance.</span>",
    holdingSub: "The fund shifts the mix as markets move",
    sipSub: "The fund shifts the mix as markets move",
    lumpSub: "One cheque, the fund handles the balance",
    holdingList: "FUND",
    allowOwn: true,
  },
  {
    key: "global",
    goalId: 41,
    label: "Global",
    stockType: "Global",
    rate: 11,
    rateLabel: "11% CAGR",
    headline: "Beyond India. <span>The world too.</span>",
    holdingSub: "US and global companies, from ₹100 a day",
    sipSub: "US and global companies, from ₹100 a day",
    lumpSub: "Invest globally in one go",
    holdingList: "FUND",
    allowOwn: true,
  },
];

async function stockGet(path) {
  const token = getAccessToken();
  if (!token) return null;
  const res = await fetch(`${STOCK_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    endSession();
    return null;
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) return null;
  return data;
}

function asList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function firstString(row, keys) {
  for (const key of keys) {
    const value = row?.[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
}

const LIST_KEYS = [
  "schemeAllocations", "scheme_allocations", "recommendedFunds", "recommended_funds",
  "items", "data", "funds", "holdings", "stocks", "schemes", "list",
];

function firstList(data, keys = LIST_KEYS) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = firstList(value, LIST_KEYS);
      if (nested.length) return nested;
    }
  }
  return [];
}

function fundNameFromRow(row) {
  if (!row || typeof row !== "object") return "";
  const nested = row.mutualFund || row.fund || row.schemeDetails || row.mf || row.stock || row.instrument || null;
  return firstString(row, [
    "name", "shortName", "schemeName", "fundName", "title",
    "scheme_name", "fund_name", "stockName", "stock_name", "mfName", "mutualFundName",
  ]) || firstString(nested, [
    "name", "shortName", "schemeName", "fundName", "title",
    "scheme_name", "fund_name", "stockName", "stock_name", "mfName",
  ]);
}

export function cutAtFund(name) {
  const text = String(name || "").trim();
  if (!text) return "";
  const match = text.match(/^(.*?\bFUND\b)/i);
  return match ? match[1].trim() : text;
}

export function compactProjection(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(abs / 1e5).toFixed(2)} L`;
  if (abs >= 1000) return `₹${(abs / 1000).toFixed(1)}K`;
  return `₹${Math.round(abs).toLocaleString("en-IN")}`;
}

export function projectSip(amount, ratePct, years, daily) {
  const annual = ratePct / 100;
  const paymentsPerYear = daily ? 264 : 12;
  const n = paymentsPerYear * years;
  const r = Math.pow(1 + annual, 1 / paymentsPerYear) - 1;
  if (r === 0) return amount * n;
  return amount * ((Math.pow(1 + r, n) - 1) / r);
}

export function projectLump(amount, ratePct, years) {
  return amount * Math.pow(1 + ratePct / 100, years);
}

function sipStamp(sip) {
  const created = Date.parse(sip.createdAt || "");
  if (Number.isFinite(created)) return created;
  const updated = Date.parse(sip.updatedAt || "");
  if (Number.isFinite(updated)) return updated;
  const start = Date.parse(sip.startDate || "");
  if (Number.isFinite(start)) return start;
  return Number(sip.id) || 0;
}

function matchTabByText(sip) {
  const text = [
    sip?.goal?.name,
    sip?.sipName,
    ...(sip?.funds || []).map((fund) => fund?.schemeName || fund?.name || fund?.fundName),
  ].join(" ").toLowerCase();
  if (/instafd|liquid fund|overnight|money market/.test(text)) return "instafd";
  // Debt / gilt before gold — bare "gold" in fund names must not steal debt SIPs.
  if (/debt|bond|gilt|income fund|fixed income/.test(text)) return "debt";
  // Digital Gold only from explicit gold-product signals, not Multi-Asset copy that mentions gold.
  if (/digital\s*gold|gold savings|goldsaving|safegold|mmtc|augmont|sovereign gold/.test(text)) {
    return "gold";
  }
  if (/global|international|nasdaq|s&p|us equity/.test(text)) return "global";
  if (/multi-asset|multi asset|multiasset|asset allocation/.test(text)) return "multi";
  if (/hybrid|balanced|arbitrage/.test(text)) return "hybrid";
  if (/equity|flexicap|momentum|nifty|sensex|smallcap|midcap|largecap|index|stock/.test(text)) return "equity";
  return "equity";
}

function tabKeyForSip(sip, goalsById) {
  const goalId = Number(sip?.goalId ?? sip?.goal?.id);
  if (Number.isFinite(goalId) && goalId > 0) {
    const tab = PRODUCT_TABS.find((item) => item.goalId === goalId);
    if (tab) return tab.key;
  }
  const name = String(sip?.goal?.name || "").trim().toLowerCase();
  if (name) {
    const byName = PRODUCT_TABS.find((item) => {
      const goal = goalsById[item.goalId];
      return goal && String(goal.name || "").trim().toLowerCase() === name;
    });
    if (byName) return byName.key;
    const byLabel = PRODUCT_TABS.find((item) => item.label.toLowerCase() === name);
    if (byLabel) return byLabel.key;
  }
  // Never fuzzy-assign Digital Gold — only goalId 39 / exact Digital Gold goal name above.
  const fuzzy = matchTabByText(sip);
  if (fuzzy === "gold") return "equity";
  return fuzzy;
}

/** First positive finite money value from API fields (else null). */
function positiveMoney(...candidates) {
  for (const value of candidates) {
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function parseFundFromRecommended(data) {
  const root = data?.data && typeof data.data === "object" && !Array.isArray(data.data)
    ? { ...data, ...data.data }
    : data;
  const list = firstList(root);
  const fromPortfolio = root?.portfolio ? firstList(root.portfolio) : [];
  const row = list[0] || fromPortfolio[0];
  if (!row) return null;
  const nested = row.mutualFund || row.fund || row.schemeDetails || row.mf || row.stock || null;
  const name = fundNameFromRow(row);
  if (!name) return null;
  return {
    name: cutAtFund(name) || name,
    fullName: name,
    scheme: firstString(row, ["isin", "ticker", "scheme", "schemeCode"])
      || firstString(nested, ["isin", "ticker", "scheme", "schemeCode"]),
    id: row.id ?? row.mfId ?? row.localMfId ?? nested?.id ?? nested?.mfId ?? null,
    minSip: positiveMoney(
      row.min_sip_amount, row.minSipAmount,
      nested?.min_sip_amount, nested?.minSipAmount,
    ),
    minInitial: positiveMoney(
      row.min_initial_investment, row.minInitialInvestment,
      nested?.min_initial_investment, nested?.minInitialInvestment,
    ),
    portfolioId: root?.portfolioId ?? root?.portfolio?.id ?? data?.portfolioId ?? null,
  };
}

export async function loadGoals() {
  const data = await stockGet("goal/getAllGoals");
  const list = asList(data);
  const byId = {};
  list.forEach((goal) => {
    const id = Number(goal?.id);
    if (!Number.isFinite(id)) return;
    byId[id] = {
      id,
      name: goal.name || "",
      tenureMin: Number(goal.tenureMin ?? goal.tenure_min),
      tenureMax: Number(goal.tenureMax ?? goal.tenure_max),
      goalAmountMin: Number(goal.goalAmountMin ?? goal.goal_amount_min),
      goalAmountMax: Number(goal.goalAmountMax ?? goal.goal_amount_max),
    };
  });
  return byId;
}

export async function loadRecommendedForGoal(goalId) {
  const data = await stockGet(`mutualFund/recommended-portfolio?goalId=${goalId}`);
  if (!data) return null;
  return parseFundFromRecommended(data);
}

export async function searchCategoryFunds(stockType, query = "") {
  const params = new URLSearchParams({ page: "1", limit: "20", stockType });
  const text = String(query || "").trim();
  if (text.length >= 2) params.set("search", text);
  const data = await stockGet(`mutualFund/search?${params.toString()}`);
  if (!data) return { funds: [], message: "Unable to load funds" };
  const funds = firstList(data, ["items", "data", "funds", "results", "schemes", "list"])
    .map((row) => {
      const name = firstString(row, [
        "schemeName", "scheme_name", "fundName", "fund_name",
        "stockName", "stock_name", "name", "title",
      ]);
      const scheme = firstString(row, ["ticker", "scheme", "selectedScheme", "isin", "schemeCode"]);
      const id = row.id ?? row.mfId ?? row.mf_id ?? row.mutualFundId ?? row.mutual_fund_id;
      if (!scheme && !name) return null;
      return {
        id: Number(id) || 0,
        name: cutAtFund(name || scheme),
        fullName: name || scheme,
        scheme,
        minSip: positiveMoney(row.min_sip_amount, row.minSipAmount),
        minInitial: positiveMoney(row.min_initial_investment, row.minInitialInvestment),
      };
    })
    .filter(Boolean);
  return { funds, message: "" };
}

function holdingFundName(sip) {
  const funds = Array.isArray(sip?.funds) ? sip.funds : [];
  for (const fund of funds) {
    const raw = fund?.schemeName || fund?.fundName || fund?.name || fund?.stockName || "";
    const name = cutAtFund(raw) || raw;
    if (name) return name;
  }
  return (
    cutAtFund(sip?.selectedSchemeName) ||
    cutAtFund(sip?.schemeName) ||
    cutAtFund(sip?.sipName) ||
    cutAtFund(sip?.goal?.name) ||
    ""
  );
}

function buildHoldingRows(sips) {
  // One line for the product card: actual invested fund, not the tab's recommended fund.
  const invested = (sips || []).reduce((sum, sip) => sum + (Number(sip.investedAmount) || 0), 0);
  const newest = sips?.[0] || null;
  const name = holdingFundName(newest);
  if (!name) return [];
  return [{ name, amount: invested, sipId: newest?.id ?? null }];
}

export async function loadHomeInvestment() {
  const [goalsById, sips] = await Promise.all([loadGoals(), loadMySips()]);
  const working = (sips || []).filter((sip) => {
    const state = String(sip?.status || "").toUpperCase();
    return state !== "CANCELLED" && state !== "COMPLETED";
  });

  const statusBySipId = {};
  await Promise.all(
    working
      .filter((sip) => String(sip?.status || "").toUpperCase() !== "INACTIVE")
      .map(async (sip) => {
        statusBySipId[sip.id] = await loadSipStatus(sip.id);
      }),
  );

  const tracked = working
    .filter((sip) => {
      const state = String(sip?.status || "").toUpperCase();
      if (state !== "ACTIVE") return false;
      const status = statusBySipId[sip.id];
      if (status == null) return Number(sip.investedAmount) > 0;
      return sipHasExecutedTransaction(status) || Number(sip.investedAmount) > 0;
    })
    .sort((a, b) => sipStamp(b) - sipStamp(a));

  const recommended = {};
  const goalsLoaded = Object.keys(goalsById).length > 0;
  await Promise.all(
    PRODUCT_TABS.map(async (tab) => {
      const missingGoal = goalsLoaded && !goalsById[tab.goalId];
      if (missingGoal && tab.key !== "instafd") {
        recommended[tab.key] = { loading: false, fund: null, missingGoal: true };
        return;
      }
      recommended[tab.key] = { loading: true, fund: null, missingGoal: false };
      const fund = await loadRecommendedForGoal(tab.goalId);
      recommended[tab.key] = {
        loading: false,
        fund,
        missingGoal: goalsLoaded && !goalsById[tab.goalId],
      };
    }),
  );

  const holdingsByTab = Object.fromEntries(PRODUCT_TABS.map((tab) => [tab.key, []]));
  tracked.forEach((sip) => {
    const key = tabKeyForSip(sip, goalsById);
    if (holdingsByTab[key]) holdingsByTab[key].push(sip);
  });

  const tabModels = Object.fromEntries(
    PRODUCT_TABS.map((tab) => {
      const holdings = holdingsByTab[tab.key] || [];
      const invested = holdings.reduce((sum, sip) => sum + (Number(sip.investedAmount) || 0), 0);
      const current = holdings.reduce((sum, sip) => {
        const value = Number(sip.currentAmount);
        return sum + (Number.isFinite(value) ? value : Number(sip.investedAmount) || 0);
      }, 0);
      const newest = holdings[0] || null;
      let earliest = null;
      holdings.forEach((sip) => {
        const date = new Date(sip.startDate);
        if (!Number.isNaN(date.getTime()) && (!earliest || date < earliest)) earliest = date;
      });
      const since = earliest
        ? earliest.toLocaleDateString("en-IN", { month: "short", year: "numeric" })
        : "";
      const sinceShort = earliest
        ? earliest.toLocaleDateString("en-IN", { month: "short" })
        : "";
      const freq = String(newest?.sipFrequency || "").toLowerCase() === "daily" ? "daily" : "monthly";
      const cadenceAmt = Math.round(Number(newest?.sipAmount) || 0);
      const cadence = newest
        ? `₹${cadenceAmt.toLocaleString("en-IN")}/${freq === "daily" ? "day" : "month"}`
        : "";
      return [tab.key, {
        holdings,
        invested,
        current,
        newestId: newest?.id ?? null,
        cadence,
        sinceShort,
        since,
        fundRows: buildHoldingRows(holdings),
      }];
    }),
  );

  const alreadyInvesting = tracked.length > 0;

  return { goalsById, recommended, tabModels, alreadyInvesting };
}
