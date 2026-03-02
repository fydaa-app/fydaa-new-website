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

const CareersPage = () => {
  return (
    <main className="min-h-screen bg-[#F7F7F7] pb-16">
      <div className="pt-24 sm:pt-28 pb-12 bg-[#EFF9F6]">
        <YoungAdvisorProgram />
      </div>
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
