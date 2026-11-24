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

  test("mobile menu offers Login and Sign up, locks the page, closes on backdrop, Escape and navigation", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "mobile layout");
    await page.goto("/about");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    const close = page.getByRole("button", { name: "Close menu" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("nav#nav .nav-center").getByRole("link", { name: "Login" })).toBeVisible();
    await expect(page.locator("nav#nav .nav-center").getByRole("link", { name: "Sign up" })).toBeVisible();

    // The page behind is locked and dimmed; tapping the backdrop closes the menu.
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
    const backdrop = page.locator(".nav-backdrop");
    const box = (await backdrop.boundingBox())!;
    // Below the open menu panel, which covers the top of the backdrop.
    await backdrop.click({ position: { x: 20, y: box.height - 20 } });
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");

    await page.getByRole("button", { name: "Open menu" }).click();
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

test("hero calculator's Start this SIP goes to signup with the chosen plan", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Start this SIP →" });
  await expect(cta).toHaveAttribute(
    "href",
    /^\/signup\?intent=sip&category=equity&frequency=monthly&amount=5000&years=10$/,
  );
  await page.getByRole("button", { name: "Debt", exact: true }).click();
  await expect(cta).toHaveAttribute("href", /category=debt/);
  await cta.click();
  await expect(page).toHaveURL(/\/signup\?intent=sip&category=debt/);
});

test("footer shows the current year and opens social links safely", async ({ page }) => {
  await page.goto("/about");
  const footer = page.locator("footer#footer");
  await expect(footer).toContainText(`© ${new Date().getFullYear()} Fydaa`);
  for (const name of ["Fydaa on LinkedIn", "Fydaa on Instagram", "Fydaa on Facebook"]) {
    const link = footer.getByRole("link", { name });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
});
