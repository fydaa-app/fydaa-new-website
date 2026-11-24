import { describe, expect, it, vi } from "vitest";
import {
  ACCESS_TOKEN_KEY,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getTokenExpiry,
  isTokenExpired,
  PIN_SETUP_KEY,
  setTokens,
  subscribeToTokens,
} from "./token-store";

function jwt(payload: Record<string, unknown>): string {
  const encode = (value: unknown) =>
    btoa(JSON.stringify(value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${encode({ alg: "HS256" })}.${encode(payload)}.signature`;
}

describe("token store", () => {
  it("stores, reads and clears tokens under the legacy keys", () => {
    setTokens({ accessToken: "a", refreshToken: "r" });
    window.localStorage.setItem(PIN_SETUP_KEY, "COMPLETED");

    expect(window.localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("a");
    expect(getAccessToken()).toBe("a");
    expect(getRefreshToken()).toBe("r");

    clearTokens();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(window.localStorage.getItem(PIN_SETUP_KEY)).toBeNull();
  });

  it("notifies subscribers on change and stops after unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToTokens(listener);
    setTokens({ accessToken: "a" });
    clearTokens();
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    setTokens({ accessToken: "b" });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("ignores empty access tokens", () => {
    setTokens({ accessToken: "" });
    expect(getAccessToken()).toBeNull();
  });
});

describe("JWT expiry", () => {
  it("decodes unpadded base64url payloads", () => {
    // 'exp' payload whose base64url length is not a multiple of 4
    const token = jwt({ exp: 1_900_000_000, sub: "user-1?" });
    expect(getTokenExpiry(token)).toBe(1_900_000_000_000);
  });

  it("returns null for tokens without a readable exp", () => {
    expect(getTokenExpiry("not-a-jwt")).toBeNull();
    expect(getTokenExpiry(jwt({ sub: "x" }))).toBeNull();
    expect(getTokenExpiry("a.%%%.c")).toBeNull();
    expect(getTokenExpiry(null)).toBeNull();
  });

  it("reports expiry relative to now", () => {
    const token = jwt({ exp: 1_000 });
    expect(isTokenExpired(token, 999_000)).toBe(false);
    expect(isTokenExpired(token, 1_000_000)).toBe(true);
    expect(isTokenExpired("opaque-token")).toBe(false);
  });
});

describe("getTokenSubject", () => {
  it("returns an opaque id claim", async () => {
    const { getTokenSubject } = await import("./token-store");
    expect(getTokenSubject(jwt({ sub: "usr_42" }))).toBe("usr_42");
    expect(getTokenSubject(jwt({ id: 1234 }))).toBe("1234");
  });

  it("never returns contact details or garbage", async () => {
    const { getTokenSubject } = await import("./token-store");
    expect(getTokenSubject(jwt({ sub: "9876543210" }))).toBeNull();
    expect(getTokenSubject(jwt({ sub: "+919876543210" }))).toBeNull();
    expect(getTokenSubject(jwt({ sub: "a@b.com" }))).toBeNull();
    expect(getTokenSubject("not-a-jwt")).toBeNull();
  });
});
