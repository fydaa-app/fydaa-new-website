import { expect, test } from "@playwright/test";

const header = "header.site-header";

test.describe("global navigation", () => {
  test("offers Log in on wide screens", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop layout");
    await page.goto("/about");
    const login = page.locator(`${header} .nav-actions`).getByRole("link", { name: "Log in" });
    await expect(login).toBeVisible();
    await login.click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("the phone menu offers Log in and Sign up, locks the page, closes on Escape and navigation", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "mobile layout");
    await page.goto("/about");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    const sheet = page.getByRole("navigation", { name: "Menu" });
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(sheet.getByRole("link", { name: "Log in" })).toBeVisible();
    await expect(sheet.getByRole("link", { name: "Sign up" })).toBeVisible();
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");

    await page.getByRole("button", { name: "Open menu" }).click();
    await sheet.getByRole("link", { name: "Careers" }).click();
    await expect(page).toHaveURL(/\/careers$/);
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  test("marks the current page", async ({ page, isMobile }) => {
    test.skip(isMobile, "the words sit in the menu on phones");
    await page.goto("/about");
    await expect(page.locator(`${header} .nav-words a[aria-current="page"]`)).toHaveText("About");
  });

  test("the first Tab stop is the skip link", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard");
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });
});

test("shows exactly one visible account link at every width", async ({ page }) => {
  await page.goto("/features");
  const visible = page
    .locator(header)
    .getByRole("link", { name: "Log in", exact: true })
    .filter({ visible: true });
  // Phones and tablets keep it inside the (closed) menu, so none shows until it opens.
  await expect(visible).toHaveCount((await page.viewportSize())!.width < 1024 ? 0 : 1);
});

test("the home planner carries the chosen plan to signup", async ({ page, isMobile }) => {
  await page.goto("/");
  const web = page.getByRole("link", { name: "Start a SIP on the web" });
  await expect(web).toHaveAttribute(
    "href",
    /^\/signup\?intent=sip&category=equity&frequency=monthly&amount=5000&years=10$/,
  );
  if (isMobile) await page.getByLabel("Fund type").selectOption("debt");
  else await page.getByRole("button", { name: "Debt", exact: true }).click();
  await page.getByRole("button", { name: "15", exact: true }).click();
  await expect(web).toHaveAttribute("href", /category=debt.*years=15/);
  // The projection always carries its assumption and the market-risk line.
  await expect(page.getByText(/Illustration only, at an assumed 7% a year for debt funds/)).toBeVisible();
  await expect(page.getByText(/subject to market risks/).first()).toBeVisible();
  await web.click();
  await expect(page).toHaveURL(/\/signup\?intent=sip&category=debt/);
});

test("the header offers the app: in the hero on phones, a QR code on a desktop", async ({
  page,
  isMobile,
}) => {
  await page.goto("/about");
  if (isMobile) {
    await page.goto("/");
    await expect(page.locator("main.home .hero").getByRole("link", { name: "Get the app" })).toHaveAttribute(
      "href",
      "/download",
    );
    return;
  }
  await page.locator(header).getByRole("button", { name: "Get the app" }).click();
  const panel = page.getByRole("dialog", { name: "Get Fydaa on your phone" });
  await expect(panel.getByRole("img", { name: "QR code to get the Fydaa app" }).locator("svg")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
});

test("Professionals groups partners, the programme and careers", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop panel; the phone menu is covered above");
  await page.goto("/about");
  await page.getByRole("button", { name: "Professionals" }).click();
  await page
    .locator(header)
    .getByRole("link", { name: /Partners/ })
    .click();
  await expect(page).toHaveURL(/\/partner$/);
});

test("footer shows the current year, both registrations and opens social links safely", async ({ page }) => {
  await page.goto("/about");
  const footer = page.locator("footer#footer");
  await expect(footer).toContainText(`© ${new Date().getFullYear()} Fydaa`);
  await expect(footer).toContainText("INA000015969");
  await expect(footer).toContainText("358522");
  for (const name of ["LinkedIn", "Instagram", "Facebook"]) {
    const link = footer.getByRole("link", { name, exact: true });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
});

test("the home page closes with the app action and the full disclaimer", async ({ page }) => {
  await page.goto("/");
  const close = page.locator("footer#contact");
  await expect(
    close.getByRole("heading", { name: "Your first goal SIP, from ₹1,000 a month" }),
  ).toBeVisible();
  await expect(close.locator(".get-app")).toHaveCount(1);
  await expect(close).toContainText("Read all the related documents carefully before investing.");
});
