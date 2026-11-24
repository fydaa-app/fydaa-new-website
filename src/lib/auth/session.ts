import { clearTokens } from "./token-store";

export const LOGIN_PATH = "/login";
export const DEFAULT_AFTER_LOGIN_PATH = "/dashboard";

/**
 * Only same-origin relative paths are accepted as post-login destinations, which
 * blocks open redirects such as `?next=https://evil.example` or `?next=//evil.example`.
 */
export function safeRedirectPath(
  candidate: string | null | undefined,
  fallback: string = DEFAULT_AFTER_LOGIN_PATH,
): string {
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//") || candidate.includes("\\")) {
    return fallback;
  }
  return candidate;
}

export function loginUrl(next?: string): string {
  const destination = next ? safeRedirectPath(next, "") : "";
  return destination ? `${LOGIN_PATH}?next=${encodeURIComponent(destination)}` : LOGIN_PATH;
}

let ending = false;

/** Clear the local session and send the user to the login page (once per page load). */
export function endSession(options: { returnTo?: string } = {}): void {
  if (typeof window === "undefined" || ending) return;
  ending = true;
  clearTokens();
  if (!window.location.pathname.startsWith(LOGIN_PATH)) {
    window.location.replace(loginUrl(options.returnTo));
  }
}
