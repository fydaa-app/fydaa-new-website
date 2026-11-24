import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("keeps a type token and a colour together", () => {
    expect(cn("text-ink", "text-display")).toBe("text-ink text-display");
    expect(cn("text-heading", "text-white")).toBe("text-heading text-white");
  });

  it("still lets a later size or radius win", () => {
    expect(cn("text-title", "text-heading")).toBe("text-heading");
    expect(cn("rounded-card", "rounded-4xl")).toBe("rounded-4xl");
  });
});
