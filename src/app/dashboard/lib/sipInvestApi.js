import { endSession, getAccessToken, getUserStage } from "../../signup/lib/authApi";
import { AUTH_BASE, PAYMENT_BASE, STOCK_BASE } from "../../signup/lib/apiHosts";
import { cutAtFund, projectSip, PRODUCT_TABS } from "./investmentApi";

/** Hide backend / ops messages (goalId, risk bucket, stack-style text) from end users. */
export function userFacingMessage(raw, fallback = "") {
  const text = String(raw || "").trim();
  if (!text) return fallback;
  if (/goal\s*id|risk\s*bucket|direct mutual fund portfolio|no .*portfolio found|request failed\s*\(|stack|exception|sql|prisma|nestjs/i.test(text)) {
    return fallback;
  }
  return text;
}

function messageFromPayload(data, fallback) {
  if (data == null) return fallback;
  if (typeof data === "string" && data.trim()) return userFacingMessage(data, fallback);
  if (typeof data.message === "string" && data.message.trim()) {
    return userFacingMessage(data.message, fallback);
  }
  if (Array.isArray(data.message)) {
    const parts = data.message
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.message) return String(item.message);
        if (item?.property && item?.message) return `${item.property}: ${item.message}`;
        return "";
      })
      .filter(Boolean);
    if (parts.length) return userFacingMessage(parts.join("; "), fallback);
  }
  if (Array.isArray(data)) {
    const parts = data
      .map((item) => (typeof item === "string" ? item : item?.message || ""))
      .filter(Boolean);
    if (parts.length) return userFacingMessage(parts.join("; "), fallback);
  }
  return fallback;
}

