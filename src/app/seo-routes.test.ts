import { afterEach, describe, expect, it, vi } from "vitest";
import { legacyRedirects, legalRoutes, routes, sitemapRoutes } from "@/config/routes";
import sitemap from "./sitemap";

vi.mock("server-only", () => ({}));
vi.mock("@/features/careers/job-openings.server", () => ({
  getJobOpenings: vi.fn(async () => ({
    jobs: [{ id: "42", title: "Investment Adviser", postedAt: "2026-11-01" }],
    error: null,
  })),
}));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sitemap", () => {
  it("lists every public page with an absolute URL and nothing private", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain("https://fydaa.com/");
    expect(urls).toContain("https://fydaa.com/about");
    expect(urls).toContain("https://fydaa.com/legal/privacy-policy");
    for (const privatePath of ["/login", "/signup", "/dashboard", "/upi-faq"]) {
      expect(urls).not.toContain(`https://fydaa.com${privatePath}`);
    }
    expect(urls).toHaveLength(sitemapRoutes().length + 1);
  });

  it("includes a page for every open job", async () => {
    const entries = await sitemap();
    expect(entries).toContainEqual(
      expect.objectContaining({ url: "https://fydaa.com/careers/jobs/42", lastModified: "2026-11-01" }),
    );
  });

  it("includes all legal pages", () => {
    expect(sitemapRoutes().map((route) => route.path)).toEqual(
      expect.arrayContaining(legalRoutes.map((route) => route.path)),
    );
    expect(sitemapRoutes().map((route) => route.path)).toContain(routes.careers.path);
  });
});

describe("legal URLs", () => {
  it("are lowercase kebab-case without characters that need escaping", () => {
    for (const { path } of legalRoutes) {
      expect(path).toMatch(/^\/legal\/[a-z0-9-]+$/);
    }
  });

  it("permanently redirect every retired /quicklinks URL, including encoded and lowercase variants", () => {
    const redirects = legacyRedirects();
    expect(redirects).toContainEqual({
      source: "/quicklinks/Terms&Conditions",
      destination: "/legal/terms-and-conditions",
      permanent: true,
    });
    expect(redirects).toContainEqual({
      source: "/quicklinks/Terms%26Conditions",
      destination: "/legal/terms-and-conditions",
      permanent: true,
    });
    expect(redirects).toContainEqual({
      source: "/quicklinks/privacypolicy",
      destination: "/legal/privacy-policy",
      permanent: true,
    });
    expect(new Set(redirects.map((r) => r.destination))).toEqual(new Set(legalRoutes.map((r) => r.path)));
  });
});

describe("robots", () => {
  it("allows crawling in production except /api and points at the sitemap", async () => {
    vi.resetModules();
    const { default: robots } = await import("./robots");
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: "/api/" },
      sitemap: "https://fydaa.com/sitemap.xml",
      host: "https://fydaa.com",
    });
  });

  it("blocks all crawling on staging", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_APP_ENV", "stage");
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://crm-stage.example.com/");
    const { default: robots } = await import("./robots");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });
});
