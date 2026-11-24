import type { MetadataRoute } from "next";
import { isProduction } from "@/config/env";
import { siteConfig } from "@/config/site";

/**
 * Production: everything is crawlable except API endpoints. Private pages (dashboard,
 * auth, transactional) stay crawlable on purpose so crawlers can see their `noindex`
 * meta tag; a robots.txt block would hide that tag and keep stale URLs indexed.
 * Non-production deployments are blocked entirely.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
