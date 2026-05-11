'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const JOBS = [
  'Zonal Head - Sales',
  'Deputy VP - Wealth',
  'Senior RM - Investments',
  'Area Sales Manager - MF',
];

const TAGS = ['Mumbai', 'Full Time', '8-5 yrs', 'BFSI Distribution'];

const SKILLS = [
  'BFSI Distribution',
  'Wealth Management',
  'Team Leadership',
  'IFA/MFD Channels',
  'Client Acquisition',
  'CRM/Salesforce',
];

function Tag({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-black/35 px-3 py-1 font-gilroy font-medium text-[14px] leading-none text-black ${className}`}
    >
      {text}
    </span>
  );
}

const selectedCardClass =
  'border-[#C792F9] bg-[linear-gradient(120deg,rgba(168,115,255,0.18)_0%,rgba(255,255,255,0.85)_58%)]';
const defaultCardClass = 'border-black/30 bg-white/40';

export default function OpenPositionsSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section className="w-full px-4 sm:px-8 md:px-10 lg:px-12">
      <div className="relative mx-auto max-w-[1240px]">
        <div className="grid grid-cols-1 gap-6 lg:h-[1280px] lg:min-h-[1280px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          <div className="min-h-0 pt-12 sm:pt-14 md:pt-16 lg:relative lg:z-10 lg:flex lg:flex-col lg:pt-20">
            <h2 className="font-gilroy font-medium text-[32px] leading-none text-black">Open Positions</h2>
            <p className="mt-1 font-inter font-normal text-[18px] text-black/60">Showing 8 jobs</p>

            <div className="mt-5 space-y-3 px-3 pb-2 pt-2 sm:px-4 sm:pb-3 sm:pt-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-3 lg:pb-2 lg:pt-2 lg:pr-3">
              {JOBS.map((job, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                <article
                  key={job}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`View details for ${job}`}
                  onClick={() => setSelectedIndex(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedIndex(idx);
                    }
                  }}
                  className={`ml-2 mt-2 w-[80%] origin-center cursor-pointer rounded-[30px] border box-border pl-4 pr-6 transition-transform duration-200 ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C792F9]/50 sm:ml-3 sm:mt-3 ${
                    idx === 0 ? 'pt-8 pb-5 sm:pt-10 sm:pb-5' : 'py-10'
                  } ${
                    isSelected ? selectedCardClass : defaultCardClass
                  }`}
                >
                  <h3 className="font-gilroy font-semibold text-[30px] leading-none text-black">{job}</h3>

                  <div className="mt-4 flex min-w-0 w-full flex-nowrap items-center gap-1 overflow-x-auto sm:gap-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {TAGS.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full border border-black/35 px-2 py-0.5 font-gilroy font-medium text-[11px] text-black sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[12px]"
                      >
                        {tag === 'Mumbai' ? <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : null}
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 font-gilroy font-normal text-[18px] text-black/50">
                    Expansion | 2 days ago
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="font-gilroy font-normal text-[32px] leading-none text-black">Rs. 28-42 LPA</div>
                    <button
                      type="button"
                      className="rounded-[20px] bg-black px-5 py-2 font-gilroy font-medium text-[14px] text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Apply now -
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
              <h3 className="font-gilroy font-semibold text-[30px] leading-none text-black">
                {JOBS[selectedIndex]}
              </h3>
              <button
                type="button"
                className="shrink-0 inline-flex h-[34px] w-[123px] items-center justify-center rounded-[20px] bg-black px-0 py-0 font-gilroy font-medium text-[14px] text-white"
              >
                Apply now -
              </button>
            </div>

            <div className="mt-4 flex min-w-0 w-full max-w-full flex-nowrap items-center gap-1 overflow-x-auto sm:gap-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {TAGS.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full border border-black/35 px-2 py-0.5 font-gilroy font-medium text-[11px] text-black sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[12px]"
                      >
                        {tag === 'Mumbai' ? <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : null}
                        {tag}
                      </span>
                    ))}
                  </div>

            <div className="mt-4 font-gilroy font-normal text-[18px] text-black/50">Expansion</div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] bg-[#E9ECF0] p-6">
                <div className="font-inter font-normal text-[16px] text-black/45 pb-2">SALARY</div>
                <div className="font-gilroy font-semibold text-[24px] leading-none text-black">Rs. 28-42 LPA</div>
              </div>
              <div className="rounded-[24px] bg-[#E9ECF0] p-6">
              <div className="font-inter font-normal text-[16px] text-black/45 pb-2">EXPERIENCE</div>
                <div className="font-gilroy font-semibold text-[24px] leading-none text-black">8-15 yrs</div>
              </div>
              <div className="rounded-[24px] bg-[#E9ECF0] p-6">
                <div className="font-inter font-normal text-[16px] text-black/45 pb-2">LOCATION</div>
                <div className="font-gilroy font-semibold text-[24px] leading-none text-black">Mumbai</div>
              </div>
              <div className="rounded-[24px] bg-[#E9ECF0] p-6">
                <div className="font-inter font-normal text-[16px] text-black/45 pb-2">POSTED</div>
                <div className="font-gilroy font-semibold text-[24px] leading-none text-black">2 days ago</div>
              </div>
            </div>

            <h4 className="mt-7 font-gilroy font-medium text-[28px] leading-none text-black">About the Role</h4>
            <p className="mt-3 font-inter font-normal text-[18px] leading-7 text-black/70">
              We are looking for a dynamic and experienced Zonal Head - Sales to lead and expand
              our business across the assigned region. The role will be responsible for driving
              revenue growth, managing regional sales teams, and expanding distribution networks.
            </p>

            <h4 className="mt-7 font-gilroy font-medium text-[28px] leading-none text-black">Key Responsibilities</h4>
            <ul className="mt-3 list-disc pl-6 font-inter font-normal text-[18px] leading-7 text-black/70">
              <li>Drive regional sales strategy to achieve revenue and business growth targets.</li>
              <li>
                Expand the company&apos;s distribution footprint through IFAs, MFDs, and channel
                partners.
              </li>
              <li>Lead, manage, and mentor Regional Sales Managers and Relationship Managers.</li>
              <li>Drive new client onboarding and portfolio growth within the assigned zone.</li>
            </ul>


            <h4 className="mt-7 font-gilroy font-medium text-[28px] leading-none text-black">Skills Required</h4>
            <div className="mt-3 flex flex-wrap gap-[10px] font-gilroy font-medium text-[14px] leading-7 text-black/70">
              {SKILLS.map((skill) => (
                <Tag
                  key={skill}
                  text={skill}
                  className="h-[34px] rounded-[20px] px-[14px] py-[10px] overflow-hidden"
                />
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

