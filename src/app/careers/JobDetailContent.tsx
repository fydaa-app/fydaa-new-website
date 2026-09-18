"use client";

import type { JobOpening, ResponsibilitiesData } from "./jobsData";

function hasMeaningfulFlatList(arr: string[] | undefined | null): boolean {
  return Array.isArray(arr) && arr.some((item) => item && item.trim().length > 0);
}

function hasMeaningfulStructured(arr: ResponsibilitiesData): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

function StructuredResponsibilities({ data }: { data: ResponsibilitiesData }) {
  if (data.length === 0) return null;

  return (
    <>
      {data.map((headingObj, idx) => {
        const { heading, items } = headingObj;

        return (
          <div key={idx}>
            <h4 className="mt-7 text-[15px] font-bold text-ink">{heading}</h4>
            {items.length > 0 && (
              <ul className="mt-3 list-disc pl-6 text-[15.5px] leading-relaxed text-grey-600">
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

export default function JobDetailContent({ job }: { job: JobOpening }) {
  const isOldFlatArray =
    Array.isArray(job.responsibilities) && typeof job.responsibilities[0] === "string";
  const isNewArray =
    Array.isArray(job.responsibilities) && typeof job.responsibilities[0] === "object";
  const isLegacyObject =
    job.responsibilities !== null &&
    !Array.isArray(job.responsibilities) &&
    typeof job.responsibilities === "object";

  let structuredData: ResponsibilitiesData | null = null;
  let flatData: string[] | null = null;

  if (isNewArray) {
    structuredData = job.responsibilities as ResponsibilitiesData;
  } else if (isLegacyObject) {
    const obj = job.responsibilities as unknown as Record<string, Record<string, string[]>>;
    structuredData = Object.keys(obj).map((heading) => ({
      heading,
      items: Object.keys(obj[heading] || {}).map((item) => ({
        item,
        subItems: obj[heading][item] || [],
      })),
    }));
  } else if (isOldFlatArray || !job.responsibilities) {
    flatData = (job.responsibilities as string[]) || [];
  }

  return (
    <>
      {job.about && (
        <div>
          <h4 className="mb-3 text-[15px] font-bold text-ink">About the role</h4>
          <p className="max-w-[66ch] text-[15.5px] leading-relaxed text-grey-600">{job.about}</p>
        </div>
      )}

      {structuredData && hasMeaningfulStructured(structuredData) && (
        <StructuredResponsibilities data={structuredData} />
      )}

      {flatData && hasMeaningfulFlatList(flatData) && (
        <>
          <h4 className="mt-7 text-[15px] font-bold text-ink">Key responsibilities</h4>
          <ul className="mt-3 list-disc pl-6 text-[15.5px] leading-relaxed text-grey-600">
            {flatData.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}

      {hasMeaningfulFlatList(job.skills) && (
        <>
          <h4 className="mt-7 text-[15px] font-bold text-ink">Skills required</h4>
          <ul className="mt-3 list-disc pl-6 text-[15.5px] leading-relaxed text-grey-600">
            {(job.skills || []).map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
