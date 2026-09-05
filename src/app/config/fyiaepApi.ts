const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
export const FYIAEP_API_URL = `${BASE_URL}fyiaep`;

const TOKEN_KEY = 'fyiaep_pin_token';
const MOBILE_KEY = 'fyiaep_mobile';

export const FYIAEP_SESSION_EXPIRED = 'FYIAEP_SESSION_EXPIRED';

export function getFyiaepToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setFyiaepToken(token: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearFyiaepSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(MOBILE_KEY);
}

export function setFyiaepMobile(mobile: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(MOBILE_KEY, mobile);
}

export function getFyiaepMobile(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(MOBILE_KEY);
}

export function isFyiaepSessionExpiredError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.message === FYIAEP_SESSION_EXPIRED ||
    /session expired/i.test(error.message)
  );
}

function looksLikeJwt(value: string) {
  return /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
}

function extractToken(result: Record<string, unknown>): string | null {
  const data = (result.data && typeof result.data === 'object'
    ? (result.data as Record<string, unknown>)
    : {}) as Record<string, unknown>;

  const nestedAuth =
    data.auth && typeof data.auth === 'object'
      ? (data.auth as Record<string, unknown>)
      : {};

  const candidates = [
    result.token,
    result.accessToken,
    result.access_token,
    result.pinToken,
    result.pintoken,
    result.jwt,
    data.token,
    data.accessToken,
    data.access_token,
    data.pinToken,
    data.pintoken,
    data.pin_token,
    data.jwt,
    nestedAuth.token,
    nestedAuth.accessToken,
  ];

  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }

  // Deep fallback: first JWT-looking string in the payload
  const stack: unknown[] = [result];
  const seen = new Set<unknown>();
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== 'object' || seen.has(cur)) continue;
    seen.add(cur);
    if (Array.isArray(cur)) {
      cur.forEach((v) => stack.push(v));
      continue;
    }
    for (const v of Object.values(cur as Record<string, unknown>)) {
      if (typeof v === 'string' && looksLikeJwt(v.trim())) return v.trim();
      if (v && typeof v === 'object') stack.push(v);
    }
  }

  return null;
}

function apiErrorMessage(result: Record<string, unknown>, fallback: string) {
  const msg =
    result.message ||
    result.error ||
    (typeof result.data === 'string' ? result.data : null);
  return typeof msg === 'string' && msg.trim() ? msg : fallback;
}

async function parseJson(res: Response): Promise<Record<string, unknown>> {
  return (await res.json().catch(() => ({}))) as Record<string, unknown>;
}

function throwIfUnauthorized(res: Response, result: Record<string, unknown>) {
  if (res.status === 401) {
    clearFyiaepSession();
    throw new Error(FYIAEP_SESSION_EXPIRED);
  }
  if (!res.ok || result.success === false) {
    throw new Error(apiErrorMessage(result, 'Request failed. Please try again.'));
  }
}

async function postJson(
  path: string,
  body: unknown,
  auth = false,
): Promise<Record<string, unknown>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (auth) {
    const token = getFyiaepToken();
    if (!token) throw new Error(FYIAEP_SESSION_EXPIRED);
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${FYIAEP_API_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const result = await parseJson(res);

  if (auth) {
    throwIfUnauthorized(res, result);
  } else if (!res.ok || result.success === false) {
    throw new Error(apiErrorMessage(result, 'Request failed. Please try again.'));
  }
  return result;
}

async function postFormData(
  path: string,
  formData: FormData,
): Promise<Record<string, unknown>> {
  const token = getFyiaepToken();
  if (!token) throw new Error(FYIAEP_SESSION_EXPIRED);

  const res = await fetch(`${FYIAEP_API_URL}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await parseJson(res);
  throwIfUnauthorized(res, result);
  return result;
}

export async function sendFyiaepOtp(mobileNumber: string, callingCode = '+91') {
  return postJson('/send-otp', { mobileNumber, callingCode }, false);
}

export async function verifyFyiaepOtp(mobileNumber: string, otp: string) {
  const res = await fetch(`${FYIAEP_API_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber, otp }),
  });
  const result = await parseJson(res);

  if (!res.ok || result.success === false) {
    throw new Error(apiErrorMessage(result, 'Invalid OTP. Please try again.'));
  }

  const headerAuth = res.headers.get('authorization') || res.headers.get('Authorization');
  const headerToken = headerAuth?.replace(/^Bearer\s+/i, '').trim() || null;

  const token = extractToken(result) || headerToken;
  if (!token) {
    // Keep response available for debugging in console
    console.warn('[fyiaep] verify-otp succeeded but token field not found', result);
    throw new Error(
      'OTP verified but no session token was returned. Please contact support.',
    );
  }
  setFyiaepToken(token);
  setFyiaepMobile(mobileNumber);
  return result;
}

