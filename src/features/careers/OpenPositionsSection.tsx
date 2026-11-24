"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { JobOpening } from "./types";
import JobDetailContent from "./JobDetailContent";
import Link from "next/link";
import JobApplicationModal from "./JobApplicationModal";
import { jobPath } from "./job-openings";

type Props = {
  jobs: JobOpening[];
  error: string | null;
};

function ChipRow({ job }: { job: JobOpening }) {
  const chips = (job.tags || []).filter(Boolean);
  const fallback = [job.experienceRange, job.division, job.location].filter(Boolean) as string[];
  const items = chips.length > 0 ? chips : fallback;

  return (
    <div className="mb-2.5 flex flex-wrap gap-1.5">
      {items.map((tag) => {
        const isLocation = Boolean(job.location && tag === job.location);
        return (
          <span
            key={tag}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-grey-100 px-2.5 py-1 text-xs font-semibold text-grey-600"
          >
            {isLocation ? (
              <svg width="10" height="12" viewBox="0 0 12 14" fill="none" aria-hidden>
                <path
                  d="M6 13s5-4.2 5-8A5 5 0 1 0 1 5c0 3.8 5 8 5 8z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle cx="6" cy="5" r="1.4" fill="currentColor" />
              </svg>
            ) : null}
            {tag}
          </span>
        );
      })}
    </div>
  );
}

function JobCard({
  job,
  active,
  onSelect,
}: {
  job: JobOpening;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`w-full rounded-2xl border p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover ${
        active ? "border-jade-200 bg-jade-tint" : "border-grey-200 bg-white"
      }`}
    >
      <p className="mb-2.5 text-base font-bold tracking-tight text-ink">{job.title}</p>
      <ChipRow job={job} />
      <span className="text-xs font-medium text-grey-500">
        {[job.division, job.posted].filter(Boolean).join(" · ")}
      </span>
    </button>
  );
}

export function JobDetail({
  job,
  onApply,
  headingLevel = 3,
  showPermalink = true,
}: {
  job: JobOpening;
  onApply: () => void;
  headingLevel?: 1 | 3;
  showPermalink?: boolean;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h3";
  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-5">
        <div>
          <Heading className="text-title font-extrabold tracking-tight text-ink">{job.title}</Heading>
          {showPermalink ? (
            <Link
              href={jobPath(job.id)}
              className="mt-1 inline-block text-sm font-semibold text-jade underline-offset-4 hover:underline"
            >
              View full job page<span className="sr-only">: {job.title}</span>
            </Link>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onApply}
          data-ph-event="Apply now"
          className="flex items-center gap-1.5 rounded-btn bg-jade px-6 py-3 text-sm font-bold text-white hover:bg-jade-hover"
        >
          Apply now
        </button>
      </div>

      <ChipRow job={job} />

      {job.division ? (
        <span className="my-4 inline-block rounded-md bg-jade-tint px-3 py-1 text-sm font-semibold text-jade-deep">
          {job.division}
        </span>
      ) : null}

      <div className="mb-7 mt-4 grid grid-cols-1 xs:grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-grey-100 px-4 py-4">
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-grey-500">Experience</div>
          <div className="text-xl font-bold tracking-tight text-ink">{job.experienceRange || "—"}</div>
        </div>
        <div className="rounded-xl bg-grey-100 px-4 py-4">
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-grey-500">Location</div>
          <div className="text-xl font-bold tracking-tight text-ink">{job.location || "—"}</div>
        </div>
        <div className="rounded-xl bg-grey-100 px-4 py-4">
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-grey-500">Posted</div>
          <div className="text-xl font-bold tracking-tight text-ink">{job.posted || "—"}</div>
        </div>
      </div>

      <JobDetailContent job={job} />
    </>
  );
}

/**
 * Opens the application modal for `?apply=<jobId>` links. Isolated in its own Suspense
 * boundary: useSearchParams() forces client rendering up to the nearest boundary, and
 * the job list itself must stay in the server-rendered HTML.
 */
function ApplyFromQuery({ jobs, onApply }: { jobs: JobOpening[]; onApply: (job: JobOpening) => void }) {
  const applyId = useSearchParams().get("apply");
  useEffect(() => {
    const job = applyId ? jobs.find((candidate) => candidate.id === applyId) : undefined;
    if (job) onApply(job);
  }, [applyId, jobs, onApply]);
  return null;
}

export default function OpenPositionsSection({ jobs, error }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [applyJob, setApplyJob] = useState<JobOpening | null>(null);

  const selectedJob = jobs.find((job) => job.id === selectedId) ?? jobs[0];

  // Stable identity: ApplyFromQuery's effect must only re-run when the URL changes,
  // otherwise closing the modal would immediately reopen it from the stale ?apply=.
  const showApplication = useCallback((job: JobOpening) => {
    setSelectedId(job.id);
    setApplyJob(job);
  }, []);

  const openApply = (job: JobOpening) => {
    showApplication(job);
    router.push(`/careers?apply=${encodeURIComponent(job.id)}`, { scroll: false });
  };

  const closeApply = () => {
    setApplyJob(null);
    router.push("/careers", { scroll: false });
  };

  return (
    <section className="px-6 py-16 font-inter">
      <JobApplicationModal open={applyJob !== null} job={applyJob} onClose={closeApply} />
      <Suspense fallback={null}>
        <ApplyFromQuery jobs={jobs} onApply={showApplication} />
      </Suspense>

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-baseline justify-between gap-5">
          <div>
            <span className="inline-block rounded-full bg-jade-tint px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-jade-deep">
              Open Positions
            </span>
            <h2 className="text-heading mt-3.5 font-bold text-ink">See where you fit</h2>
          </div>
          {error ? null : (
            <span className="text-sm font-medium text-grey-600">
              {`Showing ${jobs.length} job${jobs.length === 1 ? "" : "s"}`}
            </span>
          )}
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-11 rounded-4xl border border-grey-200 bg-white p-10 text-center shadow-card"
          >
            <h3 className="text-xl font-bold text-ink">Open roles are unavailable right now</h3>
            <p className="mt-3 text-base text-grey-600">{error} You can also register your CV below and we&apos;ll reach out.</p>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="mt-6 rounded-btn bg-jade px-6 py-3 text-sm font-bold text-white hover:bg-jade-hover"
            >
              Try again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-11 rounded-4xl border border-grey-200 bg-white p-10 text-center shadow-card">
            <h3 className="text-xl font-bold text-ink">We&apos;re not hiring right now</h3>
            <p className="mt-3 text-base text-grey-600">
              There are currently no active job openings. Please check back later, or register your CV below.
            </p>
          </div>
        ) : (
          <div className="mt-11 grid items-stretch gap-5 md:h-[min(680px,calc(100vh-10rem))] md:grid-cols-[minmax(0,320px)_1fr] lg:grid-cols-[360px_1fr]">
            <div className="flex min-h-0 max-h-[320px] flex-col gap-3 overflow-y-auto overscroll-contain pr-1 md:max-h-none">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  active={job.id === selectedJob?.id}
                  onSelect={() => setSelectedId(job.id)}
                />
              ))}
            </div>
            <div className="min-h-0 max-h-[70vh] overflow-y-auto overscroll-contain rounded-4xl border border-grey-200 bg-white p-9 shadow-card md:max-h-none md:p-10">
              {selectedJob ? (
                <JobDetail job={selectedJob} onApply={() => openApply(selectedJob)} />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
