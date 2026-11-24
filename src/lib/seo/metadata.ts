import type { Metadata } from "next";
import { isProduction } from "@/config/env";
import { siteConfig } from "@/config/site";

export interface PageSeo {
  /** Page title without the brand suffix; the root layout template appends it. */
  title: string;
  description: string;
  /** Path of the canonical URL, e.g. "/about". */
  path: `/${string}`;
  /** Keep the page out of search indexes (app screens, auth, transactional pages). */
  noIndex?: boolean;
  /** Absolute or root-relative Open Graph image. Defaults to the site image. */
  image?: string;
}

export const DEFAULT_OG_IMAGE = "/opengraph-image.png";

/** Robots directive: everything is noindex outside production. */
export function robotsFor(noIndex: boolean | undefined): Metadata["robots"] {
  return noIndex || !isProduction ? { index: false, follow: false } : { index: true, follow: true };
}

/** Metadata for the root layout: base URL, title template and site-wide defaults. */
export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    robots: robotsFor(false),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url: "/",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: siteConfig.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [DEFAULT_OG_IMAGE],
    },
    icons: { icon: [{ url: "/favicon.ico", sizes: "any" }] },
  };
}

/** Per-page metadata with a canonical URL and matching Open Graph/Twitter data. */
export function pageMetadata({ title, description, path, noIndex, image }: PageSeo): Metadata {
  const images = [image ?? DEFAULT_OG_IMAGE];
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: robotsFor(noIndex),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url: path,
      title: `${title} | ${siteConfig.name}`,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description, images },
  };
}
