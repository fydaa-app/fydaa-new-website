/** Indian PAN: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F). */
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function normalizePan(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 10);
}

export function isValidPan(value) {
  return PAN_RE.test(normalizePan(value));
}

/** Latest DOB allowed so the person is at least `minAge` years old today. */
export function maxDobForMinAge(minAge = 18, now = new Date()) {
  const d = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
  return d;
}

export function toIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** `iso` is YYYY-MM-DD from <input type="date">. */
export function isAdultDob(iso, minAge = 18, now = new Date()) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split('-').map(Number);
  const dob = new Date(y, m - 1, d);
  if (Number.isNaN(dob.getTime())) return false;
  if (dob.getFullYear() !== y || dob.getMonth() !== m - 1 || dob.getDate() !== d) return false;
  const cutoff = maxDobForMinAge(minAge, now);
  return dob.getTime() <= cutoff.getTime();
}
