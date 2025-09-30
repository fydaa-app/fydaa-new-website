import react from 'react';  
import HeroSection from './herosection';
import MissionSection from './MissionSection';
import FounderSection from './FounderSection';
import ServiceSection from './ServiceSection';
import FAQ from '../components/FAQ';
import BannerSection from './BannerSection';

const AboutPage = () => {
  return (
    <div>
      <MissionSection/>
      <FounderSection/>
      <ServiceSection/>
      <BannerSection/>
      {/* <HeroSection /> */}
      <FAQ />
    </div>
  );
};

export default AboutPage;