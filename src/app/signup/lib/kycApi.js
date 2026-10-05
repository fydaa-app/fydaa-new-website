import { getAccessToken, storeTokens } from './authApi';
import { AUTH_BASE, PAYMENT_BASE } from './apiHosts';

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

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

function authHeaders(json = true) {
  const token = getAccessToken();
  if (!token) throw new Error('Authentication failed');
  const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` };
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
}

async function authFetch(path, { method = 'GET', body, base = AUTH_BASE, json = true } = {}) {
  const res = await fetch(`${base}${path.replace(/^\//, '')}`, {
    method,
    headers: authHeaders(json),
    body: body === undefined ? undefined : json ? JSON.stringify(body) : body,
  });
  if (res.status === 401) {
    const err = new Error('Session expired. Please log in again.');
    err.status = 401;
    throw err;
  }
  const data = await parseJson(res);
  return { res, data };
}

export function isTruthyFlag(value) {
  return value === true || value === 1 || value === 'true' || value === '1';
}

export function toTitleCaseName(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function isValidFullName(value) {
  const name = String(value || '').trim().replace(/\s+/g, ' ');
  if (name.length < 2) return false;
  if (name !== name.trim()) return false;
  return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name);
}

function nest(data) {
  return data?.data && typeof data.data === 'object' ? { ...data, ...data.data } : data || {};
}

function normalizeReason(reason) {
  return String(reason || '')
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

function textBlob(data) {
  const n = nest(data);
  const parts = [n.message, n.reason, n.recommendations];
  if (Array.isArray(n.issues)) {
    n.issues.forEach((i) => parts.push(i?.reason, i?.code, i?.message));
  }
  return parts.filter(Boolean).join(' ').toLowerCase();
}

export function isNoKycRecord(data) {
  const n = nest(data);
  const action = n.action;
  if (action === 'create') return true;
  const blob = textBlob(n);
  if (
    blob.includes('not found') ||
    blob.includes('no kyc') ||
    blob.includes('no record') ||
    blob.includes('fresh kyc') ||
    blob.includes('kyc_not_found')
  ) {
    return true;
  }
  const issues = Array.isArray(n.issues) ? n.issues : [];
  return issues.some((i) => {
    const code = String(i?.code || '').toLowerCase();
    return code.includes('not_found') || code.includes('no_record') || code.includes('kyc_not_found');
  });
}

export function isPanMismatch(data) {
  const n = nest(data);
  if (n.action === 'correction_required') return true;
  const vs = n.verificationStatus || {};
  if (vs.name === 'failed' && vs.nameCode === 'mismatch') return true;
  if (vs.dob === 'failed' && vs.dobCode === 'mismatch') return true;
  if (vs.pan === 'failed' && vs.panCode) return true;
  const issues = Array.isArray(n.issues) ? n.issues : [];
  const hasIssue = issues.some((i) => {
    const code = String(i?.code || '').toLowerCase();
    return code && !code.includes('not_found') && !code.includes('no_record') && !code.includes('kyc_not_found');
  });
  if (hasIssue) return true;
  const blob = textBlob(n);
  return (
    blob.includes('does not match') ||
    blob.includes('name mismatch') ||
    blob.includes('dob mismatch') ||
    blob.includes('correction required')
  );
}

export function mismatchMessage(data) {
  const n = nest(data);
  const issues = Array.isArray(n.issues) ? n.issues : [];
  const reasons = issues.map((i) => i?.reason).filter(Boolean);
  if (reasons.length) return reasons.join('. ');
  return n.reason || n.recommendations || n.message || 'Details do not match PAN records.';
}

export function agreementCompleted(stage) {
  const list = Array.isArray(stage?.profileStage) ? stage.profileStage : [];
  return list.some((i) => i?.type === 'AGREEMENT' && isTruthyFlag(i?.completed));
}

/** Home KYC card complete (identity KYC done). */
export function isHomeKycComplete(stage = {}) {
  if (!isTruthyFlag(stage?.isRiskProfileComplete)) return false;
  if (!isTruthyFlag(stage?.isPan) || !isTruthyFlag(stage?.isDob)) return false;
  if (isTruthyFlag(stage?.isKycExpired)) return false;
  if (isTruthyFlag(stage?.ismodify)) return isTruthyFlag(stage?.ismodifynsdl);
  if (isTruthyFlag(stage?.isKycNonCompliant) || isTruthyFlag(stage?.isNonCompliantData)) {
    return isTruthyFlag(stage?.isNSDL);
  }
  if (isTruthyFlag(stage?.isKycCompliant)) return isTruthyFlag(stage?.kycExtraData);
  return false;
}

/** Full invest-ready style completion used by signup web flow (includes bank + nominee). */
export function isSignupComplete(stage = {}) {
  if (!isTruthyFlag(stage?.isPinCreated)) return false;
  if (!isHomeKycComplete(stage)) return false;
  if (!isTruthyFlag(stage?.isBank)) return false;
  if (!isTruthyFlag(stage?.isNominee)) return false;
  return true;
}

export async function fetchKycData({ pan, name, date_of_birth }) {
  const { res, data } = await authFetch('kyc/fetch-kyc-data', {
    method: 'POST',
    body: { pan, name, date_of_birth },
  });
  return { res, data, nested: nest(data) };
}

export async function reissueTokens() {
  const { res, data } = await authFetch('user/reissue-tokens', { method: 'POST', body: {} });
  if (!(res.status === 200 || res.status === 201)) {
    throw new Error(messageFrom(data, 'Could not refresh session.'));
  }
  storeTokens(data);
  return data;
}

export async function initiateKyc() {
  const { res, data } = await authFetch('kyc/initiate-kyc', { method: 'POST', body: {} });
  if (!(res.status === 200 || res.status === 201)) {
    throw new Error(messageFrom(data, 'Failed to initialize KYC. Please try again.'));
  }
  return data;
}

export async function saveKycExtra(payload) {
  const { res, data } = await authFetch('kyc/kyc-extra', { method: 'POST', body: payload });
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Could not save KYC details.'));
  }
  return data;
}

