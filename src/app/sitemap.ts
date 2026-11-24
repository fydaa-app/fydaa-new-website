import type { MetadataRoute } from "next";
import { sitemapRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes().map(({ path, sitemap: { priority, changeFrequency } }) => ({
    url: new URL(path, siteConfig.url).toString(),
    priority,
    changeFrequency,
  }));
}
