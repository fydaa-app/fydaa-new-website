/**
 * Resolve API hosts from env.
 * Set NEXT_PUBLIC_APP_ENV=stage | prod to switch.
 * Both prod and stage URLs stay in .env.local.
 */
function normalizeBase(url, fallback) {
  return String(url || fallback).replace(/\/?$/, '/');
}

const APP_ENV = (process.env.NEXT_PUBLIC_APP_ENV || 'prod').toLowerCase();
const isStage = APP_ENV === 'stage' || APP_ENV === 'staging' || APP_ENV === 'dev';

export const appEnv = isStage ? 'stage' : 'prod';

export const AUTH_BASE = normalizeBase(
  isStage
    ? process.env.NEXT_PUBLIC_AUTH_BASE_URL_STAGE || process.env.NEXT_PUBLIC_AUTH_BASE_URL
    : process.env.NEXT_PUBLIC_AUTH_BASE_URL_PROD || process.env.NEXT_PUBLIC_AUTH_BASE_URL,
  isStage ? 'https://auth-stage.fydaa.com/' : 'https://auth.fydaa.com/'
);

export const ONBOARDING_BASE = normalizeBase(
  isStage
    ? process.env.NEXT_PUBLIC_ONBOARD_BASE_URL_STAGE || process.env.NEXT_PUBLIC_ONBOARD_BASE_URL
    : process.env.NEXT_PUBLIC_ONBOARD_BASE_URL_PROD || process.env.NEXT_PUBLIC_ONBOARD_BASE_URL,
  isStage ? 'https://onboarding-stage.fydaa.com/' : 'https://onboarding.fydaa.com/'
);

export const STOCK_BASE = normalizeBase(
  isStage
    ? process.env.NEXT_PUBLIC_STOCK_BASE_URL_STAGE || process.env.NEXT_PUBLIC_STOCK_BASE_URL
    : process.env.NEXT_PUBLIC_STOCK_BASE_URL_PROD || process.env.NEXT_PUBLIC_STOCK_BASE_URL,
  isStage ? 'https://stocktransaction-stage.fydaa.com/' : 'https://stocktransaction.fydaa.com/'
);

export const ADMIN_BASE = normalizeBase(
  isStage
    ? process.env.NEXT_PUBLIC_ADMIN_BASE_URL_STAGE || process.env.NEXT_PUBLIC_ADMIN_BASE_URL
    : process.env.NEXT_PUBLIC_ADMIN_BASE_URL_PROD || process.env.NEXT_PUBLIC_ADMIN_BASE_URL,
  isStage ? 'https://stage.fydaa.in/admin/api/v4/' : 'https://fydaa.in/admin/api/v4/'
);

export const PAYMENT_BASE = normalizeBase(
  isStage
    ? process.env.NEXT_PUBLIC_PAYMENT_BASE_URL_STAGE || process.env.NEXT_PUBLIC_PAYMENT_BASE_URL
    : process.env.NEXT_PUBLIC_PAYMENT_BASE_URL_PROD || process.env.NEXT_PUBLIC_PAYMENT_BASE_URL,
  isStage ? 'https://payment-stage.fydaa.com/' : 'https://payment.fydaa.com/'
);

export const AUTH_PROD_BASE = normalizeBase(
  process.env.NEXT_PUBLIC_AUTH_BASE_URL_PROD,
  'https://auth.fydaa.com/'
);
