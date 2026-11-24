import { describe, expect, it } from "vitest";
import { loginUrl, safeRedirectPath } from "./session";

describe("safeRedirectPath", () => {
  it.each(["/dashboard", "/dashboard?start=kyc", "/careers#roles"])("allows relative path %j", (path) => {
    expect(safeRedirectPath(path)).toBe(path);
  });

  it.each([
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "javascript:alert(1)",
    "dashboard",
    "",
    null,
    undefined,
  ])("rejects %j", (path) => {
    expect(safeRedirectPath(path)).toBe("/dashboard");
  });
});

describe("loginUrl", () => {
  it("encodes a safe return path", () => {
    expect(loginUrl("/dashboard?start=kyc")).toBe("/login?next=%2Fdashboard%3Fstart%3Dkyc");
  });

  it("drops unsafe return paths", () => {
    expect(loginUrl("https://evil.example")).toBe("/login");
    expect(loginUrl()).toBe("/login");
  });
});
