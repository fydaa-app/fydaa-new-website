import { siteConfig } from "@/config/site";

/** schema.org structured data built from siteConfig (single source of truth). */

const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

export function organizationJsonLd() {
  const { adviser, distributor } = siteConfig.entities;
  return {
    "@type": "FinancialService",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    legalName: adviser.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/fydaa-logo.png`,
    image: `${siteConfig.url}/og-image.png`,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: { "@type": "PostalAddress", ...siteConfig.contact.address },
    areaServed: { "@type": "Country", name: "India" },
    sameAs: Object.values(siteConfig.social),
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "SEBI Investment Adviser registration",
        value: adviser.sebiRegistrationNumber,
      },
      { "@type": "PropertyValue", propertyID: "AMFI ARN", value: distributor.arn },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: "en-IN",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Organization + WebSite as one @graph for the root layout. */
export function siteGraphJsonLd() {
  return { "@context": "https://schema.org", "@graph": [organizationJsonLd(), websiteJsonLd()] };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqPageJsonLd(entries: readonly FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
