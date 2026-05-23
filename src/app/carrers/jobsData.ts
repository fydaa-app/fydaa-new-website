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
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}