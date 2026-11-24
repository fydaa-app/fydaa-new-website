import { env } from "./env";

/**
 * HTTP security headers applied to every route (see next.config.ts).
 *
 * The Content-Security-Policy is rolled out in two parts:
 *  - ENFORCED: directives that cannot break legitimate traffic (anti-clickjacking,
 *    <base> hijacking, plugins, mixed content).
 *  - REPORT-ONLY: the full source allowlist. Violations are posted to /api/csp-report
 *    and show up in the server logs. Once the logs are clean in production, promote it
 *    by setting ENFORCE_FULL_CSP to true.
 */
export const ENFORCE_FULL_CSP = false;

export const CSP_REPORT_PATH = "/api/csp-report";

/** Public S3 bucket serving testimonial videos and CMS images. */
export const ASSET_BUCKET = "https://fydaa-v2.s3.ap-south-1.amazonaws.com";

type Directives = Record<string, string[]>;

function origin(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function unique(values: (string | null | undefined)[]): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function serialize(directives: Directives): string {
  return Object.entries(directives)
    .map(([name, sources]) => (sources.length ? `${name} ${sources.join(" ")}` : name))
    .join("; ");
}

export function fullCspDirectives({ isDev = false }: { isDev?: boolean } = {}): Directives {
  const apiOrigins = Object.values(env.api).map(origin);

  return {
    "default-src": ["'self'"],
    // Next.js bootstraps with inline scripts; nonces would force dynamic rendering of every page.
    "script-src": unique([
      "'self'",
      "'unsafe-inline'",
      isDev ? "'unsafe-eval'" : null,
      "https://www.googletagmanager.com",
      "https://*.posthog.com",
      "https://checkout.razorpay.com",
      "https://accounts.google.com",
      "https://appleid.cdn-apple.com",
    ]),
    "style-src": ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "data:"],
    "connect-src": unique([
      "'self'",
      ...apiOrigins,
      origin(env.posthog.host),
      "https://*.posthog.com",
      "https://www.google-analytics.com",
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://www.googletagmanager.com",
      "https://*.razorpay.com",
      "https://api.ipify.org",
      "https://www.googleapis.com",
      "https://accounts.google.com",
      isDev ? "ws:" : null,
    ]),
    "frame-src": [
      "'self'",
      "https://*.razorpay.com",
      "https://accounts.google.com",
      "https://appleid.apple.com",
    ],
    "media-src": ["'self'", "blob:", ASSET_BUCKET],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'", "https://*.razorpay.com"],
    "frame-ancestors": ["'self'"],
    "report-uri": [CSP_REPORT_PATH],
  };
}

/** Directives that are safe to enforce today. */
export function enforcedCspDirectives(): Directives {
  return {
    "frame-ancestors": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "upgrade-insecure-requests": [],
  };
}

export interface Header {
  key: string;
  value: string;
}

export function securityHeaders({ isDev = false }: { isDev?: boolean } = {}): Header[] {
  const full = serialize(fullCspDirectives({ isDev }));
  const csp: Header[] = ENFORCE_FULL_CSP
    ? [{ key: "Content-Security-Policy", value: full }]
    : [
        { key: "Content-Security-Policy", value: serialize(enforcedCspDirectives()) },
        { key: "Content-Security-Policy-Report-Only", value: full },
      ];

  return [
    ...csp,
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // KYC captures the investor's location; everything else is off.
    {
      key: "Permissions-Policy",
      value: [
        "camera=()",
        "microphone=()",
        "geolocation=(self)",
        'payment=(self "https://checkout.razorpay.com" "https://api.razorpay.com")',
        "usb=()",
        "browsing-topics=()",
      ].join(", "),
    },
    // Google/Apple sign-in and KYC/payment flows open popups that must keep window.opener.
    { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
    // includeSubDomains/preload only after confirming every *.fydaa.com host is HTTPS-only.
    { key: "Strict-Transport-Security", value: "max-age=63072000" },
  ];
}
