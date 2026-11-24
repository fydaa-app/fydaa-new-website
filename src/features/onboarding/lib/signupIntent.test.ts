import { describe, expect, it } from "vitest";
import { planFromParams } from "./signupIntent";

const params = (query: string) => new URLSearchParams(query);

describe("planFromParams", () => {
  it("reads the plan the home planner sends", () => {
    expect(
      planFromParams(params("intent=sip&category=equity&frequency=monthly&amount=5000&years=10")),
    ).toEqual({
      category: "equity",
      categoryLabel: "Equity",
      frequency: "monthly",
      amount: 5000,
      years: 10,
    });
  });

  it("ignores missing or out-of-range values", () => {
    expect(planFromParams(params(""))).toBeNull();
    expect(
      planFromParams(params("intent=sip&category=crypto&frequency=monthly&amount=5000&years=10")),
    ).toBeNull();
    expect(
      planFromParams(params("intent=sip&category=debt&frequency=weekly&amount=5000&years=10")),
    ).toBeNull();
    expect(
      planFromParams(params("intent=sip&category=debt&frequency=daily&amount=5000&years=10")),
    ).toBeNull();
    expect(
      planFromParams(params("intent=sip&category=debt&frequency=monthly&amount=12.5&years=10")),
    ).toBeNull();
    expect(
      planFromParams(params("intent=sip&category=debt&frequency=monthly&amount=5000&years=7")),
    ).toBeNull();
  });
});
