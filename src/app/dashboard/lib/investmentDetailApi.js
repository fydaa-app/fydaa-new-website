import { endSession, getAccessToken } from "../../signup/lib/authApi";
import { PAYMENT_BASE, STOCK_BASE } from "../../signup/lib/apiHosts";
import {
  loadBuyOrdersForSip,
  resolveUserIp,
  sendConsentOtp,
  updateMfia,
  userFacingMessage,
  verifyConsentOtp,
} from "./sipInvestApi";
import { captureLumpsumPayment } from "./lumpsumApi";

function messageFromPayload(data, fallback) {
  if (data == null) return fallback;
  if (typeof data === "string" && data.trim()) return userFacingMessage(data, fallback);
  if (typeof data.message === "string" && data.message.trim()) {
    return userFacingMessage(data.message, fallback);
  }
  return fallback;
}

function stringifyBody(body, { wafSafe = false } = {}) {
  const raw = JSON.stringify(body);
  if (!wafSafe) return raw;
  return raw.replace(/:\/\//g, "\\u003a\\u002f\\u002f");
}

async function authed(base, path, { method = "GET", body, wafSafeBody = false } = {}) {
  const token = getAccessToken();
  if (!token) return { ok: false, message: "Session required" };
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (body != null) headers["Content-Type"] = "application/json";
  let res;
  try {
    res = await fetch(`${base}${path}`, {
      method,
      headers,
      body: body != null ? stringifyBody(body, { wafSafe: wafSafeBody }) : undefined,
    });
  } catch {
    return { ok: false, message: "Network error. Try again.", status: 0 };
  }
  if (res.status === 401) {
    endSession();
    return { ok: false, message: "Session expired", status: 401 };
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) {
    return {
      ok: false,
      message: messageFromPayload(data, `Request failed (${res.status})`),
      data,
      status: res.status,
    };
  }
  return { ok: true, data, status: res.status };
}

function firstList(data, keys = ["data", "orders", "items", "results"]) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  for (const key of keys) {
    if (Array.isArray(data[key])) return data[key];
  }
  if (data.data && typeof data.data === "object") return firstList(data.data, keys);
  return [];
}

export function addMoneyMinForTerm(term) {
  const text = String(term || "").toLowerCase().replace(/_/g, " ");
  if (text.includes("short")) return 100;
  return 1000;
}

export function isInstaFdGoal(name) {
  return String(name || "").toLowerCase().includes("instafd");
}

export function pendingWithdrawalCovers(available, pendingAmount) {
  const avail = Number(available) || 0;
  const pending = Number(pendingAmount) || 0;
  if (avail <= 1) return true;
  if (pending <= 0) return false;
  return avail - pending <= 1;
}

export function paymentPostbackUrl() {
  if (typeof window === "undefined") return "https://fydaa.com";
  return `${window.location.origin}/dashboard`;
}

export { sendConsentOtp, verifyConsentOtp };

/** Top-up existing SIP: OTP already verified by caller. */
export async function runAddMoney({ sipId, portfolioId, amount, onProgress }) {
  const id = Number(sipId);
  if (!Number.isFinite(id) || id <= 0) {
    return { ok: false, message: "Missing SIP id" };
  }

  onProgress?.("Updating your investment profile…");
  const mfia = await updateMfia();
  if (!mfia.ok) {
    return { ok: false, message: mfia.message || "Could not update investment account" };
  }

  onProgress?.("Building order…");
  const buy = await loadBuyOrdersForSip({
    sipId: id,
    amount,
    portfolioId: portfolioId != null && Number(portfolioId) > 0 ? portfolioId : null,
  });
  if (!buy.ok) return buy;
  if (!buy.orders?.length) {
    return { ok: false, message: "No orders found in buyOrderResponse" };
  }

  onProgress?.("Confirming purchase…");
  const userIp = await resolveUserIp();
  const result = await authed(STOCK_BASE, "mutualFund/mf-transaction/orders/complete", {
    method: "POST",
    wafSafeBody: true,
    body: {
      user_ip: userIp,
      sipId: id,
      payment_postback_url: paymentPostbackUrl(),
      orders: buy.orders,
    },
  });
  if (!result.ok) return result;

  const raw = result.data?.data && typeof result.data.data === "object"
    ? { ...result.data, ...result.data.data }
    : result.data;
  const paymentUrl = raw?.paymentUrl || raw?.payment_url || raw?.authorizationUrl;
  const paymentId = raw?.paymentId || raw?.payment_id;

  if (!paymentUrl) {
    return { ok: true, submitted: true, data: raw };
  }
  return { ok: true, paymentUrl, paymentId, data: raw };
}

export async function capturePayment(paymentId) {
  return captureLumpsumPayment(paymentId);
}

export async function openPaymentAndCapture(paymentUrl, paymentId, { timeoutMs = 180000 } = {}) {
  if (!paymentUrl) return { ok: true, skipped: true };
  const popup = typeof window !== "undefined"
    ? window.open(paymentUrl, "_blank", "noopener,noreferrer")
    : null;

  if (!paymentId) {
    return { ok: true, opened: !!popup, waiting: false };
  }

  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    await new Promise((r) => setTimeout(r, 2500));
    const cap = await capturePayment(paymentId);
    if (!cap.ok) continue;
    if (cap.success) return { ok: true, success: true, data: cap.data };
    if (cap.fail) {
      return { ok: false, message: cap.reason || "Payment failed", failed: true, data: cap.data };
    }
  }
  return {
    ok: true,
    pending: true,
    message: "Payment is still processing. Check History shortly.",
  };
}

