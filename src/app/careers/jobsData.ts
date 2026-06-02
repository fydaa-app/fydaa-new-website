export type JobOpening = {
  id: string;
  title: string;
  companyName: string;
  salaryCompact: string;
  salaryCard: string;
  tags: string[];
  metaLine: string;
  division: string;
  experienceRange: string;
  location: string;
  posted: string;
  about: string;
  responsibilities: string[];
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
     posted: formatPostedDate(job.posted),
     about: job.about,
     responsibilities: job.responsibilities || [],
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
  if (diffWeek === 1) return '1 week ago';
  if (diffWeek < 4) return `${diffWeek} weeks ago`;
  if (diffMonth === 1) return '1 month ago';
  if (diffMonth < 12) return `${diffMonth} months ago`;
  if (diffYear === 1) return '1 year ago';
  return `${diffYear} years ago`;
}