import { describe, expect, it } from "vitest";
import { sipFutureValue } from "@/lib/format/money";
import { categoryFor, planGoal } from "./goal-math";

describe("planGoal", () => {
  it("picks debt, hybrid or equity by horizon", () => {
    expect(categoryFor(2)).toBe("debt");
    expect(categoryFor(5)).toBe("hybrid");
    expect(categoryFor(12)).toBe("equity");
  });

  it("finds a SIP that reaches the inflation-adjusted target", () => {
    const plan = planGoal(1000000, 5);
    expect(plan.futureTarget).toBeCloseTo(1000000 * 1.06 ** 5, 0);
    expect(sipFutureValue(plan.monthly, 5, plan.rate)).toBeGreaterThanOrEqual(plan.futureTarget);
    expect(sipFutureValue(plan.monthly - 100, 5, plan.rate)).toBeLessThan(plan.futureTarget);
    expect(plan.monthly % 100).toBe(0);
  });
});