function unwrapApplication(result: Record<string, unknown> | null) {
  if (!result) return null;
  const data = result.data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  // Raw application object from GET /fyiaep
  if (result.id !== undefined || result.mobileNumber !== undefined || result.applicationStatus !== undefined) {
    return result;
  }
  return result;
}

export async function getFyiaepApplication(): Promise<Record<string, unknown> | null> {
  const token = getFyiaepToken();
  if (!token) return null;

  const res = await fetch(FYIAEP_API_URL, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await parseJson(res);
  if (res.status === 401) {
    clearFyiaepSession();
    return null;
  }
  if (!res.ok) return null;
  if (result.success === false) return null;
  return unwrapApplication(result);
}

function digitsOnly(value: unknown) {
  return String(value ?? '').replace(/\D/g, '');
}

function stripPhone91(value: unknown) {
  const d = digitsOnly(value);
  if (d.length === 12 && d.startsWith('91')) return d.slice(2);
  if (d.length === 10) return d;
  return d.slice(-10) || d;
}

/** Prefer 91XXXXXXXXXX when we have a 10-digit Indian mobile. */
function formatPhoneForApi(value: unknown) {
  const d = digitsOnly(value);
  if (!d) return '';
  if (d.length === 10) return `91${d}`;
  if (d.startsWith('91') && d.length === 12) return d;
  return d;
}

function mapGender(value: unknown) {
  const v = String(value ?? '').trim().toLowerCase();
  if (!v) return '';
  if (v === 'prefer not to say') return 'other';
  return v;
}

function mapGenderFromApi(value: unknown) {
  const v = String(value ?? '').trim().toLowerCase();
  if (!v) return '';
  if (v === 'male') return 'Male';
  if (v === 'female') return 'Female';
  if (v === 'other') return 'Other';
  return String(value ?? '');
}

function mapMaritalStatus(value: unknown) {
  const v = String(value ?? '').trim().toLowerCase();
  if (!v) return '';
  if (v === 'single') return 'unmarried';
  if (v === 'married') return 'married';
  if (v === 'other') return 'other';
  return String(value ?? '');
}

function hasMeaningfulJsonPayload(
  payload: Record<string, unknown>,
  ignoreKeys: string[] = [],
) {
  return Object.keys(payload).some((key) => !ignoreKeys.includes(key));
}

function hasAnyUploadedFiles(uploads: Record<string, File[]>) {
  return Object.values(uploads).some(
    (files) => Array.isArray(files) && files.some(Boolean),
  );
}

function hasDeclarationDraftContent(form: Record<string, unknown>) {
  return Boolean(
    form.allAnnex_agree ||
      form.esign_name ||
      form.esign_date ||
      form.esign_place ||
      form.esign_sig ||
      form.parentName ||
      form.parentRelation ||
      form.parentMobile ||
      form.empSignatory ||
      form.empDesignation ||
      form.empOrg,
  );
}

function mapMaritalFromApi(value: unknown) {
  const v = String(value ?? '').trim().toLowerCase();
  if (v === 'unmarried' || v === 'single') return 'Single';
  if (v === 'married') return 'Married';
  if (v === 'other') return 'Other';
  return String(value ?? '');
}

function mapMedicalCondition(form: Record<string, unknown>) {
  if (form.medicalCondition === 'No') return 'None';
  if (form.medicalCondition === 'Yes') {
    return String(form.medicalDetails || 'Yes');
  }
  return String(form.medicalCondition ?? '');
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function pick(obj: Record<string, unknown>, ...keys: string[]) {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
  }
  return undefined;
}

function pickStr(obj: Record<string, unknown>, ...keys: string[]) {
  const v = pick(obj, ...keys);
  return v === undefined || v === null ? '' : String(v);
}

/** Flatten nested GET /fyiaep sections into one source object. */
function flattenApplication(app: Record<string, unknown>) {
  const personal = asRecord(app.personalDetails);
  const nism = asRecord(app.nismDetails);
  const professional = asRecord(app.professionalDetails);
  const motivation = asRecord(app.motivation);
  const declarations = asRecord(app.declarations);
  const documents = asRecord(app.documents);

  return {
    ...app,
    ...documents,
    ...declarations,
    ...motivation,
    ...professional,
    ...nism,
    ...personal,
    // Keep top-level meta (don't let nested overwrite)
    id: app.id,
    mobileNumber: app.mobileNumber,
    applicationStatus: app.applicationStatus,
    paymentStatus: app.paymentStatus,
  } as Record<string, unknown>;
}

/** Map GET /fyiaep payload into local form field names. */
export function mapApplicationToForm(
  app: Record<string, unknown> | null,
  fallbackMobile = '',
): Record<string, unknown> {
  if (!app) {
    return fallbackMobile ? { whatsapp: fallbackMobile, mobile: fallbackMobile } : {};
  }

  const src = flattenApplication(app);
  const medicalRaw = pickStr(src, 'medicalCondition');
  const medicalIsNone = !medicalRaw || /^none$/i.test(medicalRaw);
  const sameAddress = Boolean(src.sameAddress);

  const mobileFromApp = stripPhone91(pick(src, 'mobileNumber', 'whatsapp')) || fallbackMobile;

  return {
    fullName: pickStr(src, 'fullName'),
    gender: mapGenderFromApi(pick(src, 'gender')),
    dob: pickStr(src, 'dob').slice(0, 10),
    whatsapp: stripPhone91(pick(src, 'whatsapp')) || mobileFromApp,
    mobile: mobileFromApp,
    email: pickStr(src, 'email'),
    pan: pickStr(src, 'pan'),
    aadhaar: pickStr(src, 'aadhaar'),
    maritalStatus: mapMaritalFromApi(pick(src, 'maritalStatus')),
    guardian: pickStr(src, 'guardian'),
    emergencyContact: pickStr(src, 'emergencyContact'),
    emergencyRelation: pickStr(src, 'emergencyRelation'),
    emergencyPhone: stripPhone91(pick(src, 'emergencyPhone')),
    bloodGroup: pickStr(src, 'bloodGroup'),
    medicalCondition: medicalIsNone ? 'No' : 'Yes',
    medicalDetails: medicalIsNone ? '' : (pickStr(src, 'medicalDetails') || medicalRaw),
    permHouse: pickStr(src, 'permHouse'),
    permStreet: pickStr(src, 'permStreet'),
    permCity: pickStr(src, 'permCity'),
    permDistrict: pickStr(src, 'permDistrict'),
    permState: pickStr(src, 'permState'),
    permPin: pickStr(src, 'permPin'),
    sameAddress,
    currHouse: pickStr(src, 'currHouse'),
    currStreet: pickStr(src, 'currStreet'),
    currCity: pickStr(src, 'currCity'),
    currDistrict: pickStr(src, 'currDistrict'),
    currState: pickStr(src, 'currState'),
    currPin: pickStr(src, 'currPin'),

    nismXA: pickStr(src, 'nismXa', 'nismXA'),
    nismXA_cert: pickStr(src, 'nismXaCert', 'nismXA_cert'),
    nismXA_date: pickStr(src, 'nismXaDate', 'nismXA_date').slice(0, 10),
    nismXA_valid: pickStr(src, 'nismXaValid', 'nismXA_valid').slice(0, 10),
    nismXB: pickStr(src, 'nismXb', 'nismXB'),
    nismXB_cert: pickStr(src, 'nismXbCert', 'nismXB_cert'),
    nismXB_date: pickStr(src, 'nismXbDate', 'nismXB_date').slice(0, 10),
    nismXB_valid: pickStr(src, 'nismXbValid', 'nismXB_valid').slice(0, 10),
    nismOther: pickStr(src, 'nismOther'),
    registeredXA: pickStr(src, 'registeredXa', 'registeredXA'),
    registeredXB: pickStr(src, 'registeredXb', 'registeredXB'),
    previouslyAppeared: pickStr(src, 'previouslyAppeared'),
    attemptDetails: pickStr(src, 'attemptDetails'),
    needGuidance: pickStr(src, 'needGuidance'),

    professionalStatus: pickStr(src, 'professionalStatus'),
    currentOrg: pickStr(src, 'currentOrg'),
    designation: pickStr(src, 'designation'),
    workExperience: pickStr(src, 'workExperience'),
    industry: pickStr(src, 'industry'),
    incomeRange: pickStr(src, 'incomeRange'),
    noticePeriod: pickStr(src, 'noticePeriod'),
    workMode: pickStr(src, 'workMode'),
    fieldActivities: pickStr(src, 'fieldActivities'),
    reasonJoining: pickStr(src, 'reasonJoining'),
    currentCity: pickStr(src, 'currentCity'),
    currentState: pickStr(src, 'currentState'),
    willingToTravel: pickStr(src, 'willingToTravel'),
    needTravelSupport: pickStr(src, 'needTravelSupport'),
    clientFacing: pickStr(src, 'clientFacing'),
    preferredLang: pickStr(src, 'preferredLang'),

    motivation: pickStr(src, 'motivation'),
    expectations: pickStr(src, 'expectations'),
    comfortLevel: pickStr(src, 'comfortLevel'),
    longTermGoal: pickStr(src, 'longTermGoal'),

    parentName: pickStr(src, 'parentName'),
    parentRelation: pickStr(src, 'parentRelation'),
    parentMobile: stripPhone91(pick(src, 'parentMobile')),
    empSignatory: pickStr(src, 'empSignatory'),
    empDesignation: pickStr(src, 'empDesignation'),
    empOrg: pickStr(src, 'empOrg'),
    allAnnex_agree: Boolean(src.allAnnexAgreed ?? src.allAnnex_agree),
    esign_name: pickStr(src, 'esignName', 'esign_name'),
    esign_date: pickStr(src, 'esignDate', 'esign_date').slice(0, 10),
    esign_place: pickStr(src, 'esignPlace', 'esign_place'),
    esign_sig: pickStr(src, 'esignSignatureText', 'esign_sig', 'esignName', 'esign_name'),
  };
}

/**
 * Map applicationStatus from GET /fyiaep to form step index (0-5).
 * Status names the section where progress left off.
 */
export function inferResumeStepFromStatus(
  applicationStatus: unknown,
  form: Record<string, unknown>,
): number {
  const raw = String(applicationStatus ?? '')
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-');

  const statusToStep: Record<string, number> = {
    personal: 0,
    'personal-details': 0,
    personaldetails: 0,
    nism: 1,
    'nism-details': 1,
    nismdetails: 1,
    professional: 2,
    'professional-details': 2,
    professionaldetails: 2,
    motivation: 3,
    documents: 4,
    document: 4,
    declarations: 5,
    declaration: 5,
    payment: 5,
    'payment-pending': 5,
    paymentpending: 5,
    'payment-failed': 5,
    paymentfailed: 5,
    paid: 5,
    completed: 5,
    'payment-completed': 5,
    paymentcompleted: 5,
    submitted: 5,
  };

  if (raw && raw in statusToStep) {
    return statusToStep[raw];
  }

  return inferResumeStep(form);
}

/** Infer step from saved fields when applicationStatus is missing. */
export function inferResumeStep(form: Record<string, unknown>): number {
  if (form.allAnnex_agree || form.esign_name) return 5;
  if (form.motivation || form.expectations || form.longTermGoal) return 4;
  if (form.professionalStatus && form.currentOrg) return 3;
  if (form.nismXA || form.nismXB) return 2;
  if (form.fullName && form.email) return 1;
  return 0;
}

function omitEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    out[key] = value;
  }
  return out as Partial<T>;
}

