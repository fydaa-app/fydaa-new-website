const AUTH_BASE = (process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'https://auth.fydaa.com/').replace(/\/?$/, '/');
const ONBOARDING_BASE = (process.env.NEXT_PUBLIC_ONBOARD_BASE_URL || 'https://onboarding.fydaa.com/').replace(/\/?$/, '/');
const STOCK_BASE = (process.env.NEXT_PUBLIC_STOCK_BASE_URL || 'https://stocktransaction.fydaa.com/').replace(/\/?$/, '/');

const TOKEN_KEY = 'fydaa-auth-token';
const REFRESH_KEY = 'fydaa-refresh-token';

function messageFrom(data, fallback = 'Something went wrong. Please try again.') {
  const message = data?.message ?? data?.error;
  if (typeof message === 'string' && message) return message;
  if (Array.isArray(message) && message.length) {
    const first = message[0];
    if (typeof first === 'string') return first;
    if (first?.message) return first.message;
  }
  return fallback;
}

function extractTokens(data) {
  const access =
    data?.authorisation?.token ||
    data?.authorization?.token ||
    data?.data?.accessToken ||
    data?.data?.access_token ||
    data?.accessToken ||
    data?.token;
  const refresh = data?.data?.refreshToken || data?.data?.refresh_token || data?.refreshToken;
  return { access, refresh };
}

export function getAccessToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function storeTokens(data) {
  const { access, refresh } = extractTokens(data);
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  return access;
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function resolvePinSetupType(stage = {}) {
  const type = stage?.pinSetupType;
  if (type === 'NEW_USER' || type === 'LEGACY_MIGRATION' || type === 'COMPLETED') return type;
  const created = stage?.isPinCreated === true || stage?.isPinCreated === 1 || stage?.isPinCreated === 'true';
  if (created) return 'COMPLETED';
  const legacy =
    stage?.hasLegacyV1Pin === true ||
    stage?.hasLegacyV1Pin === 1 ||
    stage?.hasLegacyV1Pin === 'true' ||
    stage?.hadLegacyPin === true ||
    stage?.hadLegacyPin === 1 ||
    stage?.hadLegacyPin === 'true';
  if (legacy) return 'LEGACY_MIGRATION';
  return 'NEW_USER';
}

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function postForm(path, fields) {
  const body = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    body.append(key, String(value));
  });
  const res = await fetch(`${AUTH_BASE}${path.replace(/^\//, '')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body,
  });
  const data = await parseJson(res);
  if (!(res.status === 200 || res.status === 201)) {
    throw new Error(messageFrom(data));
  }
  return data;
}

export async function postJson(path, body, { auth = false, base = AUTH_BASE } = {}) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (auth) {
    const token = getAccessToken();
    if (!token) throw new Error('Authentication failed');
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${base}${path.replace(/^\//, '')}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body ?? {}),
  });
  const data = await parseJson(res);
  const statusOk = res.status === 200 || res.status === 201;
  const statusTrue = data?.status === true || data?.status === 'true';
  const hasToken = Boolean(extractTokens(data).access);
  if (!statusOk || data?.error === true || (data?.status === false && !hasToken && !statusTrue && path.includes('verifyPin') === false)) {
    // verifyPin / createPin handled by callers with finer rules when needed
    if (!statusOk || data?.error === true || data?.status === false) {
      if (!(statusOk && (statusTrue || hasToken))) {
        throw new Error(messageFrom(data));
      }
    }
  }
  return { res, data };
}

export async function getJson(path, { auth = true, base = AUTH_BASE } = {}) {
  const headers = { Accept: 'application/json' };
  if (auth) {
    const token = getAccessToken();
    if (!token) throw new Error('Authentication failed');
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${base}${path.replace(/^\//, '')}`, { headers });
  const data = await parseJson(res);
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data));
  }
  return data;
}

