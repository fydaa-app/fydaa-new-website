'use client';

import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { fetchJobOpenings } from './jobsData';
import type { JobOpening } from './jobsData';
import JobDetailContent from './JobDetailContent';
import JobApplicationModal from './JobApplicationModal';

const selectedCardClass =
  'border-[#C792F9] bg-[linear-gradient(120deg,rgba(168,115,255,0.18)_0%,rgba(255,255,255,0.85)_58%)]';
const defaultCardClass = 'border-black/30 bg-white/40';

export default function OpenPositionsSection() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [applyJob, setApplyJob] = useState<JobOpening | null>(null);

  useEffect(() => {
    fetchJobOpenings()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedJob = jobs[selectedIndex] ?? jobs[0] ?? ({} as JobOpening);

  if (loading) {
    return (
      <section className="w-full px-4 py-20">
        <p className="text-center font-gilroy text-[18px] text-black/60">Loading jobs...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-4 py-20">
        <p className="text-center font-gilroy text-[18px] text-red-600">Error: {error}</p>
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section className="w-full px-4 py-20">
        <p className="text-center font-gilroy text-[18px] text-black/60"></p>
      </section>
    );
  }

  return (
    <section className="w-full px-4 sm:px-8 md:px-10 lg:px-12">
      <JobApplicationModal open={applyJob !== null} job={applyJob} onClose={() => setApplyJob(null)} />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="grid grid-cols-1 gap-6 lg:h-[1280px] lg:min-h-[1280px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          <div className="min-h-0 pt-12 sm:pt-14 md:pt-16 lg:relative lg:z-10 lg:flex lg:flex-col lg:pt-20">
            <h2 className="font-gilroy font-medium text-[32px] leading-none text-black">Open Positions</h2>
            <p className="mt-1 font-inter font-normal text-[18px] text-black/60">
              Showing {jobs.length} jobs
            </p>

            <div className="mt-5 space-y-3 px-3 pb-2 pt-2 sm:px-4 sm:pb-3 sm:pt-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-3 lg:pb-2 lg:pt-2 lg:pr-3">
              {jobs.map((job, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <article
                    key={job.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`View details for ${job.title}`}
                    onClick={() => setSelectedIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedIndex(idx);
                      }
                    }}
                    className={`ml-2 mt-2 w-[80%] origin-center cursor-pointer rounded-[30px] border box-border pl-4 pr-6 transition-transform duration-200 ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C792F9]/50 sm:ml-3 sm:mt-3 ${
                      idx === 0 ? 'pt-8 pb-5 sm:pt-10 sm:pb-5' : 'py-10'
                    } ${isSelected ? selectedCardClass : defaultCardClass}`}
                  >
                    <h3 className="font-gilroy font-semibold text-[30px] leading-none text-black">{job.title}</h3>

<div className="mt-4 flex min-w-0 w-full flex-nowrap items-center gap-1 overflow-x-auto sm:gap-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {(job.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full border border-black/35 px-2 py-0.5 font-gilroy font-medium text-[11px] text-black sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[12px]"
                        >
                          {tag === job.location ? <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : null}
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 font-gilroy font-normal text-[18px] text-black/50">{job.metaLine}</div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="font-gilroy font-normal text-[32px] leading-none text-black">{job.salaryCard}</div>
                      <button
                        type="button"
                        className="rounded-[20px] bg-black px-5 py-2 font-gilroy font-medium text-[14px] text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setApplyJob(job);
                        }}
                      >
                        Apply now
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="lg:relative lg:z-0 lg:min-h-0 lg:overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden lg:block"
              style={{
                boxShadow:
                  'inset 12px 0 24px rgba(0,0,0,0.14), inset 0 1px 0 rgba(0,0,0,0.10), inset 0 -1px 0 rgba(0,0,0,0.10), inset -1px 0 0 rgba(0,0,0,0.10)',
              }}
            />
            <div className="relative z-10 h-full overflow-y-auto p-4 pt-10 sm:p-6 sm:pt-16 md:pt-24 lg:pl-20 lg:pr-20 lg:pt-48">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-gilroy font-semibold text-[30px] leading-none text-black">{selectedJob.title}</h3>
                <button
                  type="button"
                  className="shrink-0 inline-flex h-[34px] min-w-[123px] items-center justify-center rounded-[20px] bg-black px-4 py-0 font-gilroy font-medium text-[14px] text-white"
                  onClick={() => setApplyJob(selectedJob)}
                >
                  Apply now
                </button>
              </div>

              <JobDetailContent job={selectedJob} tagSize="sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}