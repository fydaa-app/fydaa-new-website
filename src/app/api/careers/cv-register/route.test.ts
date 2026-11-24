// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_CV_BYTES, POST } from "./route";

const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);

function submit(overrides: Record<string, string | File | null> = {}) {
  const form = new FormData();
  const fields: Record<string, string | File | null> = {
    firstName: "Asha",
    lastName: "Rao",
    email: "asha@example.com",
    phone: "98765 43210",
    resume: new File([PDF], "cv.pdf", { type: "application/pdf" }),
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) if (value !== null) form.set(key, value);
  return POST(new NextRequest("http://localhost/api/careers/cv-register", { method: "POST", body: form }));
}

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 201 }));
  vi.stubGlobal("fetch", fetchMock);
});

describe("POST /api/careers/cv-register", () => {
  it("forwards only validated fields with a sniffed content type", async () => {
    const response = await submit({ injected: "x" });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, message: "Thanks! We've received your CV." });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://crm-prod.fydaa.com/referrals/cv-register");
    const sent = init.body as FormData;
    expect([...sent.keys()].sort()).toEqual(["email", "firstName", "lastName", "phone", "resume"]);
    expect(sent.get("phone")).toBe("9876543210");
    expect((sent.get("resume") as File).type).toBe("application/pdf");
    expect((sent.get("resume") as File).name).toBe("Asha-Rao-cv.pdf");
  });

  it.each([
    [{ firstName: "" }, 400],
    [{ email: "not-an-email" }, 400],
    [{ phone: "12345" }, 400],
    [{ resume: null }, 400],
  ])("rejects invalid input %j without calling the backend", async (override, status) => {
    expect((await submit(override)).status).toBe(status);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects files that are not really PDF/Word, whatever their name says", async () => {
    const fake = new File([new TextEncoder().encode("<script>alert(1)</script>")], "cv.pdf", {
      type: "application/pdf",
    });
    expect((await submit({ resume: fake })).status).toBe(415);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects CVs over 5 MB", async () => {
    const big = new File([new Uint8Array(MAX_CV_BYTES + 1)], "cv.pdf");
    expect((await submit({ resume: big })).status).toBe(413);
  });

  it("hides backend failures and never relays upstream headers", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>stack trace</html>", { status: 500, headers: { "set-cookie": "a=b" } }),
    );
    const response = await submit();
    expect(response.status).toBe(502);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect((await response.json()).message).toBe(
      "We couldn't submit your CV right now. Please try again later.",
    );
  });
});