export async function putJson(path, body = {}, { auth = true, base = STOCK_BASE } = {}) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (auth) {
    const token = getAccessToken();
    if (!token) throw new Error('Authentication failed');
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${base}${path.replace(/^\//, '')}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
  return { res, data: await parseJson(res) };
}

export async function requestOtp({ mobileNumber, referredBy, whatsapp = true }) {
  const fields = {
    callingCode: '+91',
    mobileNumber,
    deviceId: 'appSignature',
    isWhatsappOptin: whatsapp ? 'true' : 'false',
    fromApp: 'fydaa',
  };
  if (referredBy) fields.referredBy = referredBy;
  return postForm('auth/requestOtp', fields);
}

export async function verifyOtp({ mobileNumber, otp }) {
  const data = await postForm('auth/verifyOtp', {
    mobileNumber,
    otp,
    referralCode: '',
  });
  const token = storeTokens(data);
  if (!token) throw new Error('Something went wrong. Please try again.');
  return data;
}

export async function verifyPin({ mobileNumber, pin }) {
  const res = await fetch(`${AUTH_BASE}auth/verifyPin`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber, pin }),
  });
  const data = await parseJson(res);
  if (res.status === 429) throw new Error(messageFrom(data, 'Too many failed attempts. Try again after 15 minutes.'));
  if (res.status === 401) throw new Error('Wrong pin');
  if (res.status === 404) {
    const msg = messageFrom(data, 'Invalid mobile number');
    throw new Error(msg);
  }
  const blocked =
    data?.blocked === true ||
    String(data?.platform || '').toLowerCase() === 'savestment' ||
    String(data?.user_details?.[0]?.from_app || data?.user_details?.[0]?.fromApp || data?.data?.fromApp || '')
      .toLowerCase() === 'savestment';
  if (blocked) throw new Error(messageFrom(data, "You can't login as you are Savestment user"));
  const token = extractTokens(data).access;
  const ok = (res.status === 200 || res.status === 201) && (data?.status === true || data?.status === 'true' || token);
  if (!ok) throw new Error(messageFrom(data, 'Invalid pin. Please try again.'));
  storeTokens(data);
  return data;
}

export async function createPin({ pin, confirmPin }) {
  const { res, data } = await postJson('auth/createPin', { pin, confirmPin }, { auth: true });
  if (!(res.status === 200 || res.status === 201) || !(data?.status === true || data?.status === 'true')) {
    throw new Error(messageFrom(data));
  }
  return data;
}

export async function getUserStage() {
  return getJson('user/getUserStage', { auth: true, base: AUTH_BASE });
}

export async function getRiskQuestionnaire() {
  const data = await getJson('risk-profile-questionnaire/getRiskProfileQuestionnaire', {
    auth: true,
    base: ONBOARDING_BASE,
  });
  const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function createUserRiskProfile(option) {
  const { res, data } = await postJson(
    'risk-profile/createUserRiskProfile',
    { option },
    { auth: true, base: ONBOARDING_BASE }
  );
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Something went wrong. Try again after sometime.'));
  }
  return data;
}

export async function updatePortfoliosSoft() {
  try {
    await putJson('orders/sips/update-portfolios', {}, { auth: true, base: STOCK_BASE });
  } catch {
    /* non-blocking */
  }
}

export async function getRiskIndicators() {
  return getJson('risk-profile/getIndicators', { auth: true, base: ONBOARDING_BASE });
}

/** Unwrap getIndicators payload whether returned flat or under `.data`. */
function indicatorsRoot(data) {
  if (!data || typeof data !== 'object') return null;
  if (data.riskProfile != null || data.riskProfileBasePoints != null) return data;
  if (data.data && typeof data.data === 'object') return data.data;
  return data;
}

/**
 * finalScore = (riskProfile.totalPoints / riskProfileBasePoints) * 100
 * — all values from getIndicators
 */
export function scoreFromIndicators(indicators) {
  const root = indicatorsRoot(indicators);
  const total = Number(root?.riskProfile?.totalPoints);
  const base = Number(root?.riskProfileBasePoints);
  if (!Number.isFinite(total) || !Number.isFinite(base) || base <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((total / base) * 100)));
}

export function bandFromScore(score) {
  if (score <= 30) return 'Ultra Conservative';
  if (score <= 40) return 'Very Conservative';
  if (score <= 50) return 'Conservative';
  if (score <= 60) return 'Moderately Conservative';
  if (score <= 70) return 'Moderately Aggressive';
  if (score <= 80) return 'Aggressive';
  return 'Very Aggressive';
}

/** Prefer API portfolio name from getIndicators; fall back to score thresholds. */
export function bandFromIndicators(indicators) {
  const root = indicatorsRoot(indicators);
  const name = root?.assetAllocation?.smallCasePortfolioName;
  if (typeof name === 'string' && name.trim()) return name.trim();
  return bandFromScore(scoreFromIndicators(indicators));
}
