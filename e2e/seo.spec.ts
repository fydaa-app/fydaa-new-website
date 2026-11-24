import { expect, test } from "@playwright/test";

test("robots.txt allows crawling and links the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toMatch(/User-Agent: \*/i);
  expect(body).toContain("Disallow: /api/");
  expect(body).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);
});

test("sitemap.xml is valid XML listing public pages", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");
  const body = await response.text();
  expect(body).toContain("<urlset");
  expect(body).toMatch(/<loc>https?:\/\/[^<]+\/about<\/loc>/);
  expect(body).not.toMatch(/<loc>[^<]*\/dashboard<\/loc>/);
  // Raw ampersands would make the XML invalid.
  expect(body).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
});

for (const [from, to] of [
  ["/quicklinks/PrivacyPolicy", "/legal/privacy-policy"],
  ["/quicklinks/Terms&Conditions", "/legal/terms-and-conditions"],
  ["/quicklinks/Terms%26Conditions", "/legal/terms-and-conditions"],
  ["/quicklinks/complaints", "/legal/complaints"],
] as const) {
  test(`${from} permanently redirects to ${to}`, async ({ request }) => {
    const response = await request.get(from, { maxRedirects: 0 });
    expect([301, 308]).toContain(response.status());
    expect(new URL(response.headers()["location"] ?? "", "http://x").pathname).toBe(to);
  });
}

test("the retired /api/careers/apply relay no longer exists", async ({ request }) => {
  const response = await request.post("/api/careers/apply", {
    multipart: { firstName: "x", email: "x@y.z" },
  });
  expect(response.status()).toBe(404);
});

test("cv-register validates input server-side", async ({ request }) => {
  const response = await request.post("/api/careers/cv-register", { multipart: { firstName: "A" } });
  expect(response.status()).toBe(400);
  expect((await response.json()) as { ok: boolean }).toMatchObject({ ok: false });
});
