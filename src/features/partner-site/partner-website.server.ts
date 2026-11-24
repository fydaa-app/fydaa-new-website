import "server-only";
import { cache } from "react";
import { env } from "@/config/env";
import { ApiError } from "@/lib/http/api-error";
import { request } from "@/lib/http/client";
import type { PublicPartnerWebsite } from "./api";
import { normalizePartnerSlug } from "./partner-slug";

/** Partner microsites change rarely; regenerate at most every 5 minutes. */
export const PARTNER_REVALIDATE_SECONDS = 300;

async function load(rawSlug: string): Promise<PublicPartnerWebsite | null> {
  const slug = normalizePartnerSlug(rawSlug);
  if (!slug) return null;
  try {
    const payload = await request<{ success?: boolean; data?: PublicPartnerWebsite }>(
      env.api.crm,
      `arn/public/partner-website/${encodeURIComponent(slug)}`,
      { next: { revalidate: PARTNER_REVALIDATE_SECONDS, tags: [`partner-site:${slug}`] }, timeoutMs: 8_000 },
    );
    return payload?.data ?? null;
  } catch (error) {
    if (!(error instanceof ApiError && error.status === 404)) {
      console.error("[partner-site] lookup failed", slug, error);
    }
    return null;
  }
}

/** Request-scoped memoisation so generateMetadata and the page share one fetch. */
export const getPartnerWebsite = cache(load);
