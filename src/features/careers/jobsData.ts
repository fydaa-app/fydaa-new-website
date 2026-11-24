/** New structured responsibilities: array of objects to preserve order */
export type ResponsibilitiesData = Array<{
  heading: string;
  items: Array<{ item: string; subItems: string[] }>;
}>;

export type JobOpening = {
  id: string;
  title: string;
  companyName: string;
  salaryCompact: string | null;
  salaryCard: string | null;
  tags: string[];
  metaLine: string;
  division: string;
  experienceRange: string | null;
  location: string | null;
  posted: string;
  about: string;
  /** Supports both legacy flat string[] and the new structured object format */
  responsibilities: string[] | ResponsibilitiesData;
  skills: string[];
  linkedinLink: string;
};

export async function fetchJobOpenings(): Promise<JobOpening[]> {
    const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}referrals/job-openings?active=true`
  );
  const data = await res.json();

   return data.map((job: any) => ({
     id: String(job.id),
     title: job.title,
     companyName: job.companyName,
     salaryCompact: job.salaryCompact,
     salaryCard: job.salaryCard,
     tags: (job.tags || []).map((t: string) => t.charAt(0).toUpperCase() + t.slice(1)),
     metaLine:
       job.division && job.posted
         ? `${job.division} | ${formatPostedDate(job.posted)}`
         : job.division || formatPostedDate(job.posted),
     division: job.division,
     experienceRange: job.experienceRange,
     location: job.location,
      posted: job.posted ? formatPostedDate(job.posted) : '',
     about: job.about,
     responsibilities: job.responsibilities ?? [],
     skills: job.skills || [],
     linkedinLink: job.linkedinLink || '',
   }));
}

function formatPostedDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

if (diffDay === 0) return 'Today';
if (diffDay === 1) return '1 day ago';
if (diffDay < 7) return `${diffDay} days ago`;

if (diffDay < 30) {
  const weeks = Math.floor(diffDay / 7);
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
}

if (diffDay < 365) {
  const months = Math.floor(diffDay / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

const years = Math.floor(diffDay / 365);
return years === 1 ? '1 year ago' : `${years} years ago`;
}