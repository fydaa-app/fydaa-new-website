'use client';

import { MapPin } from 'lucide-react';
import type { JobOpening } from './jobsData';

function Tag({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-black/35 px-3 py-1 font-gilroy font-medium text-[14px] leading-none text-black ${className}`}
    >
      {text}
    </span>
  );
}

type Props = {
  job: JobOpening;
  /** Smaller tag row (matches listing strip) */
  tagSize?: 'sm' | 'md';
};

export default function JobDetailContent({ job, tagSize = 'md' }: Props) {
  const tagClass =
    tagSize === 'sm'
      ? 'inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full border border-black/35 px-2 py-0.5 font-gilroy font-medium text-[11px] text-black sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[12px]'
      : 'inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full border border-black/35 px-2 py-0.5 font-gilroy font-medium text-[11px] text-black sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[12px]';

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
        <div className="rounded-[24px] bg-[#E9ECF0] p-6">
          <div className="font-inter font-normal text-[16px] text-black/45 pb-2">SALARY</div>
          <div className="font-gilroy font-semibold text-[24px] leading-none text-black">{job.salaryCard}</div>
        </div>
        <div className="rounded-[24px] bg-[#E9ECF0] p-6">
          <div className="font-inter font-normal text-[16px] text-black/45 pb-2">EXPERIENCE</div>
          <div className="font-gilroy font-semibold text-[24px] leading-none text-black">{job.experienceRange}</div>
        </div>
        <div className="rounded-[24px] bg-[#E9ECF0] p-6">
          <div className="font-inter font-normal text-[16px] text-black/45 pb-2">LOCATION</div>
          <div className="font-gilroy font-semibold text-[24px] leading-none text-black">{job.location}</div>
        </div>
        <div className="rounded-[24px] bg-[#E9ECF0] p-6">
          <div className="font-inter font-normal text-[16px] text-black/45 pb-2">POSTED</div>
          <div className="font-gilroy font-semibold text-[24px] leading-none text-black">{job.posted}</div>
        </div>
      </div>

      {job.about && (
        <>
          <h4 className="mt-7 font-gilroy font-medium text-[28px] leading-none text-black">About the Role</h4>
          <p className="mt-3 font-inter font-normal text-[18px] leading-7 text-black/70">{job.about}</p>
        </>
      )}

      {job.responsibilities && job.responsibilities.length > 0 && (
        <>
          <h4 className="mt-7 font-gilroy font-medium text-[28px] leading-none text-black">Key Responsibilities</h4>
          <ul className="mt-3 list-disc pl-6 font-inter font-normal text-[18px] leading-7 text-black/70">
            {(job.responsibilities || []).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}

      {job.skills && job.skills.length > 0 && (
        <>
          <h4 className="mt-7 font-gilroy font-medium text-[28px] leading-none text-black">Skills Required</h4>
          <div className="mt-3 flex flex-wrap gap-[10px] font-gilroy font-medium text-[14px] leading-7 text-black/70">
            {(job.skills || []).map((skill) => (
              <Tag
                key={skill}
                text={skill}
                className="h-[34px] rounded-[20px] px-[14px] py-[10px] overflow-hidden"
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}