import "@/features/home/styles/home.css";
import { Inter } from "next/font/google";
import Hero from "@/features/home/components/Hero";
import AmcStrip from "@/features/home/components/AmcStrip";
import DreamsSection from "@/features/home/components/DreamsSection";
import DirectPlanSection from "@/features/home/components/DirectPlanSection";
import PurposeSection from "@/features/home/components/PurposeSection";
import TrustSection from "@/features/home/components/TrustSection";
import AdvisorySection from "@/features/home/components/AdvisorySection";
import Testimonials from "@/features/home/components/Testimonials";
import FaqSection from "@/features/home/components/FaqSection";
import FinalCta from "@/features/home/components/FinalCta";
import HashScroll from "@/components/HashScroll";
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
 * The homepage keeps fydaa.com's own typeface, Inter (the rest of the site uses Mona Sans). Loaded
 * here so only this route downloads it.
 */
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"], display: "swap" });

/** fydaa.com's homepage design, with the audit fixes (responsive, accessible, faster). */
export default function HomePage() {
  return (
    <main className={`${inter.variable} fydaa-home relative m-0 w-full p-0`}>
      <HashScroll />
      <Hero />
      <AmcStrip />
      <DreamsSection />
      <DirectPlanSection />
      <PurposeSection />
      <AdvisorySection />
      <TrustSection />
      <Testimonials />
      <FinalCta />
      <FaqSection />
      <JsonLd data={faqPageJsonLd(FAQS.map((faq) => ({ question: faq.q, answer: faq.a })))} />
    </main>
  );
}
