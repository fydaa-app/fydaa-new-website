import type { MetadataRoute } from "next";

/**
 * Single registry of the site's routes. Navigation, footer links and the sitemap are
 * derived from it so a renamed path cannot leave stale links behind.
 */

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export interface SiteRoute {
  path: `/${string}`;
  label: string;
  /** Present when the page belongs in the XML sitemap (public, indexable). */
  sitemap?: { priority: number; changeFrequency: ChangeFrequency };
}

export const routes = {
  home: { path: "/", label: "Home", sitemap: { priority: 1, changeFrequency: "weekly" } },
  about: { path: "/about", label: "About", sitemap: { priority: 0.8, changeFrequency: "monthly" } },
  features: { path: "/features", label: "Features", sitemap: { priority: 0.8, changeFrequency: "monthly" } },
  programme: {
    path: "/programme",
    label: "Programme",
    sitemap: { priority: 0.8, changeFrequency: "monthly" },
  },
  careers: { path: "/careers", label: "Career", sitemap: { priority: 0.7, changeFrequency: "weekly" } },
  partner: { path: "/partner", label: "Partner", sitemap: { priority: 0.6, changeFrequency: "monthly" } },
  login: { path: "/login", label: "Login" },
  signup: { path: "/signup", label: "Sign up" },
  dashboard: { path: "/dashboard", label: "Dashboard" },
  upiFaq: { path: "/upi-faq", label: "UPI handle FAQs" },
} as const satisfies Record<string, SiteRoute>;

const legal = { priority: 0.3, changeFrequency: "yearly" } as const;

export interface LegalRoute extends SiteRoute {
  /** Previous URL, permanently redirected to `path`. */
  legacyPath: `/${string}`;
}

/** Regulatory and policy pages linked from the footer. */
export const legalRoutes = [
  {
    path: "/legal/terms-and-conditions",
    legacyPath: "/quicklinks/Terms&Conditions",
    label: "Terms & Conditions",
    sitemap: legal,
  },
  {
    path: "/legal/privacy-policy",
    legacyPath: "/quicklinks/PrivacyPolicy",
    label: "Privacy Policy",
    sitemap: legal,
  },
  {
    path: "/legal/refund-policy",
    legacyPath: "/quicklinks/RefundPolicy",
    label: "Refund Policy",
    sitemap: legal,
  },
  {
    path: "/legal/investor-charter",
    legacyPath: "/quicklinks/InvestorCharter",
    label: "Investor Charter",
    sitemap: legal,
  },
  {
    path: "/legal/complaints",
    legacyPath: "/quicklinks/Complaints",
    label: "Complaints",
    sitemap: { ...legal, changeFrequency: "monthly" },
  },
  {
    path: "/legal/grievance-redressal",
    legacyPath: "/quicklinks/Grievance",
    label: "Grievance Redressal / Escalation Matrix",
    sitemap: legal,
  },
  {
    path: "/legal/investor-warning",
    legacyPath: "/quicklinks/InvestorWarning",
    label: "Investor Warning - Fraudulent Misuse of Our Details",
    sitemap: legal,
  },
  {
    path: "/legal/vigilance-awareness-week",
    legacyPath: "/quicklinks/VigilanceAwarenessWeek",
    label: "Vigilance Awareness Week",
    sitemap: legal,
  },
  {
    path: "/legal/disclosure",
    legacyPath: "/quicklinks/Disclosure",
    label: "Disclosure",
    sitemap: legal,
  },
] as const satisfies readonly LegalRoute[];

/** Permanent redirects from retired URLs, consumed by next.config.ts. */
export function legacyRedirects() {
  return legalRoutes.flatMap(({ legacyPath, path }) => {
    const sources = new Set([legacyPath, legacyPath.replace(/&/g, "%26"), legacyPath.toLowerCase()]);
    return [...sources].map((source) => ({ source, destination: path, permanent: true }));
  });
}

/** Primary navigation, in display order. */
export const mainNavigation = [
  routes.home,
  routes.about,
  routes.features,
  routes.programme,
  routes.careers,
  routes.partner,
] as const;

export type IndexableRoute = SiteRoute & { sitemap: NonNullable<SiteRoute["sitemap"]> };

export function sitemapRoutes(): IndexableRoute[] {
  const all: readonly SiteRoute[] = [...Object.values(routes), ...legalRoutes];
  return all.filter((route): route is IndexableRoute => route.sitemap !== undefined);
}
