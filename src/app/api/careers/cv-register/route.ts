import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/config/env";

/**
 * General CV registration (careers page). Validates everything server-side, then
 * forwards only the known fields to the CRM. Never relays upstream headers or raw
 * upstream errors to the browser.
 */

export const MAX_CV_BYTES = 5 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_CV_BYTES + 64 * 1024;
const UPSTREAM_TIMEOUT_MS = 20_000;

const NAME = /^[\p{L}][\p{L} .'-]{0,79}$/u;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INDIAN_MOBILE = /^[6-9]\d{9}$/;

type CvKind = "pdf" | "doc" | "docx";

/** Identify the file by its leading bytes, not by the name or the client-sent type. */
function sniffCv(bytes: Uint8Array): CvKind | null {
  const startsWith = (...signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  if (startsWith(0x25, 0x50, 0x44, 0x46)) return "pdf"; // %PDF
  if (startsWith(0x50, 0x4b, 0x03, 0x04)) return "docx"; // ZIP container (OOXML)
  if (startsWith(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1)) return "doc"; // OLE2
  return null;
}

const CONTENT_TYPES: Record<CvKind, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

/** Structural check: works across realms (undici, jsdom, edge) unlike `instanceof File`. */
function isFile(value: FormDataEntryValue | null): value is File {
  return typeof value === "object" && value !== null && typeof value.arrayBuffer === "function";
}

function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_REQUEST_BYTES) {
    return fail("CV must be 5MB or smaller.", 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("Invalid request.");
  }

  const firstName = field(form, "firstName");
  const lastName = field(form, "lastName");
  const email = field(form, "email");
  const phone = field(form, "phone").replace(/\D/g, "");
  const resume = form.get("resume");

  if (!NAME.test(firstName) || !NAME.test(lastName)) return fail("Please enter your first and last name.");
  if (email.length > 254 || !EMAIL.test(email)) return fail("Please enter a valid email address.");
  if (!INDIAN_MOBILE.test(phone)) return fail("Please enter a valid 10-digit mobile number.");
  if (!isFile(resume) || resume.size === 0) return fail("Please upload your CV.");
  if (resume.size > MAX_CV_BYTES) return fail("CV must be 5MB or smaller.", 413);

  const bytes = new Uint8Array(await resume.arrayBuffer());
  const kind = sniffCv(bytes);
  if (!kind) return fail("CV must be a PDF or Word document.", 415);

  const safeName = `${`${firstName}-${lastName}`.replace(/[^\p{L}\p{N}-]+/gu, "-").slice(0, 60)}-cv.${kind}`;
  const outbound = new FormData();
  outbound.set("firstName", firstName);
  outbound.set("lastName", lastName);
  outbound.set("email", email);
  outbound.set("phone", phone);
  outbound.set("resume", new File([bytes], safeName, { type: CONTENT_TYPES[kind] }));

  let upstream: Response;
  try {
    upstream = await fetch(`${env.api.crm}referrals/cv-register`, {
      method: "POST",
      body: outbound,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("[cv-register] upstream unreachable", error);
    return fail("We couldn't submit your CV right now. Please try again later.", 502);
  }

  if (!upstream.ok) {
    const body = (await upstream.json().catch(() => null)) as { message?: unknown } | null;
    const clientError = upstream.status >= 400 && upstream.status < 500;
    const message =
      clientError && typeof body?.message === "string" && body.message.length <= 200
        ? body.message
        : "We couldn't submit your CV right now. Please try again later.";
    if (!clientError) console.error("[cv-register] upstream failed", upstream.status);
    return fail(message, clientError ? upstream.status : 502);
  }

  return NextResponse.json({ ok: true, message: "Thanks! We've received your CV." });
}
