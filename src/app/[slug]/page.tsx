import { notFound } from 'next/navigation';
import { fetchPublicPartnerWebsite } from '../config/partnerWebsiteApi';
import PartnerWebsite from './PartnerWebsite';

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

  return <PartnerWebsite data={data} slug={slug} />;
}
