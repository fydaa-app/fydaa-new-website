import { endSession, getAccessToken } from "../../signup/lib/authApi";
import { STOCK_BASE } from "../../signup/lib/apiHosts";

async function stockFetch(path, method = "GET", body) {
  const token = getAccessToken();
  if (!token) return null;
  const res = await fetch(`${STOCK_BASE}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    endSession();
    return null;
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) return null;
  return data;
}

function messageFrom(data, fallback) {
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  return fallback;
}

/** Delete an INACTIVE pending SIP from Home. `DELETE /orders/{sipId}/deletePending` */
export async function deletePendingSip(sipId) {
  const token = getAccessToken();
  if (!token) return { ok: false, message: "Session required" };
  const id = Number(sipId);
  if (!Number.isFinite(id) || id <= 0) return { ok: false, message: "Missing SIP id" };
  let res;
  try {
    res = await fetch(`${STOCK_BASE}orders/${id}/deletePending`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    return { ok: false, message: "Could not reach server" };
  }
  if (res.status === 401) {
    endSession();
    return { ok: false, message: "Session expired" };
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) {
    const raw = messageFrom(data, "");
    if (
      res.status === 404
      || /SIP not found|Only INACTIVE SIPs can be deleted/i.test(raw)
    ) {
      return {
        ok: false,
        message: "Unable to delete this SIP. Only inactive SIPs can be deleted.",
        data,
      };
    }
    return { ok: false, message: raw || "Failed to delete pending SIP", data };
  }
  return { ok: true, data };
}

/** @deprecated Use deletePendingSip */
export async function cancelPendingSip(sipId) {
  return deletePendingSip(sipId);
}

function unwrap(data) {
  if (!data || Array.isArray(data)) return data;
  if (data.summary || data.holdings || data.sips || data.lumpsums || data.orders) return data;
  return data.data || data;
}

export async function loadJourney() {
  const [sipRaw, portfolio] = await Promise.all([
    stockFetch("orders/getMySipMf"),
    loadPortfolio(),
  ]);

  const sips = Array.isArray(sipRaw) ? sipRaw : Array.isArray(sipRaw?.data) ? sipRaw.data : [];
  const statusBySipId = await activeSipStatuses(sips);
  return { sips, portfolio, statusBySipId };
}

function asSips(sipRaw) {
  if (Array.isArray(sipRaw)) return sipRaw;
  if (Array.isArray(sipRaw?.data)) return sipRaw.data;
  return [];
}

async function activeSipStatuses(sips) {
  const statusBySipId = {};
  await Promise.all(
    sips.filter((sip) => sipStatus(sip) === "ACTIVE").map(async (sip) => {
      statusBySipId[sip.id] = await loadSipStatus(sip.id);
    }),
  );
  return statusBySipId;
}

export async function loadMySips() {
  return asSips(await stockFetch("orders/getMySipMf"));
}

function pendingDraftFromSip(sip) {
  const goalId = Number(sip?.goalId ?? sip?.goal?.id) || null;
  const amount = Number(sip?.sipAmount) || 0;
  const tenureMonths = Number(sip?.sipTenure ?? sip?.intendedTenureMonths) || 36;
  const tenureYears = Math.max(1, Math.round(tenureMonths / 12));
  const frequency = String(sip?.sipFrequency || "").toLowerCase() === "daily" ? "daily" : "monthly";
  const scheme = String(sip?.selectedScheme || sip?.scheme || "").trim();
  const mfId = Number(sip?.selectedMfId ?? sip?.mfId) || 0;
  const fundName = sip?.funds?.[0]?.schemeName || sip?.sipName || sip?.goal?.name || "Fund";
  const ownFund = !!scheme;
  return {
    id: sip.id,
    sipId: sip.id,
    name: sip.goal?.name || sip.sipName || "SIP",
    forLabel: amount > 0
      ? `₹${Math.round(amount).toLocaleString("en-IN")}/${frequency === "daily" ? "day" : "month"} · finish setup`
      : "Finish setup to start auto-debit",
    badge: String(sip.status || "INACTIVE").toUpperCase(),
    goalId,
    amount,
    tenureYears,
    frequency,
    monthlyDay: Number(sip?.sipDateDay) || 10,
    goalName: sip.goal?.name || sip.sipName || "SIP",
    fundMode: ownFund ? "own" : "rec",
    fund: ownFund
      ? {
          id: mfId,
          name: fundName,
          fullName: fundName,
          scheme,
        }
      : null,
    portfolioId: sip.portfolioId ?? null,
  };
}

export async function loadHomePending() {
  const sips = asSips(await stockFetch("orders/getMySipMf"));
  const statusBySipId = await activeSipStatuses(sips);
  return pendingSips({ sips, statusBySipId }).map(pendingDraftFromSip);
}

export async function loadPortfolio() {
  let body = unwrap(await stockFetch("mutualFund/portfolio/details"));
  if (!Array.isArray(body?.holdings) || body.holdings.length === 0) {
    await stockFetch("mutualFund/portfolio/sync-reality", "POST");
    body = unwrap(await stockFetch("mutualFund/portfolio/details"));
  }
  if (!Array.isArray(body?.holdings) || body.holdings.length === 0) {
    const fallback = unwrap(await stockFetch("mutualFund/portfolio/holdings"));
    const holdings = Array.isArray(fallback?.holdings) ? fallback.holdings : Array.isArray(fallback) ? fallback : [];
    body = { ...(body || {}), holdings };
  }
  return body;
}

export async function loadSipStatus(sipId) {
  return unwrap(await stockFetch(`mutualFund/sip/status/${sipId}`));
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function fundRows(funds, withValue) {
  return (funds || []).map((fund, index) => {
    const invested = num(fund.investedAmount);
    const current = num(fund.currentValue ?? (withValue ? null : fund.amount));
    const gain = invested != null && current != null ? current - invested : null;
    const gainPct = num(fund.xirr);
    return {
      name: fund.schemeName || "—",
      type: fund.status || fund.frequency || "",
      color: ["#0C4A3E", "#047857", "#6EE7B7"][index % 3],
      val: current ?? num(fund.amount),
      gain,
      gainPct,
      up: gain == null ? gainPct == null || gainPct >= 0 : gain >= 0,
    };
  });
}

function sipStatus(sip) {
  return String(sip?.status || "").toUpperCase();
}

function listOf(value) {
  return Array.isArray(value) ? value : [];
}

export function sipHasExecutedTransaction(status) {
  if (Array.isArray(status)) return status.length > 0;
  if (!status || typeof status !== "object") return false;
  if (status.mfAnalytical || status.mfanalytical || status.MFANALYTICAL || status.mf_analytical) return true;
  if (status.hasTransaction === true || status.transactionExecuted === true) return true;
  const state = String(status.status || status.state || status.orderStatus || "").toUpperCase();
  if (state === "EXECUTED" || state === "COMPLETED" || state === "TRANSACTED") return true;
  if (listOf(status.plans).length > 0 || listOf(status.transactions).length > 0) return true;
  if (status.data && status.data !== status) return sipHasExecutedTransaction(status.data);
  return false;
}

function sipTransacted(sip, statusBySipId) {
  const status = statusBySipId?.[sip.id];
  if (status == null) return num(sip.investedAmount) > 0;
  return sipHasExecutedTransaction(status);
}

function sipTab(sip, statusBySipId) {
  const state = sipStatus(sip);
  if (state === "CANCELLED") return "CANCELLED";
  if (state === "COMPLETED") return "COMPLETED";
  if (state === "ACTIVE" && sipTransacted(sip, statusBySipId)) return "ACTIVE";
  return null;
}

export function pendingSips({ sips, statusBySipId }) {
  return (sips || []).filter((sip) => {
    const state = sipStatus(sip);
    if (state === "INACTIVE" || state === "PENDING") return true;
    if (state === "ACTIVE") return !sipTransacted(sip, statusBySipId);
    return false;
  });
}

export function mapJourney({ sips, portfolio, statusBySipId }) {
  const portfolioSips = Array.isArray(portfolio?.sips) ? portfolio.sips : [];
  const holdings = Array.isArray(portfolio?.holdings) ? portfolio.holdings : [];

  const sipCards = sips
    .filter((sip) => sipTab(sip, statusBySipId))
    .map((sip) => {
      const match = portfolioSips.find((row) => row.sipId === sip.id);
      const invested = num(sip.investedAmount);
      const current = num(sip.currentAmount);
      return {
        id: `sip-${sip.id}`,
        sipId: sip.id,
        tab: sipTab(sip, statusBySipId),
        name: sip.goal?.name || sip.sipName || "SIP",
        forLabel: sip.sipName || "",
        badge: sip.status || "",
        pct: num(sip.percentageCompleted) ?? 0,
        invested,
        current,
        returns: invested != null && current != null ? current - invested : null,
        returnsPct: invested ? ((current - invested) / invested) * 100 : null,
        monthly: num(sip.sipAmount),
        duration: sip.sipTenure != null ? `${sip.sipTenure} months` : "—",
        funds: fundRows(match?.funds?.length ? match.funds : sip.funds, true),
      };
    });

  const outsideCards = holdings
    .filter((holding) => holding?.source === "outsideApp")
    .map((holding) => {
      const invested = num(holding.investedAmount);
      const current = num(holding.currentValue);
      return {
        id: `out-${holding.folioNumber}-${holding.scheme}`,
        tab: "ACTIVE",
        name: holding.schemeName || "Outside app",
        forLabel: holding.folioNumber || "Outside app",
        badge: "Outside app",
        pct: 0,
        invested,
        current,
        returns: invested != null && current != null ? current - invested : null,
        returnsPct: num(holding.xirr),
        monthly: null,
        duration: holding.asOn || "—",
        funds: [],
      };
    });

  return [...sipCards, ...outsideCards];
}

export function remainingInstallments(status) {
  const plans = Array.isArray(status?.plans) ? status.plans : [];
  const values = plans
    .map((plan) => num(plan.remaining_installments))
    .filter((value) => value != null);
  if (!values.length) return null;
  return Math.min(...values);
}
