import React from 'react';
import { ServiceData } from '@/data/services/types';
import VideoSection from './VideoSection';
import DebtFreedom from './FeatureSection';
import Testimonials from './Testimonials';
import FinancialSafety from './FinancialSafety';
import FAQ from './FAQ';
import HeroSection from './HeroSection';
interface ServiceLayoutProps {
  serviceData: ServiceData;
}

const ServiceLayout: React.FC<ServiceLayoutProps> = ({ serviceData }) => {
  return (
    <div className="relative">
      <HeroSection data={serviceData.heroSection} />
      <VideoSection data={serviceData.videoSection} />
      <DebtFreedom data={serviceData.featureSection} />
      <Testimonials testimonials={serviceData.testimonials} />
      <FAQ faqs={serviceData.faqs} />
      <FinancialSafety data={serviceData.financialSafety} />
    </div>
  );
};

export default ServiceLayout;
