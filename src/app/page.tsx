import "./home/styles/home.css";
import Hero from "./home/components/Hero";
import AmcStrip from "./home/components/AmcStrip";
import ProductSections from "./home/components/ProductSections";
import PurposeSection from "./home/components/PurposeSection";
import TrustSection from "./home/components/TrustSection";
import AdvisorySection from "./home/components/AdvisorySection";
import Testimonials from "./home/components/Testimonials";
import FaqSection from "./home/components/FaqSection";
import FinalCta from "./home/components/FinalCta";
import Footer from "./home/components/Footer";

export default function HomePage() {
  return (
    <main className="fydaa-home w-full m-0 p-0 relative">
      <Hero />
      <AmcStrip />
      <ProductSections />
      <PurposeSection />
      <TrustSection />
      <AdvisorySection />
      <Testimonials />
      <FaqSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
