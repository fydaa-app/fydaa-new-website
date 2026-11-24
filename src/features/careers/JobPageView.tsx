"use client";

import Link from "next/link";
import { useState } from "react";
import JobApplicationModal from "./JobApplicationModal";
import { JobDetail } from "./OpenPositionsSection";
import type { JobOpening } from "./types";

/** Standalone job page body: full description plus the application modal. */
export default function JobPageView({ job }: { job: JobOpening }) {
  const [applying, setApplying] = useState(false);

  return (
    <main className="bg-white px-4 pb-28 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
      <JobApplicationModal open={applying} job={applying ? job : null} onClose={() => setApplying(false)} />
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-grey-600 sm:mb-6">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/careers"
                className="inline-flex min-h-11 items-center font-semibold text-jade underline-offset-4 hover:underline"
              >
                Careers
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {job.title}
            </li>
          </ol>
        </nav>
        {/* Full-width reading column on phones; a card from sm up. */}
        <article className="sm:rounded-4xl sm:border sm:border-grey-200 sm:p-7 sm:shadow-card md:p-10">
          <JobDetail job={job} onApply={() => setApplying(true)} headingLevel={1} showPermalink={false} />
        </article>
      </div>

      {/* Phones: Apply stays in reach through a long description. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-grey-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
        <button
          type="button"
          onClick={() => setApplying(true)}
          data-ph-event="Apply now"
          className="btn btn-primary btn-lg w-full"
        >
          Apply now
        </button>
      </div>
    </main>
  );
}
