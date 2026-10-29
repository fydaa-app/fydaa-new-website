import "./home/styles/home.css";
import Hero from "./home/components/Hero";
import AmcStrip from "./home/components/AmcStrip";
import Dreams from "./about/Dreams";
import DirectPlanSection from "./home/components/DirectPlanSection";
import PurposeSection from "./home/components/PurposeSection";
import TrustSection from "./home/components/TrustSection";
import AdvisorySection from "./home/components/AdvisorySection";
import Testimonials from "./home/components/Testimonials";
import FaqSection from "./home/components/FaqSection";
import FinalCta from "./home/components/FinalCta";
import StickyCtaBar from "./home/components/StickyCtaBar";
import HashScroll from "./components/HashScroll";

export default function HomePage() {
  return (
    <main className="fydaa-home w-full m-0 p-0 relative">
      <HashScroll />
      <Hero />
      <AmcStrip />
      <Dreams />
      <DirectPlanSection />
      <PurposeSection />
      <TrustSection />
      <AdvisorySection />
      <Testimonials />
      <FaqSection />
      <FinalCta />
      <StickyCtaBar />
    </main>
  );
}
