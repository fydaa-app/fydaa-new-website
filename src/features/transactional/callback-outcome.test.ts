import { describe, expect, it } from "vitest";
import { resolveCallbackOutcome } from "./callback-outcome";

const outcome = (query: string) => resolveCallbackOutcome(new URLSearchParams(query));

describe("resolveCallbackOutcome", () => {
  it.each(["status=successful", "status=SUCCESS", "status=completed", "success=true"])(
    "treats %s as success",
    (query) => expect(outcome(query)).toBe("success"),
  );

  it.each([
    "status=failed",
    "status=cancelled",
    "success=false",
    "error=access_denied",
    "error_code=E101&status=successful",
  ])("treats %s as failure", (query) => expect(outcome(query)).toBe("failure"));

  it.each(["", "foo=bar", "status=", "status=pending", "status=processing"])(
    "never assumes success for %j",
    (query) => expect(outcome(query)).toBe("unknown"),
  );
});
