import { getAccessToken, endSession } from "../../signup/lib/authApi";
import { STOCK_BASE } from "../../signup/lib/apiHosts";

async function stockGet(path) {
  const token = getAccessToken();
  if (!token) return { ok: false, message: "Session required", status: 401 };
  let res;
  try {
    res = await fetch(`${STOCK_BASE}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    return { ok: false, message: "Unable to reach order tracking. Try again.", status: 0 };
  }
  if (res.status === 401) {
    endSession();
    return { ok: false, message: "Please log in again", status: 401 };
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.error === true) {
    return {
      ok: false,
      message: data?.message || `Unable to load orders (${res.status})`,
      status: res.status,
      data,
    };
  }
  return { ok: true, data };
}

function upper(value) {
  return String(value || "").trim().toUpperCase();
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function fundStatus(fund) {
  return String(fund?.status || "").trim().toLowerCase();
}

function fundPaymentStatus(fund) {
  return upper(fund?.payment?.status);
}

function isFundPaid(fund) {
  return fundPaymentStatus(fund) === "SUCCESS";
}

function isFundSuccessful(fund) {
  const status = fundStatus(fund);
  return status === "successful" || status === "completed" || status === "success";
}

function isFundSubmitted(fund) {
  const status = fundStatus(fund);
  return (
    status === "submitted" ||
    status === "successful" ||
    status === "completed" ||
    status === "success"
  );
}

function isFundFailed(fund) {
  const status = fundStatus(fund);
  return status === "failed" || status === "errored" || status === "error";
}

function processedAmountForOrder(order) {
  const funds = Array.isArray(order?.funds) ? order.funds : [];
  return funds.reduce((sum, fund) => {
    if (isFundPaid(fund) || isFundSuccessful(fund)) return sum + num(fund.amount);
    return sum;
  }, 0);
}

function isLumpsumPaymentProcessed(order) {
  const pay = upper(order?.paymentStatus);
  if (pay === "SUCCESS" || pay === "PROCESSED") return true;
  const funds = Array.isArray(order?.funds) ? order.funds : [];
  if (funds.some((fund) => isFundPaid(fund))) return true;
  if (processedAmountForOrder(order) > 0) return true;
  return false;
}

/** Normalize modern `orders[]` and legacy `goals[].batches[]` into one list. */
export function normalizeInProgressOrders(payload) {
  if (!payload || typeof payload !== "object") return [];

  if (Array.isArray(payload.orders)) {
    return payload.orders.map((order) => enrichOrder(order));
  }

  const goals = Array.isArray(payload.goals) ? payload.goals : [];
  const orders = [];
  for (const goal of goals) {
    const batches = Array.isArray(goal?.batches) ? goal.batches : [];
    for (const batch of batches) {
      orders.push(
        enrichOrder({
          goalId: goal.goalId ?? batch.goalId,
          goalName: goal.goalName ?? batch.goalName,
          type: batch.investmentType || batch.type,
          sipId: batch.sipId,
          sipName: batch.sipName,
          lumpsumId: batch.lumpsumId,
          totalAmount: batch.totalAmount ?? goal.totalAmount,
          status: batch.overallStatus || batch.status,
          paymentStatus: batch.paymentStatus,
          placedAt: batch.submittedAt || batch.createdAt || batch.placedAt,
          funds: batch.funds,
        }),
      );
    }
  }
  return orders;
}

function enrichOrder(raw) {
  const funds = Array.isArray(raw?.funds) ? raw.funds : [];
  const totalAmount = num(raw?.totalAmount);
  const processedAmount = processedAmountForOrder(raw);
  const remainingAmount = Math.max(0, totalAmount - processedAmount);
  const submittedFunds = funds.filter(isFundSubmitted).length;
  const paidFunds = funds.filter(isFundPaid).length;
  const successfulFunds = funds.filter(isFundSuccessful).length;
  const failedFunds = funds.filter(isFundFailed).length;

  return {
    ...raw,
    funds,
    totalAmount,
    processedAmount,
    remainingAmount,
    submittedFunds,
    paidFunds,
    successfulFunds,
    failedFunds,
    fundsTotal: funds.length,
    type: String(raw?.type || "sip").toLowerCase(),
    status: String(raw?.status || "").trim(),
    paymentStatus: String(raw?.paymentStatus || "").trim(),
    goalName: raw?.goalName || "Investment",
    sipName: raw?.sipName || null,
    placedAt: raw?.placedAt || null,
  };
}

export function isTrackableOrder(order) {
  if (!order) return false;
  if (order.type !== "lumpsum") return true;
  return isLumpsumPaymentProcessed(order);
}

export function filterTrackableOrders(orders) {
  return (orders || []).filter(isTrackableOrder);
}

export async function fetchInProgressOrders() {
  const result = await stockGet("mutualFund/user/in-progress-orders");
  if (!result.ok) return result;
  const orders = filterTrackableOrders(normalizeInProgressOrders(result.data));
  return { ok: true, orders, data: result.data };
}

export function orderStatusTone(status) {
  const value = upper(status);
  if (value.includes("SUCCESS") || value.includes("COMPLETED")) return "success";
  if (value.includes("FAIL")) return "error";
  if (value.includes("SUBMIT")) return "warning";
  return "neutral";
}

export function detailHeadline(order) {
  const value = upper(order?.status);
  if (value.includes("SUCCESS") || value.includes("COMPLETED")) return "Transaction Successful";
  if (value.includes("FAIL")) return "Transaction Failed";
  return "Transaction Pending";
}

export function detailHeadlineTone(order) {
  const value = upper(order?.status);
  if (value.includes("SUCCESS") || value.includes("COMPLETED")) return "success";
  if (value.includes("FAIL")) return "error";
  return "pending";
}

/** Timeline steps for order detail. */
export function buildOrderTimeline(order) {
  const funds = Array.isArray(order?.funds) ? order.funds : [];
  const allDone =
    funds.length > 0 &&
    funds.every((fund) => {
      const status = fundStatus(fund);
      return status === "successful" || status === "completed" || status === "success";
    });
  const anyFailed = funds.some(isFundFailed);
  const paymentDone =
    upper(order?.paymentStatus) === "SUCCESS" ||
    upper(order?.paymentStatus) === "PROCESSED" ||
    funds.some(isFundPaid) ||
    order.processedAmount > 0;

  const placedAt = order?.placedAt
    ? new Date(order.placedAt)
    : null;
  const placedLabel =
    placedAt && !Number.isNaN(placedAt.getTime())
      ? placedAt.toLocaleString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

  const unitsState = allDone ? "done" : anyFailed && paymentDone ? "failed" : paymentDone ? "active" : "pending";
  const paymentState = paymentDone ? "done" : anyFailed ? "failed" : "active";

  return [
    {
      id: "placed",
      title: "Order placed",
      state: "done",
      detail: placedLabel,
    },
    {
      id: "payment",
      title: paymentDone ? "Payment processed" : "Payment processing",
      state: paymentState,
    },
    {
      id: "units",
      title: allDone ? "Units allocated" : "Units allocation",
      state: unitsState,
      detail: unitsState === "active" ? "Usually takes 48–72 hours" : null,
    },
  ];
}

export function groupOrdersByGoal(orders) {
  const map = new Map();
  for (const order of orders || []) {
    const key = String(order.goalId ?? order.goalName ?? "other");
    if (!map.has(key)) {
      map.set(key, {
        goalId: order.goalId,
        goalName: order.goalName || "Investment",
        orders: [],
        totalAmount: 0,
      });
    }
    const group = map.get(key);
    group.orders.push(order);
    group.totalAmount += num(order.totalAmount);
  }
  return [...map.values()];
}

export function summarizeTrackableOrders(orders) {
  const list = orders || [];
  const goalIds = new Set(list.map((order) => order.goalId).filter((id) => id != null));
  return {
    goals: goalIds.size || (list.length ? 1 : 0),
    orders: list.length,
  };
}

export function orderCardKey(order, index = 0) {
  return [
    order?.sipId || order?.lumpsumId || "ord",
    order?.goalId || "g",
    order?.placedAt || "",
    index,
  ].join("-");
}
