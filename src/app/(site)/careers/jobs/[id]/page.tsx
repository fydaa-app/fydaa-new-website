import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobOpening, getJobOpenings } from "@/features/careers/job-openings.server";
import { jobPath, jobPostingJsonLd } from "@/features/careers/job-openings";
import JobPageView from "@/features/careers/JobPageView";
import { JsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 600;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const { jobs } = await getJobOpenings();
  return jobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobOpening((await params).id);
  if (!job) notFound();
  const summary = job.about.replace(/\s+/g, " ").trim();
  return pageMetadata({
    title: `${job.title} – Careers`,
    description:
      summary.length > 50
        ? `${summary.slice(0, 152).trimEnd()}${summary.length > 152 ? "…" : ""}`
        : `Apply for ${job.title} at ${job.companyName}${job.location ? ` in ${job.location}` : ""}.`,
    path: jobPath(job.id),
  });
}

export default async function JobPage({ params }: Props) {
  const job = await getJobOpening((await params).id);
  if (!job) notFound();
  return (
    <>
      <JsonLd data={jobPostingJsonLd(job)} />
      <JobPageView job={job} />
    </>
  );
}
