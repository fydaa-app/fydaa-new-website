"use client";

import { useSyncExternalStore } from "react";
import { getAccessToken, isTokenExpired, subscribeToTokens } from "./token-store";

export type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

function readStatus(): AuthStatus {
  const token = getAccessToken();
  return token && !isTokenExpired(token) ? "authenticated" : "unauthenticated";
}

const serverStatus = (): AuthStatus => "unknown";

/**
 * Current auth status, kept in sync with storage in this and other tabs.
 * Returns "unknown" during server rendering and hydration so callers can render a
 * neutral state first instead of flashing protected or public content.
 */
export function useAuthStatus(): AuthStatus {
  return useSyncExternalStore(subscribeToTokens, readStatus, serverStatus);
}
