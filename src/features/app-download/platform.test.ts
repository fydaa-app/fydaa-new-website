import { describe, expect, it } from "vitest";
import { storePlatformFor } from "./platform";

describe("storePlatformFor", () => {
  it.each([
    [
      "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/131 Mobile Safari/537.36",
      "android",
    ],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148", "ios"],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.1 Mobile/15E148 Safari/604.1",
      "ios",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.1 Safari/605.1.15",
      null,
    ],
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131 Safari/537.36", null],
    [null, null],
  ])("maps %s to %s", (ua, expected) => {
    expect(storePlatformFor(ua)).toBe(expected);
  });
});
