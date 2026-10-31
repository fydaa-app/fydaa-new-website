import { endSession, getAccessToken, getUserDetails } from "../../signup/lib/authApi";

function crmBase() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://crm-prod.fydaa.com/";
  return base.endsWith("/") ? base : `${base}/`;
}

function userIdFromToken() {
  const token = getAccessToken();
  const payload = token?.split(".")[1];
  if (!payload) return null;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    const id = json?.id ?? json?.userId ?? json?.user_id ?? json?.sub;
    const n = Number(id);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

/** Resolve numeric user id from JWT or userDetails. */
export async function resolveCrmUserId() {
  const fromToken = userIdFromToken();
  if (fromToken) return fromToken;
  try {
    const details = await getUserDetails();
    const id = Number(details?.data?.id);
    return Number.isFinite(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

/**
 * POST referrals/assign-advisor-relationship-manager/:userId
 * Maps advisor + relationship manager after OTP verify (login / signup).
 */
export async function assignAdvisorRelationshipManager(userId) {
  const id = Number(userId);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Missing user id for advisor assignment");
  }
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(
    `${crmBase()}referrals/assign-advisor-relationship-manager/${id}`,
    { method: "POST", headers, body: JSON.stringify({}) },
  );
  if (res.status === 401) {
    endSession();
    return null;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false || data?.error === true) {
    throw new Error(data?.message || "Could not assign relationship manager");
  }
  return data;
}

/** Best-effort assign after OTP — never blocks login/signup. */
export async function assignAdvisorAfterOtp() {
  try {
    const userId = await resolveCrmUserId();
    if (!userId) return null;
    return await assignAdvisorRelationshipManager(userId);
  } catch {
    return null;
  }
}

export async function getAdvisorAndRelationshipManager(userId) {
  const headers = { Accept: "application/json" };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${crmBase()}referrals/getAdvisorAndRelationshipManager/${userId}`, { headers });
  if (res.status === 401) {
    endSession();
    return null;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Could not load relationship manager");
  }
  return data;
}

export function mapRelationshipManager(payload) {
  const manager = payload?.data?.relationshipManager;
  if (!manager) return null;
  const name = String(manager.name || "").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  return {
    name,
    initials: parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
    email: manager.email ? String(manager.email) : "",
    phone: manager.mobileNumber ? String(manager.mobileNumber) : "",
    description: manager.description ? String(manager.description) : "",
    photo: manager.photo ? String(manager.photo) : "",
  };
}

export function emailFromAdvisorPayload(payload) {
  return payload?.data?.user?.email ? String(payload.data.user.email) : "";
}
