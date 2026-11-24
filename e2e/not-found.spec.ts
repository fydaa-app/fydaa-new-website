import { expect, test } from "@playwright/test";

for (const path of ["/direct-plan", "/about/does-not-exist"]) {
  test(`${path} shows a navigable 404 page`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);

    await expect(page.getByRole("heading", { level: 1, name: "We couldn't find that page" })).toBeVisible();
    // Exactly one site header and footer: no missing or duplicated chrome.
    await expect(page.locator("header.site-header")).toHaveCount(1);
    await expect(page.locator("footer#footer")).toHaveCount(1);
    await expect(page).toHaveTitle(/Page not found/);

    await page.getByRole("link", { name: "Go to home" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
}

test("404 text stays readable in dark mode", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/direct-plan");
  const heading = page.getByRole("heading", { level: 1 });
  const [color, background] = await heading.evaluate((element) => {
    const bodyStyle = getComputedStyle(document.body);
    return [getComputedStyle(element).color, bodyStyle.backgroundColor];
  });
  expect(color).not.toBe(background);
  expect(background).not.toBe("rgb(0, 0, 0)");
});
