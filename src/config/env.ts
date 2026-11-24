import * as z from "zod/mini";

// Parse without JIT code generation: no `new Function` (CSP-clean) and a smaller bundle.
z.config({ jitless: true });

/**
 * Public runtime configuration, validated once at module load.
 *
 * Every variable is read through a literal `process.env.NEXT_PUBLIC_*` reference so
 * Next.js can inline it at build time. Misconfiguration fails fast (at build or
 * first import) instead of producing requests to `undefined/...` at runtime.
 *
 * Per-service URLs resolve as `<NAME>_<ENV>` → `<NAME>` → built-in default.
 */

export type AppEnv = "production" | "staging";

const STAGING_ALIASES = new Set(["stage", "staging", "dev"]);

export function resolveAppEnv(raw: string | undefined): AppEnv {
  return raw && STAGING_ALIASES.has(raw.trim().toLowerCase()) ? "staging" : "production";
}

const appEnv = resolveAppEnv(process.env.NEXT_PUBLIC_APP_ENV);
const isStaging = appEnv === "staging";

function pick(staging: string | undefined, production: string | undefined, shared: string | undefined) {
  const value = (isStaging ? staging : production) || shared;
  return value?.trim() || undefined;
}

const DEFAULTS: Record<AppEnv, Record<string, string | undefined>> = {
  production: {
    siteUrl: "https://fydaa.com",
    auth: "https://auth.fydaa.com/",
    onboarding: "https://onboarding.fydaa.com/",
    stock: "https://stocktransaction.fydaa.com/",
    admin: "https://fydaa.in/admin/api/v4/",
    payment: "https://payment.fydaa.com/",
    crm: "https://crm-prod.fydaa.com/",
  },
  staging: {
    siteUrl: undefined,
    auth: "https://auth-stage.fydaa.com/",
    onboarding: "https://onboarding-stage.fydaa.com/",
    stock: "https://stocktransaction-stage.fydaa.com/",
    admin: "https://stage.fydaa.in/admin/api/v4/",
    payment: "https://payment-stage.fydaa.com/",
    // No safe default: staging must set NEXT_PUBLIC_BASE_URL(_STAGE) explicitly.
    crm: undefined,
  },
};

const httpUrl = z.url({ protocol: /^https?$/, error: "must be an absolute http(s) URL" });

/** API base URL, normalised to end with exactly one slash. */
const baseUrl = z.pipe(
  httpUrl,
  z.transform((value: string) => value.replace(/\/+$/, "") + "/"),
);

/** Origin-style URL without a trailing slash (used for canonical links). */
const originUrl = z.pipe(
  httpUrl,
  z.transform((value: string) => value.replace(/\/+$/, "")),
);

const optionalString = z.optional(z.string().check(z.minLength(1)));

const envSchema = z.object({
  appEnv: z.enum(["production", "staging"]),
  siteUrl: originUrl,
  api: z.object({
    auth: baseUrl,
    onboarding: baseUrl,
    stock: baseUrl,
    admin: baseUrl,
    payment: baseUrl,
    crm: baseUrl,
  }),
  posthog: z.object({
    key: optionalString,
    host: originUrl,
  }),
  oauth: z.object({
    googleClientId: optionalString,
    appleClientId: optionalString,
    appleRedirectUri: z.optional(httpUrl),
  }),
  /** Branch deep link for "Get the app" (optional until it exists; see TODO.md). */
  appLink: z.optional(httpUrl),
});

export type Env = z.output<typeof envSchema>;

const defaults = DEFAULTS[appEnv];

const raw = {
  appEnv,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || defaults.siteUrl || "http://localhost:3000",
  api: {
    auth:
      pick(
        process.env.NEXT_PUBLIC_AUTH_BASE_URL_STAGE,
        process.env.NEXT_PUBLIC_AUTH_BASE_URL_PROD,
        process.env.NEXT_PUBLIC_AUTH_BASE_URL,
      ) ?? defaults.auth,
    onboarding:
      pick(
        process.env.NEXT_PUBLIC_ONBOARD_BASE_URL_STAGE,
        process.env.NEXT_PUBLIC_ONBOARD_BASE_URL_PROD,
        process.env.NEXT_PUBLIC_ONBOARD_BASE_URL,
      ) ?? defaults.onboarding,
    stock:
      pick(
        process.env.NEXT_PUBLIC_STOCK_BASE_URL_STAGE,
        process.env.NEXT_PUBLIC_STOCK_BASE_URL_PROD,
        process.env.NEXT_PUBLIC_STOCK_BASE_URL,
      ) ?? defaults.stock,
    admin:
      pick(
        process.env.NEXT_PUBLIC_ADMIN_BASE_URL_STAGE,
        process.env.NEXT_PUBLIC_ADMIN_BASE_URL_PROD,
        process.env.NEXT_PUBLIC_ADMIN_BASE_URL,
      ) ?? defaults.admin,
    payment:
      pick(
        process.env.NEXT_PUBLIC_PAYMENT_BASE_URL_STAGE,
        process.env.NEXT_PUBLIC_PAYMENT_BASE_URL_PROD,
        process.env.NEXT_PUBLIC_PAYMENT_BASE_URL,
      ) ?? defaults.payment,
    crm:
      pick(
        process.env.NEXT_PUBLIC_BASE_URL_STAGE,
        process.env.NEXT_PUBLIC_BASE_URL_PROD,
        process.env.NEXT_PUBLIC_BASE_URL,
      ) ?? defaults.crm,
  },
  posthog: {
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() || undefined,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com",
  },
  oauth: {
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || undefined,
    appleClientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID?.trim() || undefined,
    appleRedirectUri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI?.trim() || undefined,
  },
  appLink: process.env.NEXT_PUBLIC_BRANCH_LINK?.trim() || undefined,
};

export function parseEnv(input: unknown): Env {
  const result = envSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Invalid environment configuration:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const env: Env = parseEnv(raw);

export const isProduction = env.appEnv === "production";
