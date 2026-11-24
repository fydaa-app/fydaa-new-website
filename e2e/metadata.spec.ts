import { expect, test } from "@playwright/test";

const INDEXABLE = [
  "/",
  "/about",
  "/features",
  "/programme",
  "/careers",
  "/partner",
  "/legal/privacy-policy",
  "/legal/terms-and-conditions",
  "/legal/complaints",
];

const PRIVATE = ["/login", "/signup", "/dashboard", "/upi-faq", "/SuccesspageFund", "/Successpagelumpsum"];

/** Reads metadata from the server-rendered HTML (what crawlers see), not the hydrated DOM. */
async function headOf(request: import("@playwright/test").APIRequestContext, path: string) {
  const html = await (await request.get(path)).text();
  const pick = (pattern: RegExp) => pattern.exec(html)?.[1] ?? null;
  return {
    title: pick(/<title>([^<]*)<\/title>/),
    description: pick(/<meta name="description" content="([^"]*)"/),
    canonical: pick(/<link rel="canonical" href="([^"]*)"/),
    robots: pick(/<meta name="robots" content="([^"]*)"/),
    ogImage: pick(/<meta property="og:image" content="([^"]*)"/),
  };
}

test("indexable pages have unique titles, descriptions and self-referencing canonicals", async ({
  request,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const path of INDEXABLE) {
    const head = await headOf(request, path);
    expect(head.title, `${path} title`).toBeTruthy();
    expect(head.description?.length ?? 0, `${path} description length`).toBeGreaterThan(50);
    expect(new URL(head.canonical ?? "", "https://x").pathname, `${path} canonical`).toBe(path);
    expect(head.robots ?? "index, follow", `${path} robots`).not.toContain("noindex");
    expect(head.ogImage, `${path} og:image`).toMatch(/^https?:\/\/.+\/og-image\.png$/);
    titles.add(head.title ?? "");
    descriptions.add(head.description ?? "");
  }

  expect(titles.size).toBe(INDEXABLE.length);
  expect(descriptions.size).toBe(INDEXABLE.length);
});

for (const path of PRIVATE) {
  test(`${path} is noindex`, async ({ request }) => {
    const head = await headOf(request, path);
    expect(head.robots).toContain("noindex");
  });
}

test("careers list is server-rendered and job pages carry JobPosting data", async ({ request }) => {
  const careers = await (await request.get("/careers")).text();
  const jobLink = /href="(\/careers\/jobs\/[^"]+)"/.exec(careers)?.[1];
  test.skip(!jobLink, "no open roles returned by the jobs API at build time");

  const html = await (await request.get(jobLink!)).text();
  const ld = /<script type="application\/ld\+json">([^<]+)<\/script>/.exec(html)?.[1];
  expect(ld).toBeTruthy();
  const data = JSON.parse(ld!) as Record<string, unknown>;
  expect(data["@type"]).toBe("JobPosting");
  expect(data).toHaveProperty("hiringOrganization");
  expect(new URL(String(data.url)).pathname).toBe(jobLink);
});

for (const path of [
  "/",
  "/about",
  "/features",
  "/programme",
  "/careers",
  "/partner",
  "/login",
  "/signup",
  "/legal/privacy-policy",
]) {
  test(`${path} has exactly one h1 in the server HTML`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    expect(html.match(/<h1[\s>]/g) ?? []).toHaveLength(1);
  });
}

for (const path of [
  "/",
  "/about",
  "/features",
  "/programme",
  "/careers",
  "/partner",
  "/login",
  "/signup",
  "/download",
  "/legal/complaints",
  "/legal/grievance-redressal",
  "/legal/investor-warning",
  "/legal/privacy-policy",
  "/SuccesspageFund",
  "/about/does-not-exist",
]) {
  test(`${path} has exactly one <main> landmark in the server HTML`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    expect(html.match(/<main[\s>]/g) ?? []).toHaveLength(1);
  });
}

async function jsonLdTypes(request: import("@playwright/test").APIRequestContext, path: string) {
  const html = await (await request.get(path)).text();
  return [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].flatMap((match) => {
    const data = JSON.parse(match[1] ?? "{}") as { "@type"?: string; "@graph"?: { "@type": string }[] };
    return data["@graph"]?.map((node) => node["@type"]) ?? [data["@type"]];
  });
}

test("structured data: organisation on every page, FAQPage where FAQs are shown", async ({ request }) => {
  expect(await jsonLdTypes(request, "/")).toEqual(
    expect.arrayContaining(["FinancialService", "WebSite", "FAQPage"]),
  );
  expect(await jsonLdTypes(request, "/about")).toEqual(
    expect.arrayContaining(["FinancialService", "FAQPage"]),
  );
  expect(await jsonLdTypes(request, "/careers")).toEqual(expect.arrayContaining(["FAQPage"]));
  expect(await jsonLdTypes(request, "/legal/privacy-policy")).not.toContain("FAQPage");
});
