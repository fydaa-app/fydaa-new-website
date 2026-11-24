import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/seo/metadata';
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
  'legal',
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
  params: Promise<{ slug: string }>;
};

function isReservedSlug(slug: string): boolean {
  const value = slug.trim().toLowerCase();
  if (RESERVED_SLUGS.has(value)) return true;
  if (value.startsWith('successpage')) return true;
  return false;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = String((await params)?.slug || '').trim();
  if (!slug || isReservedSlug(slug)) return {};
  const data = await fetchPublicPartnerWebsite(slug);
  if (!data) return {};
  const name = data.name?.trim() || 'Fydaa Partner';
  const about = data.about?.replace(/\s+/g, ' ').trim();
  return pageMetadata({
    title: `${name} – Fydaa Partner`,
    description:
      about && about.length > 40
        ? `${about.slice(0, 152).trimEnd()}${about.length > 152 ? '…' : ''}`
        : `Invest in mutual funds and plan your goals with ${name}, an AMFI-registered Fydaa partner.`,
    path: `/${encodeURIComponent(slug.toLowerCase())}`,
    image: data.photoUrl || undefined,
  });
}

export default async function PartnerWebsitePage({ params }: PageProps) {
  const resolved = await params;
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
