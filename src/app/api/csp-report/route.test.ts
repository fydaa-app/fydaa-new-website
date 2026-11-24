// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function post(body: string, headers: Record<string, string> = {}) {
  return POST(
    new NextRequest("http://localhost/api/csp-report", {
      method: "POST",
      body,
      headers: { "content-type": "application/csp-report", ...headers },
    }),
  );
}

describe("POST /api/csp-report", () => {
  it("logs a sanitised one-line summary and answers 204", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const response = await post(
      JSON.stringify({
        "csp-report": {
          "document-uri": "https://fydaa.com/login",
          "effective-directive": "script-src-elem",
          "blocked-uri": "https://evil.example/x.js\nINJECTED",
        },
      }),
    );
    expect(response.status).toBe(204);
    expect(warn).toHaveBeenCalledTimes(1);
    const line = String(warn.mock.calls[0]?.[1]);
    expect(line).toContain("script-src-elem");
    expect(line).not.toContain("\n");
  });

  it("accepts Reporting API batches", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const response = await post(
      JSON.stringify([{ type: "csp-violation", body: { effectiveDirective: "img-src", blockedURL: "x" } }]),
    );
    expect(response.status).toBe(204);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("rejects oversized and malformed bodies", async () => {
    expect((await post("x".repeat(20_000))).status).toBe(413);
    expect((await post("{not json")).status).toBe(400);
  });
});