export async function saveNonCompliantRequest(payload) {
  const { res, data } = await authFetch('kyc/request', { method: 'PUT', body: payload });
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Could not save KYC details.'));
  }
  return data;
}

export async function startIdentityDocument(postback_url = 'https://fydaa.com') {
  const { res, data } = await authFetch('kyc/identity-document', {
    method: 'POST',
    body: { postback_url },
  });
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Could not start DigiLocker.'));
  }
  return data;
}

export async function getIdentityDocument() {
  const { res, data } = await authFetch('kyc/get-identity-document');
  if (!(res.status === 200 || res.status === 201)) {
    throw new Error(messageFrom(data, 'Could not read DigiLocker status.'));
  }
  return data;
}

export async function uploadSignatureBase64(signatureData) {
  const { res, data } = await authFetch('kyc/signature', {
    method: 'POST',
    body: { signatureData },
  });
  if (res.status === 403) return { alreadyStored: true, data };
  const msg = messageFrom(data, '');
  if (
    /already|permission denied|not allowed|error updating kyc request/i.test(msg)
  ) {
    return { alreadyStored: true, data };
  }
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Could not save signature.'));
  }
  return { alreadyStored: false, data };
}

export async function startNsdlEsign(postback_url = 'https://fydaa.com/SuccesspageNSDL') {
  const { res, data } = await authFetch('kyc/esign', {
    method: 'POST',
    body: { postback_url },
  });
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Could not start Aadhaar e-sign.'));
  }
  return data;
}

export async function getNsdlEsignStatus() {
  const { res, data } = await authFetch('kyc/esign');
  if (res.status === 500) {
    await new Promise((r) => setTimeout(r, 2000));
    return authFetch('kyc/esign').then(({ data: d }) => d);
  }
  if (!(res.status === 200 || res.status === 201)) {
    // non-JSON 200 treated as success by product — if parse empty, treat successful
    if (res.status === 200 || res.status === 201) return { status: 'successful' };
    throw new Error(messageFrom(data, 'Could not confirm e-sign.'));
  }
  return data;
}

export async function createInvestorProfileAndMfAccount(ipAddress) {
  const { res, data } = await authFetch('kyc/investor-profile-and-mf-account', {
    method: 'POST',
    body: { ipAddress },
  });
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Could not create investment profile.'));
  }
  return data;
}

export async function createAndVerifyBankAccount(payload) {
  const { res, data } = await authFetch('subscription/createAndVerifyBankAccount', {
    method: 'POST',
    body: payload,
    base: PAYMENT_BASE,
  });
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Could not verify bank account.'));
  }
  return data;
}

export async function saveNominee(payload) {
  const { res, data } = await authFetch('kyc/nominee', { method: 'POST', body: payload });
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Could not save nominee.'));
  }
  return data;
}

export async function createModifyKycForm(payload) {
  const { res, data } = await authFetch('kyc/kyc-forms/modify', { method: 'POST', body: payload });
  if (
    /ongoing|already exists/i.test(messageFrom(data, '')) ||
    (data?.id && (res.status === 200 || res.status === 201 || res.status === 400))
  ) {
    return data;
  }
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Could not start KYC update.'));
  }
  return data;
}

export async function getCurrentKycForm() {
  const { res, data } = await authFetch('kyc/kyc-forms/current');
  if (res.status === 404) return null;
  if (!(res.status === 200 || res.status === 201)) {
    throw new Error(messageFrom(data, 'Could not load KYC form.'));
  }
  return data;
}

