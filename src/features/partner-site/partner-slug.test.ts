import { describe, expect, it } from "vitest";
import { normalizePartnerSlug } from "./partner-slug";

describe("normalizePartnerSlug", () => {
  it.each([
    ["Johns-Advisory", "johns-advisory"],
    ["  ravi_mfd  ", "ravi_mfd"],
    ["a1", "a1"],
  ])("accepts %j", (raw, expected) => {
    expect(normalizePartnerSlug(raw)).toBe(expected);
  });

  it.each([
    "wp-login.php",
    ".env",
    "favicon-32.png",
    "a",
    "-leading",
    "trailing-",
    "x".repeat(65),
    "api",
    "SuccesspageFund",
    "",
    null,
  ])("rejects %j without a backend call", (raw) => {
    expect(normalizePartnerSlug(raw)).toBeNull();
  });
});
