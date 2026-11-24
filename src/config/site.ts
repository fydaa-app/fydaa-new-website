import { env } from "./env";

/**
 * Static, non-secret facts about the business. Single source of truth for
 * metadata, structured data, the footer and contact links.
 */
export const siteConfig = {
  name: "Fydaa",
  url: env.siteUrl,
  title: "Fydaa – Your money, your mission",
  description:
    "Plan your money better with Fydaa. Get goal-based financial planning, investing, budgeting, debt management & retirement planning from SEBI-registered advisers.",
  locale: "en_IN",
  contact: {
    phone: "+91 9136935300",
    phoneHref: "tel:+919136935300",
    email: "support@fydaa.com",
    address: {
      streetAddress: "903, Ecostar Building, Off Aarey Road, Churi Wadi, Goregaon (East)",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400063",
      addressCountry: "IN",
    },
  },
  entities: {
    adviser: {
      legalName: "Multistrato Capital Advisors Private Limited",
      registration: "SEBI RIA INA000015969",
      gstin: "27AAHCM9321Q1ZS",
    },
    distributor: {
      legalName: "Fydaa Analytics Private Limited",
      registration: "AMFI ARN 358522",
    },
    principalOfficer: "Kuntal Bhansali",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/fydaaoffical",
    instagram: "https://www.instagram.com/fydaaofficial/",
    facebook: "https://www.facebook.com/fydaaofficial/",
  },
  apps: {
    ios: "https://apps.apple.com/in/app/fydaa-your-money-for-tomorrow/id1622175190",
    android: "https://play.google.com/store/apps/details?id=com.app.fydaa",
  },
} as const;

export type SiteConfig = typeof siteConfig;
