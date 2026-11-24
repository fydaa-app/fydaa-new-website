import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setTokens } from "@/lib/auth/token-store";
import { RequireAuth } from "./require-auth";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

function jwt(exp: number) {
  const encode = (value: unknown) => btoa(JSON.stringify(value)).replace(/=+$/, "");
  return `${encode({ alg: "HS256" })}.${encode({ exp })}.sig`;
}

beforeEach(() => {
  replace.mockClear();
  window.history.replaceState(null, "", "/dashboard?start=kyc");
});

describe("RequireAuth", () => {
  it("sends signed-out visitors to login with a return path", () => {
    render(<RequireAuth>secret</RequireAuth>);
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Redirecting to login");
    expect(replace).toHaveBeenCalledWith("/login?next=%2Fdashboard%3Fstart%3Dkyc");
  });

  it("treats an expired token as signed out", () => {
    setTokens({ accessToken: jwt(Math.floor(Date.now() / 1000) - 60) });
    render(<RequireAuth>secret</RequireAuth>);
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalled();
  });

  it("renders the app for a valid session", () => {
    setTokens({ accessToken: jwt(Math.floor(Date.now() / 1000) + 3600) });
    render(<RequireAuth>secret</RequireAuth>);
    expect(screen.getByText("secret")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
