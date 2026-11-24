import { expect, test } from "@playwright/test";

test("home FAQ answers are in the server HTML for search engines", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain("How much do I need to start?");
  expect(html).toMatch(/aria-expanded="false"/);
});

test("home FAQ is keyboard operable and opens one answer at a time", async ({ page }) => {
  await page.goto("/");
  const first = page.getByRole("button", { name: "How much do I need to start?" });
  const second = page.getByRole("button", { name: "Is my money safe?" });

  await first.focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("region", { name: "How much do I need to start?" })).toBeVisible();

  await second.focus();
  await page.keyboard.press(" ");
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(first).toHaveAttribute("aria-expanded", "false");
});