export function buildPersonalDetailsPayload(form: Record<string, unknown>) {
  const sameAddress = !!form.sameAddress;
  const payload: Record<string, unknown> = {
    fullName: form.fullName || '',
    gender: mapGender(form.gender),
    dob: form.dob || '',
    whatsapp: formatPhoneForApi(form.whatsapp || form.mobile),
    email: form.email || '',
    pan: form.pan || '',
    aadhaar: form.aadhaar || '',
    maritalStatus: mapMaritalStatus(form.maritalStatus),
    guardian: form.guardian || '',
    emergencyContact: form.emergencyContact || '',
    emergencyRelation: form.emergencyRelation || '',
    emergencyPhone: formatPhoneForApi(form.emergencyPhone),
    bloodGroup: form.bloodGroup || '',
    permHouse: form.permHouse || '',
    permStreet: form.permStreet || '',
    permCity: form.permCity || '',
    permDistrict: form.permDistrict || '',
    permState: form.permState || '',
    permPin: form.permPin || '',
    sameAddress,
    currHouse: sameAddress ? form.permHouse || '' : form.currHouse || '',
    currStreet: sameAddress ? form.permStreet || '' : form.currStreet || '',
    currCity: sameAddress ? form.permCity || '' : form.currCity || '',
    currDistrict: sameAddress ? form.permDistrict || '' : form.currDistrict || '',
    currState: sameAddress ? form.permState || '' : form.currState || '',
    currPin: sameAddress ? form.permPin || '' : form.currPin || '',
  };

  if (form.medicalCondition) {
    payload.medicalCondition = mapMedicalCondition(form);
    payload.medicalDetails =
      form.medicalCondition === 'Yes'
        ? form.medicalDetails || ''
        : 'No known medical conditions';
  }

  return omitEmpty(payload);
}

