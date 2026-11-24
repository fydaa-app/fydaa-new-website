import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setTokens } from "@/lib/auth/token-store";
import { ApiError } from "./api-error";
import { buildUrl, createApiClient, request } from "./client";

vi.mock("@/lib/auth/session", () => ({ endSession: vi.fn() }));
const { endSession } = await import("@/lib/auth/session");

const BASE = "https://api.example.com/v1/";

function respond(body: unknown, init: ResponseInit = {}, contentType = "application/json") {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return new Response(text, { status: 200, headers: { "content-type": contentType }, ...init });
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.mocked(endSession).mockClear();
});

describe("buildUrl", () => {
  it("joins base and path and drops empty query values", () => {
    expect(buildUrl(BASE, "/referrals/job-openings", { active: true, page: 2, q: undefined, x: null })).toBe(
      "https://api.example.com/v1/referrals/job-openings?active=true&page=2",
    );
    expect(buildUrl("https://api.example.com/v1", "items")).toBe("https://api.example.com/v1/items");
  });
});

describe("request", () => {
  it("returns parsed JSON for successful responses", async () => {
    fetchMock.mockResolvedValue(respond({ data: [1, 2] }));
    await expect(request(BASE, "items")).resolves.toEqual({ data: [1, 2] });
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("GET");
  });

  it("sends JSON bodies as POST with a content type", async () => {
    fetchMock.mockResolvedValue(respond({ ok: true }));
    await request(BASE, "items", { json: { a: 1 } });
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(init.body).toBe('{"a":1}');
    expect(new Headers(init.headers).get("content-type")).toBe("application/json");
  });

  it("surfaces backend validation messages for 4xx responses", async () => {
    fetchMock.mockResolvedValue(respond({ message: ["email must be an email"] }, { status: 400 }));
    await expect(request(BASE, "items")).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      message: "email must be an email",
    });
  });

  it("never shows raw HTML or parser errors from proxy error pages", async () => {
    fetchMock.mockResolvedValue(respond("<!DOCTYPE html><h1>Bad gateway</h1>", { status: 502 }, "text/html"));
    const error = (await request(BASE, "items").catch((e: unknown) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("Something went wrong on our side. Please try again shortly.");
    expect(error.message).not.toMatch(/DOCTYPE|Unexpected token/);
  });

  it("hides 5xx backend details", async () => {
    fetchMock.mockResolvedValue(respond({ message: "QueryFailedError: relation users" }, { status: 500 }));
    await expect(request(BASE, "items")).rejects.toThrow("Something went wrong on our side");
  });

  it("treats { success: false } with HTTP 200 as a failure", async () => {
    fetchMock.mockResolvedValue(respond({ success: false, message: "Invalid OTP" }));
    await expect(request(BASE, "verify")).rejects.toThrow("Invalid OTP");
  });

  it("can opt out of failure-flag checks", async () => {
    fetchMock.mockResolvedValue(respond({ success: false }));
    await expect(request(BASE, "x", { rejectFailureFlags: false })).resolves.toEqual({ success: false });
  });

  it("maps network failures to a friendly error with status 0", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(request(BASE, "items")).rejects.toMatchObject({ status: 0, isNetworkError: true });
  });

  it("maps timeouts to status 408", async () => {
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_, reject) => init.signal?.addEventListener("abort", () => reject(init.signal?.reason))),
    );
    await expect(request(BASE, "slow", { timeoutMs: 10 })).rejects.toMatchObject({ status: 408 });
  });

  describe("auth", () => {
    it("fails fast without a token and does not call the network", async () => {
      await expect(request(BASE, "me", { auth: true })).rejects.toMatchObject({ status: 401 });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("attaches the bearer token", async () => {
      setTokens({ accessToken: "abc" });
      fetchMock.mockResolvedValue(respond({}));
      await request(BASE, "me", { auth: true });
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(new Headers(init.headers).get("authorization")).toBe("Bearer abc");
    });

    it("ends the session on 401", async () => {
      setTokens({ accessToken: "abc" });
      fetchMock.mockResolvedValue(respond({ message: "jwt expired" }, { status: 401 }));
      await expect(request(BASE, "me", { auth: true })).rejects.toMatchObject({ status: 401 });
      expect(endSession).toHaveBeenCalledTimes(1);
    });
  });
});

describe("createApiClient", () => {
  it("binds the base URL and method", async () => {
    fetchMock.mockResolvedValue(respond({}));
    await createApiClient(BASE).put("items/1", { json: {} });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.com/v1/items/1");
    expect(init.method).toBe("PUT");
  });
});
