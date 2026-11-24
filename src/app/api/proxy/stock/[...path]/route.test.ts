// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

async function loadRoute(nodeEnv: string) {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", nodeEnv);
  return import("./route");
}

function call(
  handler: (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) => Promise<Response>,
  path: string[],
) {
  return handler(
    new NextRequest(`http://localhost/api/proxy/stock/${path.join("/")}?q=1`, {
      headers: { authorization: "Bearer t", cookie: "session=secret", "x-forwarded-for": "1.2.3.4" },
    }),
    { params: Promise.resolve({ path }) },
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("stock proxy", () => {
  it("is disabled outside development and never contacts the backend", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { GET } = await loadRoute("production");

    const response = await call(GET, ["mutualFund", "search"]);

    expect(response.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards only safe headers to the stock API in development", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("{}", { headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    const { GET } = await loadRoute("development");

    const response = await call(GET, ["mutualFund", "search"]);

    expect(response.status).toBe(200);
    const [target, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(String(target)).toBe("https://stocktransaction.fydaa.com/mutualFund/search?q=1");
    const headers = new Headers(init.headers);
    expect(headers.get("authorization")).toBe("Bearer t");
    expect(headers.get("cookie")).toBeNull();
    expect(headers.get("x-forwarded-for")).toBeNull();
  });

  it("rejects path traversal", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { GET } = await loadRoute("development");

    expect((await call(GET, ["..", "admin"])).status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
