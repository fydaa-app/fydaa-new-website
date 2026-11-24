import { expect, test } from "@playwright/test";

test("Quick answers panel: honest label, accessible, Escape returns focus", async ({ page, isMobile }) => {
  await page.goto("/about");
  if (isMobile) {
    // On phones the launcher appears once the visitor scrolls back up mid-page.
    await page.mouse.wheel(0, 1600);
    await page.mouse.wheel(0, -300);
  }
  const trigger = page.getByRole("button", { name: "Quick answers" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();

  const panel = page.getByRole("dialog", { name: "Quick answers" });
  await expect(panel).toBeVisible();
  await expect(panel).not.toContainText(/AI assistant|Online now/);

  await panel.getByRole("button", { name: "What is a SIP?" }).click();
  await expect(panel.getByText(/Systematic Investment Plan \(SIP\)/)).toBeVisible();
  await expect(panel.getByRole("link", { name: "Call", exact: true })).toHaveAttribute(
    "href",
    "tel:+919136935300",
  );

  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Quick answers" })).toBeFocused();
});

test("help panel is not shown in the signed-in app or on payment callbacks", async ({ page }) => {
  for (const path of ["/SuccesspageFund", "/Successpagelumpsum"]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Quick answers" })).toHaveCount(0);
  }
});

test("quick answers stays out of focused tasks and out of the way while reading on phones", async ({
  page,
  isMobile,
}) => {
  for (const path of ["/login", "/signup", "/partner"]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Quick answers" })).toHaveCount(0);
  }

  test.skip(!isMobile, "scroll-away behaviour is phone-only");
  await page.goto("/about");
  const launcher = page.getByRole("button", { name: "Quick answers" });
  // Out of the way on the first screen and while reading down...
  await expect(launcher).toHaveCSS("opacity", "0");
  await page.mouse.wheel(0, 1600);
  await expect(launcher).toHaveCSS("opacity", "0");
  // ...and back as soon as the visitor scrolls up.
  await page.mouse.wheel(0, -300);
  await expect(launcher).toHaveCSS("opacity", "1");
});
