import { endSession, getAccessToken } from "../../signup/lib/authApi";
import { STOCK_BASE } from "../../signup/lib/apiHosts";

async function stockGet(path) {
  const token = getAccessToken();
  if (!token) return null;
  let res;
  try {
    res = await fetch(`${STOCK_BASE}${path}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    return null;
  }
  if (res.status === 401) {
    endSession();
    return null;
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) return null;
  return data;
}

function firstList(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  for (const key of ["data", "baskets", "items", "results", "list"]) {
    const value = data[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      if (Array.isArray(value.data)) return value.data;
      if (Array.isArray(value.baskets)) return value.baskets;
      if (Array.isArray(value.items)) return value.items;
    }
  }
  return [];
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function truthyDefault(row) {
  if (row?.isDefault === true || row?.is_default === true) return true;
  const kind = String(row?.type || row?.kind || row?.basketType || "").toLowerCase();
  return kind === "default" || kind === "admin";
}

function fundName(row) {
  const nested = row?.mutualFund || row?.fund || row?.schemeDetails || null;
  const raw =
    row?.fundName ||
    row?.name ||
    row?.schemeName ||
    row?.stockName ||
    row?.title ||
    nested?.fundName ||
    nested?.name ||
    nested?.schemeName ||
    "";
  const text = String(raw || "").trim();
  if (!text) return "";
  // Ignore bare ISIN-like placeholders
  if (/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/i.test(text)) return "";
  return text;
}

function shortFundLabel(name) {
  const parts = String(name || "")
    .replace(/\s*-\s*(Direct|Regular).*$/i, "")
    .replace(/\s+Fund.*$/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) return `${parts[0]} ${parts[1]}`.toUpperCase();
  return (parts[0] || "FUND").toUpperCase();
}

function normalizeWeight(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n > 0 && n <= 1) return Math.round(n * 100);
  return Math.round(n);
}

function normalizeFund(row) {
  if (!row || typeof row !== "object") return null;
  const mfId =
    num(row.mfId) ||
    num(row.mf_id) ||
    num(row.mutualFundId) ||
    num(row.localMfId) ||
    num(row.id) ||
    0;
  const weight = normalizeWeight(row.weight ?? row.allocation ?? row.weightPercent);
  const name = fundName(row);
  return {
    mfId,
    weight: weight || 0,
    name: name || (mfId > 0 ? `Fund ${mfId}` : "Fund"),
    label: shortFundLabel(name || `Fund ${mfId}`),
    scheme: String(row.isin || row.ticker || row.scheme || row.schemeCode || "").trim(),
  };
}

export function normalizeBasket(row) {
  if (!row || typeof row !== "object") return null;
  const id = num(row.id) || num(row.basketId) || 0;
  if (id <= 0) return null;
  const fundsRaw = row.funds || row.basketFunds || row.basket_funds || row.allocations || [];
  const funds = (Array.isArray(fundsRaw) ? fundsRaw : []).map(normalizeFund).filter(Boolean);
  const asset =
    row.assetClassGoal || row.assetClass || row.goal || null;
  return {
    id,
    name: String(row.name || row.title || "Basket").trim() || "Basket",
    description: String(row.description || row.subtitle || "").trim(),
    isDefault: truthyDefault(row),
    investmentMode: String(row.investmentMode || row.investment_mode || "").toUpperCase() || null,
    investAmount: num(row.investAmount ?? row.invest_amount),
    minInvestment: Math.max(1000, num(row.minInvestment ?? row.min_investment) || 1000),
    assetClassName:
      String(row.assetClassName || row.asset_class_name || asset?.name || asset?.goalName || "").trim() || null,
    funds,
    sipStatus: String(
      row.sipStatus ||
        row.relatedSipStatus ||
        row.sip_status ||
        row.sip?.status ||
        row.relatedSip?.status ||
        "",
    ).toUpperCase(),
  };
}

function unwrapBasket(data) {
  if (!data || typeof data !== "object") return null;
  if (data.basket && typeof data.basket === "object") return data.basket;
  if (data.data?.basket && typeof data.data.basket === "object") return data.data.basket;
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    if (data.data.id || data.data.basketId) return data.data;
  }
  if (data.id || data.basketId) return data;
  const list = firstList(data);
  return list[0] || null;
}

export async function getBasket(basketId) {
  const id = Number(basketId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const data = await stockGet(`basket/${id}`);
  return normalizeBasket(unwrapBasket(data));
}

export async function loadBasketDefaults() {
  const data = await stockGet("basket/defaults");
  return firstList(data).map(normalizeBasket).filter(Boolean);
}

export async function loadMyBaskets() {
  const data = await stockGet("basket/my");
  return firstList(data).map(normalizeBasket).filter(Boolean);
}

/** Home list: mine first, then curated defaults. Omit limit (or pass null) for all. */
export async function loadHomeBaskets(limit = null) {
  const [mine, defaults] = await Promise.all([
    loadMyBaskets().catch(() => []),
    loadBasketDefaults().catch(() => []),
  ]);
  const seen = new Set();
  const merged = [];
  const cap = Number(limit);
  const hasCap = Number.isFinite(cap) && cap > 0;
  for (const basket of [...mine, ...defaults]) {
    if (!basket?.id || seen.has(basket.id)) continue;
    seen.add(basket.id);
    merged.push(basket);
    if (hasCap && merged.length >= cap) break;
  }
  return { mine, defaults, preview: merged };
}

export const BASKET_BAR_COLORS = ["#0C4A3E", "#047857", "#6EE7B7", "#A7F3D0", "#D1FAE5"];
