import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { env } from "@/config/env";
import JobApplicationModal from "./JobApplicationModal";
import RegisterCvModal from "./RegisterCvModal";
import { mapJobOpening } from "./job-openings";

const job = mapJobOpening({ id: 4, title: "Area Manager", location: "Pan India", salaryCompact: "" })!;

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true })));
  vi.stubGlobal("fetch", fetchMock);
});

const cv = () => new File(["%PDF-1.4"], "cv.pdf", { type: "application/pdf" });

describe("JobApplicationModal", () => {
  it("names the role without empty salary text", () => {
    render(<JobApplicationModal open job={job} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "Area Manager" });
    expect(dialog).toHaveTextContent("Pan India");
    expect(dialog).not.toHaveTextContent("null");
  });

  it("points at the field to fix and does not move on", async () => {
    const user = userEvent.setup();
    render(<JobApplicationModal open job={job} onClose={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter your first and last name.");
    expect(screen.getByLabelText("First name")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("First name")).toHaveFocus();
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("sends the application to the CRM and confirms it", async () => {
    const user = userEvent.setup();
    render(<JobApplicationModal open job={job} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("First name"), "Asha");
    await user.type(screen.getByLabelText("Last name"), "Rao");
    await user.type(screen.getByLabelText("Email"), "asha@example.com");
    await user.type(screen.getByLabelText("Mobile number"), "9876543210");
    await user.type(screen.getByLabelText("City"), "Pune");
    await user.click(screen.getByRole("button", { name: "Next" }));

    await user.type(screen.getByLabelText("Total experience, in years"), "6");
    await user.type(screen.getByLabelText("Expected CTC, in lakh a year"), "12.5");
    await user.click(screen.getByRole("button", { name: "Next" }));

    await user.upload(screen.getByLabelText("CV"), cv());
    await user.click(screen.getByRole("button", { name: "Submit application" }));

    expect(
      await screen.findByRole("heading", { name: "Thanks, we've got your application" }),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(`${env.api.crm}referrals/apply`);
    const body = init.body as FormData;
    expect(body.get("jobId")).toBe("4");
    expect(body.get("phone")).toBe("9876543210");
    expect(body.get("expectedCtc")).toBe("12.5");
    expect(body.get("noticePeriod")).toBe("Immediate");
    expect((body.get("resume") as File).name).toBe("cv.pdf");
  });
});

describe("RegisterCvModal", () => {
  it("registers a CV and confirms it", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<RegisterCvModal open onClose={onClose} />);
    const dialog = screen.getByRole("dialog", { name: "Register your CV" });

    await user.type(within(dialog).getByLabelText("First name"), "Asha");
    await user.type(within(dialog).getByLabelText("Last name"), "Rao");
    await user.type(within(dialog).getByLabelText("Email"), "asha@example.com");
    await user.type(within(dialog).getByLabelText("Mobile number"), "9876543210");
    await user.upload(within(dialog).getByLabelText("CV"), cv());
    await user.click(within(dialog).getByRole("button", { name: "Register CV" }));

    expect(await screen.findByRole("heading", { name: "Thanks, we've got your CV" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/careers/cv-register",
      expect.objectContaining({ method: "POST" }),
    );

    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<RegisterCvModal open onClose={onClose} />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});
