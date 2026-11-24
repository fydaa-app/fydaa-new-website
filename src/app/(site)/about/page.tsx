import HeroSection from "@/features/about/Herosection";
import PageDivider from "@/features/about/PageDivider";
import Portfolios from "@/features/about/Portfolios";
import HowItStarted from "@/features/about/HowItStarted";
import Founder from "@/features/about/Founder";
import Services from "@/features/about/Services";
import WhyFydaa from "@/features/about/WhyFydaa";
import AboutCta from "@/features/about/AboutCta";
import AboutFaq from "@/features/about/AboutFaq";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Fydaa makes expert, SEBI-registered investment advice accessible to every Indian. Meet our founder and see how we plan, save and invest for your goals.",
  path: "/about",
});

const AboutPage = () => {
  return (
    <div className="bg-grey-50 font-inter text-ink antialiased">
      <HeroSection />
      <PageDivider />
      <Portfolios />
      <HowItStarted />
      <Founder />
      <Services />
      <WhyFydaa />
      <AboutCta />
      <AboutFaq />
    </div>
  );
};

export default AboutPage;
