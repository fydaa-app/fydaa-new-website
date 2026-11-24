import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearPendingLumpsumPayment,
  getPendingLumpsumPayment,
  setPendingLumpsumPayment,
} from "./lumpsumApi";

afterEach(() => {
  vi.useRealTimers();
  window.sessionStorage.clear();
});

describe("pending lump-sum payment", () => {
  it("survives across tabs by using localStorage", () => {
    setPendingLumpsumPayment({ paymentId: "pay_1", amount: 5000 });
    expect(window.localStorage.getItem("fydaa.pendingLumpsumPayment")).toContain("pay_1");
    expect(getPendingLumpsumPayment()).toMatchObject({ paymentId: "pay_1", amount: 5000 });
  });

  it("expires after two hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));
    setPendingLumpsumPayment({ paymentId: "pay_1" });
    vi.setSystemTime(new Date("2026-01-01T12:00:01Z"));
    expect(getPendingLumpsumPayment()).toBeNull();
    expect(window.localStorage.getItem("fydaa.pendingLumpsumPayment")).toBeNull();
  });

  it("still reads entries written to sessionStorage before the change", () => {
    window.sessionStorage.setItem(
      "fydaa.pendingLumpsumPayment",
      JSON.stringify({ paymentId: "legacy", at: Date.now() }),
    );
    expect(getPendingLumpsumPayment()).toMatchObject({ paymentId: "legacy" });
    clearPendingLumpsumPayment();
    expect(getPendingLumpsumPayment()).toBeNull();
  });
});
