import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { JobOpening, ResponsibilitiesData } from "./types";

type Level = 2 | 3 | 4;

function hasMeaningfulFlatList(arr: string[] | undefined | null): boolean {
  return Array.isArray(arr) && arr.some((item) => item && item.trim().length > 0);
}

function hasMeaningfulStructured(arr: ResponsibilitiesData): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

/** Section heading ("About the role") and sub-heading ("1. Revenue ownership") styles. */
const SECTION = "text-title text-ink";
const SUBSECTION = "mt-7 text-base font-semibold text-ink [font-stretch:104%]";

function Heading({ level, sub, children }: { level: Level; sub?: boolean; children: ReactNode }) {
  const Tag = `h${Math.min(level + (sub ? 1 : 0), 6)}` as "h2" | "h3" | "h4" | "h5";
  return <Tag className={sub ? SUBSECTION : SECTION}>{children}</Tag>;
}

/** A list with the logo's round-capped stroke as its marker; sub-items get a short grey dash. */
function StrokeList({ items }: { items: Array<{ item: string; subItems?: string[] }> }) {
  return (
    <ul className="mt-3 flex flex-col gap-2.5">
      {items.map(({ item, subItems = [] }, i) => (
        <li key={`${i}-${item}`} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-x-3">
          <i
            aria-hidden="true"
            className="mt-1.5 block h-3 w-1.5 -rotate-[38deg] justify-self-center rounded-full bg-sprout"
          />
          <div>
            {item}
            {subItems.length > 0 ? (
              <ul className="mt-2 flex flex-col gap-1.5">
                {subItems.map((sub, j) => (
                  <li key={`${j}-${sub}`} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-x-3">
                    <i
                      aria-hidden="true"
                      className="mt-3 block h-0.5 w-2 justify-self-center rounded-full bg-grey-400"
                    />
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Responsibilities arrive as headed groups. A heading with no items of its own ("Responsibilities")
 * introduces the groups after it, so those become its sub-headings.
 */
function StructuredResponsibilities({ data, level }: { data: ResponsibilitiesData; level: Level }) {
  const firstGroup = data.findIndex((block) => block.items.length === 0);
  return (
    <>
      {data.map(({ heading, items }, idx) => {
        const sub = items.length > 0 && firstGroup !== -1 && idx > firstGroup;
        return (
          <div key={`${idx}-${heading}`} className={cn(!sub && "mt-10 first:mt-0")}>
            {heading ? (
              <Heading level={level} sub={sub}>
                {heading.replace(/:\s*$/, "")}
              </Heading>
            ) : null}
            {items.length > 0 ? <StrokeList items={items} /> : null}
          </div>
        );
      })}
    </>
  );
}

/** The job description: about the role, responsibilities (flat, structured or legacy) and skills. */
export default function JobDetailContent({
  job,
  headingLevel = 4,
}: {
  job: JobOpening;
  headingLevel?: Level;
}) {
  const isOldFlatArray = Array.isArray(job.responsibilities) && typeof job.responsibilities[0] === "string";
  const isNewArray = Array.isArray(job.responsibilities) && typeof job.responsibilities[0] === "object";
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
        subItems: obj[heading]?.[item] || [],
      })),
    }));
  } else if (isOldFlatArray || !job.responsibilities) {
    flatData = (job.responsibilities as string[]) || [];
  }

  return (
    <div className="max-w-[68ch] text-base leading-relaxed text-grey-600">
      {job.about ? (
        <div className="mt-10 first:mt-0">
          <Heading level={headingLevel}>About the role</Heading>
          <p className="mt-3 whitespace-pre-line">{job.about}</p>
        </div>
      ) : null}

      {structuredData && hasMeaningfulStructured(structuredData) ? (
        <StructuredResponsibilities data={structuredData} level={headingLevel} />
      ) : null}

      {flatData && hasMeaningfulFlatList(flatData) ? (
        <div className="mt-10 first:mt-0">
          <Heading level={headingLevel}>Key responsibilities</Heading>
          <StrokeList items={flatData.filter(Boolean).map((item) => ({ item }))} />
        </div>
      ) : null}

      {hasMeaningfulFlatList(job.skills) ? (
        <div className="mt-10 first:mt-0">
          <Heading level={headingLevel}>Skills required</Heading>
          <StrokeList items={job.skills.filter(Boolean).map((item) => ({ item }))} />
        </div>
      ) : null}
    </div>
  );
}
