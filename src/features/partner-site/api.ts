import { env } from '@/config/env';

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
  referralCode: string | null;
};

export type BookPartnerConsultationPayload = {
  mobileNumber: string;
  email: string;
  preferredTime: string;
  name?: string;
};

function getCrmBaseUrl(): string {
  return env.api.crm;
}



export async function bookPartnerConsultation(
  slug: string,
  payload: BookPartnerConsultationPayload,
): Promise<{ leadId: number }> {
  const normalized = String(slug || '').trim().toLowerCase();
  const url = `${getCrmBaseUrl()}arn/public/partner-website/${encodeURIComponent(normalized)}/book-consultation`;

  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      body && typeof body.message === 'string'
        ? body.message
        : 'Unable to book consultation. Please try again.';
    throw new Error(message);
  }

  if (!body?.success) {
    throw new Error(
      typeof body?.message === 'string'
        ? body.message
        : 'Unable to book consultation. Please try again.',
    );
  }

  return { leadId: Number(body?.data?.leadId) || 0 };
}
