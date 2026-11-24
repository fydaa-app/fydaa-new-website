import { getJobOpenings } from "@/features/careers/job-openings.server";
import CareersView from "@/features/careers/CareersView";
import { pageMetadata } from "@/lib/seo/metadata";

/** Regenerate at most every 10 minutes (matches the job openings fetch). */
export const revalidate = 600;

export const metadata = pageMetadata({
  title: "Careers",
  description:
    "Help people across India invest for their goals. See open roles at Fydaa and apply online, or register your CV and we'll get in touch when a role that fits opens.",
  path: "/careers",
});

export default async function CareersPage() {
  const result = await getJobOpenings();
  return <CareersView {...result} />;
}
