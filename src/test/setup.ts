import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Shared by DOM (jsdom) and server (`@vitest-environment node`) test files.
afterEach(() => {
  if (typeof window === "undefined") return;
  cleanup();
  window.localStorage.clear();
});
