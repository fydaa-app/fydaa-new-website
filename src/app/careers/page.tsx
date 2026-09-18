'use client';

import CareerHeroCard from "./CareerHeroCard";
import OpenPositionsSection from "./OpenPositionsSection";
import Pagedivider3 from "./pagedivider3";
import { Suspense, useEffect, useState } from "react";
import { fetchJobOpenings } from "./jobsData";

const CareersPage = () => {
  const [jobCount, setJobCount] = useState(0);
  useEffect(() => {
    fetchJobOpenings()
      .then(jobs => setJobCount(jobs.length))
      .catch(() => setJobCount(0));
  }, []);
  return (
    <main className="bg-[#F7F7F7]">
      <CareerHeroCard jobCount={jobCount} />
      <Suspense fallback={null}>
        <OpenPositionsSection />
      </Suspense>
      <Pagedivider3 />
    </main>
  );
};

export default CareersPage;