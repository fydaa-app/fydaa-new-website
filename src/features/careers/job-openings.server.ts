import "server-only";
import { env } from "@/config/env";
import { request } from "@/lib/http/client";
import { JOBS_LOAD_ERROR, mapJobOpenings } from "./job-openings";
import type { JobOpening, JobOpeningsResult } from "./types";

/** Job openings change rarely; regenerate at most every 10 minutes. */
export const JOBS_REVALIDATE_SECONDS = 600;

/** Active job openings for server rendering. Never throws: failures become a user-safe error. */
export async function getJobOpenings(): Promise<JobOpeningsResult> {
  try {
    const payload = await request(env.api.crm, "referrals/job-openings", {
      query: { active: true },
      next: { revalidate: JOBS_REVALIDATE_SECONDS, tags: ["job-openings"] },
      timeoutMs: 10_000,
    });
    return { jobs: mapJobOpenings(payload), error: null };
  } catch (error) {
    console.error("[careers] failed to load job openings", error);
    return { jobs: [], error: JOBS_LOAD_ERROR };
  }
}

export async function getJobOpening(id: string): Promise<JobOpening | null> {
  const { jobs } = await getJobOpenings();
  return jobs.find((job) => job.id === id) ?? null;
}