export function buildNismDetailsPayload(form: Record<string, unknown>) {
  const nismXa = String(form.nismXA || '');
  const nismXb = String(form.nismXB || '');
  const previouslyAppeared = String(form.previouslyAppeared || '');

  const payload: Record<string, unknown> = {
    nismXa,
    nismXb,
    registeredXa: form.registeredXA || '',
    registeredXb: form.registeredXB || '',
    previouslyAppeared,
    needGuidance: form.needGuidance || '',
  };

  // Only send cert/date fields when Passed (backend rejects empty ISO dates)
  if (nismXa === 'Passed') {
    if (form.nismXA_cert) payload.nismXaCert = form.nismXA_cert;
    if (form.nismXA_date) payload.nismXaDate = form.nismXA_date;
    if (form.nismXA_valid) payload.nismXaValid = form.nismXA_valid;
  }

  if (nismXb === 'Passed') {
    if (form.nismXB_cert) payload.nismXbCert = form.nismXB_cert;
    if (form.nismXB_date) payload.nismXbDate = form.nismXB_date;
    if (form.nismXB_valid) payload.nismXbValid = form.nismXB_valid;
  }

  if (form.nismOther) payload.nismOther = form.nismOther;

  if (previouslyAppeared === 'Yes' && form.attemptDetails) {
    payload.attemptDetails = form.attemptDetails;
  }

  return omitEmpty(payload);
}

