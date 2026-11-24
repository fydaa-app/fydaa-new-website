/** Simple email format check before requestLinkEmail. */
export function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  if (!email) return false;
  // pragmatic check: local@domain.tld
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
