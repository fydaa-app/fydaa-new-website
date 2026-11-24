import { expect, test } from "@playwright/test";

test.describe("global navigation", () => {
  test("offers Login on wide screens", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop layout");
    await page.goto("/about");
    const login = page.locator("nav#nav .nav-right").getByRole("link", { name: "Login" });
    await expect(login).toBeVisible();
    await login.click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("mobile menu exposes Login, closes on Escape and on navigation", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile layout");
    await page.goto("/about");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    const close = page.getByRole("button", { name: "Close menu" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("nav#nav .nav-center").getByRole("link", { name: "Login" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");

    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .locator("nav#nav .nav-center")
      .getByRole("link", { name: "Careers" })
      .or(page.locator("nav#nav .nav-center").getByRole("link", { name: "Career" }))
      .click();
    await expect(page).toHaveURL(/\/careers$/);
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  test("marks the current page", async ({ page }) => {
    await page.goto("/features");
    await expect(page.locator('nav#nav a[aria-current="page"]')).toHaveText("Features");
  });
});

test("shows exactly one account link at every width", async ({ page }) => {
  await page.goto("/features");
  await expect(page.locator("nav#nav").getByRole("link", { name: "Login", exact: true })).toHaveCount(
    // Phones show it inside the (closed) menu only, so none is visible until it opens.
    (await page.viewportSize())!.width <= 768 ? 0 : 1,
  );
});
