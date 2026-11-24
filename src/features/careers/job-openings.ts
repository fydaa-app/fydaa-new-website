import { siteConfig } from "@/config/site";
import type { JobOpening, ResponsibilitiesData } from "./types";

export const JOBS_LOAD_ERROR = "We couldn't load open roles right now. Please try again in a moment.";

export function jobPath(id: string): `/careers/jobs/${string}` {
  return `/careers/jobs/${encodeURIComponent(id)}`;
}

/** "Today", "3 days ago", "2 weeks ago", … relative to `now`. */
export function formatPostedDate(value: string | null | undefined, now: Date = new Date()): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 86_400_000));
  const plural = (count: number, unit: string) => `${count} ${unit}${count === 1 ? "" : "s"} ago`;
  if (days === 0) return "Today";
  if (days < 7) return plural(days, "day");
  if (days < 30) return plural(Math.floor(days / 7), "week");
  if (days < 365) return plural(Math.floor(days / 30), "month");
  return plural(Math.floor(days / 365), "year");
}

/**
 * Experience as people read it: "4-8", "2 - 4" or "2–6 Years" become "4–8 years". Text without
 * digits ("Fresher") is returned unchanged.
 */
export function formatExperience(range: string | null | undefined): string | null {
  const value = range?.trim();
  if (!value) return null;
  if (!/\d/.test(value)) return value;
  const core = value
    .replace(/\s*(?:years?|yrs?)\.?\s*$/i, "")
    .replace(/\s*[-–—]\s*/g, "–")
    .trim();
  return `${core} ${core === "1" ? "year" : "years"}`;
}

/** "Pan India, 4–8 years": the two facts a candidate checks first, for list rows. */
export function jobSummary(job: Pick<JobOpening, "location" | "experienceRange">): string {
  return [job.location, formatExperience(job.experienceRange)].filter(Boolean).join(", ");
}

/**
 * Tags worth showing next to the job facts: drops tags that repeat the location or team, and
 * experience tags when the listing already has an experience range (they can disagree).
 */
export function jobTags(
  job: Pick<JobOpening, "tags" | "location" | "division" | "experienceRange">,
): string[] {
  const repeats = [job.location, job.division].filter(Boolean).map((value) => value!.toLowerCase());
  return job.tags.filter((tag) => {
    if (repeats.includes(tag.toLowerCase())) return false;
    if (job.experienceRange && /\d/.test(tag) && /\b(?:years?|yrs?)\b/i.test(tag)) return false;
    return true;
  });
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function textOrNull(value: unknown): string | null {
  return text(value) || null;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(text).filter(Boolean) : [];
}

function toIsoDate(value: unknown): string | null {
  const raw = text(value);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function responsibilities(value: unknown): string[] | ResponsibilitiesData {
  if (Array.isArray(value)) {
    if (value.every((entry) => typeof entry === "string")) return stringList(value);
    return value
      .filter((entry): entry is { heading?: unknown; items?: unknown } =>
        Boolean(entry && typeof entry === "object"),
      )
      .map((entry) => ({
        heading: text(entry.heading),
        items: (Array.isArray(entry.items) ? entry.items : [])
          .filter((item): item is { item?: unknown; subItems?: unknown } =>
            Boolean(item && typeof item === "object"),
          )
          .map((item) => ({ item: text(item.item), subItems: stringList(item.subItems) })),
      }));
  }
  if (value && typeof value === "object") {
    // Legacy object form: { heading: { item: [subItems] } }
    return Object.entries(value as Record<string, unknown>).map(([heading, items]) => ({
      heading,
      items: Object.entries((items ?? {}) as Record<string, unknown>).map(([item, subItems]) => ({
        item,
        subItems: stringList(subItems),
      })),
    }));
  }
  return [];
}

/** Normalise one job from the CRM API. Returns null for records without id or title. */
export function mapJobOpening(raw: unknown, now: Date = new Date()): JobOpening | null {
  if (!raw || typeof raw !== "object") return null;
  const job = raw as Record<string, unknown>;
  const id = job.id === undefined || job.id === null ? "" : String(job.id).trim();
  const title = text(job.title);
  if (!id || !title) return null;

  const posted = formatPostedDate(text(job.posted), now);
  const division = text(job.division);
  return {
    id,
    title,
    companyName: text(job.companyName) || siteConfig.name,
    salaryCompact: textOrNull(job.salaryCompact),
    salaryCard: textOrNull(job.salaryCard),
    tags: stringList(job.tags).map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)),
    metaLine: [division, posted].filter(Boolean).join(" | "),
    division,
    experienceRange: textOrNull(job.experienceRange),
    location: textOrNull(job.location),
    posted,
    postedAt: toIsoDate(job.posted),
    about: text(job.about),
    responsibilities: responsibilities(job.responsibilities),
    skills: stringList(job.skills),
    linkedinLink: text(job.linkedinLink),
  };
}

export function mapJobOpenings(payload: unknown, now: Date = new Date()): JobOpening[] {
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: unknown[] }).data
      : null;
  if (!list) throw new TypeError("Unexpected job openings payload");
  return list.map((raw) => mapJobOpening(raw, now)).filter((job): job is JobOpening => job !== null);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function descriptionHtml(job: JobOpening): string {
  const parts = job.about ? [`<p>${escapeHtml(job.about)}</p>`] : [];
  const list = (items: string[]) =>
    `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  if (job.responsibilities.length && typeof job.responsibilities[0] === "string") {
    parts.push(`<h3>Responsibilities</h3>${list(job.responsibilities as string[])}`);
  } else {
    for (const section of job.responsibilities as ResponsibilitiesData) {
      parts.push(`<h3>${escapeHtml(section.heading)}</h3>${list(section.items.map((entry) => entry.item))}`);
    }
  }
  if (job.skills.length) parts.push(`<h3>Skills</h3>${list(job.skills)}`);
  return parts.join("");
}

function employmentType(tags: string[]): string | undefined {
  const joined = tags.join(" ").toLowerCase();
  if (/intern/.test(joined)) return "INTERN";
  if (/part[\s-]?time/.test(joined)) return "PART_TIME";
  if (/contract/.test(joined)) return "CONTRACTOR";
  if (/full[\s-]?time/.test(joined)) return "FULL_TIME";
  return undefined;
}

/** schema.org JobPosting for a job detail page (Google for Jobs). */
export function jobPostingJsonLd(job: JobOpening): Record<string, unknown> {
  const remote = /remote/i.test(job.location ?? "");
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: descriptionHtml(job) || escapeHtml(job.title),
    identifier: { "@type": "PropertyValue", name: job.companyName, value: job.id },
    ...(job.postedAt ? { datePosted: job.postedAt } : {}),
    ...(employmentType(job.tags) ? { employmentType: employmentType(job.tags) } : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      sameAs: siteConfig.url,
      logo: `${siteConfig.url}/fydaa-logo.png`,
    },
    ...(remote
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: { "@type": "Country", name: "India" },
        }
      : job.location
        ? {
            jobLocation: {
              "@type": "Place",
              address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "IN" },
            },
          }
        : {}),
    directApply: true,
    url: `${siteConfig.url}${jobPath(job.id)}`,
  };
}
