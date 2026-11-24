import { expect, test } from "@playwright/test";

/**
 * Responsive layout guard. At every width, a page must not scroll sideways and no
 * container may silently clip its content (`overflow: hidden | clip` with content wider
 * than the box). Intentional clipping — marquees, decorative bleed — is opted in with a
 * `data-allow-clip` attribute so it is reviewed rather than guessed.
 */
const PAGES = [
  "/",
  "/about",
  "/features",
  "/programme",
  "/careers",
  "/partner",
  "/login",
  "/signup",
  "/upi-faq",
  "/legal/privacy-policy",
  "/legal/complaints",
  "/direct-plan", // 404 page
];
const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440];

test.describe.configure({ mode: "parallel" });

for (const path of PAGES) {
  test(`${path} fits every viewport width without clipping`, async ({ page, isMobile }) => {
    test.skip(isMobile, "widths are set explicitly; one project is enough");
    const failures: string[] = [];
    await page.goto(path);
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(150);
      const result = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;
        const clipped: string[] = [];
        for (const el of document.body.querySelectorAll<HTMLElement>("*")) {
          const style = getComputedStyle(el);
          if (style.overflowX !== "hidden" && style.overflowX !== "clip") continue;
          if (el.clientWidth === 0 || el.scrollWidth <= el.clientWidth + 2) continue;
          if (el.closest("[data-allow-clip]") || el.getBoundingClientRect().height < 8) continue;
          const text = (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 40);
          clipped.push(
            `${el.tagName.toLowerCase()}.${el.className.toString().split(" ")[0]} (+${el.scrollWidth - el.clientWidth}px) "${text}"`,
          );
        }
        return { sideways: document.documentElement.scrollWidth - viewport, clipped };
      });
      if (result.sideways > 0) failures.push(`${width}px: page scrolls sideways by ${result.sideways}px`);
      for (const entry of result.clipped.slice(0, 3)) failures.push(`${width}px: clips ${entry}`);
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
}
