const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export type PublicPartnerReview = {
  id: number;
  customerName: string | null;
  stars: number | null;
  customerProfession: string | null;
  customerTestimonial: string | null;
  displayOrder: number;
};

export type PublicPartnerWebsite = {
  name: string | null;
  mobileNumber: string | null;
  photoUrl: string | null;
  about: string | null;
  certifications: string[];
  reviews: PublicPartnerReview[];
  websiteSlug: string;
};

export async function fetchPublicPartnerWebsite(
  slug: string,
): Promise<PublicPartnerWebsite | null> {
  const normalized = String(slug || '').trim().toLowerCase();
  if (!normalized) return null;

  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  const url = `${base}arn/public/partner-website/${encodeURIComponent(normalized)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;

    const payload = await res.json();
    if (!payload?.success || !payload?.data) return null;
    return payload.data as PublicPartnerWebsite;
  } catch {
    return null;
  }
}
