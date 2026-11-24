import { NextResponse, type NextRequest } from "next/server";

/**
 * Collects Content-Security-Policy violation reports (report-uri and Reporting API
 * formats) and writes a compact, single-line summary to the server log. Reports are
 * untrusted input: the body is size-capped, fields are truncated and newlines stripped.
 */

const MAX_BODY_BYTES = 16 * 1024;
const MAX_FIELD_LENGTH = 300;

type Report = Record<string, unknown>;

function clean(value: unknown): string {
  return String(value ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .slice(0, MAX_FIELD_LENGTH);
}

function extractReports(payload: unknown): Report[] {
  if (Array.isArray(payload)) {
    // Reporting API: [{ type: "csp-violation", body: {...} }]
    return payload
      .filter((entry): entry is { body: Report } =>
        Boolean(entry && typeof entry === "object" && "body" in entry),
      )
      .map((entry) => entry.body);
  }
  if (payload && typeof payload === "object" && "csp-report" in payload) {
    return [(payload as { "csp-report": Report })["csp-report"]];
  }
  return [];
}

export async function POST(request: NextRequest) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return new NextResponse(null, { status: 413 });

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return new NextResponse(null, { status: 413 });

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  for (const report of extractReports(payload).slice(0, 10)) {
    console.warn(
      "[csp-violation]",
      JSON.stringify({
        directive: clean(
          report["effective-directive"] ?? report.effectiveDirective ?? report["violated-directive"],
        ),
        blocked: clean(report["blocked-uri"] ?? report.blockedURL),
        page: clean(report["document-uri"] ?? report.documentURL),
        source: clean(report["source-file"] ?? report.sourceFile),
        disposition: clean(report.disposition),
      }),
    );
  }

  return new NextResponse(null, { status: 204 });
}