export function buildProfessionalDetailsPayload(form: Record<string, unknown>) {
  return omitEmpty({
    professionalStatus: form.professionalStatus || '',
    currentOrg: form.currentOrg || '',
    designation: form.designation || '',
    workExperience: form.workExperience || '',
    industry: form.industry || '',
    incomeRange: form.incomeRange || '',
    noticePeriod: form.noticePeriod || '',
    workMode: form.workMode || '',
    fieldActivities: form.fieldActivities || '',
    reasonJoining: form.reasonJoining || '',
    currentCity: form.currentCity || '',
    currentState: form.currentState || '',
    willingToTravel: form.willingToTravel || '',
    needTravelSupport: form.needTravelSupport || '',
    clientFacing: form.clientFacing || '',
    preferredLang: form.preferredLang || '',
  });
}

export function buildMotivationPayload(form: Record<string, unknown>) {
  return omitEmpty({
    motivation: form.motivation || '',
    expectations: form.expectations || '',
    comfortLevel: form.comfortLevel || '',
    longTermGoal: form.longTermGoal || '',
  });
}

function appendFiles(fd: FormData, key: string, files: File[] | undefined) {
  if (!Array.isArray(files)) return;
  files.forEach((file) => {
    if (file) fd.append(key, file);
  });
}

