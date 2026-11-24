import HeroSection from "./Herosection";
import PageDivider from "./PageDivider";
import Portfolios from "./Portfolios";
import HowItStarted from "./HowItStarted";
import Founder from "./Founder";
import Services from "./Services";
import WhyFydaa from "./WhyFydaa";
import AboutCta from "./AboutCta";
import AboutFaq from "./AboutFaq";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Fydaa makes expert, SEBI-registered investment advice accessible to every Indian. Meet our founder and see how we plan, save and invest for your goals.",
  path: "/about",
});


const AboutPage = () => {
  return (
    <div className="font-inter text-ink antialiased bg-grey-50">
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
