import type { Viewport } from "next";
import "@/features/home/styles/home.css";
import HashScroll from "@/components/HashScroll";
import { siteConfig } from "@/config/site";
import { Advisers } from "@/features/home/sections/Advisers";
import { Features } from "@/features/home/sections/Features";
import { GoalsApp } from "@/features/home/sections/GoalsApp";
import { Hero } from "@/features/home/sections/Hero";
import { MomentLoader } from "@/features/home/sections/MomentLoader";
import { HOME_QUESTIONS, Questions } from "@/features/home/sections/Questions";
import { Steps } from "@/features/home/sections/Steps";
import { JsonLd } from "@/lib/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { faqPageJsonLd } from "@/lib/seo/structured-data";

/** The browser's chrome takes the page's ground (canvas in tailwind.config.ts). */
export const viewport: Viewport = { themeColor: "#F7F6F2" };

export const metadata = pageMetadata({
  title: "Fydaa: goal-based mutual fund SIPs and a SEBI-registered adviser",
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

/*
 * The home page, built to tasteskill 2.5.1 (DESIGN.md, "Editorial and exact").
 * kind software · palette: Fydaa's own (warm off-white, forest ink, jade) · type Mona Sans + DM Mono
 * hero split · nav nav-mega · footer footer-dark · close close-word · rhythm surface-pairs
 * buttons solid · mark: the logo · effect none · moment line-carries-colour (advisers)
 * Each section is one or two screens tall at 1440x900; the footer is the closing section.
 */
export default function HomePage() {
  return (
    <main id="top" className="home">
      <HashScroll />
      <Hero />
      <GoalsApp />
      <Features />
      <Advisers />
      <Steps />
      <Questions />
      <JsonLd data={faqPageJsonLd(HOME_QUESTIONS.map((item) => ({ question: item.q, answer: item.a })))} />
      <MomentLoader />
    </main>
  );
}