export function buildDocumentsFormData(uploads: Record<string, File[]>) {
  const fd = new FormData();
  appendFiles(fd, 'photo', uploads.photo);
  appendFiles(fd, 'panCard', uploads.panCard);
  appendFiles(fd, 'aadhaarCard', uploads.aadhaarCard);
  appendFiles(fd, 'gradCert', uploads.gradCert);
  appendFiles(fd, 'nismCertDoc', uploads.nismCertDoc);
  appendFiles(fd, 'nismScorecard', uploads.nismScorecard);
  appendFiles(fd, 'resumeDoc', uploads.resumeDoc);
  return fd;
}

function signatureFileFromText(text: string) {
  const content = text.trim() || 'signature';
  return new File([content], 'signature.txt', { type: 'text/plain' });
}

/** Render typed e-sign name to a PNG file for API multipart upload. */
export async function createSignatureImageFile(text: string): Promise<File> {
  const label = text.trim() || 'signature';
  if (typeof document === 'undefined') return signatureFileFromText(label);

  const canvas = document.createElement('canvas');
  canvas.width = 700;
  canvas.height = 220;
  const ctx = canvas.getContext('2d');
  if (!ctx) return signatureFileFromText(label);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0C4A3E';
  ctx.font = 'italic 48px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, canvas.width / 2, canvas.height / 2, canvas.width - 40);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png'),
  );
  if (!blob) return signatureFileFromText(label);
  return new File([blob], 'signature.png', { type: 'image/png' });
}

export async function buildDeclarationsFormData(form: Record<string, unknown>) {
  const fd = new FormData();
  if (form.allAnnex_agree) fd.append('allAnnexAgreed', 'true');
  if (form.esign_name) fd.append('esignName', String(form.esign_name));
  if (form.esign_date) fd.append('esignDate', String(form.esign_date));
  if (form.esign_place) fd.append('esignPlace', String(form.esign_place));

  const sigText = String(form.esign_sig || form.esign_name || '').trim();
  if (sigText) {
    const sigFile = await createSignatureImageFile(sigText);
    fd.append('esignSignature', sigFile);
  }

  if (form.parentName) fd.append('parentName', String(form.parentName));
  if (form.parentRelation) fd.append('parentRelation', String(form.parentRelation));
  const parentMobile = digitsOnly(form.parentMobile);
  if (parentMobile) fd.append('parentMobile', parentMobile);
  if (form.empSignatory) fd.append('empSignatory', String(form.empSignatory));
  if (form.empDesignation) fd.append('empDesignation', String(form.empDesignation));
  if (form.empOrg) fd.append('empOrg', String(form.empOrg));
  return fd;
}

export async function savePersonalDetails(form: Record<string, unknown>) {
  const payload = buildPersonalDetailsPayload(form);
  // Draft with nothing filled — nothing to persist
  if (!hasMeaningfulJsonPayload(payload, ['sameAddress'])) {
    return { success: true };
  }
  return postJson('/personal-details', payload, true);
}

export async function saveNismDetails(form: Record<string, unknown>) {
  const payload = buildNismDetailsPayload(form);
  if (!hasMeaningfulJsonPayload(payload)) return { success: true };
  return postJson('/nism-details', payload, true);
}

export async function saveProfessionalDetails(form: Record<string, unknown>) {
  const payload = buildProfessionalDetailsPayload(form);
  if (!hasMeaningfulJsonPayload(payload)) return { success: true };
  return postJson('/professional-details', payload, true);
}

export async function saveMotivation(form: Record<string, unknown>) {
  const payload = buildMotivationPayload(form);
  if (!hasMeaningfulJsonPayload(payload)) return { success: true };
  return postJson('/motivation', payload, true);
}

export async function saveDocuments(uploads: Record<string, File[]>) {
  // Draft save with no new files — skip multipart (backend requires files)
  if (!hasAnyUploadedFiles(uploads)) return { success: true };
  return postFormData('/documents', buildDocumentsFormData(uploads));
}

export async function saveDeclarations(form: Record<string, unknown>) {
  if (!hasDeclarationDraftContent(form)) return { success: true };
  return postFormData('/declarations', await buildDeclarationsFormData(form));
}

