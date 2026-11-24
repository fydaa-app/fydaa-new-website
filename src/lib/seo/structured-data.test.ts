import { describe, expect, it } from "vitest";
import { faqPageJsonLd, organizationJsonLd, siteGraphJsonLd } from "./structured-data";

describe("structured data", () => {
  it("describes the organisation with its regulatory identifiers", () => {
    const graph = siteGraphJsonLd();
    const [organization, website] = graph["@graph"];
    expect(graph["@context"]).toBe("https://schema.org");
    expect(organization).toMatchObject({
      "@type": "FinancialService",
      legalName: "Multistrato Capital Advisors Private Limited",
      url: "https://fydaa.com",
      address: { addressLocality: "Mumbai", addressCountry: "IN" },
    });
    expect(organizationJsonLd().identifier).toContainEqual(
      expect.objectContaining({ value: "INA000015969" }),
    );
    expect(website).toMatchObject({
      "@type": "WebSite",
      publisher: { "@id": "https://fydaa.com/#organization" },
    });
  });

  it("builds an FAQPage from question/answer pairs", () => {
    expect(faqPageJsonLd([{ question: "Q?", answer: "A." }])).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: "Q?", acceptedAnswer: { "@type": "Answer", text: "A." } }],
    });
  });
});
