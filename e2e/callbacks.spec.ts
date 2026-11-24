import { expect, test } from "@playwright/test";

test("provider callback without a status never claims success", async ({ page }) => {
  await page.goto("/SuccesspageNSDL");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Returning you to Fydaa");
  await expect(page.getByText(/success/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Continue to Fydaa" })).toHaveAttribute("href", "/dashboard");
});

test("provider callback reports failures", async ({ page }) => {
  await page.goto("/SuccesspageDigi?status=failed");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("DigiLocker wasn't completed");
});

test("provider callback confirms explicit success", async ({ page }) => {
  await page.goto("/SuccesspageSetu?status=successful");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Verification completed");
});

test("lump-sum return without a pending payment is not shown as paid", async ({ page }) => {
  await page.goto("/Successpagelumpsum");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("We couldn't confirm this payment here");
  await expect(page.getByText(/payment received|successful/i)).toHaveCount(0);
});