/** Persist current step to backend. step index matches form wizard. */
export async function saveFyiaepStep(
  step: number,
  form: Record<string, unknown>,
  uploads: Record<string, File[]>,
) {
  switch (step) {
    case 0:
      return savePersonalDetails(form);
    case 1:
      return saveNismDetails(form);
    case 2:
      return saveProfessionalDetails(form);
    case 3:
      return saveMotivation(form);
    case 4:
      return saveDocuments(uploads);
    case 5:
      return saveDeclarations(form);
    default:
      throw new Error('Unknown application step.');
  }
}

function normalizeApplicationStatus(status: unknown): string {
  return String(status ?? '')
    .trim()
    .toLowerCase()
    .replace(/_/g, '-');
}

export function isFyiaepPaymentCompleted(status: unknown): boolean {
  const raw = normalizeApplicationStatus(status);
  return raw === 'payment-completed' || raw === 'paid';
}

export function canStartFyiaepPayment(status: unknown): boolean {
  const raw = normalizeApplicationStatus(status);
  return (
    raw === 'declarations' ||
    raw === 'submitted' ||
    raw === 'payment-pending' ||
    raw === 'payment-failed'
  );
}

export function shouldSkipFyiaepSubmit(status: unknown): boolean {
  const raw = normalizeApplicationStatus(status);
  return (
    raw === 'submitted' ||
    raw === 'payment-pending' ||
    raw === 'payment-failed' ||
    isFyiaepPaymentCompleted(raw)
  );
}

export interface CoursePaymentPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

export interface CoursePaymentOrder {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  applicationNo?: string;
  applicationStatus?: string;
  prefill?: CoursePaymentPrefill;
}

function unwrapPaymentPayload(
  result: Record<string, unknown>,
): Record<string, unknown> {
  if (result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
    return result.data as Record<string, unknown>;
  }
  return result;
}

function parseCoursePaymentOrder(result: Record<string, unknown>): CoursePaymentOrder {
  const data = unwrapPaymentPayload(result);
  const keyId = String(data.keyId || data.key || '');
  const orderId = String(data.orderId || data.id || '');
  const amount = Number(data.amount);
  const currency = String(data.currency || 'INR');

  if (!keyId || !orderId || !Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid payment order response. Please try again.');
  }

  const prefillRaw = data.prefill;
  const prefill =
    prefillRaw && typeof prefillRaw === 'object' && !Array.isArray(prefillRaw)
      ? (prefillRaw as CoursePaymentPrefill)
      : undefined;

  return {
    keyId,
    orderId,
    amount,
    currency,
    applicationNo:
      typeof data.applicationNo === 'string' ? data.applicationNo : undefined,
    applicationStatus:
      typeof data.applicationStatus === 'string'
        ? data.applicationStatus
        : undefined,
    prefill,
  };
}

export async function submitFyiaepApplication() {
  return postJson('/submit', {}, true);
}

export async function createCoursePayment(
  courseName = 'FYIAEP',
): Promise<CoursePaymentOrder> {
  const result = await postJson('/course-payment/create', { courseName }, true);
  return parseCoursePaymentOrder(result);
}

export async function captureCoursePayment(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  return postJson('/course-payment/capture', params, true);
}

export const FYIAEP_PAYMENT_DISMISSED = 'FYIAEP_PAYMENT_DISMISSED';

function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Payment is only available in the browser.'));
  }
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load payment gateway.')),
      );
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load payment gateway.'));
    document.body.appendChild(script);
  });
}

export async function openFyiaepCourseCheckout(
  order: CoursePaymentOrder,
): Promise<Record<string, unknown>> {
  await loadRazorpayScript();

  const Razorpay = window.Razorpay;
  if (!Razorpay) {
    throw new Error('Payment gateway failed to initialize.');
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'FYIAEP',
      description: order.applicationNo || 'FYIAEP Course Fee',
      order_id: order.orderId,
      prefill: order.prefill,
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const captureResult = await captureCoursePayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          resolve(captureResult);
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => reject(new Error(FYIAEP_PAYMENT_DISMISSED)),
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  });
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}
