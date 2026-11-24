"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/container";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils/cn";
import JobApplicationModal from "./JobApplicationModal";
import { JobFacts, JobTags } from "./JobDetail";
import JobDetailContent from "./JobDetailContent";
import { jobSummary } from "./job-openings";
import type { JobOpening } from "./types";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

const CV_NOTE = "Have your CV ready as a PDF or DOCX file, up to 5MB.";

/**
 * Standalone job page: the title and facts, the full description, and Apply kept in reach (a
 * sticky card on desktop, a bar on phones and tablets that steps aside once the closing Apply block
 * is on screen).
 */
export default function JobPageView({ job }: { job: JobOpening }) {
  const [applying, setApplying] = useState(false);
  const [barHidden, setBarHidden] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const summary = jobSummary(job);
  const apply = () => setApplying(true);

  useEffect(() => {
    const end = endRef.current;
    if (!end || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setBarHidden(entry.isIntersecting || entry.boundingClientRect.top < 0);
    });
    observer.observe(end);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-white">
      <JobApplicationModal open={applying} job={applying ? job : null} onClose={() => setApplying(false)} />

      <section aria-labelledby="job-title" className="pb-10 pt-24 sm:pt-28 lg:pb-12 lg:pt-32" data-enter>
        <Container className="flex flex-col gap-5">
          <nav aria-label="Breadcrumb" data-enter-item style={step(0)}>
            <ol className="flex flex-wrap items-center gap-x-2 text-sm text-grey-600">
              <li>
                <Link href={routes.careers.path} className="link inline-flex min-h-11 items-center">
                  Careers
                </Link>
              </li>
              <li aria-hidden="true" className="text-grey-500">
                /
              </li>
              <li aria-current="page">
                {job.title}
              </li>
            </ol>
          </nav>
          <h1 id="job-title" className="max-w-[22ch] text-heading text-ink" data-enter-item style={step(1)}>
            {job.title}
          </h1>
          <div className="flex flex-col gap-4 pt-2" data-enter-item style={step(2)}>
            <JobFacts job={job} className="max-w-4xl" />
            <JobTags job={job} />
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 pb-16 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-16 lg:pb-28">
        <div className="min-w-0">
          <JobDetailContent job={job} headingLevel={2} />
          <div ref={endRef} className="mt-12 flex flex-col items-start gap-4 rounded-4xl bg-mist p-6 sm:p-8 lg:hidden">
            <h2 className="text-title text-ink">Apply for this role</h2>
            <p className="text-base text-grey-600">{CV_NOTE}</p>
            <button type="button" onClick={apply} data-ph-event="Apply now" className="btn btn-primary btn-lg">
              Apply now
            </button>
          </div>
        </div>

        <aside aria-label="Apply for this role" className="hidden lg:block">
          <div className="sticky top-28 flex flex-col gap-4 rounded-4xl border border-line bg-white p-6">
            <div>
              <p className="text-title text-ink">{job.title}</p>
              {summary ? <p className="mt-1 text-sm text-grey-600">{summary}</p> : null}
            </div>
            <button type="button" onClick={apply} data-ph-event="Apply now" className="btn btn-primary btn-lg w-full">
              Apply now
            </button>
            <p className="text-sm text-grey-500">{CV_NOTE}</p>
          </div>
        </aside>
      </Container>

      {/* Phones and tablets: Apply stays in reach through a long description. */}
      <div
        inert={barHidden}
        data-allow-clip
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-fast ease-smooth-out motion-reduce:transition-none lg:hidden",
          barHidden && "translate-y-full",
        )}
      >
        <Container className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{job.title}</p>
            {summary ? <p className="truncate text-sm text-grey-500">{summary}</p> : null}
          </div>
          <button type="button" onClick={apply} data-ph-event="Apply now" className="btn btn-primary btn-md">
            Apply now
          </button>
        </Container>
      </div>
    </main>
  );
}
