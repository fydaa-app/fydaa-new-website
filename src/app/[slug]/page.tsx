import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo/metadata";
import { getPartnerWebsite } from "@/features/partner-site/partner-website.server";
import PartnerWebsite from "@/features/partner-site/PartnerWebsite";

/** Incrementally generated and cached for 5 minutes (including "not found"). */
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = String((await params)?.slug || "").trim();
  const data = await getPartnerWebsite(slug);
  // Unknown partner: hand over to the 404 boundary so its metadata (title, noindex) applies.
  if (!data) notFound();
  const name = data.name?.trim() || "Fydaa Partner";
  const about = data.about?.replace(/\s+/g, " ").trim();
  return pageMetadata({
    title: `${name} – Fydaa Partner`,
    description:
      about && about.length > 40
        ? `${about.slice(0, 152).trimEnd()}${about.length > 152 ? "…" : ""}`
        : `Invest in mutual funds and plan your goals with ${name}, an AMFI-registered Fydaa partner.`,
    path: `/${encodeURIComponent(slug.toLowerCase())}`,
    image: data.photoUrl || undefined,
  });
}

export default async function PartnerWebsitePage({ params }: PageProps) {
  const slug = String((await params)?.slug || "").trim();
  const data = await getPartnerWebsite(slug);
  if (!data) notFound();
  return <PartnerWebsite data={data} slug={slug} />;
}
