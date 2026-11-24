import "@/features/home/styles/home.css";
import Hero from "@/features/home/components/Hero";
import FundHouses from "@/features/home/components/FundHouses";
import GoalsSection from "@/features/home/components/GoalsSection";
import MoneySection from "@/features/home/components/MoneySection";
import AdviceSection from "@/features/home/components/AdviceSection";
import Testimonials from "@/features/home/components/Testimonials";
import FaqSection from "@/features/home/components/FaqSection";
import ClosingCta from "@/features/home/components/ClosingCta";
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

export default function HomePage() {
  return (
    <main className="relative m-0 w-full bg-white p-0">
      <HashScroll />
      <Hero />
      <FundHouses />
      <GoalsSection />
      <MoneySection />
      <AdviceSection />
      <ProofBand />
      <Testimonials />
      <FaqSection />
      <ClosingCta />
      <JsonLd data={faqPageJsonLd(FAQS.map((faq) => ({ question: faq.q, answer: faq.a })))} />
    </main>
  );
}
