"use client";

import CareerHeroCard from "./CareerHeroCard";
import CareersFaq from "./CareersFaq";
import FyiapProgramBoxes from "./FyiapProgramBoxes";
import OpenPositionsSection from "./OpenPositionsSection";
import Pagedivider3 from "./pagedivider3";
import type { JobOpeningsResult } from "./types";

/** Careers page body. Jobs are fetched on the server and arrive pre-rendered. */
export default function CareersView({ jobs, error }: JobOpeningsResult) {
  return (
    <main className="min-h-screen bg-white font-inter text-ink antialiased">
      <CareerHeroCard jobCount={error ? null : jobs.length} />
      <OpenPositionsSection jobs={jobs} error={error} />
      <FyiapProgramBoxes />
      <Pagedivider3 />
      <CareersFaq />
    </main>
  );
}
