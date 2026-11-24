import type { MetadataRoute } from "next";
import { sitemapRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { jobPath } from "@/features/careers/job-openings";
import { getJobOpenings } from "@/features/careers/job-openings.server";

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = sitemapRoutes().map(
    ({ path, sitemap: { priority, changeFrequency } }) => ({
      url: new URL(path, siteConfig.url).toString(),
      priority,
      changeFrequency,
    }),
  );

  const { jobs } = await getJobOpenings();
  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: new URL(jobPath(job.id), siteConfig.url).toString(),
    priority: 0.6,
    changeFrequency: "weekly",
    ...(job.postedAt ? { lastModified: job.postedAt } : {}),
  }));

  return [...pages, ...jobPages];
}
