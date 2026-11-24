import { expect, test } from "@playwright/test";

test("Quick answers panel: honest label, accessible, Escape returns focus", async ({ page }) => {
  await page.goto("/about");
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
