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

for (const path of ["/", "/about", "/features", "/programme", "/careers", "/partner", "/login", "/signup"]) {
  test(`${path}: readable text is at least 12px`, async ({ page }) => {
    await page.goto(path);
    const tooSmall = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((element) => {
          if (element.closest('[aria-hidden="true"], script, style, noscript')) return false;
          const ownText = [...element.childNodes].some(
            (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim().length > 1,
          );
          const box = element.getBoundingClientRect();
          return (
            ownText && box.width > 0 && box.height > 0 && parseFloat(getComputedStyle(element).fontSize) < 12
          );
        })
        .map(
          (element) =>
            `${(element.textContent ?? "").trim().slice(0, 30)} @ ${getComputedStyle(element).fontSize}`,
        ),
    );
    expect(tooSmall, `text below 12px on ${path}`).toEqual([]);
  });
}

// Horizontal overflow and clipped content are checked at every width in layout.spec.ts.
