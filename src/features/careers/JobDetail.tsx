import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import JobDetailContent from "./JobDetailContent";
import { formatExperience, jobPath, jobTags } from "./job-openings";
import type { JobOpening } from "./types";

/** Team, location, experience and posting date as a row of label/value pairs. Empty facts are left out. */
export function JobFacts({ job, className }: { job: JobOpening; className?: string }) {
  const facts = [
    { label: "Team", value: job.division },
    { label: "Location", value: job.location },
    { label: "Experience", value: formatExperience(job.experienceRange) },
    { label: "Posted", value: job.posted },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  if (facts.length === 0) return null;
  return (
    <dl
      className={cn("grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-4 sm:grid-cols-4", className)}
    >
      {facts.map((fact) => (
        <div key={fact.label} className="min-w-0">
          <dt className="text-sm text-grey-500">{fact.label}</dt>
          <dd className="mt-0.5 text-base font-semibold text-ink [font-stretch:104%]">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The listing's own tags that the facts don't already say ("Full-time", "Remote"). */
export function JobTags({ job, className }: { job: JobOpening; className?: string }) {
  const tags = jobTags(job);
  if (tags.length === 0) return null;
  return (
    <ul aria-label="Tags" className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <li key={tag} className="rounded-full border border-line px-3 py-1 text-sm text-grey-600">
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** One role in the careers page's detail pane: title, apply, facts and the full description. */
export function JobDetail({ job, onApply }: { job: JobOpening; onApply: () => void }) {
  return (
    <article aria-labelledby={`job-${job.id}-title`} className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 max-w-[36ch] flex-col">
          <h3
            id={`job-${job.id}-title`}
            className="text-2xl font-semibold leading-tight tracking-tight text-ink stretch-semi xl:text-3xl"
          >
            {job.title}
          </h3>
          <Link href={jobPath(job.id)} className="link inline-flex min-h-11 w-fit items-center text-sm">
            View full job page<span className="sr-only">: {job.title}</span>
          </Link>
        </div>
        <button type="button" onClick={onApply} data-ph-event="Apply now" className="btn btn-primary btn-md">
          Apply now
        </button>
      </header>
      <JobFacts job={job} />
      <JobTags job={job} />
      <div className="pt-2">
        <JobDetailContent job={job} headingLevel={4} />
      </div>
    </article>
  );
}
