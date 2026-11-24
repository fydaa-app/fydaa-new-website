import { expect, test } from "@playwright/test";

const PAGES = ["/", "/about", "/features", "/programme", "/careers", "/partner", "/login", "/signup"];

for (const path of PAGES) {
  test(`${path}: every link has a name and every internal link resolves`, async ({ page, request }) => {
    await page.goto(path);

    const links = await page.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => ({
        href: anchor.getAttribute("href") ?? "",
        name:
          (anchor.textContent ?? "").trim() ||
          anchor.getAttribute("aria-label") ||
          anchor.querySelector("img")?.alt ||
          "",
      })),
    );

    const unnamed = links.filter((link) => !link.name).map((link) => link.href);
    expect(unnamed, "links without an accessible name").toEqual([]);

    const internal = [
      ...new Set(
        links
          .map((link) => link.href)
          .filter((href) => href.startsWith("/") && !href.startsWith("//"))
          .map((href) => href.split("#")[0] || "/"),
      ),
    ];
    for (const href of internal) {
      const response = await request.get(href);
      expect(response.status(), `${href} linked from ${path}`).toBeLessThan(400);
    }
  });
}
