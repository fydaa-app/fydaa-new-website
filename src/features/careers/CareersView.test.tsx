import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CareersView from "./CareersView";
import { JOBS_LOAD_ERROR, mapJobOpening } from "./job-openings";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh, replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/careers",
}));

const job = mapJobOpening({ id: 4, title: "Area Manager", location: "Pan India", about: "Lead a region." })!;

describe("CareersView", () => {
  it("lists jobs with a link to each job page", () => {
    render(<CareersView jobs={[job]} error={null} />);
    expect(screen.getByText("Showing 1 job")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View full job page/ })).toHaveAttribute(
      "href",
      "/careers/jobs/4",
    );
  });

  it("shows a friendly, recoverable error instead of a misleading zero", async () => {
    render(<CareersView jobs={[]} error={JOBS_LOAD_ERROR} />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Open roles are unavailable right now");
    expect(document.body).not.toHaveTextContent(/Unexpected token|DOCTYPE|JSON/);
    expect(screen.queryByText("Showing 0 jobs")).not.toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();

    await userEvent.setup().click(screen.getByRole("button", { name: "Try again" }));
    expect(refresh).toHaveBeenCalled();
  });
});
