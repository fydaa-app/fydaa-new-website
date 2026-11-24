import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BookCallForm from "./BookCallForm";

vi.mock("@/lib/posthog", () => ({ captureEvent: vi.fn(), captureNamedButton: vi.fn(), toEventName: vi.fn() }));

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true })));
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.useRealTimers());

describe("BookCallForm OTP resend", () => {
  it("rate-limits resending the OTP for 30 seconds", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<BookCallForm />);

    await user.type(screen.getByLabelText("Your name"), "Asha Rao");
    await user.type(screen.getByLabelText("Phone number"), "9876543210");
    await user.click(screen.getByRole("button", { name: /book a free call/i }));

    const resend = await screen.findByRole("button", { name: /Resend OTP in 30s/ });
    expect(resend).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    for (let second = 0; second < 30; second += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1_000);
      });
    }
    expect(screen.getByRole("button", { name: "Resend OTP" })).toBeEnabled();
  });
});