export async function getKycFormById(id) {
  const { res, data } = await authFetch(`kyc/kyc-forms/${id}`);
  if (!(res.status === 200 || res.status === 201)) {
    throw new Error(messageFrom(data, 'Could not load KYC form.'));
  }
  return data;
}

export async function patchKycForm(id, payload) {
  const { res, data } = await authFetch(`kyc/kyc-forms/${id}`, { method: 'PATCH', body: payload });
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Could not save details.'));
  }
  return data;
}

export async function uploadModifySignatureFile(id, file) {
  const token = getAccessToken();
  if (!token) throw new Error('Authentication failed');
  const body = new FormData();
  body.append('file', file, 'signature.png');
  const res = await fetch(`${AUTH_BASE}kyc/kyc-forms/${id}/signature`, {
    method: 'POST',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    body,
  });
  if (res.status === 401) throw new Error('Session expired. Please log in again.');
  const data = await parseJson(res);
  if (!(res.status === 200 || res.status === 201) || data?.error === true) {
    throw new Error(messageFrom(data, 'Could not upload signature.'));
  }
  return data;
}

export async function getPublicIp() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data?.ip || '0.0.0.0';
  } catch {
    return '0.0.0.0';
  }
}

export function openPopup(url, name = 'fydaa-kyc') {
  if (typeof window === 'undefined' || !url) return null;
  const w = 520;
  const h = 720;
  const left = window.screenX + Math.max(0, (window.outerWidth - w) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - h) / 2);
  return window.open(
    url,
    name,
    `width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`
  );
}

export function waitForPopupClose(popup, { isDoneUrl, timeoutMs = 15 * 60 * 1000 } = {}) {
  return new Promise((resolve) => {
    if (!popup) {
      resolve({ closed: true, done: false });
      return;
    }
    const started = Date.now();
    const timer = setInterval(() => {
      let done = false;
      try {
        const href = popup.location?.href || '';
        if (href && isDoneUrl?.(href)) done = true;
      } catch {
        /* cross-origin while on DigiLocker/NSDL */
      }
      if (popup.closed || done || Date.now() - started > timeoutMs) {
        clearInterval(timer);
        if (done && !popup.closed) {
          try {
            popup.close();
          } catch {
            /* ignore */
          }
        }
        resolve({ closed: true, done });
      }
    }, 600);
  });
}

export function isDigiLockerCallback(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (!host.includes('fydaa.com')) return false;
    const path = u.pathname.toLowerCase();
    if (path.includes('successpagedigi')) return true;
    if (u.searchParams.has('identity_document')) return true;
    if (u.searchParams.has('status')) return true;
    if (path.includes('kyc-modify') && (u.search.includes('proof=') || u.search.includes('esign='))) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function isNsdlCallback(url) {
  try {
    const u = new URL(url);
    if (!u.hostname.toLowerCase().includes('fydaa.com')) return false;
    const status = String(u.searchParams.get('status') || '').toLowerCase();
    return status === 'successful' || status === 'success' || u.pathname.toLowerCase().includes('successpagensdl');
  } catch {
    return false;
  }
}

export const INCOME_OPTIONS = [
  { value: 'upto_1lakh', label: 'Less than ₹1 lakh' },
  { value: 'above_1lakh_upto_5lakh', label: '₹1 lakh – ₹5 lakh' },
  { value: 'above_5lakh_upto_10lakh', label: '₹5 lakh – ₹10 lakh' },
  { value: 'above_10lakh_upto_25lakh', label: '₹10 lakh – ₹25 lakh' },
  { value: 'above_25lakh_upto_1cr', label: '₹25 lakh – ₹1 crore' },
  { value: 'above_1cr', label: 'Above ₹1 crore' },
];

export const OCCUPATION_COMPLIANT = [
  { value: 'business', label: 'Business' },
  { value: 'professional', label: 'Professional' },
  { value: 'retired', label: 'Retired' },
  { value: 'housewife', label: 'Housewife' },
  { value: 'student', label: 'Student' },
  { value: 'public_sector', label: 'Public sector' },
  { value: 'private_sector', label: 'Private sector' },
  { value: 'government_sector', label: 'Government sector' },
  { value: 'others', label: 'Other' },
];

export const OCCUPATION_NONCOMPLIANT = OCCUPATION_COMPLIANT;

export const SOURCE_OF_WEALTH = [
  { value: 'salary', label: 'Salary' },
  { value: 'business', label: 'Business' },
  { value: 'gift', label: 'Gift' },
  { value: 'ancestral_property', label: 'Ancestral property' },
  { value: 'rental_income', label: 'Rental income' },
  { value: 'prize_money', label: 'Prize money' },
  { value: 'royalty', label: 'Royalty' },
  { value: 'others', label: 'Other' },
];

export const NOMINEE_RELATIONS = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
];
