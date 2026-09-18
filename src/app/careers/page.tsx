"use client";

import { Suspense, useEffect, useState } from "react";
import CareerHeroCard from "./CareerHeroCard";
import OpenPositionsSection from "./OpenPositionsSection";
import FyiapProgramBoxes from "./FyiapProgramBoxes";
import Pagedivider3 from "./pagedivider3";
import CareersFaq from "./CareersFaq";
import { fetchJobOpenings } from "./jobsData";
import type { JobOpening } from "./jobsData";

function OpenPositionsWithJobs({
  jobs,
  loading,
  error,
}: {
  jobs: JobOpening[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <Suspense fallback={null}>
      <OpenPositionsSection jobs={jobs} loading={loading} error={error} />
    </Suspense>
  );
}

const CareersPage = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobOpenings()
      .then(setJobs)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white font-inter text-ink antialiased">
      <CareerHeroCard jobCount={jobs.length} />
      <OpenPositionsWithJobs jobs={jobs} loading={loading} error={error} />
      <FyiapProgramBoxes />
      <Pagedivider3 />
      <CareersFaq />
    </main>
  );
};

export default CareersPage;
