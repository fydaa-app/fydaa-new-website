'use client';

import { MapPin } from 'lucide-react';
import type { JobOpening, ResponsibilitiesData } from './jobsData';

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Returns true when a flat string[] has at least one non-empty entry. */
function hasMeaningfulFlatList(arr: string[] | undefined | null): boolean {
  return Array.isArray(arr) && arr.some((item) => item && item.trim().length > 0);
}

/** Returns true when the new structured array has at least one heading. */
function hasMeaningfulStructured(arr: ResponsibilitiesData): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

// ─── structured renderer ──────────────────────────────────────────────────────

function StructuredResponsibilities({ data }: { data: ResponsibilitiesData }) {
  if (data.length === 0) return null;

  return (
    <>
      {data.map((headingObj, idx) => {
        const { heading, items } = headingObj;

        return (
          <div key={idx}>
            <h4 className="mt-7 font-gilroy font-medium text-[28px] leading-none text-black">
              {heading}
            </h4>

            {items.length > 0 && (
              <ul className="mt-3 list-disc pl-6 font-inter font-normal text-[18px] leading-7 text-black/70">
                {items.map((itemObj, i) => {
                  const { item, subItems } = itemObj;
                  return (
                    <li key={i}>
                      {item}
                      {subItems.length > 0 && (
                        <ul className="mt-1 list-[circle] pl-5">
                          {subItems.map((sub, j) => (
                            <li key={j}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
}

// ─── props ────────────────────────────────────────────────────────────────────

type Props = {
  job: JobOpening;
  /** Smaller tag row (matches listing strip) */
  tagSize?: 'sm' | 'md';
};

// ─── component ────────────────────────────────────────────────────────────────

export default function JobDetailContent({ job, tagSize = 'md' }: Props) {
  const tagClass =
    tagSize === 'sm'
      ? 'inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full border border-black/35 px-2 py-0.5 font-gilroy font-medium text-[11px] text-black sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[12px]'
      : 'inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full border border-black/35 px-2 py-0.5 font-gilroy font-medium text-[11px] text-black sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[12px]';

  // Detect format: new structured array vs legacy flat array vs legacy object (not expected anymore)
  const isOldFlatArray = Array.isArray(job.responsibilities) && typeof job.responsibilities[0] === 'string';
  const isNewArray = Array.isArray(job.responsibilities) && typeof job.responsibilities[0] === 'object';
  const isLegacyObject = job.responsibilities !== null && !Array.isArray(job.responsibilities) && typeof job.responsibilities === 'object';

  let structuredData: ResponsibilitiesData | null = null;
  let flatData: string[] | null = null;

  if (isNewArray) {
    structuredData = job.responsibilities as ResponsibilitiesData;
  } else if (isLegacyObject) {
    // Convert old object to array on the fly just in case some are saved
    const obj = job.responsibilities as unknown as Record<string, Record<string, string[]>>;
    structuredData = Object.keys(obj).map(heading => ({
      heading,
      items: Object.keys(obj[heading] || {}).map(item => ({
        item,
        subItems: obj[heading][item] || []
      }))
    }));
  } else if (isOldFlatArray || (!job.responsibilities)) {
    flatData = (job.responsibilities as string[]) || [];
  }

  return (
    <>
      <div className="mt-4 flex min-w-0 w-full max-w-full flex-nowrap items-center gap-1 overflow-x-auto sm:gap-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(job.tags || []).map((tag) => (
          <span key={tag} className={tagClass}>
            {tag === job.location ? <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : null}
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 font-gilroy font-normal text-[18px] text-black/50">{job.division}</div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {job.salaryCard && (
          <div className="rounded-[24px] bg-[#E9ECF0] p-6">
            <div className="font-inter font-normal text-[16px] text-black/45 pb-2">SALARY</div>
            <div className="font-gilroy font-semibold text-[24px] leading-none text-black">{job.salaryCard}</div>
          </div>
        )}
        {job.experienceRange && (
          <div className="rounded-[24px] bg-[#E9ECF0] p-6">
            <div className="font-inter font-normal text-[16px] text-black/45 pb-2">EXPERIENCE</div>
            <div className="font-gilroy font-semibold text-[24px] leading-none text-black">{job.experienceRange}</div>
          </div>
        )}
        {job.location && (
          <div className="rounded-[24px] bg-[#E9ECF0] p-6">
            <div className="font-inter font-normal text-[16px] text-black/45 pb-2">LOCATION</div>
            <div className="font-gilroy font-semibold text-[24px] leading-none text-black">{job.location}</div>
          </div>
        )}
        {job.posted && (
          <div className="rounded-[24px] bg-[#E9ECF0] p-6">
            <div className="font-inter font-normal text-[16px] text-black/45 pb-2">POSTED</div>
            <div className="font-gilroy font-semibold text-[24px] leading-none text-black">{job.posted}</div>
          </div>
        )}
      </div>

      {job.about && (
        <>
          <h4 className="mt-7 font-gilroy font-medium text-[28px] leading-none text-black">About the Role</h4>
          <p className="mt-3 font-inter font-normal text-[18px] leading-7 text-black/70">{job.about}</p>
        </>
      )}

      {/* ── Responsibilities: new structured format ── */}
      {structuredData && hasMeaningfulStructured(structuredData) && (
        <StructuredResponsibilities data={structuredData} />
      )}

      {/* ── Responsibilities: legacy flat array fallback ── */}
      {flatData && hasMeaningfulFlatList(flatData) && (
        <>
          <h4 className="mt-7 font-gilroy font-medium text-[28px] leading-none text-black">
            Key Responsibilities
          </h4>
          <ul className="mt-3 list-disc pl-6 font-inter font-normal text-[18px] leading-7 text-black/70">
            {flatData.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}

      {hasMeaningfulFlatList(job.skills as string[]) && (
        <>
          <h4 className="mt-7 font-gilroy font-medium text-[28px] leading-none text-black">Skills Required</h4>
          <ul className="mt-3 list-disc pl-6 font-inter font-normal text-[18px] leading-7 text-black/70">
            {(job.skills || []).map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}