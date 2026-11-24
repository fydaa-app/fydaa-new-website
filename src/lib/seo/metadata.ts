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
  /** Use the title as-is, without the "| Fydaa" template (e.g. the home page). */
  absoluteTitle?: boolean;
}

export const DEFAULT_OG_IMAGE = "/og-image.png";

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
export function pageMetadata({ title, description, path, noIndex, image, absoluteTitle }: PageSeo): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const images = [image ?? DEFAULT_OG_IMAGE];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: robotsFor(noIndex),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url: path,
      title: fullTitle,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
