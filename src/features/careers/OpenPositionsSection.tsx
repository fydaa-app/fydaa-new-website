"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils/cn";
import JobApplicationModal from "./JobApplicationModal";
import { JobDetail } from "./JobDetail";
import { jobPath, jobSummary } from "./job-openings";
import type { JobOpening } from "./types";

type Props = {
  jobs: JobOpening[];
  error: string | null;
  onRegisterCv: () => void;
};

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

/** No list to show: say why, and offer the CV route so the visit isn't wasted. */
function EmptyState({
  title,
  children,
  alert,
  onRetry,
  onRegisterCv,
}: {
  title: string;
  children: ReactNode;
  alert?: boolean;
  onRetry?: () => void;
  onRegisterCv: () => void;
}) {
  return (
    <div
      role={alert ? "alert" : undefined}
      className="flex flex-col items-start gap-4 rounded-4xl bg-mist p-6 sm:p-10"
    >
      <h3 className="text-title text-ink">{title}</h3>
      <p className="max-w-[56ch] text-base leading-relaxed text-grey-600">{children}</p>
      <div className="flex flex-wrap gap-3 pt-2">
        {onRetry ? (
          <button type="button" onClick={onRetry} className="btn btn-primary btn-md">
            Try again
          </button>
        ) : null}
        <button
          type="button"
          onClick={onRegisterCv}
          data-ph-event="Register your CV"
          className={cn("btn btn-md", onRetry ? "btn-secondary" : "btn-primary")}
        >
          Register your CV
        </button>
      </div>
    </div>
  );
}

export default function OpenPositionsSection({ jobs, error, onRegisterCv }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [applyJob, setApplyJob] = useState<JobOpening | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const selectedJob = jobs.find((job) => job.id === selectedId) ?? jobs[0];

  // Stable identity: ApplyFromQuery's effect must only re-run when the URL changes,
  // otherwise closing the modal would immediately reopen it from the stale ?apply=.
  const showApplication = useCallback((job: JobOpening) => {
    setSelectedId(job.id);
    setApplyJob(job);
  }, []);

  const select = (id: string) => {
    setSelectedId(id);
    if (detailRef.current) detailRef.current.scrollTop = 0;
  };

  const openApply = (job: JobOpening) => {
    showApplication(job);
    router.push(`/careers?apply=${encodeURIComponent(job.id)}`, { scroll: false });
  };

  const closeApply = () => {
    setApplyJob(null);
    router.push("/careers", { scroll: false });
  };

  return (
    <section id="open-roles" aria-labelledby="open-roles-title" className="section scroll-mt-16">
      <JobApplicationModal open={applyJob !== null} job={applyJob} onClose={closeApply} />
      <Suspense fallback={null}>
        <ApplyFromQuery jobs={jobs} onApply={showApplication} />
      </Suspense>

      <Container className="flex flex-col gap-8 lg:gap-10">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div className="flex flex-col gap-3">
            <h2 id="open-roles-title" className="text-heading text-ink">
              Open roles
            </h2>
            <p className="max-w-[52ch] text-pretty text-lead text-grey-600">
              Each role lists where it&apos;s based and the experience it needs.
            </p>
          </div>
          {error ? null : (
            <p className="text-sm font-medium text-grey-500">
              {`Showing ${jobs.length} job${jobs.length === 1 ? "" : "s"}`}
            </p>
          )}
        </div>

        {error ? (
          <EmptyState
            title="Open roles are unavailable right now"
            alert
            onRetry={() => router.refresh()}
            onRegisterCv={onRegisterCv}
          >
            {error} You can also register your CV and we&apos;ll reach out.
          </EmptyState>
        ) : jobs.length === 0 ? (
          <EmptyState title="We're not hiring right now" onRegisterCv={onRegisterCv}>
            There are no open roles at the moment. Check back later, or register your CV and we&apos;ll reach
            out when one opens.
          </EmptyState>
        ) : (
          <>
            {/* Phones and tablets: one row per role, each opening its own page. */}
            <ul className="divide-y divide-line overflow-hidden rounded-4xl border border-line lg:hidden">
              {jobs.map((job) => {
                const summary = jobSummary(job);
                return (
                  <li key={job.id}>
                    <Link
                      href={jobPath(job.id)}
                      className="flex items-center gap-4 px-4 py-4 transition-colors duration-quick hover:bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-jade sm:px-6 sm:py-5"
                    >
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-base font-semibold text-ink [font-stretch:104%]">
                          {job.title}
                        </span>
                        {summary ? <span className="text-sm text-grey-500">{summary}</span> : null}
                      </span>
                      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-grey-500" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Desktop: the list and the selected role side by side, each pane scrolling on its own. */}
            <div className="hidden h-[min(46rem,calc(100dvh-8rem))] overflow-hidden rounded-4xl border border-line lg:grid lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
              <ul
                aria-label="Open roles"
                className="min-h-0 overflow-y-auto overscroll-contain border-r border-line bg-mist"
              >
                {jobs.map((job) => {
                  const active = job.id === selectedJob?.id;
                  const summary = jobSummary(job);
                  return (
                    <li key={job.id} className="border-b border-line">
                      <button
                        type="button"
                        onClick={() => select(job.id)}
                        aria-pressed={active}
                        className={cn(
                          "relative flex w-full flex-col gap-1 px-6 py-5 text-left transition-colors duration-quick focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-jade",
                          active ? "bg-white" : "hover:bg-white/60",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-y-4 left-2 w-1 rounded-full bg-jade transition-opacity duration-fast",
                            active ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span className="text-base font-semibold text-ink [font-stretch:104%]">
                          {job.title}
                        </span>
                        {summary ? <span className="text-sm text-grey-500">{summary}</span> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div ref={detailRef} className="min-h-0 overflow-y-auto overscroll-contain p-8 xl:p-10">
                {selectedJob ? <JobDetail job={selectedJob} onApply={() => openApply(selectedJob)} /> : null}
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
