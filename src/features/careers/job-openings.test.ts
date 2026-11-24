import { describe, expect, it } from "vitest";
import {
  formatExperience,
  formatPostedDate,
  jobPath,
  jobPostingJsonLd,
  jobSummary,
  jobTags,
  mapJobOpening,
  mapJobOpenings,
} from "./job-openings";

const NOW = new Date("2026-11-24T12:00:00Z");

const raw = {
  id: 7,
  title: "  Investment Adviser  ",
  companyName: "Fydaa",
  tags: ["full time", "mumbai"],
  division: "Advisory",
  experienceRange: "2-4 yrs",
  location: "Mumbai",
  posted: "2026-11-17T09:00:00Z",
  about: "Advise clients <script>alert(1)</script> on goals.",
  responsibilities: [{ heading: "Advisory", items: [{ item: "Build plans", subItems: [] }] }],
  skills: ["NISM X-A"],
};

describe("formatPostedDate", () => {
  it.each([
    ["2026-11-24T08:00:00Z", "Today"],
    ["2026-11-23T08:00:00Z", "1 day ago"],
    ["2026-11-10T08:00:00Z", "2 weeks ago"],
    ["2026-08-24T08:00:00Z", "3 months ago"],
    ["2024-11-24T08:00:00Z", "2 years ago"],
  ])("formats %s as %s", (value, expected) => {
    expect(formatPostedDate(value, NOW)).toBe(expected);
  });

  it("returns an empty string for missing or invalid dates", () => {
    expect(formatPostedDate(undefined, NOW)).toBe("");
    expect(formatPostedDate("not a date", NOW)).toBe("");
  });
});

describe("formatExperience", () => {
  it.each([
    ["4-8", "4–8 years"],
    ["2 - 4", "2–4 years"],
    ["2–6 Years", "2–6 years"],
    ["2-4 yrs", "2–4 years"],
    ["1", "1 year"],
    ["5+", "5+ years"],
    ["Fresher", "Fresher"],
  ])("formats %s as %s", (value, expected) => {
    expect(formatExperience(value)).toBe(expected);
  });

  it("returns null when there is no range", () => {
    expect(formatExperience(null)).toBeNull();
    expect(formatExperience("  ")).toBeNull();
  });
});

describe("jobSummary and jobTags", () => {
  const job = {
    location: "Pan India",
    division: "Growth",
    experienceRange: "4-8",
    tags: ["Full-time", "4-5 years", "BFSI Distributor", "Pan India", "Remote"],
  };

  it("summarises location and experience", () => {
    expect(jobSummary(job)).toBe("Pan India, 4–8 years");
    expect(jobSummary({ location: null, experienceRange: null })).toBe("");
  });

  it("drops tags that repeat or contradict the job facts", () => {
    expect(jobTags(job)).toEqual(["Full-time", "BFSI Distributor", "Remote"]);
    expect(jobTags({ ...job, experienceRange: null })).toContain("4-5 years");
  });
});

describe("mapJobOpening", () => {
  it("normalises an API record", () => {
    expect(mapJobOpening(raw, NOW)).toMatchObject({
      id: "7",
      title: "Investment Adviser",
      tags: ["Full time", "Mumbai"],
      posted: "1 week ago",
      postedAt: "2026-11-17",
      metaLine: "Advisory | 1 week ago",
      salaryCompact: null,
    });
  });

  it("drops records without an id or title and converts the legacy object format", () => {
    expect(mapJobOpening({ title: "No id" })).toBeNull();
    expect(mapJobOpening({ id: 1 })).toBeNull();
    const legacy = mapJobOpening({ id: 1, title: "x", responsibilities: { Sales: { Prospect: ["Calls"] } } });
    expect(legacy?.responsibilities).toEqual([
      { heading: "Sales", items: [{ item: "Prospect", subItems: ["Calls"] }] },
    ]);
  });
});

describe("mapJobOpenings", () => {
  it("accepts a bare array or a { data } envelope", () => {
    expect(mapJobOpenings([raw], NOW)).toHaveLength(1);
    expect(mapJobOpenings({ data: [raw, { bad: true }] }, NOW)).toHaveLength(1);
  });

  it("rejects unexpected payloads (e.g. an HTML error page parsed as text)", () => {
    expect(() => mapJobOpenings("<!DOCTYPE html>")).toThrow(TypeError);
  });
});

describe("jobPostingJsonLd", () => {
  const job = mapJobOpening(raw, NOW)!;
  const ld = jobPostingJsonLd(job);

  it("produces the fields Google for Jobs requires", () => {
    expect(ld).toMatchObject({
      "@type": "JobPosting",
      title: "Investment Adviser",
      datePosted: "2026-11-17",
      employmentType: "FULL_TIME",
      hiringOrganization: { "@type": "Organization", name: "Fydaa" },
      jobLocation: { address: { addressLocality: "Mumbai", addressCountry: "IN" } },
      url: `https://fydaa.com${jobPath("7")}`,
    });
  });

  it("escapes HTML from the API in the description", () => {
    expect(String(ld.description)).not.toContain("<script>");
    expect(String(ld.description)).toContain("&#60;script&#62;");
  });

  it("marks remote roles as telecommute", () => {
    const remote = jobPostingJsonLd({ ...job, location: "Remote" });
    expect(remote).toMatchObject({ jobLocationType: "TELECOMMUTE" });
    expect(remote).not.toHaveProperty("jobLocation");
  });
});
