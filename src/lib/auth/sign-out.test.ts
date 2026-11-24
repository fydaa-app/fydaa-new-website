import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/posthog", () => ({ resetAnalyticsIdentity: vi.fn() }));

describe("signOut", () => {
  it("clears tokens and resets the analytics identity", async () => {
    const { resetAnalyticsIdentity } = await import("@/lib/posthog");
    const { setTokens, getAccessToken, getRefreshToken } = await import("./token-store");
    const { signOut } = await import("./sign-out");
    setTokens({ accessToken: "a", refreshToken: "r" });

    signOut();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(resetAnalyticsIdentity).toHaveBeenCalledTimes(1);
  });
});
