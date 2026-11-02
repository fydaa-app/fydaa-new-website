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

function getCrmBaseUrl(): string {
  return BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
}

export type PartnerMobileCheckStatus =
  | 'linked'
  | 'not_found'
  | 'no_referral'
  | 'other_referral';

export type PartnerMobileCheckResult = {
  status: PartnerMobileCheckStatus;
  message: string;
};

export async function fetchPublicPartnerWebsite(
  slug: string,
): Promise<PublicPartnerWebsite | null> {
  const normalized = String(slug || '').trim().toLowerCase();
  if (!normalized) return null;

  const url = `${getCrmBaseUrl()}arn/public/partner-website/${encodeURIComponent(normalized)}`;

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

export async function checkPartnerMobile(
  slug: string,
  mobileNumber: string,
): Promise<PartnerMobileCheckResult> {
  const normalized = String(slug || '').trim().toLowerCase();
  const url = `${getCrmBaseUrl()}arn/public/partner-website/${encodeURIComponent(normalized)}/check-mobile`;

  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mobileNumber }),
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      payload && typeof payload.message === 'string'
        ? payload.message
        : 'Unable to check this number. Please try again.';
    throw new Error(message);
  }

  if (!payload?.success || !payload?.data?.message) {
    throw new Error('Unable to check this number. Please try again.');
  }

  return {
    status: payload.data.status,
    message: payload.data.message,
  };
}
