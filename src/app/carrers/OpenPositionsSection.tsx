'use client';

import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchJobOpenings } from './jobsData';
import type { JobOpening } from './jobsData';
import JobDetailContent from './JobDetailContent';
import JobApplicationModal from './JobApplicationModal';

const selectedCardOuter =
  'rounded-[30px] p-[2px] [background:linear-gradient(118deg,#09DEFF_3%,#6309FF_48%,#FF00C8_85%,#FF004D_100%)]';

const selectedCardInner =
  'rounded-[28px] overflow-hidden backdrop-blur-md [background:linear-gradient(116deg,rgba(9,222,255,0.10)_3%,rgba(99,9,255,0.10)_34%,rgba(255,0,200,0.10)_85%,rgba(255,0,77,0.10)_100%),white]';
const defaultCardClass = 'rounded-[30px] border border-black/30 bg-white/40';

export default function OpenPositionsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  useEffect(() => {
    const applyJobId = searchParams.get('apply');
    if (applyJobId && jobs.length > 0) {
      const job = jobs.find((j) => j.id === applyJobId);
      if (job) setApplyJob(job);
    }
  }, [searchParams, jobs]);

  const openApply = (job: JobOpening) => {
    setApplyJob(job);
    const params = new URLSearchParams(searchParams);
    params.set('apply', job.id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const closeApply = () => {
    setApplyJob(null);
    router.push('/carrers', { scroll: false });
  };

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
    <section className="w-full px-4 py-16 sm:px-8 sm:py-20 md:px-10 lg:px-12 lg:py-24">
      <div className="relative mx-auto max-w-[1240px]">
        <div className="rounded-[32px] border border-black/10 bg-white/60 p-6 backdrop-blur-md sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Left Side */}
            <div>
              <h2 className="font-gilroy font-medium text-[32px] leading-none text-black">
                Open Positions
              </h2>

              <p className="mt-1 font-inter text-[18px] text-black/60">
                Showing 0 jobs
              </p>

              <div className="mt-6">
                <div className={selectedCardOuter}>
                  <div
                    className={`${selectedCardInner} flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center`}
                  >
                    <div className="mb-4 rounded-full border border-black/10 bg-white/70 px-4 py-2 font-gilroy text-[14px] text-black/60">
                      No openings available
                    </div>

                    <h3 className="font-gilroy font-semibold text-[30px] leading-none text-black">
                      We’re not hiring right now
                    </h3>

                    <p className="mt-4 max-w-[420px] font-inter text-[16px] leading-[26px] text-black/60">
                      There are currently no active job openings. Please check
                      back later for new opportunities at Fydaa.
                    </p>

                    <button
                      type="button"
                      onClick={() => router.push('/')}
                      className="mt-6 rounded-[20px] bg-black px-5 py-2 font-gilroy font-medium text-[14px] text-white transition-opacity hover:opacity-90"
                    >
                      Go to Homepage
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex min-h-[420px] items-center justify-center rounded-[30px] border border-black/10 bg-white/40 p-8 text-center backdrop-blur-sm">
              <div>
                <div className="mb-4 inline-flex rounded-full border border-black/10 bg-black/5 px-4 py-2 font-gilroy text-[14px] text-black/60">
                  Careers at Fydaa
                </div>

                <h3 className="font-gilroy font-semibold text-[30px] leading-none text-black">
                  New roles coming soon
                </h3>

                <p className="mt-4 max-w-[440px] font-inter text-[16px] leading-[28px] text-black/60">
                  We’re always looking for talented people. Keep an eye on this
                  page for future openings across engineering, operations,
                  design, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

  return (
    <section className="w-full px-4 sm:px-8 md:px-10 lg:px-12">
      <JobApplicationModal open={applyJob !== null} job={applyJob} onClose={closeApply} />

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

                const cardContent = (
                  <article
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
                    className={`w-full cursor-pointer box-border pl-4 pr-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C792F9]/50 ${
                      idx === 0 ? 'pt-8 pb-5 sm:pt-10 sm:pb-5' : 'py-10'
                    } ${isSelected ? selectedCardInner : defaultCardClass}`}
                  >
                    <h3 className="font-gilroy font-semibold text-[30px] leading-none text-black">{job.title}</h3>

                    <div className="mt-4 flex min-w-0 w-full flex-nowrap items-center gap-1 overflow-x-auto sm:gap-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {(job.tags || []).map((tag, tagIdx) => (
                        <span
                          key={`${tag}-${tagIdx}`}
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
                          openApply(job);
                        }}
                      >
                        Apply now
                      </button>
                    </div>
                  </article>
                );

                return (
                  <div
                    key={job.id}
                    className={`ml-2 mt-2 sm:ml-3 sm:mt-3 w-[80%] origin-center transition-transform duration-200 ease-out hover:scale-[1.02] ${
                      isSelected ? selectedCardOuter : ''
                    }`}
                  >
                    {cardContent}
                  </div>
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
                  onClick={() => openApply(selectedJob)}
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