function normalizeWithdrawalLines(data) {
  return firstList(data, ["data", "orders", "items", "withdrawals"]).map((row) => ({ ...row }));
}

export async function loadWithdrawalPreview({ sipId, portfolioId, amount, planId }) {
  const min = Math.max(1, Math.round(Number(amount) || 0));
  const params = new URLSearchParams({ minimumAmount: String(min) });
  if (sipId != null && Number(sipId) > 0) params.set("sipId", String(sipId));
  if (portfolioId != null && Number(portfolioId) > 0) params.set("portfolioId", String(portfolioId));
  if (planId != null && Number(planId) > 0) params.set("planId", String(planId));

  const result = await authed(STOCK_BASE, `stock/withdrawalMf?${params.toString()}`);
  if (!result.ok) {
    if (result.status === 401) return { ...result, message: "Unauthorized — login again" };
    if (result.status === 404) return { ...result, message: "API endpoint not found" };
    return result;
  }
  const lines = normalizeWithdrawalLines(result.data);
  return { ok: true, lines, data: result.data };
}

export async function runWithdrawFromSip({
  sipId,
  portfolioId,
  amount,
  mode,
  goalName,
  otp,
  onProgress,
}) {
  const id = Number(sipId);
  if (!Number.isFinite(id) || id <= 0) {
    return { ok: false, message: "Missing SIP id" };
  }
  const type = mode === "complete" ? "complete" : "partial";
  const withdrawAmount = Math.round(Number(amount) || 0);
  if (type === "partial" && withdrawAmount < 50) {
    return { ok: false, message: "Minimum withdrawal is ₹50" };
  }

  onProgress?.("Preparing withdrawal…");
  const preview = await loadWithdrawalPreview({
    sipId: id,
    portfolioId,
    amount: Math.max(withdrawAmount, 50),
  });
  if (!preview.ok) return preview;

  let lines = preview.lines || [];
  if (!lines.length) {
    return { ok: false, message: "Redemption data is empty", status: 400 };
  }

  const instant = isInstaFdGoal(goalName) && withdrawAmount <= 50000;
  const userIp = await resolveUserIp();
  const body = {
    user_ip: userIp,
    sipId: id,
    type,
    data: lines,
    minimumamount: 0,
    orderValue: 0,
    weight: 0,
    FixedBonds: 0,
    Gold: 0,
    IndianStock: 0,
    RealEstate: 0,
    GlobalStock: 0,
    portfolioId: Number(portfolioId) > 0 ? Number(portfolioId) : 0,
    portfolioName: "",
  };
  if (instant) {
    body.gateway = "ondc";
    body.redemption_mode = "instant";
    if (otp) body.otp = String(otp);
  }

  onProgress?.("Confirming withdrawal…");
  const result = await authed(STOCK_BASE, "mutualFund/mf-redemption/complete-from-sip", {
    method: "POST",
    body,
  });
  if (!result.ok) return result;

  const raw = result.data?.data && typeof result.data.data === "object"
    ? { ...result.data, ...result.data.data }
    : result.data;
  const ids = firstList(raw, ["mfRedemptionIds", "ids"]);
  if (!ids.length && raw?.error) {
    return { ok: false, message: messageFromPayload(raw, "Withdrawal failed"), data: raw };
  }
  return { ok: true, instant, data: raw, mfRedemptionIds: ids };
}

export async function modifySipAmount({ sipId, newAmount }) {
  const id = Number(sipId);
  const amount = Math.round(Number(newAmount) || 0);
  if (!Number.isFinite(id) || id <= 0) return { ok: false, message: "Missing SIP id" };
  if (amount <= 0) return { ok: false, message: "Enter a valid amount" };

  const userIp = await resolveUserIp();
  return authed(STOCK_BASE, "mutualfund/sip/modify-amount", {
    method: "POST",
    body: { sipId: id, newAmount: amount, user_ip: userIp },
  });
}

export const CANCEL_REASONS = [
  { code: "amount_not_available", title: "Amount Not Available" },
  { code: "investment_returns_not_as_expected", title: "Returns Not As Expected" },
  { code: "investment_goal_complete", title: "Investment Goal Complete" },
  { code: "invest_later", title: "Invest Later" },
  { code: "custom_reason", title: "Other Reason" },
];

export async function cancelSipPlan({ sipId, cancellationCode, cancellationReason }) {
  const id = Number(sipId);
  if (!Number.isFinite(id) || id <= 0) return { ok: false, message: "Missing SIP id" };
  if (!cancellationCode) return { ok: false, message: "Select a reason" };

  const body = {
    sipId: id,
    cancellation_code: cancellationCode,
  };
  if (cancellationCode === "custom_reason") {
    const text = String(cancellationReason || "").trim();
    if (!text) return { ok: false, message: "Please enter a reason" };
    body.cancellation_reason = text;
  }
  return authed(STOCK_BASE, "mutualfund/sip-purchase-plans/cancel", {
    method: "POST",
    body,
  });
}

export function modifyLimits(frequency) {
  const daily = String(frequency || "").toLowerCase() === "daily";
  return daily
    ? { min: 100, max: 1000, label: "daily" }
    : { min: 1000, max: 25000, label: "monthly" };
}
