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

async function stockWrite(path, { method = "POST", body, fallbackMessage } = {}) {
  const token = getAccessToken();
  if (!token) return { ok: false, message: "Session required" };
  let res;
  try {
    res = await fetch(`${STOCK_BASE}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(body != null ? { "Content-Type": "application/json" } : {}),
      },
      body: body != null ? JSON.stringify(body) : undefined,
    });
  } catch {
    return { ok: false, message: "Could not reach server" };
  }
  if (res.status === 401) {
    endSession();
    return { ok: false, message: "Session expired" };
  }
  if (res.status === 204) return { ok: true, data: null };
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) {
    return {
      ok: false,
      message: String(data?.message || fallbackMessage || `Request failed (${res.status})`).trim()
        || fallbackMessage
        || "Request failed",
      data,
    };
  }
  return { ok: true, data };
}

function stockPost(path, body) {
  return stockWrite(path, {
    method: "POST",
    body,
    fallbackMessage: "Could not create basket. Please try again.",
  });
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
  const minSip = num(row.minSipAmount ?? row.min_sip_amount ?? row.minSip);
  const minInitial = num(row.minInitialInvestment ?? row.min_initial_investment ?? row.minInitial);
  return {
    mfId,
    weight: weight || 0,
    name: name || (mfId > 0 ? `Fund ${mfId}` : "Fund"),
    label: shortFundLabel(name || `Fund ${mfId}`),
    scheme: String(row.isin || row.ticker || row.scheme || row.schemeCode || "").trim(),
    minSip: minSip != null && minSip > 0 ? minSip : null,
    minInitial: minInitial != null && minInitial > 0 ? minInitial : null,
  };
}

/** First-purchase floor for a fund: max(minInitial, minSip) among positives. */
export function firstPurchaseMin(fund) {
  const a = Number(fund?.minInitial ?? fund?.minInitialInvestment);
  const b = Number(fund?.minSip ?? fund?.minSipAmount);
  const vals = [a, b].filter((n) => Number.isFinite(n) && n > 0);
  return vals.length ? Math.max(...vals) : 0;
}

/** Minimum basket amount so every weighted leg covers first-purchase + SIP mins. */
export function requiredBasketAmount(funds, amountFloor = 1000) {
  const floor = Math.max(1000, Number(amountFloor) || 1000);
  const rows = (funds || []).filter((fund) => Number(fund?.weight) > 0);
  if (!rows.length) return floor;
  let required = floor;
  for (const fund of rows) {
    const w = Number(fund.weight) / 100;
    if (!(w > 0)) continue;
    const need = firstPurchaseMin(fund);
    if (need > 0) required = Math.max(required, Math.ceil(need / w));
  }
  return required;
}

export function weightsSumOk(funds) {
  const rows = funds || [];
  // Custom baskets: 2–5 funds.
  if (rows.length < 2 || rows.length > 5) return false;
  if (rows.some((fund) => !(Number(fund.weight) > 0))) return false;
  const sum = rows.reduce((s, fund) => s + Number(fund.weight), 0);
  return Math.abs(sum - 100) <= 0.51;
}

/** Default weight seed: first 40%, rest share 60% (single fund → 100%). */
export function seedWeights(count) {
  const n = Math.max(1, Math.min(5, Number(count) || 1));
  if (n === 1) return [100];
  const first = 40;
  const rest = 100 - first;
  const base = Math.floor(rest / (n - 1));
  const weights = [first];
  let used = first;
  for (let i = 1; i < n - 1; i += 1) {
    weights.push(base);
    used += base;
  }
  weights.push(100 - used);
  return weights;
}

export function equalWeights(count) {
  const n = Math.max(1, Math.min(5, Number(count) || 1));
  const base = Math.floor(100 / n);
  const weights = Array.from({ length: n }, () => base);
  weights[n - 1] = 100 - base * (n - 1);
  return weights;
}

export async function createCustomBasket({
  name,
  description,
  investmentMode,
  investAmount,
  funds,
}) {
  const mode = String(investmentMode || "").toUpperCase() === "LUMPSUM" ? "LUMPSUM" : "SIP";
  const amount = Math.round(Number(investAmount) || 0);
  const payloadFunds = (funds || [])
    .map((fund) => {
      const mfId = Number(fund.mfId || fund.localMfId || fund.id) || 0;
      const weight = Math.min(100, Math.max(1, Math.round(Number(fund.weight) || 0)));
      if (mfId <= 0 || weight <= 0) return null;
      return { mfId, weight };
    })
    .filter(Boolean);

  if (!String(name || "").trim()) return { ok: false, message: "Basket name is required" };
  if (!(amount > 0)) return { ok: false, message: "Enter a valid invest amount" };
  if (payloadFunds.length < 2) return { ok: false, message: "Add at least 2 funds" };
  if (payloadFunds.length > 5) return { ok: false, message: "Up to 5 funds only" };
  if (!weightsSumOk(payloadFunds)) return { ok: false, message: "Weights must add up to 100%" };

  const body = {
    name: String(name).trim().slice(0, 48),
    investmentMode: mode,
    investAmount: amount,
    funds: payloadFunds,
  };
  const desc = String(description || "").trim().slice(0, 140);
  if (desc) body.description = desc;

  const result = await stockPost("basket/custom", body);
  if (!result.ok) return result;
  const basket = normalizeBasket(unwrapBasket(result.data));
  if (!basket?.id) {
    return {
      ok: false,
      message: "Basket created but id missing",
      data: result.data,
    };
  }
  return { ok: true, basket, data: result.data };
}

export async function updateCustomBasket({
  basketId,
  name,
  description,
  investAmount,
  funds,
}) {
  const id = Number(basketId);
  if (!Number.isFinite(id) || id <= 0) return { ok: false, message: "Invalid basket" };

  const body = {};
  const trimmedName = String(name || "").trim().slice(0, 48);
  if (trimmedName) body.name = trimmedName;
  if (description != null) body.description = String(description).trim().slice(0, 140);
  const amount = Math.round(Number(investAmount) || 0);
  if (amount > 0) body.investAmount = amount;
  if (Array.isArray(funds)) {
    const payloadFunds = funds
      .map((fund) => {
        const mfId = Number(fund.mfId || fund.localMfId || fund.id) || 0;
        const weight = Math.min(100, Math.max(1, Math.round(Number(fund.weight) || 0)));
        if (mfId <= 0 || weight <= 0) return null;
        return { mfId, weight };
      })
      .filter(Boolean);
    if (payloadFunds.length < 2) return { ok: false, message: "Add at least 2 funds" };
    if (payloadFunds.length > 5) return { ok: false, message: "Up to 5 funds only" };
    if (!weightsSumOk(payloadFunds)) return { ok: false, message: "Weights must add up to 100%" };
    body.funds = payloadFunds;
  }

  const result = await stockWrite(`basket/custom/${id}`, {
    method: "PATCH",
    body,
    fallbackMessage: "Could not update basket. Please try again.",
  });
  if (!result.ok) return result;
  const basket = normalizeBasket(unwrapBasket(result.data)) || (await getBasket(id));
  if (!basket?.id) {
    return { ok: true, basket: { id, ...body, funds: body.funds || [] }, data: result.data };
  }
  return { ok: true, basket, data: result.data };
}

export async function deleteCustomBasket(basketId) {
  const id = Number(basketId);
  if (!Number.isFinite(id) || id <= 0) return { ok: false, message: "Invalid basket" };
  return stockWrite(`basket/custom/${id}`, {
    method: "DELETE",
    fallbackMessage: "Could not delete basket. Please try again.",
  });
}

/**
 * Custom only. Server flag wins; else lumpsum always, SIP only while inactive/none.
 */
export function canEditBasketFunds(basket) {
  if (!basket || basket.isDefault) return false;
  if (basket.canEditFunds === false) return false;
  if (basket.canEditFunds === true) return true;
  const mode = String(basket.investmentMode || "").toUpperCase();
  if (mode === "LUMPSUM") return true;
  const status = String(basket.sipStatus || "").toUpperCase();
  return !status || status === "INACTIVE";
}

export function canDeleteBasket(basket) {
  return !!basket && !basket.isDefault && Number(basket.id) > 0;
}

export function normalizeBasket(row) {
  if (!row || typeof row !== "object") return null;
  const id = num(row.id) || num(row.basketId) || 0;
  if (id <= 0) return null;
  const fundsRaw = row.funds || row.basketFunds || row.basket_funds || row.allocations || [];
  const funds = (Array.isArray(fundsRaw) ? fundsRaw : []).map(normalizeFund).filter(Boolean);
  const asset =
    row.assetClassGoal || row.assetClass || row.goal || null;
  const editableRaw = row.canEditFunds ?? row.fundsEditable ?? row.canEdit;
  let canEditFunds = null;
  if (editableRaw === true || editableRaw === false) canEditFunds = editableRaw;
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
    canEditFunds,
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
