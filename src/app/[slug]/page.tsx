import { notFound } from 'next/navigation';
import { fetchPublicPartnerWebsite } from '../config/partnerWebsiteApi';
import PartnerMobileCheck from './PartnerMobileCheck';

export const dynamic = 'force-dynamic';

const RESERVED_SLUGS = new Set([
  'about',
  'careers',
  'carrers',
  'features',
  'partner',
  'programme',
  'fydaafyip',
  'login',
  'signup',
  'dashboard',
  'upi-faq',
  'quicklinks',
  'api',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'successpagedigi',
  'successpagefund',
  'successpagemandate',
  'successpagensdl',
  'successpagesetu',
  'successpagelumpsum',
]);

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

function isReservedSlug(slug: string): boolean {
  const value = slug.trim().toLowerCase();
  if (RESERVED_SLUGS.has(value)) return true;
  if (value.startsWith('successpage')) return true;
  return false;
}

export default async function PartnerWebsitePage({ params }: PageProps) {
  const resolved = await Promise.resolve(params);
  const slug = String(resolved?.slug || '').trim();

  if (!slug || isReservedSlug(slug)) {
    notFound();
  }

  const data = await fetchPublicPartnerWebsite(slug);
  if (!data) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>{data.name || 'Partner'}</h1>

      {data.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.photoUrl}
          alt={data.name || 'Partner photo'}
          width={160}
          height={160}
          style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }}
        />
      ) : null}

      {data.mobileNumber ? (
        <p style={{ marginBottom: 12 }}>
          <strong>Phone:</strong> {data.mobileNumber}
        </p>
      ) : null}

      {data.about ? (
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>About</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{data.about}</p>
        </section>
      ) : null}

      {Array.isArray(data.certifications) && data.certifications.length > 0 ? (
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>
            Certifications / Qualifications / Achievements
          </h2>
          <ul>
            {data.certifications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(data.reviews) && data.reviews.length > 0 ? (
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Customer Reviews</h2>
          <ol>
            {data.reviews.map((review) => (
              <li key={review.id} style={{ marginBottom: 12 }}>
                <div>
                  <strong>{review.customerName || 'Customer'}</strong>
                  {review.stars != null ? ` · ${review.stars}/5` : ''}
                </div>
                {review.customerProfession ? (
                  <div>{review.customerProfession}</div>
                ) : null}
                {review.customerTestimonial ? (
                  <p style={{ marginTop: 4 }}>{review.customerTestimonial}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <PartnerMobileCheck slug={slug} />
    </main>
  );
}
