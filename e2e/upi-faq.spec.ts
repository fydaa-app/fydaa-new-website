import { expect, test } from "@playwright/test";

// Android Chrome cannot render a PDF inside an iframe, so the notice must be real HTML.
test("UPI handle notice is readable HTML with the IDs, FAQs and the PDF", async ({ page }) => {
  await page.goto("/upi-faq");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("SEBI-validated UPI IDs");
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.getByText("fydaa.ia@validyes", { exact: true })).toBeVisible();

  // Site navigation is present, so nobody is trapped on the page.
  await expect(page.getByRole("navigation").first()).toBeVisible();

  const question = page.getByRole("button", { name: "Do I need a new UPI ID to invest?" });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Only intermediaries get the new validated IDs")).toBeVisible();

  const pdf = page.getByRole("link", { name: "Download the notice (PDF)" });
  const href = await pdf.getAttribute("href");
  expect(href).toBe("/documents/upi-intimation-to-investors.pdf");
  expect((await page.request.get(href!)).headers()["content-type"]).toContain("application/pdf");
});
