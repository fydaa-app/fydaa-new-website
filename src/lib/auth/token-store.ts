/**
 * Client-side token storage.
 *
 * Tokens are issued in the response body by the auth service, so they currently live in
 * localStorage. All access goes through this module so the storage mechanism can move
 * to HttpOnly cookies later without touching callers. Storage keys are unchanged from
 * the legacy implementation so existing sessions survive the migration.
 */

export const ACCESS_TOKEN_KEY = "fydaa-auth-token";
export const REFRESH_TOKEN_KEY = "fydaa-refresh-token";
export const PIN_SETUP_KEY = "fydaa-pin-setup";

const CHANGE_EVENT = "fydaa:auth-change";

export interface TokenPair {
  accessToken: string;
  refreshToken?: string;
}

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    // Access can throw in privacy modes or sandboxed iframes.
    return null;
  }
}

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getAccessToken(): string | null {
  return storage()?.getItem(ACCESS_TOKEN_KEY) || null;
}

export function getRefreshToken(): string | null {
  return storage()?.getItem(REFRESH_TOKEN_KEY) || null;
}

export function setTokens({ accessToken, refreshToken }: TokenPair): void {
  const store = storage();
  if (!store || !accessToken) return;
  store.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) store.setItem(REFRESH_TOKEN_KEY, refreshToken);
  notify();
}

export function clearTokens(): void {
  const store = storage();
  if (!store) return;
  store.removeItem(ACCESS_TOKEN_KEY);
  store.removeItem(REFRESH_TOKEN_KEY);
  store.removeItem(PIN_SETUP_KEY);
  notify();
}

/** Subscribe to token changes in this tab and in other tabs. Returns an unsubscribe fn. */
export function subscribeToTokens(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === ACCESS_TOKEN_KEY) callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

/** Expiry of a JWT in epoch milliseconds, or null when it has no readable `exp` claim. */
export function getTokenExpiry(token: string | null | undefined): number | null {
  const payload = token?.split(".")[1];
  if (!payload) return null;
  try {
    const exp = Number((JSON.parse(decodeBase64Url(payload)) as { exp?: unknown }).exp);
    return Number.isFinite(exp) ? exp * 1000 : null;
  } catch {
    return null;
  }
}

/** True when the token has an `exp` claim that is in the past (with optional skew). */
export function isTokenExpired(token: string | null | undefined, now = Date.now(), skewMs = 0): boolean {
  const expiry = getTokenExpiry(token);
  return expiry !== null && now + skewMs >= expiry;
}