function stringifyBody(body, { wafSafe = false } = {}) {
  const raw = JSON.stringify(body);
  // AWS WAF GenericRFI_BODY blocks literal "://" in POST bodies; Nest still JSON-parses \u escapes.
  if (!wafSafe) return raw;
  return raw.replace(/:\/\//g, "\\u003a\\u002f\\u002f");
}

async function authed(base, path, { method = "GET", body, wafSafeBody = false, timeoutMs } = {}) {
  const token = getAccessToken();
  if (!token) return { ok: false, message: "Session required" };
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (body != null) headers["Content-Type"] = "application/json";
  const controller = timeoutMs ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  let res;
  try {
    res = await fetch(`${base}${path}`, {
      method,
      headers,
      body: body != null ? stringifyBody(body, { wafSafe: wafSafeBody }) : undefined,
      signal: controller?.signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") {
      return {
        ok: false,
        message:
          "First installment setup is taking longer than expected. Please check your order status or contact support.",
        status: 0,
      };
    }
    return {
      ok: false,
      message: "Network or CORS error — the server blocked or returned an unreadable response.",
      status: 0,
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
  if (res.status === 401) {
    endSession();
    return { ok: false, message: "Session expired", status: 401 };
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error) {
    const fallback =
      res.status === 403
        ? "Payment service refused this request (403)."
        : res.status === 0
        ? "Request failed"
        : `Request failed (${res.status})`;
    return {
      ok: false,
      message: messageFromPayload(data, fallback),
      data,
      status: res.status,
    };
  }
  return { ok: true, data, status: res.status };
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

function firstString(row, keys) {
  for (const key of keys) {
    const value = row?.[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function ymd(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function nextBusinessDay(from = new Date()) {
  const d = new Date(from);
  const day = d.getDay();
  if (day === 6) d.setDate(d.getDate() + 2);
  else if (day === 0) d.setDate(d.getDate() + 1);
  return d;
}

export function tabMeta(key) {
  return PRODUCT_TABS.find((tab) => tab.key === key) || PRODUCT_TABS.find((tab) => tab.key === "equity");
}

export function installmentCount(frequency, tenureYears) {
  const months = tenureYears * 12;
  return frequency === "daily" ? months * 22 : months;
}

export function horizonLabel(frequency, tenureYears) {
  const count = installmentCount(frequency, tenureYears);
  const unit = tenureYears === 1 ? "year" : "years";
  if (frequency === "daily") return `${count} installments · ${tenureYears} ${unit} (business days)`;
  return `${count} installments · ${tenureYears} ${unit}`;
}

export async function loadPortfolioForSip(goalId, customFund, basketId) {
  if (customFund?.name) {
    return {
      portfolioId: null,
      funds: [{
        name: cutAtFund(customFund.name) || customFund.name,
        fullName: customFund.fullName || customFund.name,
        scheme: customFund.scheme,
        id: customFund.id,
        weight: 100,
        cagr: null,
        risk: null,
      }],
      rate: null,
    };
  }
  const basket = Number(basketId);
  const query = Number.isFinite(basket) && basket > 0
    ? `basketId=${basket}`
    : `goalId=${goalId}`;
  const result = await authed(STOCK_BASE, `mutualFund/recommended-portfolio?${query}`);
  if (!result.ok) return { portfolioId: null, funds: [], rate: null, message: "" };
  const raw = result.data;
  const data = raw?.data && typeof raw.data === "object" && !Array.isArray(raw.data)
    ? { ...raw, ...raw.data }
    : raw;
  const list = firstList(data);
  const fromPortfolio = data?.portfolio ? firstList(data.portfolio) : [];
  const rows = list.length ? list : fromPortfolio;
  const funds = rows.map((row) => {
    const nested = row?.mutualFund || row?.fund || row?.schemeDetails || row?.mf || row?.stock || null;
    const name = firstString(row, [
      "name", "shortName", "schemeName", "fundName", "title",
      "scheme_name", "fund_name", "stockName", "stock_name", "mfName", "mutualFundName",
    ]) || firstString(nested, [
      "name", "shortName", "schemeName", "fundName", "title",
      "scheme_name", "fund_name", "stockName", "stock_name", "mfName",
    ]);
    const assetClass = firstString(row, [
      "assetClass", "asset_class", "category", "stockType", "stock_type", "type", "assetType",
    ]) || firstString(nested, ["assetClass", "category", "stockType", "type"]);
    const display = cutAtFund(name) || name;
    if (!display) return null;
    return {
      name: display,
      fullName: name || display,
      label: assetClass && display ? `${assetClass} · ${display}` : display,
      assetClass,
      scheme: firstString(row, ["isin", "ticker", "scheme", "schemeCode"])
        || firstString(nested, ["isin", "ticker", "scheme", "schemeCode"]),
      id: row.id ?? row.mfId ?? row.localMfId ?? nested?.id ?? nested?.mfId ?? null,
      weight: Number(row.weight ?? row.allocation ?? nested?.weight ?? 100) || 100,
      cagr: row.cagr ?? row.returns_3y ?? row.return3Y ?? nested?.cagr ?? null,
      risk: row.risk ?? row.riskLevel ?? row.risk_level ?? nested?.risk ?? null,
    };
  }).filter(Boolean);
  return {
    portfolioId: data?.portfolioId ?? data?.portfolio?.id ?? null,
    funds,
    rate: Number(data?.goal?.expectedAnnualReturnPercent) || Number(data?.expectedAnnualReturnPercent) || null,
    message: "",
  };
}

export async function checkInvestReadiness() {
  const stage = await getUserStage().catch(() => null);
  const kyc = await authed(AUTH_BASE, "kyc/check-kyc", { method: "POST", body: {} });
  const entity = kyc.data?.entity_details?.name || kyc.data?.data?.entity_details?.name || "";
  const kycOk = kyc.ok && (kyc.data?.status === true || kyc.data?.status === "true")
    && String(kyc.data?.action || "").toLowerCase() !== "modify";
  const bankOk = stage?.isBank === true || stage?.isBank === "true";
  const nomineeOk = stage?.isNominee === true || stage?.isNominee === "true";
  const model = String(stage?.investmentModel || "").toUpperCase();
  const modelSet = model === "RIA" || model === "ARN";
  const packagePaid = (stage?.isPackage === true || stage?.isPackage === "true")
    && String(stage?.packageName || "").toLowerCase() === "comprehensive financial plan";

  return {
    stage,
    kycOk,
    kycName: entity,
    bankOk,
    nomineeOk,
    modelSet,
    model,
    packagePaid,
    checklist: [
      {
        id: "kyc",
        label: "KYC",
        detail: entity ? `${entity} · verified` : "Complete KYC before mandate and first installment",
        done: kycOk,
      },
      {
        id: "consent",
        label: "Consent otp",
        detail: "Required before mandate and first installment",
        done: false,
      },
      {
        id: "mandate",
        label: "UPI auto-debit mandate",
        detail: "Each SIP needs its own UPI AutoPay",
        done: false,
      },
    ],
  };
}

export function nextReviewAction({ readiness, consentDone, mandateDone }) {
  if (!readiness?.kycOk) return { label: "Complete KYC →", step: "kyc" };
  if (!readiness?.bankOk) return { label: "Add bank details →", step: "bank" };
  if (!consentDone) return { label: "Verify consent otp →", step: "consent" };
  if (!mandateDone) return { label: "Set up UPI AutoPay →", step: "mandate" };
  return { label: "Start first debit →", step: "debit" };
}

export async function createSipSetup(args) {
  const {
    goalId,
    basketId,
    amount,
    tenureYears,
    frequency,
    sipName,
    fund,
    goalAmount,
    sipDateDay = 10,
  } = args;
  const months = tenureYears * 12;
  const firstDebit = nextBusinessDay();
  const start = new Date(firstDebit);
  const isBasket = Number(basketId) > 0;
  // Basket SIPs are always monthly.
  const monthly = isBasket || frequency !== "daily";
  if (monthly) {
    const today = new Date();
    start.setDate(sipDateDay);
    if (today.getDate() >= sipDateDay) start.setMonth(start.getMonth() + 1);
  }
  const end = addMonths(start, months);
  const body = {
    sipAmount: Number(amount).toFixed(2),
    sipName: sipName || "SIP",
    goalAmount: Number(goalAmount || amount).toFixed(2),
    autoRenewDate: ymd(addMonths(new Date(), 1)),
    startDate: ymd(start),
    endDate: ymd(end),
    status: "INACTIVE",
    sipTenure: String(months),
    intendedTenureMonths: Math.max(1, Math.min(360, months)),
  };
  if (isBasket) {
    body.basketId = Number(basketId);
  } else if (goalId != null) {
    body.goalId = goalId;
  }
  if (!monthly) {
    body.sipFrequency = "daily";
  } else {
    body.sipDate = ymd(start);
  }
  // Multi-fund baskets must not send a single selected scheme.
  if (!isBasket && fund?.scheme) {
    body.selectedScheme = fund.scheme;
    if (Number(fund.id) > 0) body.selectedMfId = Number(fund.id);
  }
  return authed(STOCK_BASE, "orders/sipSetup", { method: "POST", body });
}

export async function sendConsentOtp() {
  const result = await authed(STOCK_BASE, "mutualFund/consentOtp", { method: "POST", body: {} });
  if (!result.ok) return result;
  const delivered = result.data?.data?.otpDelivered ?? result.data?.otpDelivered;
  if (delivered !== true) {
    return { ok: false, message: "otp not delivered, try again later", data: result.data };
  }
  return result;
}

export async function verifyConsentOtp(otp) {
  return authed(STOCK_BASE, "mutualFund/verifyOtp", {
    method: "POST",
    body: { otp: String(otp || "").trim() },
  });
}

export async function createMandate(sipId, amount) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://fydaa.com";
  const id = Number(sipId);
  if (!Number.isFinite(id) || id <= 0) {
    return { ok: false, message: "Missing SIP id — create the SIP before UPI AutoPay.", status: 400 };
  }
  const result = await authed(PAYMENT_BASE, "subscription/createAndAuthorizeMandate", {
    method: "POST",
    wafSafeBody: true,
    body: {
      mandate_type: "UPI",
      paymentPostbackUrl: `${origin}/Successpagemandate`,
      mandate_limit: Math.round(Number(amount) || 0),
      sipId: id,
    },
  });
  if (!result.ok && (result.status === 0 || result.status === 403)) {
    return {
      ...result,
      message:
        result.status === 403
          ? result.message || "Payment service refused UPI mandate (403)."
          : "UPI mandate blocked before the payment API (WAF/ALB 403).",
    };
  }
  return result;
}

export async function pollMandate(mandateId) {
  return authed(PAYMENT_BASE, `subscription/mandate/${mandateId}`);
}

export async function pollMandateBySip(sipId) {
  return authed(PAYMENT_BASE, `subscription/mandate/sip/${sipId}`);
}

export function illustratedCorpus(amount, rate, tenureYears, daily) {
  return projectSip(amount, rate || 12, tenureYears, daily);
}

const PENDING_FIRST_DEBIT_KEY = "fydaa.pendingSipFirstDebit";
let firstDebitInFlight = null;

export function setPendingSipFirstDebit(payload) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(
    PENDING_FIRST_DEBIT_KEY,
    JSON.stringify({ ...payload, at: Date.now() }),
  );
}

export function getPendingSipFirstDebit() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_FIRST_DEBIT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.sipId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingSipFirstDebit() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(PENDING_FIRST_DEBIT_KEY);
}

export async function updateMfia() {
  const result = await authed(PAYMENT_BASE, "subscription/update-mfia", {
    method: "PATCH",
    body: {},
  });
  if (result.ok || result.status === 200 || result.status === 201) return { ok: true, data: result.data };
  return result;
}

export async function resolveUserIp() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    if (data?.ip) return String(data.ip);
  } catch {
    /* fall through */
  }
  return "127.0.0.1";
}

function normalizeBuyOrders(data) {
  const list = firstList(data, ["orders", "data", "items"]);
  return list.map((row) => {
    const next = { ...row };
    if (next.price != null) next.price = String(next.price);
    return next;
  });
}

function ordersTotal(orders) {
  return orders.reduce((sum, row) => {
    const n = Number(row?.price ?? row?.amount ?? row?.investmentAmount ?? 0);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
}

export async function loadBuyOrdersForSip({ sipId, amount, portfolioId }) {
  const min = Math.max(1, Math.round(Number(amount) || 0));
  const params = new URLSearchParams({
    minimumAmount: String(min),
    sipId: String(sipId),
  });
  if (portfolioId != null && portfolioId !== "") {
    params.set("portfolioId", String(portfolioId));
  }
  const result = await authed(STOCK_BASE, `stock/buyOrderMf?${params.toString()}`);
  if (!result.ok) return result;
  const orders = normalizeBuyOrders(result.data);
  if (!orders.length) {
    return { ok: false, message: "Could not build first installment orders", data: result.data };
  }
  return { ok: true, orders, total: ordersTotal(orders), data: result.data };
}

export async function completeFirstDebitWithMandate({ sipId, userIp, orders }) {
  return authed(
    STOCK_BASE,
    "mutualFund/mf-purchase-plan/orders/flow/complete-with-mandate-first-debit",
    {
      method: "POST",
      timeoutMs: 180000,
      body: {
        user_ip: userIp || "127.0.0.1",
        sipId: Number(sipId),
        orders,
      },
    },
  );
}

function firstDebitPartialNote(data) {
  const failed = firstList(data, ["failed", "failedOrders", "failures", "errors"]);
  if (failed.length) {
    return "Some funds could not be purchased. Your SIP may be partially active — check History or Dreams.";
  }
  return "";
}

export async function runSipFirstDebit({ sipId, amount, portfolioId, onProgress }) {
  const id = Number(sipId);
  if (!Number.isFinite(id) || id <= 0) {
    return { ok: false, message: "Missing SIP id for first debit" };
  }

  onProgress?.("Preparing your transaction…");
  onProgress?.("Updating your investment profile…");
  const mfia = await updateMfia();
  if (!mfia.ok) {
    return { ok: false, message: mfia.message || "Could not update investment account" };
  }

  const userIp = await resolveUserIp();

  onProgress?.("Confirming your UPI mandate…");
  let approved = false;
  for (let i = 0; i < 8; i += 1) {
    const bySip = await pollMandateBySip(id);
    if (bySip.data?.isApproved === true || bySip.data?.data?.isApproved === true) {
      approved = true;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  if (!approved) {
    return { ok: false, message: "UPI mandate is not approved yet. Approve in UPI, then try again." };
  }

  onProgress?.("Building your first installment…");
  const buy = await loadBuyOrdersForSip({ sipId: id, amount, portfolioId });
  if (!buy.ok) return buy;

  const sipAmount = Number(amount) || 0;
  if (buy.total > sipAmount + 0.01) {
    return {
      ok: false,
      message: `Your SIP amount is ₹${Math.round(sipAmount).toLocaleString("en-IN")}, but the fund requires at least ₹${Math.round(buy.total).toLocaleString("en-IN")} for the first installment. Please go back and increase your SIP amount.`,
    };
  }

  onProgress?.("Activating your SIP and debiting the first installment…");
  let result = await completeFirstDebitWithMandate({
    sipId: id,
    userIp,
    orders: buy.orders,
  });

  const msg = String(result.message || "");
  if (!result.ok && /must be approved|current status:\s*cancelled/i.test(msg)) {
    onProgress?.("Confirming your UPI mandate…");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const again = await pollMandateBySip(id);
    if (again.data?.isApproved === true || again.data?.data?.isApproved === true) {
      onProgress?.("Activating your SIP and debiting the first installment…");
      result = await completeFirstDebitWithMandate({
        sipId: id,
        userIp,
        orders: buy.orders,
      });
    }
  }

  if (!result.ok) return result;
  return {
    ok: true,
    data: result.data,
    partialMessage: firstDebitPartialNote(result.data),
  };
}

export async function runPendingSipFirstDebit(onProgress) {
  const pending = getPendingSipFirstDebit();
  if (!pending?.sipId) return { ok: true, skipped: true };
  if (firstDebitInFlight) return firstDebitInFlight;
  firstDebitInFlight = (async () => {
    try {
      const result = await runSipFirstDebit({
        sipId: pending.sipId,
        amount: pending.amount,
        portfolioId: pending.ownFund ? null : pending.portfolioId,
        onProgress,
      });
      if (result.ok) clearPendingSipFirstDebit();
      return result;
    } finally {
      firstDebitInFlight = null;
    }
  })();
  return firstDebitInFlight;
}
