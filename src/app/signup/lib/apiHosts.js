/**
 * Legacy API host exports, now backed by the validated config in `@/config/env`.
 * New code should import `env` directly; these names remain for existing callers.
 */
import { env } from '@/config/env';

export const appEnv = env.appEnv === 'staging' ? 'stage' : 'prod';

export const AUTH_BASE = env.api.auth;
export const ONBOARDING_BASE = env.api.onboarding;
export const STOCK_BASE_REMOTE = env.api.stock;
export const ADMIN_BASE = env.api.admin;
export const PAYMENT_BASE = env.api.payment;

/**
 * In `npm run dev` on localhost, browser calls go through the development-only proxy
 * (/api/proxy/stock) because the stock API's CORS allowlist excludes localhost.
 * Production builds always call the stock API directly.
 */
export function getStockBase() {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return '/api/proxy/stock/';
  }
  return STOCK_BASE_REMOTE;
}

/** Resolved once per runtime; prefer getStockBase() when in doubt. */
export const STOCK_BASE = getStockBase();

export const AUTH_PROD_BASE = String(process.env.NEXT_PUBLIC_AUTH_BASE_URL_PROD || 'https://auth.fydaa.com/').replace(
  /\/?$/,
  '/'
);
