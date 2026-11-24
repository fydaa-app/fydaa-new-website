import { getJobOpenings } from "@/features/careers/job-openings.server";
import CareersView from "@/features/careers/CareersView";
import { pageMetadata } from "@/lib/seo/metadata";

/** Regenerate at most every 10 minutes (matches the job openings fetch). */
export const revalidate = 600;

export const metadata = pageMetadata({
  title: "Careers",
  description:
    "Build the future of wealth for every Indian. Explore open roles at Fydaa, a SEBI-registered fintech, or register your CV for upcoming opportunities.",
  path: "/careers",
});

export default async function CareersPage() {
  const result = await getJobOpenings();
  return <CareersView {...result} />;
}
