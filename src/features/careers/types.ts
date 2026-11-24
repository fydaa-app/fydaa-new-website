/** Structured responsibilities: ordered headings, each with items and optional sub-items. */
export type ResponsibilitiesData = Array<{
  heading: string;
  items: Array<{ item: string; subItems: string[] }>;
}>;

export interface JobOpening {
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
  /** Human label such as "3 days ago". */
  posted: string;
  /** ISO date (YYYY-MM-DD) the role was posted, when known. */
  postedAt: string | null;
  about: string;
  /** Legacy flat string[] or the structured format. */
  responsibilities: string[] | ResponsibilitiesData;
  skills: string[];
  linkedinLink: string;
}

export interface JobOpeningsResult {
  jobs: JobOpening[];
  /** User-safe message when the list could not be loaded. */
  error: string | null;
}
