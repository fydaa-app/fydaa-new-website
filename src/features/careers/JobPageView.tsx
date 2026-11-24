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
    <main className="bg-white px-6 pb-16 pt-28 font-inter">
      <JobApplicationModal open={applying} job={applying ? job : null} onClose={() => setApplying(false)} />
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-grey-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/careers" className="font-semibold text-jade underline-offset-4 hover:underline">
                Careers
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {job.title}
            </li>
          </ol>
        </nav>
        <article className="rounded-[20px] border border-grey-200 bg-white p-7 shadow-card md:p-10">
          <JobDetail job={job} onApply={() => setApplying(true)} headingLevel={1} showPermalink={false} />
        </article>
      </div>
    </main>
  );
}
