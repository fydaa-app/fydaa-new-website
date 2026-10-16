import { endSession, getAccessToken } from "../../signup/lib/authApi";

function crmBase() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://crm-prod.fydaa.com/";
  return base.endsWith("/") ? base : `${base}/`;
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
