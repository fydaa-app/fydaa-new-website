'use client';

import CareerHeroCard from "./CareerHeroCard";
import OpenPositionsSection from "./OpenPositionsSection";
import Pagedivider3 from "./pagedivider3";
import FAQ from "../components/FAQ";
import { Suspense } from "react";

const CareersPage = () => {
  return (
    <main className="bg-[#F7F7F7]">
      <CareerHeroCard />
      <Suspense fallback={null}>
        <OpenPositionsSection />
      </Suspense>
      <Pagedivider3 />
      <FAQ />
    </main>
  );
};

export default CareersPage;