"use client";

import { resetAnalyticsIdentity } from "@/lib/posthog";
import { clearTokens } from "./token-store";

/**
 * Sign the user out on this device: drop the tokens and forget the analytics identity
 * (so a shared device doesn't attribute the next visitor to this account).
 *
 * TODO(backend): call the auth service's refresh-token revocation endpoint here once
 * it exists, so a stolen refresh token stops working after logout (FYD-95).
 */
export function signOut(): void {
  clearTokens();
  resetAnalyticsIdentity();
}
