import { expect, test } from "@playwright/test";

const ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Mobile Safari/537.36";
const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";

test("/download sends Android phones to Google Play", async ({ request }) => {
  const response = await request.get("/download", { headers: { "user-agent": ANDROID }, maxRedirects: 0 });
  expect([302, 303, 307, 308]).toContain(response.status());
  expect(response.headers()["location"]).toBe("https://play.google.com/store/apps/details?id=com.app.fydaa");
});

test("/download sends iPhones to the App Store", async ({ request }) => {
  const response = await request.get("/download", { headers: { "user-agent": IPHONE }, maxRedirects: 0 });
  expect(response.headers()["location"]).toMatch(/^https:\/\/apps\.apple\.com\//);
});

test("/download offers both stores on desktop", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop user agent only");
  await page.goto("/download");
  await expect(page.getByRole("link", { name: "Get it on Google Play" })).toHaveAttribute(
    "href",
    "https://play.google.com/store/apps/details?id=com.app.fydaa",
  );
  await expect(page.getByRole("link", { name: "Download on the App Store" })).toHaveAttribute(
    "href",
    /apps\.apple\.com/,
  );
});

test("every Download App button uses the smart link", async ({ page }) => {
  for (const path of ["/", "/about"]) {
    await page.goto(path);
    const hrefs = await page
      .locator('a[data-ph-event="Download App"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThan(0);
    expect(new Set(hrefs)).toEqual(new Set(["/download"]));
  }
});
