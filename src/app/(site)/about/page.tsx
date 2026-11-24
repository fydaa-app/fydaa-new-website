import HeroSection from "@/features/about/Herosection";
import HowItStarted from "@/features/about/HowItStarted";
import Founder from "@/features/about/Founder";
import Portfolios from "@/features/about/Portfolios";
import Services from "@/features/about/Services";
import WhyFydaa from "@/features/about/WhyFydaa";
import AboutFaq from "@/features/about/AboutFaq";
import AboutCta from "@/features/about/AboutCta";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Fydaa makes expert, SEBI-registered investment advice accessible to every Indian. Meet our founder and see how we plan, save and invest for your goals.",
  path: "/about",
});

/** About: the mission, why Fydaa exists, who started it, what it does, and why people trust it. */
export default function AboutPage() {
  return (
    <main className="relative m-0 w-full bg-white">
      <HeroSection />
      <HowItStarted />
      <Founder />
      <Portfolios />
      <Services />
      <WhyFydaa />
      <AboutFaq />
      <AboutCta />
    </main>
  );
}
