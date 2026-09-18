import HeroSection from "./Herosection";
import PageDivider from "./PageDivider";
import Dreams from "./Dreams";
import Portfolios from "./Portfolios";
import HowItStarted from "./HowItStarted";
import Founder from "./Founder";
import Services from "./Services";
import WhyFydaa from "./WhyFydaa";
import AboutCta from "./AboutCta";
import AboutFaq from "./AboutFaq";

const AboutPage = () => {
  return (
    <div className="font-inter text-ink antialiased bg-grey-50">
      <HeroSection />
      <PageDivider />
      <Dreams />
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
