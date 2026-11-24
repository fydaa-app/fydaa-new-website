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
 * Browser calls from localhost/127.0.0.1 go through a same-origin proxy
 * (/api/proxy/stock) so CORS allowlist gaps don't break fund search and other stock APIs.
 * Call at request time in browser code; safe to use on the server (returns remote host).
 */
export function getStockBase() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return '/api/proxy/stock/';
  }
  return STOCK_BASE_REMOTE;
}

/**
 * Resolved once per runtime. Client bundle on localhost → `/api/proxy/stock/`;
 * server / production → STOCK_BASE_REMOTE. Prefer getStockBase() when in doubt.
 */
export const STOCK_BASE = getStockBase();

export const AUTH_PROD_BASE = String(process.env.NEXT_PUBLIC_AUTH_BASE_URL_PROD || 'https://auth.fydaa.com/').replace(
  /\/?$/,
  '/'
);
