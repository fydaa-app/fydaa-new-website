"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { JobOpening } from "./jobsData";
import JobDetailContent from "./JobDetailContent";
import JobApplicationModal from "./JobApplicationModal";

type Props = {
  jobs: JobOpening[];
  loading: boolean;
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
      <p className="mb-2.5 text-[16.5px] font-bold tracking-tight text-ink">{job.title}</p>
      <ChipRow job={job} />
      <span className="text-[12.5px] font-medium text-grey-500">
        {[job.division, job.posted].filter(Boolean).join(" · ")}
      </span>
    </button>
  );
}

function JobDetail({ job, onApply }: { job: JobOpening; onApply: () => void }) {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-5">
        <h3 className="text-[clamp(22px,2.6vw,27px)] font-extrabold tracking-tight text-ink">{job.title}</h3>
        <button
          type="button"
          onClick={onApply}
          className="flex items-center gap-1.5 rounded-[10px] bg-jade px-6 py-3 text-sm font-bold text-white hover:bg-jade-hover"
        >
          Apply now
        </button>
      </div>

      <ChipRow job={job} />

      {job.division ? (
        <span className="my-4 inline-block rounded-md bg-jade-tint px-3 py-1 text-[13.5px] font-semibold text-jade-deep">
          {job.division}
        </span>
      ) : null}

      <div className="mb-7 mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-grey-100 px-4 py-4">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-grey-500">Experience</div>
          <div className="text-[19px] font-bold tracking-tight text-ink">{job.experienceRange || "—"}</div>
        </div>
        <div className="rounded-xl bg-grey-100 px-4 py-4">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-grey-500">Location</div>
          <div className="text-[19px] font-bold tracking-tight text-ink">{job.location || "—"}</div>
        </div>
        <div className="rounded-xl bg-grey-100 px-4 py-4">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-grey-500">Posted</div>
          <div className="text-[19px] font-bold tracking-tight text-ink">{job.posted || "—"}</div>
        </div>
      </div>

      <JobDetailContent job={job} />
    </>
  );
}

export default function OpenPositionsSection({ jobs, loading, error }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [applyJob, setApplyJob] = useState<JobOpening | null>(null);

  useEffect(() => {
    if (selectedIndex >= jobs.length) setSelectedIndex(0);
  }, [jobs.length, selectedIndex]);

  useEffect(() => {
    const applyJobId = searchParams.get("apply");
    if (applyJobId && jobs.length > 0) {
      const job = jobs.find((j) => j.id === applyJobId);
      if (job) {
        setApplyJob(job);
        const idx = jobs.findIndex((j) => j.id === applyJobId);
        if (idx >= 0) setSelectedIndex(idx);
      }
    }
  }, [searchParams, jobs]);

  const openApply = (job: JobOpening) => {
    setApplyJob(job);
    const params = new URLSearchParams(searchParams.toString());
    params.set("apply", job.id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const closeApply = () => {
    setApplyJob(null);
    router.push("/careers", { scroll: false });
  };

  const selectedJob = jobs[selectedIndex] ?? jobs[0];

  return (
    <section className="px-6 py-16 font-inter">
      <JobApplicationModal open={applyJob !== null} job={applyJob} onClose={closeApply} />

      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-baseline justify-between gap-5">
          <div>
            <span className="inline-block rounded-full bg-jade-tint px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-jade-deep">
              Open Positions
            </span>
            <h2 className="mt-3.5 text-[clamp(26px,3.4vw,32px)] font-bold tracking-tight text-ink">See where you fit</h2>
          </div>
          <span className="text-sm font-medium text-grey-500">
            {loading
              ? "Loading jobs..."
              : `Showing ${jobs.length} job${jobs.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {error ? (
          <p className="mt-11 text-[15px] text-red-600">{error}</p>
        ) : loading ? (
          <p className="mt-11 text-[15px] text-grey-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="mt-11 rounded-[20px] border border-grey-200 bg-white p-10 text-center shadow-card">
            <h3 className="text-xl font-bold text-ink">We&apos;re not hiring right now</h3>
            <p className="mt-3 text-[15px] text-grey-600">
              There are currently no active job openings. Please check back later, or register your CV below.
            </p>
          </div>
        ) : (
          <div className="mt-11 grid items-stretch gap-5 md:h-[min(680px,calc(100vh-10rem))] md:grid-cols-[360px_1fr]">
            <div className="flex min-h-0 max-h-[320px] flex-col gap-3 overflow-y-auto overscroll-contain pr-1 md:max-h-none">
              {jobs.map((job, idx) => (
                <JobCard
                  key={job.id}
                  job={job}
                  active={idx === selectedIndex}
                  onSelect={() => setSelectedIndex(idx)}
                />
              ))}
            </div>
            <div className="min-h-0 max-h-[70vh] overflow-y-auto overscroll-contain rounded-[20px] border border-grey-200 bg-white p-9 shadow-card md:max-h-none md:p-10">
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
