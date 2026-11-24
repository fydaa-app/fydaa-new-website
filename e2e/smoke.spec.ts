import { expect, test } from "@playwright/test";

/** Public routes that must always render successfully. */
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/features",
  "/programme",
  "/careers",
  "/partner",
  "/login",
  "/signup",
  "/legal/privacy-policy",
  "/legal/terms-and-conditions",
  "/legal/complaints",
];

for (const path of PUBLIC_ROUTES) {
  test(`${path} renders without errors`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(path, { waitUntil: "load" });

    expect(response?.status(), `HTTP status for ${path}`).toBe(200);
    await expect(page).toHaveTitle(/\S/);
    await expect(page.locator("body")).not.toBeEmpty();
    expect(pageErrors, `uncaught errors on ${path}`).toEqual([]);
  });
}
