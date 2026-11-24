import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  "/",
  "/about",
  "/features",
  "/programme",
  "/careers",
  "/partner",
  "/login",
  "/signup",
  "/legal/privacy-policy",
  "/legal/complaints",
  "/direct-plan", // 404 page
];

for (const path of PAGES) {
  test(`${path} meets WCAG AA colour contrast`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withRules(["color-contrast"])
      // Third-party widgets and the animated logo strip are outside our control.
      .exclude("iframe")
      .analyze();
    const failures = results.violations.flatMap((violation) =>
      violation.nodes.map(
        (node) => `${node.target.join(" ")} — ${node.failureSummary?.split("\n")[1]?.trim()}`,
      ),
    );
    expect(failures, `contrast failures on ${path}`).toEqual([]);
  });
}
