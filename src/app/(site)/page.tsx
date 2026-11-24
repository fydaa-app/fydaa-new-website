import "@/features/home/styles/home.css";
import Hero from "@/features/home/components/Hero";
import FundHouses from "@/features/home/components/FundHouses";
import MoneyPersonSection from "@/features/home/components/MoneyPersonSection";
import AppTour from "@/features/home/components/AppTour";
import Testimonials from "@/features/home/components/Testimonials";
import FaqSection from "@/features/home/components/FaqSection";
import GetAppSection from "@/features/home/components/GetAppSection";
import HashScroll from "@/components/HashScroll";
import { ProofBand } from "@/components/layout/proof-band";
import { FAQS } from "@/features/home/data/content";
import { JsonLd } from "@/lib/seo/json-ld";
import { faqPageJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Fydaa: Goal-Based Investing & Financial Planning",
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

/**
 * App-first home: plan a goal (and see it in the app), meet the people behind it, tour the app,
 * proof, stories, questions, get the app.
 */
export default function HomePage() {
  return (
    <main className="relative m-0 w-full bg-white p-0">
      <HashScroll />
      <Hero />
      <FundHouses />
      <MoneyPersonSection />
      <AppTour />
      <ProofBand />
      <Testimonials />
      <FaqSection />
      <GetAppSection />
      <JsonLd data={faqPageJsonLd(FAQS.map((faq) => ({ question: faq.q, answer: faq.a })))} />
    </main>
  );
}
