import { describe, expect, it } from "vitest";
import { enforcedCspDirectives, fullCspDirectives, securityHeaders } from "./security-headers";

const header = (key: string) => securityHeaders().find((h) => h.key === key)?.value;

describe("security headers", () => {
  it("enforces anti-clickjacking and safe base directives", () => {
    const enforced = header("Content-Security-Policy");
    expect(enforced).toContain("frame-ancestors 'self'");
    expect(enforced).toContain("object-src 'none'");
    expect(enforced).toContain("base-uri 'self'");
    expect(header("X-Frame-Options")).toBe("SAMEORIGIN");
  });

  it("ships the full allowlist as report-only with a report endpoint", () => {
    const reportOnly = header("Content-Security-Policy-Report-Only");
    expect(reportOnly).toContain("default-src 'self'");
    expect(reportOnly).toContain("report-uri /api/csp-report");
    expect(reportOnly).toContain("https://checkout.razorpay.com");
  });

  it("allows every configured API origin to be called", () => {
    const connect = fullCspDirectives()["connect-src"];
    for (const origin of [
      "https://auth.fydaa.com",
      "https://onboarding.fydaa.com",
      "https://stocktransaction.fydaa.com",
      "https://fydaa.in",
      "https://payment.fydaa.com",
      "https://crm-prod.fydaa.com",
    ]) {
      expect(connect).toContain(origin);
    }
  });

  it("allows testimonial videos from the asset bucket", () => {
    expect(fullCspDirectives()["media-src"]).toContain("https://fydaa-v2.s3.ap-south-1.amazonaws.com");
  });

  it("only allows eval in development", () => {
    expect(fullCspDirectives()["script-src"]).not.toContain("'unsafe-eval'");
    expect(fullCspDirectives({ isDev: true })["script-src"]).toContain("'unsafe-eval'");
  });

  it("keeps geolocation available to KYC and blocks camera/microphone", () => {
    const policy = header("Permissions-Policy");
    expect(policy).toContain("geolocation=(self)");
    expect(policy).toContain("camera=()");
    expect(policy).toContain("microphone=()");
  });

  it("sets the remaining hardening headers", () => {
    expect(header("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(header("X-Content-Type-Options")).toBe("nosniff");
    expect(header("Strict-Transport-Security")).toMatch(/max-age=\d+/);
    expect(header("Cross-Origin-Opener-Policy")).toBe("same-origin-allow-popups");
    expect(Object.keys(enforcedCspDirectives())).not.toContain("script-src");
  });
});
