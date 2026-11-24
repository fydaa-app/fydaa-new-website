"use client";

import { useState } from "react";
import { ProofBand, type ProofItem } from "@/components/layout/proof-band";
import { siteConfig } from "@/config/site";
import CareersFaq from "./CareersFaq";
import CareersHero from "./CareersHero";
import OpenPositionsSection from "./OpenPositionsSection";
import ProgrammeSection from "./ProgrammeSection";
import RegisterCvCta from "./RegisterCvCta";
import RegisterCvModal from "./RegisterCvModal";
import type { JobOpeningsResult } from "./types";

const { distributor, adviser } = siteConfig.entities;
const { address } = siteConfig.contact;

/** Who a candidate would be joining. Every line is checkable: registrations and the office address. */
const COMPANY_FACTS: ProofItem[] = [
  {
    title: "Goal-based investing",
    body: "People use Fydaa to invest in mutual funds for a goal, like a home, a child's education or retirement, and to see all their money in one place.",
  },
  {
    title: "Registered on both sides",
    body: `${distributor.legalName} is an AMFI-registered mutual fund distributor (${distributor.arn}). Advice comes from ${adviser.legalName}, a SEBI-registered investment adviser (${adviser.sebiRegistrationNumber}).`,
  },
  {
    title: "Our office",
    body: `${address.streetAddress}, ${address.addressLocality}. Each listing says where its role is based.`,
  },
  {
    title: "Check it yourself",
    body: "Both registrations are public. Look them up on the SEBI and AMFI websites before you apply.",
  },
];

/** Careers page body. Jobs are fetched on the server and arrive pre-rendered. */
export default function CareersView({ jobs, error }: JobOpeningsResult) {
  const [registerCvOpen, setRegisterCvOpen] = useState(false);
  const openRegisterCv = () => setRegisterCvOpen(true);

  return (
    <main className="min-h-screen bg-white text-ink antialiased">
      <RegisterCvModal open={registerCvOpen} onClose={() => setRegisterCvOpen(false)} />
      <CareersHero jobCount={error ? null : jobs.length} onRegisterCv={openRegisterCv} />
      <OpenPositionsSection jobs={jobs} error={error} onRegisterCv={openRegisterCv} />
      <ProgrammeSection />
      <ProofBand title="The company you'd join" items={COMPANY_FACTS} />
      <CareersFaq />
      <RegisterCvCta onRegisterCv={openRegisterCv} />
    </main>
  );
}
