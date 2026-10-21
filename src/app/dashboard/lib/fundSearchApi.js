import { endSession, getAccessToken } from "../../signup/lib/authApi";
import { STOCK_BASE } from "../../signup/lib/apiHosts";

const RECENT_KEY = "fydaa-fund-recent-searches";
const CHIPS = [
  { id: "All", stockType: null },
  { id: "Equity", stockType: "IndianStock" },
  { id: "Liquid", stockType: "Liquid" },
  { id: "Debt", stockType: "Debt" },
];

export { CHIPS };

async function stockGet(path) {
  const token = getAccessToken();
  if (!token) return { ok: false, message: "Unable to search funds" };
  const res = await fetch(`${STOCK_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    endSession();
    return { ok: false, message: "Unable to search funds" };
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) {
    return { ok: false, message: data?.message || "Unable to search funds", data };
  }
  return { ok: true, data };
}

function firstList(data, keys) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = firstList(value, ["items", "data", "results", "funds", "list"]);
      if (nested.length) return nested;
    }
  }
  return [];
}

function firstString(row, keys) {
  for (const key of keys) {
    const value = row?.[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
}

export async function loadSearchTypes() {
  try {
    const result = await stockGet("mutualFund/search/types");
    if (!result.ok) return [];
    return firstList(result.data, ["options", "data", "types", "items", "results", "list"])
      .map((row) => {
        const value = firstString(row, ["value", "stockType", "type", "key"]);
        const label = firstString(row, ["label", "name", "title"]) || value;
        return value ? { value, label } : null;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function mapFinprim(row) {
  const name = firstString(row, ["name", "schemeName", "stockName", "fundName", "title"]);
  const scheme = firstString(row, ["isin", "ISIN", "ticker", "scheme"]);
  if (!name || !scheme) return null;
  return {
    name,
    scheme,
    subtitle: firstString(row, ["suggestedGoalName", "suggested_goal_name", "goalName"]),
    localMfId: row.localMfId ?? row.id ?? null,
    purchaseAllowed: row.purchase_allowed !== false,
    sipAllowed: row.sip_allowed !== false,
    minInitial: row.min_initial_investment,
    minSip: row.min_sip_amount,
    raw: row,
  };
}

function mapCategory(row, chipLabel) {
  const name = firstString(row, [
    "schemeName", "scheme_name", "fundName", "fund_name",
    "stockName", "stock_name", "name", "title",
  ]);
  const scheme = firstString(row, ["ticker", "scheme", "selectedScheme", "isin", "schemeCode"]);
  if (!scheme) return null;
  return {
    name: name || scheme,
    scheme,
    subtitle: firstString(row, ["suggestedGoalName", "suggested_goal_name", "goalName"]) || chipLabel,
    localMfId: row.localMfId ?? row.id ?? null,
    purchaseAllowed: row.purchase_allowed !== false,
    sipAllowed: row.sip_allowed !== false,
    minInitial: row.min_initial_investment,
    minSip: row.min_sip_amount,
    raw: row,
  };
}

export async function searchFunds(query, chipId) {
  const search = encodeURIComponent(query.trim());
  const chip = CHIPS.find((item) => item.id === chipId) || CHIPS[0];
  if (!chip.stockType) {
    const result = await stockGet(`mutualFund/finprim-search?page=0&limit=20&search=${search}`);
    if (!result.ok) return { funds: [], message: result.message };
    const funds = firstList(result.data, ["items", "data", "results", "funds"])
      .map(mapFinprim)
      .filter(Boolean);
    return { funds, message: "" };
  }
  const result = await stockGet(
    `mutualFund/search?page=1&limit=20&stockType=${encodeURIComponent(chip.stockType)}&search=${search}`,
  );
  if (!result.ok) return { funds: [], message: result.message };
  const funds = firstList(result.data, ["items", "data", "funds", "results", "schemes", "list"])
    .map((row) => mapCategory(row, chip.id))
    .filter(Boolean);
  return { funds, message: "" };
}

export function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((item) => typeof item === "string" && item.trim()) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(name) {
  const text = String(name || "").trim();
  if (text.length < 2) return loadRecentSearches();
  const next = [text, ...loadRecentSearches().filter((item) => item.toLowerCase() !== text.toLowerCase())].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

export function clearRecentSearches() {
  localStorage.removeItem(RECENT_KEY);
  return [];
}
