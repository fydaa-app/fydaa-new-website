'use client';

import YoungAdvisorProgram from "./heroSection";    
import CareerPath from "./carrerpath";
import WhyChooseFyiap from "./whyChooseFyip";
import ProgrammeStructure from "./programmStructure";
import CourseStructure from "./courseStructure";
import QuickComparison from "./quickComparison";
import SelectionProcess from "./selectionprocess";
import FAQSection from "./faq";
import ApplyForm from "./applyForm";
import CareerHeroCard from "../careers/CareerHeroCard";

const CareersPage = () => {
  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      <YoungAdvisorProgram/>
      <ProgrammeStructure />
      <CareerPath />
      <CourseStructure />
      <WhyChooseFyiap />
      <QuickComparison />
      <SelectionProcess />
      <FAQSection />
      <ApplyForm />
    </main>
  );
};

export default CareersPage;
