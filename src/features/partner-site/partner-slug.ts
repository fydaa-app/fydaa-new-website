/** Top-level words that are never partner slugs (retired or reserved paths). */
const RESERVED = new Set(["api", "legal", "quicklinks", "carrers", "fydaafyip", "download"]);

/**
 * Partner slugs are short lowercase words/hyphens. Anything else (bot probes like
 * "wp-login.php", ".env", "favicon-32.png") is rejected without asking the CRM.
 */
export function normalizePartnerSlug(raw: string | null | undefined): string | null {
  const slug = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!/^[a-z0-9][a-z0-9_-]{0,62}[a-z0-9]$/.test(slug)) return null;
  if (RESERVED.has(slug) || slug.startsWith("successpage")) return null;
  return slug;
}
