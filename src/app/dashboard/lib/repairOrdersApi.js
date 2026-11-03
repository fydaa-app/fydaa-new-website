import { getAccessToken, endSession, getUserStage } from "../../signup/lib/authApi";
import { PAYMENT_BASE, STOCK_BASE } from "../../signup/lib/apiHosts";
import { resolveUserIp } from "./sipInvestApi";

const PENDING_REPAIR_PAYMENT_KEY = "fydaa.pendingRepairPayment";

async function stockFetch(path, { method = "GET", body } = {}) {
  const token = getAccessToken();
  if (!token) return { ok: false, message: "Session required", status: 401 };
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (body != null) headers["Content-Type"] = "application/json";
  let res;
  try {
    res = await fetch(`${STOCK_BASE}${path}`, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    return { ok: false, message: "Network or parsing error. Please try again.", status: 0 };
  }
  if (res.status === 401) {
    endSession();
    return { ok: false, message: "Unauthorized - please login again", status: 401 };
  }
  const data = await res.json().catch(() => null);
  if (data?.error === true) {
    return {
      ok: false,
      message: data?.message || `Repair failed (${res.status || "error"})`,
      status: res.status,
      data,
    };
  }
  if (!(res.status === 200 || res.status === 201)) {
    return {
      ok: false,
      message: data?.message || `Server error: ${res.status}`,
      status: res.status,
      data,
    };
  }
  return { ok: true, data };
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function lower(value) {
  return String(value || "").trim().toLowerCase();
}

export function formatFailureReason(raw) {
  return String(raw || "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatFailureReasonUpper(raw) {
  return formatFailureReason(raw).toUpperCase();
}

export function sipCardTitle(sip) {
  return sip?.sipName || sip?.userSipName || sip?.portfolio?.portfolioName || "SIP";
}

export function sipCardSubtitle(sip) {
  const amount = num(sip?.sipAmount);
  const portfolio = sip?.portfolio?.portfolioName || "Portfolio";
  const amt = amount
    ? `₹${Math.round(amount).toLocaleString("en-IN")}/month`
    : null;
  return [amt, portfolio].filter(Boolean).join(" · ");
}

export function filterRepairMonths(sip) {
  const months = Array.isArray(sip?.monthlyBreakdown) ? sip.monthlyBreakdown : [];
  return months
    .filter((month) => num(month?.failedOrdersCount) !== 0)
    .filter((month) => lower(month?.repairStatus) !== "completed")
    .sort((a, b) => String(a.month || "").localeCompare(String(b.month || "")));
}

export function isMonthActionable(month) {
  return month?.canRepair === true && num(month?.totalAmount) > 0 && lower(month?.repairStatus) !== "completed";
}

export function isMonthProcessing(month) {
  return lower(month?.repairStatus) === "processing";
}

export function monthDisplayName(month) {
  return month?.monthName || month?.month || "Month";
}

export function monthSchemes(month) {
  const schemes = Array.isArray(month?.failedSchemes) ? month.failedSchemes : [];
  if (schemes.length) {
    return schemes.map((row) => ({
      schemeName: row.schemeName || row.amcName || "Fund",
      amcName: row.amcName || "",
      amount: num(row.amount),
      failureReason: row.failureReason || "",
    }));
  }
  if (num(month?.totalAmount) > 0) {
    return [{ schemeName: "Failed orders", amcName: "", amount: num(month.totalAmount), failureReason: "" }];
  }
  return [];
}

export function monthRepairableAmount(month) {
  const repairable = num(month?.repairableAmount);
  return repairable > 0 ? repairable : num(month?.totalAmount);
}

export function monthReasonsLabel(month) {
  const reasons = Array.isArray(month?.failureReasons) ? month.failureReasons : [];
  const cleaned = reasons.map(formatFailureReason).filter(Boolean);
  return cleaned.length ? cleaned.join(" · ") : "Failed instalment";
}

export function enrichRepairSip(sip) {
  const months = filterRepairMonths(sip);
  const monthCount = months.length;
  const ordersCount = months.reduce((sum, month) => sum + num(month.failedOrdersCount), 0);
  const failedAmt = months.reduce((sum, month) => sum + num(month.totalAmount), 0);
  const repairableAmt = months.reduce((sum, month) => sum + monthRepairableAmount(month), 0);
  const openMonths = months.filter((month) => isMonthActionable(month) || isMonthProcessing(month));
  const doneMonths = months.filter((month) => lower(month.repairStatus) === "completed");
  const reasons = [
    ...new Set(
      months
        .flatMap((month) => (Array.isArray(month.failureReasons) ? month.failureReasons : []))
        .map(formatFailureReason)
        .filter(Boolean),
    ),
  ];

  return {
    ...sip,
    months,
    monthCount,
    ordersCount,
    failedAmt,
    repairableAmt,
    openCount: openMonths.length,
    doneCount: doneMonths.length,
    reasonsLabel: reasons.length ? reasons.join(" · ") : "Review failed instalments",
    title: sipCardTitle(sip),
    subtitle: sipCardSubtitle(sip),
  };
}

export function filterRepairSips(payload) {
  const sips = Array.isArray(payload?.sips) ? payload.sips : Array.isArray(payload) ? payload : [];
  return sips
    .filter((sip) => num(sip?.totalFailedOrders) > 0)
    .map(enrichRepairSip)
    .filter((sip) => sip.monthCount > 0);
}

export async function fetchUserNeedsRepair() {
  try {
    const stage = await getUserStage();
    const data = stage?.data && typeof stage.data === "object" ? stage.data : stage;
    return data?.isRepair === true;
  } catch {
    return false;
  }
}

export async function fetchRepairDashboard() {
  const result = await stockFetch("mutualFund/repair-dashboard");
  if (!result.ok) return result;
  return { ok: true, sips: filterRepairSips(result.data), data: result.data };
}

export function paymentPostbackUrl() {
  if (typeof window === "undefined") return "https://fydaa.com";
  return `${window.location.origin}/dashboard`;
}

export function setPendingRepairPayment(payload) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(
    PENDING_REPAIR_PAYMENT_KEY,
    JSON.stringify({ ...payload, at: Date.now() }),
  );
}

export function getPendingRepairPayment() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_REPAIR_PAYMENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPendingRepairPayment() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(PENDING_REPAIR_PAYMENT_KEY);
}

export async function executeRepairMonth({ sipId, month }) {
  const userIp = await resolveUserIp();
  const result = await stockFetch("mutualFund/repair-failed-orders", {
    method: "POST",
    body: {
      sipId: Number(sipId),
      month: String(month),
      user_ip: userIp || "127.0.0.1",
      payment_postback_url: paymentPostbackUrl(),
    },
  });

  if (!result.ok) {
    return {
      ok: false,
      kind: "error",
      message: result.message || "Repair failed",
      data: result.data,
    };
  }

  const data = result.data || {};
  if (data.success === false) {
    return {
      ok: false,
      kind: "soft",
      message: softFailMessage(data),
      title: softFailTitle(data),
      data,
    };
  }

  const paymentUrl = data.paymentUrl || data.payment_url;
  const paymentId = data.paymentId || data.payment_id;
  if (paymentUrl && paymentId) {
    return { ok: true, kind: "payment", paymentUrl, paymentId, data };
  }

  return { ok: true, kind: "done", data };
}

function softFailTitle(data) {
  const total = num(data?.totalFailedOrders);
  const repaired = num(data?.totalRepaired);
  const failed = num(data?.totalFailedToRepair);
  if (total === 0) return "No Repair Orders";
  if (repaired > 0 && failed === 0) return "Repair Completed";
  if (failed > 0) return "Repair Partially Failed";
  return "Repair Status";
}

function softFailMessage(data) {
  const repaired = num(data?.totalRepaired);
  const failed = num(data?.totalFailedToRepair);
  const total = num(data?.totalFailedOrders);
  if (total === 0) return "No failed orders available for repair";
  if (repaired > 0 && failed === 0) return `All ${repaired} failed orders repaired`;
  if (failed > 0) {
    return `Repaired ${repaired}, failed ${failed}${data?.error ? ` · ${data.error}` : ""}`;
  }
  return data?.error || "Unable to process repair request";
}

export async function captureRepairPayment(paymentId) {
  const token = getAccessToken();
  if (!token) return { ok: false, message: "Session required" };
  let res;
  try {
    res = await fetch(`${PAYMENT_BASE}subscription/payment/${paymentId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    return { ok: false, message: "Unable to confirm payment" };
  }
  if (res.status === 401) {
    endSession();
    return { ok: false, message: "Unauthorized - please login again" };
  }
  const data = await res.json().catch(() => null);
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    const reason =
      data?.failed_reason ||
      data?.failure_reason ||
      data?.failure_message ||
      data?.message ||
      "Payment unsuccessful";
    return { ok: false, message: String(reason), data };
  }
  const status = String(data?.status || data?.data?.status || "").toUpperCase();
  const success = ["SUCCESS", "SUCCESSFUL", "PAID", "APPROVED", "COMPLETED"].includes(status);
  if (!success) {
    const reason =
      data?.failed_reason ||
      data?.failure_reason ||
      data?.failure_message ||
      data?.message ||
      `Payment status: ${status || "unknown"}`;
    return { ok: false, message: String(reason), data };
  }
  return { ok: true, data };
}

export async function settlePendingRepairPayment() {
  const pending = getPendingRepairPayment();
  if (!pending?.paymentId) return { ok: true, skipped: true };
  const result = await captureRepairPayment(pending.paymentId);
  clearPendingRepairPayment();
  return result;
}
