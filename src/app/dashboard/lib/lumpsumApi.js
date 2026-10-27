import { endSession, getAccessToken, getUserStage, storeTokens } from "../../signup/lib/authApi";
import { AUTH_BASE, PAYMENT_BASE, STOCK_BASE } from "../../signup/lib/apiHosts";
import { cutAtFund } from "./investmentApi";
import { loadPortfolioForSip, resolveUserIp, updateMfia, userFacingMessage } from "./sipInvestApi";

function messageFromPayload(data, fallback) {
  if (data == null) return fallback;
  if (typeof data === "string" && data.trim()) return userFacingMessage(data, fallback);
  if (typeof data.message === "string" && data.message.trim()) {
    return userFacingMessage(data.message, fallback);
  }
  return fallback;
}

async function authed(base, path, { method = "GET", body, wafSafeBody = false } = {}) {
  const token = getAccessToken();
  if (!token) return { ok: false, message: "Session required" };
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (body != null) headers["Content-Type"] = "application/json";
  let raw = body != null ? JSON.stringify(body) : undefined;
  if (raw && wafSafeBody) raw = raw.replace(/:\/\//g, "\\u003a\\u002f\\u002f");
  let res;
  try {
    res = await fetch(`${base}${path}`, { method, headers, body: raw });
  } catch {
    return { ok: false, message: "Could not reach server", status: 0 };
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

function todayYmd() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function paymentPostbackUrl() {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://fydaa.com";
  return `${origin}/Successpagelumpsum`;
}

const PENDING_LUMPSUM_KEY = "fydaa.pendingLumpsumPayment";

export function setPendingLumpsumPayment(payload) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(PENDING_LUMPSUM_KEY, JSON.stringify({ ...payload, at: Date.now() }));
}

export function getPendingLumpsumPayment() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_LUMPSUM_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPendingLumpsumPayment() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(PENDING_LUMPSUM_KEY);
}

export async function checkLumpsumReadiness() {
  const stage = await getUserStage().catch(() => null);
  const kyc = await authed(AUTH_BASE, "kyc/check-kyc", { method: "POST", body: {} });
  const entity = kyc.data?.entity_details?.name || kyc.data?.data?.entity_details?.name || "";
  const kycOk = kyc.ok && (kyc.data?.status === true || kyc.data?.status === "true")
    && String(kyc.data?.action || "").toLowerCase() !== "modify";
  const bankOk = stage?.isBank === true || stage?.isBank === "true";
  const nomineeOk = stage?.isNominee === true || stage?.isNominee === "true";
  const model = String(stage?.investmentModel || "").toUpperCase();
  const modelSet = model === "RIA" || model === "ARN";

  return {
    stage,
    kycOk,
    kycName: entity,
    bankOk,
    nomineeOk,
    modelSet,
    model,
    checklist: [
      {
        id: "model",
        label: "Investment model",
        detail: modelSet
          ? (model === "RIA" ? "Direct (RIA) selected" : "Regular (ARN) selected")
          : "Choose Direct (RIA) or Regular (ARN)",
        done: modelSet,
      },
      {
        id: "kyc",
        label: "KYC",
        detail: entity ? `${entity} · verified` : "Complete KYC and bank before payment",
        done: kycOk && bankOk,
      },
      {
        id: "consent",
        label: "Consent otp",
        detail: "Required before lumpsum payment",
        done: false,
      },
    ],
  };
}

export function nextLumpsumAction({ readiness, consentDone }) {
  if (!readiness?.modelSet) return { label: "Choose investment model →", step: "model" };
  if (!readiness?.kycOk) return { label: "Complete KYC →", step: "kyc" };
  if (!readiness?.bankOk) return { label: "Add bank details →", step: "bank" };
  if (!readiness?.nomineeOk) return { label: "Add nominee →", step: "nominee" };
  if (!consentDone) return { label: "Verify consent OTP →", step: "consent" };
  return { label: "Continue to payment →", step: "pay" };
}

export async function selectInvestmentModel(model) {
  const value = String(model || "").toUpperCase() === "ARN" ? "ARN" : "RIA";
  const result = await authed(AUTH_BASE, "user/select-investment-model", {
    method: "POST",
    body: { investmentModel: value },
  });
  if (!result.ok && result.status === 400) return { ok: true, already: true, data: result.data };
  if (result.ok && result.data) storeTokens(result.data);
  return result;
}

export async function canCreateLumpsum({ goalId, fund }) {
  const params = new URLSearchParams({ goalId: String(goalId) });
  if (fund?.id) params.set("selectedMfId", String(fund.id));
  if (fund?.scheme) params.set("selectedScheme", String(fund.scheme));
  const result = await authed(STOCK_BASE, `mutualFund/lumpsum/can-create?${params.toString()}`);
  if (!result.ok) return result;
  const raw = result.data?.data && typeof result.data.data === "object"
    ? { ...result.data, ...result.data.data }
    : result.data;
  const action = String(raw?.action || "create").toLowerCase();
  const existing = raw?.existingLumpsum || null;
  const existingId = Number(existing?.id);
  const scheme = String(existing?.selectedScheme || existing?.scheme || "").trim();
  const useAdd = action === "add_money" && Number.isFinite(existingId) && existingId > 0 && !!scheme;
  return {
    ok: true,
    action: useAdd ? "add_money" : "create",
    existingLumpsum: useAdd ? existing : null,
    data: raw,
  };
}

export async function createLumpsum({ amount, goalId, portfolioId, fund }) {
  const body = {
    investedAmount: Math.round(Number(amount) || 0),
    goalId: Number(goalId),
    investmentDate: todayYmd(),
  };
  if (portfolioId != null && Number(portfolioId) > 0) body.portfolioId = Number(portfolioId);
  if (fund?.id && Number(fund.id) > 0) body.selectedMfId = Number(fund.id);
  if (fund?.scheme) body.selectedScheme = String(fund.scheme);
  const result = await authed(STOCK_BASE, "mutualFund/lumpsum/create", { method: "POST", body });
  if (!result.ok) return result;
  const raw = result.data?.data && typeof result.data.data === "object"
    ? { ...result.data, ...result.data.data }
    : result.data;
  const id = raw?.lumpsumData?.id ?? raw?.lumpsumId ?? raw?.id;
  const port = raw?.lumpsumData?.portfolioId ?? raw?.portfolioId ?? portfolioId;
  if (!id) return { ok: false, message: "Lumpsum created but id missing", data: raw };
  return { ok: true, lumpsumId: id, portfolioId: port, data: raw };
}

export async function loadBuyOrdersForLumpsum({ amount, portfolioId }) {
  const min = Math.max(1, Math.round(Number(amount) || 0));
  const params = new URLSearchParams({ minimumAmount: String(min) });
  if (portfolioId != null && portfolioId !== "") params.set("portfolioId", String(portfolioId));
  const result = await authed(STOCK_BASE, `stock/buyOrderMf?${params.toString()}`);
  if (!result.ok) return result;
  const list = Array.isArray(result.data?.orders)
    ? result.data.orders
    : Array.isArray(result.data?.data)
      ? result.data.data
      : Array.isArray(result.data)
        ? result.data
        : [];
  const orders = list.map((row) => {
    const next = { ...row };
    if (next.price != null) next.price = String(next.price);
    return next;
  });
  if (!orders.length) return { ok: false, message: "Could not build purchase orders", data: result.data };
  return { ok: true, orders, data: result.data };
}

function customOrderLine({ fund, amount }) {
  const id = Number(fund?.id) || 0;
  const scheme = String(fund?.scheme || "");
  const name = cutAtFund(fund?.fullName || fund?.name) || fund?.name || "Fund";
  return [{
    stockId: id,
    ticker: scheme,
    stockName: name,
    stockType: "Custom",
    capType: "Large Cap",
    weight: 1,
    price: "100",
    minimumamount: 500,
    quantity: 0,
    systemQty: 0,
    orderValue: Math.round(Number(amount) || 0),
    stock: id,
    type: "purchase",
    transactionType: 1,
    portfolioType: 2,
    scheme,
  }];
}

export async function completeLumpsum({
  lumpsumId,
  amount,
  paymentMethod,
  portfolioId,
  fund,
  ownFund,
}) {
  const userIp = await resolveUserIp();
  let orders;
  if (ownFund && fund?.scheme) {
    orders = customOrderLine({ fund, amount });
  } else {
    const buy = await loadBuyOrdersForLumpsum({ amount, portfolioId });
    if (!buy.ok) return buy;
    orders = buy.orders;
  }
  const result = await authed(STOCK_BASE, `mutualFund/lumpsum/${lumpsumId}/complete`, {
    method: "POST",
    wafSafeBody: true,
    body: {
      user_ip: userIp,
      payment_postback_url: paymentPostbackUrl(),
      payment_method: paymentMethod === "NETBANKING" ? "NETBANKING" : "UPI",
      orders,
    },
  });
  if (!result.ok) return result;
  const raw = result.data?.data && typeof result.data.data === "object"
    ? { ...result.data, ...result.data.data }
    : result.data;
  const paymentUrl = raw?.paymentUrl || raw?.payment_url || raw?.authorizationUrl;
  const paymentId = raw?.paymentId || raw?.payment_id;
  if (!paymentUrl) {
    return {
      ok: false,
      message: "Investment submitted. We will update your portfolio shortly.",
      submitted: true,
      data: raw,
    };
  }
  return { ok: true, paymentUrl, paymentId, data: raw };
}

export async function captureLumpsumPayment(paymentId) {
  const result = await authed(PAYMENT_BASE, `subscription/payment/${paymentId}`);
  if (!result.ok) return result;
  const raw = result.data?.data && typeof result.data.data === "object"
    ? { ...result.data, ...result.data.data }
    : result.data;
  const status = String(raw?.status || "").toUpperCase();
  const success = ["SUCCESS", "SUCCESSFUL", "PAID", "APPROVED", "COMPLETED"].includes(status);
  const fail = ["FAILED", "FAILURE", "REJECTED", "CANCELLED", "CANCELED", "EXPIRED"].includes(status);
  return {
    ok: true,
    success,
    fail,
    status,
    amount: raw?.amount,
    reason: raw?.failed_reason || raw?.failure_reason || raw?.failure_message || raw?.message || "",
    data: raw,
  };
}

export async function runLumpsumPayment({
  goalId,
  amount,
  fund,
  fundMode,
  paymentMethod,
  onProgress,
}) {
  const ownFund = fundMode === "own";
  onProgress?.("Checking existing investment…");
  const can = await canCreateLumpsum({ goalId, fund: ownFund ? fund : null });
  if (!can.ok) return can;

  let lumpsumId = can.existingLumpsum?.id;
  let portfolioId = can.existingLumpsum?.portfolioId ?? null;

  if (can.action === "create") {
    onProgress?.("Creating investment…");
    const port = ownFund ? null : await loadPortfolioForSip(goalId, null);
    portfolioId = port?.portfolioId ?? null;
    const created = await createLumpsum({
      amount,
      goalId,
      portfolioId: ownFund ? null : portfolioId,
      fund: ownFund ? fund : null,
    });
    if (!created.ok) return created;
    lumpsumId = created.lumpsumId;
    if (!ownFund) portfolioId = created.portfolioId ?? portfolioId;
  }

  onProgress?.("Updating your investment profile…");
  const mfia = await updateMfia();
  if (!mfia.ok) return { ok: false, message: mfia.message || "Could not update investment account" };

  onProgress?.("Preparing payment…");
  const complete = await completeLumpsum({
    lumpsumId,
    amount,
    paymentMethod,
    portfolioId: ownFund ? null : portfolioId,
    fund,
    ownFund,
  });
  if (!complete.ok) return complete;

  setPendingLumpsumPayment({
    paymentId: complete.paymentId,
    lumpsumId,
    amount,
    goalId,
  });

  return {
    ok: true,
    paymentUrl: complete.paymentUrl,
    paymentId: complete.paymentId,
    lumpsumId,
  };
}
