import { expect, test } from "@playwright/test";

test("home questions and answers are in the server HTML for search engines", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain("How much do I need to start a SIP?");
  expect(html).toContain("There is no account minimum");
});

test("home questions show every answer open, with no accordion", async ({ page }) => {
  await page.goto("/");
  const questions = page.locator("#questions");
  await expect(questions.getByRole("heading", { name: "Where does my SIP money go?" })).toBeVisible();
  await expect(questions.getByText(/Straight to the fund house, never to Fydaa/)).toBeVisible();
  await expect(questions.locator("[aria-expanded]")).toHaveCount(0);
});

test("about hero copy has no missing spaces at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/about");
  await expect(page.locator("main")).toContainText("understandable, and achievable");
  await expect(page.locator("body")).not.toContainText("understandable,and");
});
