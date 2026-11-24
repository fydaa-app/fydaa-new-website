import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("getUserBankDetails", () => {
  it("calls the auth host of the current environment (never production from staging)", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_ENV", "stage");
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://crm-stage.example.com/");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: true, data: {} })));
    vi.stubGlobal("fetch", fetchMock);
    const { setTokens } = await import("@/lib/auth/token-store");
    setTokens({ accessToken: "stage-token" });

    const { getUserBankDetails } = await import("./authApi");
    await getUserBankDetails();

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://auth-stage.fydaa.com/user/user-details");
    expect(new Headers(init.headers).get("authorization")).toBe("Bearer stage-token");
  });
});
