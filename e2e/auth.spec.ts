import { expect, test } from "@playwright/test";

test("signed-out visitors to the dashboard are sent to login and can return", async ({ page }) => {
  await page.goto("/dashboard?start=kyc");
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard%3Fstart%3Dkyc$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // The empty dashboard shell ("Hi, —") must never be shown to signed-out users.
  await expect(page.getByText("Hi, —")).toHaveCount(0);
});
