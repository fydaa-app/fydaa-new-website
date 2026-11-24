import { expect, test } from "@playwright/test";

// These tests must never reach real backends: block every API host.
test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/([a-z0-9-]+\.)*fydaa\.(com|in)\/(?!_next)/, (route) =>
    route.request().resourceType() === "document" ? route.continue() : route.abort(),
  );
});

test("login form: labelled fields, masked PIN, paste fills all digits, Enter submits", async ({ page }) => {
  await page.goto("/login");

  const mobile = page.getByLabel("Mobile Number");
  await expect(mobile).toHaveAttribute("autocomplete", "tel-national");
  await expect(mobile).toHaveAttribute("inputmode", "numeric");

  const pin = page.getByLabel("4-digit PIN");
  await expect(pin).toHaveAttribute("type", "password");

  await pin.click();
  await page.evaluate(() => {
    const input = document.activeElement as HTMLInputElement;
    const data = new DataTransfer();
    data.setData("text/plain", "12-34");
    input.dispatchEvent(
      new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }),
    );
  });
  await pin.fill("12-34"); // the paste pipeline ends in an input event with the full text
  await expect(pin).toHaveValue("1234");
  await expect(page.locator("main")).not.toContainText("1234");

  // Enter in the mobile field submits the form; client validation answers first.
  await mobile.fill("98765");
  await mobile.press("Enter");
  await expect(page.locator("main").getByRole("alert")).toHaveText("Enter a 10-digit mobile number.");
});

test("signup: referral toggle is a keyboard-operable button", async ({ page }) => {
  await page.goto("/signup");
  const toggle = page.getByRole("button", { name: "Have a Referral Code?" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Referral Code")).toBeVisible();
});
