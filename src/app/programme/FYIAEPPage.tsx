"use client";

import Image from "next/image";
import { useState, useEffect, useRef, type ReactNode, type KeyboardEvent, type ChangeEvent, type InputHTMLAttributes } from "react";
import {
  sendFyiaepOtp,
  verifyFyiaepOtp,
  saveFyiaepStep,
  getFyiaepToken,
  getFyiaepApplication,
  mapApplicationToForm,
  inferResumeStepFromStatus,
  isFyiaepSessionExpiredError,
  isFyiaepPaymentCompleted,
  isFyiaepCancelled,
  isFyiaepPaymentFailed,
  isFyiaepAwaitingPayment,
  isFyiaepAlreadyPaidError,
  isCoursePaymentCaptureSuccess,
  shouldSkipFyiaepSubmit,
  submitFyiaepApplication,
  createCoursePayment,
  openFyiaepCourseCheckout,
  FYIAEP_SESSION_EXPIRED,
  FYIAEP_PAYMENT_DISMISSED,
} from "../config/fyiaepApi";

type FormState = Record<string, unknown>;
type UploadsState = Record<string, File[]>;
type ErrorsState = Record<string, boolean>;
type FieldSetter = (name: string, val: string) => void;
type ChipPicker = (name: string, val: string) => void;
type CheckSetter = (name: string, val: boolean) => void;
type FileAdder = (name: string, fileList: FileList | File[]) => void;
type FileRemover = (name: string, index: number) => void;
type PageView = "landing" | "verify-mobile" | "enter-otp" | "form";

function asStr(value: unknown): string {
  if (value === undefined || value === null) return "";
  return String(value);
}

/* ══════════════════════════════════════
   ICONS
   ══════════════════════════════════════ */
const CheckIcon = ({ dark = false }: { dark?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[3px]">
    <path d="M3.5 8.5L6.5 11.5L12.5 5.5" stroke={dark ? "#6EE7B7" : "#0C4A3E"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = ({ className = "" }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={`ml-1.5 ${className}`}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="3" stroke="#A3A3A3" strokeWidth="1.5" />
  </svg>
);

const FileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M4 14h8a1 1 0 001-1V5l-4-4H4a1 1 0 00-1 1v11a1 1 0 001 1z" stroke="#A3A3A3" strokeWidth="1.2" />
    <path d="M9 1v4h4" stroke="#A3A3A3" strokeWidth="1.2" />
  </svg>
);

/* ══════════════════════════════════════
   SMALL COMPONENTS
   ══════════════════════════════════════ */
const Pill = ({ children }: { children: ReactNode }) => (
  <span className="inline-block bg-jade-tint text-jade-deep text-[11px] font-semibold px-3.5 py-[5px] rounded-full tracking-[0.04em] uppercase">
    {children}
  </span>
);

const FYIAEP_BROCHURE_PDF = "/brochure/fyiaep.pdf";

/* ══════════════════════════════════════
   HERO
   ══════════════════════════════════════ */
function Hero({ onApply }: { onApply: () => void }) {
  return (
    <section className="pt-24 sm:pt-28 md:pt-[140px] px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-[88px] relative overflow-hidden bg-jade">
      {/* Hero image: same full-bleed cover on all sizes; mobile focuses on the person */}
      <div
        className="absolute inset-0 bg-cover bg-[70%_20%] sm:bg-[60%_25%] md:bg-[center_30%]"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink/70 via-jade/55 to-ink/50 md:from-ink/55 md:via-jade/45 md:to-ink/40" />

      <div className="max-w-[800px] md:pl-12 lg:pl-20 relative z-[1]">
        <h1 className="text-[28px] sm:text-[36px] md:text-[clamp(30px,5.5vw,52px)] leading-[1.12] sm:leading-[1.08] text-white tracking-[-0.035em] mb-4 sm:mb-5 md:mb-[22px] max-w-[680px]">
          <span className="font-normal">Become an industry-ready</span>
          <span className="font-normal block">investment adviser</span>
          <span className="font-bold text-jade-300">in 4 months.</span>
        </h1>

        <p className="text-[14px] sm:text-[16px] md:text-[17px] text-white/70 leading-relaxed max-w-[480px] mb-6 sm:mb-8 md:mb-9">
          Get NISM certified, gain real client experience, and launch your financial advisory career.
          Powered by Fydaa, a SEBI Registered Investment Adviser.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button onClick={onApply} className="w-full sm:w-auto justify-center px-6 sm:px-9 py-3 sm:py-3.5 bg-white text-jade border-none rounded-[10px] text-[14px] sm:text-[15px] font-bold cursor-pointer font-sans tracking-[-0.01em] inline-flex items-center hover:-translate-y-px transition-transform">
            Apply Now <ArrowIcon />
          </button>
          <a
            href={FYIAEP_BROCHURE_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto justify-center px-6 sm:px-9 py-3 sm:py-3.5 bg-transparent border border-white/30 rounded-[10px] text-[14px] sm:text-[15px] font-semibold text-white cursor-pointer font-sans hover:bg-white/10 transition-colors inline-flex items-center text-center no-underline"
          >
            Learn more
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 md:gap-10 mt-10 sm:mt-12 md:mt-14 border-t border-white/10 pt-6 sm:pt-7">
          {[
            ["4 months", "Programme duration"],
            ["NISM XA + XB", "Dual certification"],
            ["SEBI RIA", "Industry-backed"],
          ].map(([val, label]) => (
            <div key={val}>
              <div className="text-lg sm:text-xl font-bold text-white tracking-[-0.03em]">{val}</div>
              <div className="text-[12px] sm:text-[13px] text-white/50 mt-0.5 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   JOURNEY
   ══════════════════════════════════════ */
const JOURNEY = [
  { num: "01", period: "Month 1-2", title: "Foundation & Certification", points: ["Investment concepts, mutual funds, insurance, and tax planning", "Financial planning and goal-based investing", "NISM XA & XB exam prep with 1000+ practice questions", "Daily doubt-clearing and live sessions"] },
  { num: "02", period: "Month 3", title: "On-Field Training", points: ["Client interaction and customer onboarding practice", "CRM orientation and meeting documentation", "Business development activities in live settings", "Professional conduct and advisory process training"] },
  { num: "03", period: "Month 4", title: "Live Implementation", points: ["Manage real prospects and build financial plans", "Present investment solutions to actual clients", "Performance evaluation and mentorship reviews", "Complete documentation and CRM reporting"] },
];

function Journey() {
  return (
    <section id="journey" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-[1000px] mx-auto">
      <Pill>Programme Structure</Pill>
      <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-[-0.03em] text-ink mt-3.5">Your 4-month journey</h2>
      <p className="text-[14px] sm:text-[15px] text-grey-600 mt-2 leading-relaxed max-w-[440px]">
        Each phase builds on the last, from theory to certification to real-world practice.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 sm:mt-10 md:mt-12">
        {JOURNEY.map((j) => (
          <div key={j.num} className="bg-white rounded-2xl p-5 sm:p-7 border border-grey-200 shadow-card flex flex-col gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-3xl sm:text-4xl font-bold text-grey-150 tracking-[-0.04em] leading-none">{j.num}</span>
              <span className="text-[11px] font-semibold text-grey-500 bg-grey-100 px-2.5 py-1 rounded-md">{j.period}</span>
            </div>
            <h3 className="text-[16px] sm:text-[17px] font-bold text-ink tracking-[-0.01em]">{j.title}</h3>
            <ul className="flex flex-col gap-2">
              {j.points.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-grey-600 leading-relaxed">
                  <CheckIcon /><span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   CURRICULUM
   ══════════════════════════════════════ */
const CURRICULUM = [
  "Financial Planning & Goal-Based Investing", "Mutual Funds & Investment Products",
  "Insurance & Tax Planning", "Portfolio Construction",
  "Risk Profiling & Financial Health Check-ups", "Client Advisory Process",
  "CRM & Professional Documentation", "Business Development & Client Acquisition",
];

function Curriculum({ onApply }: { onApply: () => void }) {
  return (
    <section className="bg-grey-100">
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
          <div>
            <Pill>Curriculum</Pill>
            <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-[-0.03em] mt-3.5">What you'll learn</h2>
            <p className="text-[14px] sm:text-[15px] text-grey-600 mt-2 leading-relaxed">
              An industry-integrated curriculum designed by SEBI-registered advisers.
            </p>
            <button onClick={onApply} className="mt-5 sm:mt-6 w-full sm:w-auto justify-center px-6 sm:px-7 py-3 bg-jade text-white border-none rounded-[10px] text-[14px] sm:text-[15px] font-bold cursor-pointer font-sans tracking-[-0.01em] inline-flex items-center hover:bg-jade-hover transition-colors">
              Start your application <ArrowIcon />
            </button>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-grey-200 shadow-card">
            <ul>
              {CURRICULUM.map((c, i) => (
                <li key={c} className={`flex gap-2.5 items-start py-3 text-[14px] sm:text-[15px] text-ink font-medium leading-normal ${i < CURRICULUM.length - 1 ? "border-b border-grey-200" : ""}`}>
                  <CheckIcon /><span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   HIGHLIGHTS
   ══════════════════════════════════════ */
const HIGHLIGHTS = [
  ["Hybrid Learning", "Live sessions combined with recorded modules. Learn at your pace without losing expert access."],
  ["NISM Dual Certification", "Complete preparation for both NISM Series X-A and X-B examinations."],
  ["Real Client Exposure", "Interact with actual clients under guided mentorship, not simulations."],
  ["Business Development", "Learn client acquisition, professional documentation, and CRM tools."],
  ["Expert Mentorship", "Guidance from SEBI-registered investment advisers and industry practitioners."],
  ["Career Launchpad", "Graduate industry-ready with real advisory experience on your resume."],
];

function Highlights() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-[1000px] mx-auto text-center">
      <Pill>Why FYIAEP</Pill>
      <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold tracking-[-0.03em] mt-3.5 mx-auto">Not just another certification course</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-8 sm:mt-10 md:mt-12">
        {HIGHLIGHTS.map(([title, desc]) => (
          <div key={title} className="p-5 sm:p-6 rounded-[14px] border border-grey-200 bg-white text-left hover:border-jade-200 hover:shadow-card-hover transition-all">
            <h4 className="text-base font-bold text-ink tracking-[-0.01em] mb-1.5">{title}</h4>
            <p className="text-sm text-grey-600 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   WHO IS THIS FOR
   ══════════════════════════════════════ */
const AUDIENCES = [
  "Final-year students and graduates in Commerce, Finance, or Management",
  "Working professionals transitioning into financial advisory",
  "Finance enthusiasts who want a structured industry pathway",
  "Anyone who wants NISM certification with real client experience",
];

function WhoIsThisFor() {
  return (
    <section
      className="w-full overflow-hidden"
      style={{
        backgroundColor: "#0A0A0A",
        backgroundImage:
          "radial-gradient(ellipse 100% 120% at 0% 100%, rgba(4,120,87,0.35) 0%, transparent 55%), radial-gradient(ellipse 80% 100% at 100% 0%, rgba(12,74,62,0.25) 0%, transparent 50%)",
      }}
    >
      <div className="max-w-[1000px] mx-auto py-14 sm:py-16 md:py-[72px] px-5 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
        <div className="min-w-0">
          <p
            className="text-[10px] font-semibold uppercase mb-3 tracking-[0.08em]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Who is this for
          </p>
          <h2
            className="text-[24px] sm:text-[26px] font-bold tracking-[-0.03em] leading-[1.15]"
            style={{ color: "#FFFFFF" }}
          >
            Students, graduates, career switchers, and finance enthusiasts
          </h2>
        </div>
        <ul className="flex flex-col gap-3.5 min-w-0">
          {AUDIENCES.map((a) => (
            <li
              key={a}
              className="flex gap-2.5 items-start text-[14px] sm:text-[15px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              <CheckIcon dark />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   ABOUT FYDAA
   ══════════════════════════════════════ */
function AboutFydaa() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-[1000px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="min-w-0">
          <Pill>About Fydaa</Pill>
          <h2 className="text-[22px] sm:text-[24px] md:text-[26px] font-bold tracking-[-0.03em] mt-3.5">
            Learn from a SEBI Registered Investment Adviser
          </h2>
          <p className="text-[14px] sm:text-[15px] text-grey-600 leading-[1.7] mt-3">
            Fydaa (Multistrato Capital Advisors Pvt. Ltd.) is committed to making financial planning
            accessible through technology and expert guidance.
          </p>
          <div className="mt-5 flex flex-col sm:inline-flex sm:flex-row gap-px bg-grey-200 rounded-xl overflow-hidden w-full sm:w-auto">
            {[["SEBI Registration", "INA000015969"], ["ARN", "358522"]].map(([l, v]) => (
              <div key={l} className="bg-grey-100 px-5 sm:px-6 py-3.5 flex-1 sm:flex-none">
                <div className="text-[10px] font-semibold text-grey-500 tracking-[0.06em] uppercase">{l}</div>
                <div className="text-base font-bold text-ink mt-0.5 tracking-[-0.02em]">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[220px] sm:w-[260px] mx-auto lg:mx-0 lg:ml-auto text-center">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
            <Image
              src="/programme/course1.jpg"
              alt="Prof. Sheetal Kunder"
              fill
              className="object-cover object-center"
              sizes="260px"
            />
          </div>
          <p className="mt-3 text-[15px] sm:text-base font-bold text-ink tracking-[-0.02em]">
            Prof. Sheetal Kunder
          </p>
          <p className="mt-1 text-[13px] text-grey-500">
            19 Years in Finance | Mentored 11,000+ Students
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   FOOTER
   ══════════════════════════════════════ */
function ProgrammeFooter() {
  return (
    <footer className="py-7 px-6 border-t border-grey-200">
      <div className="max-w-[1000px] mx-auto flex justify-center items-center flex-wrap gap-6 sm:gap-8">
        <div className="flex gap-1.5 items-center">
          <PhoneIcon />
          <span className="text-[11px] text-grey-400">Counsellor</span>
          <a href="tel:+919987308778" className="text-xs text-grey-600 no-underline font-semibold">
            +91 99873 08778
          </a>
        </div>
        <div className="flex gap-1.5 items-center">
          <PhoneIcon />
          <span className="text-[11px] text-grey-400">Support</span>
          <a href="tel:+919503359949" className="text-xs text-grey-600 no-underline font-semibold">
            +91 95033 59949
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════
   CTA — TWO PROGRAMME CARDS
   ══════════════════════════════════════ */
function CTACard({ onApply }: { onApply: () => void }) {
  const cards = [
    {
      badge: "Full Programme",
      title: "4-Month FYIAEP Programme",
      description:
        "Complete programme with NISM X-A & X-B preparation, on-field training, live client exposure and mentorship, including an opportunity to build a career with Fydaa.",
      fee: "₹35,000",
      feeNote:
        "Includes NISM X-A & X-B prep, on-field training, mentorship and career opportunity.",
    },
    {
      badge: "Already NISM Certified?",
      title: "2-Month On-Field Programme",
      description:
        "For NISM Series X-A & X-B certified candidates. Focused hands-on advisory experience, client interactions and a hiring opportunity with Fydaa.",
      fee: "₹17,500",
      feeNote:
        "Hands-on advisory experience, client interactions and hiring opportunity.",
    },
  ];

  return (
    <section className="px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-20">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center max-w-[560px] mx-auto mb-8 sm:mb-10">
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-grey-400 mb-3">
            Ready to start your advisory career?
          </p>
          <h2 className="text-[24px] sm:text-[28px] md:text-[30px] font-bold tracking-[-0.03em] leading-[1.2] text-ink mb-3">
            From training to your career at Fydaa.
          </h2>
          <p className="text-[14px] sm:text-[15px] text-grey-600 leading-relaxed">
            Submit your application today. Our admissions team will review it and get back to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-[20px] sm:rounded-[22px] p-5 sm:p-6 flex flex-col"
              style={{
                backgroundColor: "#0C4A3E",
                backgroundImage:
                  "radial-gradient(ellipse 90% 70% at 15% 0%, rgba(4,120,87,0.55) 0%, transparent 55%)",
              }}
            >
              <span className="inline-flex items-center gap-1.5 self-start text-[11px] font-semibold text-white tracking-[0.02em] px-2.5 py-1 rounded-full mb-4 bg-black/25">
                <span className="w-1.5 h-1.5 rounded-full bg-jade-300 shrink-0" aria-hidden />
                {card.badge}
              </span>

              <h3 className="text-[20px] sm:text-[22px] font-bold text-white tracking-[-0.03em] leading-snug mb-2.5">
                {card.title}
              </h3>
              <p className="text-[13px] sm:text-[14px] leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>
                {card.description}
              </p>

              <div className="bg-white rounded-[14px] p-4 sm:p-5 mb-5">
                <div className="flex justify-between items-center mb-2 gap-2">
                  <div className="text-[11px] font-semibold text-grey-500 tracking-[0.06em] uppercase">
                    Programme Fee
                  </div>
                  <span className="text-[11px] font-semibold text-jade-deep bg-jade-tint px-2.5 py-[3px] rounded-full tracking-[0.03em] shrink-0">
                    One-time
                  </span>
                </div>
                <div className="text-[22px] sm:text-[24px] font-bold text-ink tracking-[-0.02em]">
                  {card.fee}{" "}
                  <span className="text-[14px] font-medium text-grey-500">+ taxes</span>
                </div>
                <p className="text-[12px] text-grey-500 leading-relaxed mt-2">
                  {card.feeNote}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 mt-auto">
                <button
                  type="button"
                  onClick={onApply}
                  className="w-full sm:flex-1 justify-center px-5 py-3 border-none rounded-[10px] text-sm font-bold cursor-pointer font-sans inline-flex items-center hover:-translate-y-px transition-transform bg-white text-ink"
                >
                  Apply Now <ArrowIcon />
                </button>
                <a
                  href={FYIAEP_BROCHURE_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 justify-center px-5 py-3 rounded-[10px] text-sm font-semibold cursor-pointer font-sans inline-flex items-center gap-1.5 transition-colors no-underline text-white border border-white/30 hover:bg-white/10"
                >
                  Details <ArrowIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════
   FORM HELPERS
   ══════════════════════════════════════ */
function RequiredMark() {
  return <span className="text-red-500 ml-0.5" aria-hidden>*</span>;
}

function Field({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  error = false,
  maxLength,
  inputMode,
  transform,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: unknown;
  onChange: FieldSetter;
  required?: boolean;
  error?: boolean;
  maxLength?: number;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  transform?: (raw: string) => string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-grey-800 mb-1 tracking-[-0.01em]">
        {label}{required && <RequiredMark />}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={asStr(value)}
        maxLength={maxLength}
        inputMode={inputMode}
        autoCapitalize={transform ? "characters" : undefined}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(name, transform ? transform(raw) : raw);
        }}
        className={`w-full py-[11px] px-3.5 border rounded-[10px] text-[15px] font-sans text-ink outline-none bg-white transition-all focus:border-jade focus:ring-[3px] focus:ring-jade/[.08] placeholder:text-grey-400 ${
          error ? "border-red-400" : "border-grey-200"
        }`}
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  error = false,
}: {
  label: string;
  name: string;
  options: string[];
  value: unknown;
  onChange: FieldSetter;
  required?: boolean;
  error?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-grey-800 mb-1 tracking-[-0.01em]">
        {label}{required && <RequiredMark />}
      </label>
      <select
        value={asStr(value)} onChange={(e) => onChange(name, e.target.value)}
        className={`w-full py-[11px] px-3.5 border rounded-[10px] text-[15px] font-sans text-ink outline-none bg-white cursor-pointer focus:border-jade focus:ring-[3px] focus:ring-jade/[.08] ${
          error ? "border-red-400" : "border-grey-200"
        }`}
      >
        <option value="">Select</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Chips({
  label,
  name,
  options,
  value,
  onPick,
  required = false,
  error = false,
}: {
  label: string;
  name: string;
  options: string[];
  value: unknown;
  onPick: ChipPicker;
  required?: boolean;
  error?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-grey-800 mb-1 tracking-[-0.01em]">
        {label}{required && <RequiredMark />}
      </label>
      <div className={`flex flex-wrap gap-1.5 mt-0.5 ${error ? "rounded-xl p-1 ring-1 ring-red-300" : ""}`}>
        {options.map((o) => (
          <button key={o} type="button" onClick={() => onPick(name, o)}
            className={`py-2 px-4 rounded-full text-sm font-sans cursor-pointer transition-all border-[1.5px] ${
              value === o
                ? "border-jade bg-jade text-white font-semibold"
                : "border-grey-200 bg-white text-grey-600 font-normal"
            }`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextArea({
  label,
  name,
  placeholder = "",
  value,
  onChange,
  required = false,
  error = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  value: unknown;
  onChange: FieldSetter;
  required?: boolean;
  error?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-grey-800 mb-1 tracking-[-0.01em]">
        {label}{required && <RequiredMark />}
      </label>
      <textarea
        placeholder={placeholder} value={asStr(value)}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full py-[11px] px-3.5 border rounded-[10px] text-[15px] font-sans text-ink outline-none bg-white min-h-[80px] resize-y transition-all focus:border-jade focus:ring-[3px] focus:ring-jade/[.08] placeholder:text-grey-400 ${
          error ? "border-red-400" : "border-grey-200"
        }`}
      />
    </div>
  );
}

function Upload({
  label,
  name,
  files,
  onAdd,
  onRemove,
  required = false,
  error = false,
}: {
  label: string;
  name: string;
  files: File[] | undefined;
  onAdd: FileAdder;
  onRemove: FileRemover;
  required?: boolean;
  error?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-grey-800 mb-1 tracking-[-0.01em]">
        {label}{required && <RequiredMark />}
      </label>
      <div className={`border-[1.5px] border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          error
            ? "border-red-400 bg-red-50"
            : "border-grey-300 bg-grey-50 hover:border-jade hover:bg-jade-tint"
        }`}
        onClick={() => document.getElementById(`upload-${name}`)?.click()}>
        <input
          id={`upload-${name}`}
          type="file"
          multiple
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) onAdd(name, e.target.files);
          }}
        />
        <span className="text-sm font-semibold text-jade">Click to upload</span>
        <p className="text-[13px] text-grey-400 mt-1">PDF, JPG, PNG up to 5 MB</p>
      </div>
      {(files || []).map((f, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-grey-100 rounded-lg mt-1.5 text-[13px] text-grey-600">
          <FileIcon />
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{f.name}</span>
          <button onClick={() => onRemove(name, i)} className="bg-none border-none text-grey-400 cursor-pointer text-sm px-1.5">✕</button>
        </div>
      ))}
    </div>
  );
}

function Checkbox({
  name,
  label,
  checked,
  onCheck,
}: {
  name: string;
  label: string;
  checked: unknown;
  onCheck: CheckSetter;
}) {
  return (
    <label className="flex gap-2.5 items-start py-2 cursor-pointer">
      <input type="checkbox" checked={!!checked} onChange={(e) => onCheck(name, e.target.checked)}
        className="w-[18px] h-[18px] accent-jade shrink-0 mt-0.5 cursor-pointer" />
      <span className="text-sm text-grey-600 leading-relaxed">{label}</span>
    </label>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return <div className="text-sm font-bold text-jade-deep mt-7 mb-3.5 pb-2 border-b border-grey-200 first:mt-0">{children}</div>;
}

/* ══════════════════════════════════════
   ANNEXURE BLOCK
   ══════════════════════════════════════ */
function AnnexureBlock({
  title,
  body,
  items,
}: {
  title: string;
  body: ReactNode;
  items: string[];
}) {
  return (
    <div className="bg-grey-50 border border-grey-200 rounded-[14px] p-6 mb-4">
      <h4 className="text-base font-bold text-ink tracking-[-0.01em] mb-2.5">{title}</h4>
      <div className="text-sm text-grey-600 leading-relaxed mb-3.5">{body}</div>
      {items.length > 0 && (
        <ul className="flex flex-col gap-1.5 my-2.5">
          {items.map((t, i) => (
            <li key={i} className="flex gap-2 items-start text-sm text-grey-600 leading-normal">
              <CheckIcon />{t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   STEP VALIDATION
   ══════════════════════════════════════ */
function isFilled(val: unknown) {
  return val !== undefined && val !== null && String(val).trim() !== "";
}

function hasUpload(uploads: UploadsState, name: string) {
  return Array.isArray(uploads[name]) && uploads[name].length > 0;
}

const PROGRAMME_OPTIONS = [
  {
    id: "full",
    badge: "Full Programme",
    badgeTone: "neutral" as const,
    title: "4-Month FYIAEP",
    description:
      "Complete programme with NISM X-A & X-B preparation, on-field training, live client exposure and mentorship, including an opportunity to build a career with Fydaa.",
    feeLabel: "₹35,000",
    feeAmount: 35000,
    selectionLabel: "4-Month FYIAEP Programme",
  },
  {
    id: "onfield",
    badge: "NISM Certified",
    badgeTone: "jade" as const,
    title: "2-Month On-Field",
    description:
      "For NISM Series X-A & X-B certified candidates. Focused hands-on advisory experience, client interactions and a hiring opportunity with Fydaa.",
    feeLabel: "₹17,500",
    feeAmount: 17500,
    selectionLabel: "2-Month On-Field Programme",
  },
] as const;

function getProgrammeOption(id: unknown) {
  return PROGRAMME_OPTIONS.find((p) => p.id === id) || null;
}

const PROGRAMME_SELECTION_KEY = "fyiaep_selected_programme";

function persistSelectedProgramme(id: string) {
  if (typeof window === "undefined") return;
  if (id) sessionStorage.setItem(PROGRAMME_SELECTION_KEY, id);
  else sessionStorage.removeItem(PROGRAMME_SELECTION_KEY);
}

function clearPersistedProgramme() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PROGRAMME_SELECTION_KEY);
}

/** 2-month track requires Passed on both NISM exams + at least 2 uploaded NISM docs. */
function isNismCertifiedForOnField(form: FormState, uploads: UploadsState) {
  const bothPassed = form.nismXA === "Passed" && form.nismXB === "Passed";
  const certCount =
    (Array.isArray(uploads.nismCertDoc) ? uploads.nismCertDoc.filter(Boolean).length : 0) +
    (Array.isArray(uploads.nismScorecard) ? uploads.nismScorecard.filter(Boolean).length : 0);
  return bothPassed && certCount >= 2;
}

/** Indian PAN: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F) */
function isValidPan(val: unknown) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(val ?? "").trim().toUpperCase());
}

/** Last 4 digits of Aadhaar only */
function isValidAadhaarLast4(val: unknown) {
  return /^[0-9]{4}$/.test(String(val ?? "").trim());
}

function normalizePanInput(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

function normalizeAadhaarLast4Input(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 4);
}

/** Indian mobile: exactly 10 digits */
function isValidMobile10(val: unknown) {
  return /^[0-9]{10}$/.test(String(val ?? "").replace(/\D/g, ""));
}

function normalizeMobile10Input(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 10);
}

/** Compare names ignoring case / extra spaces */
function normalizePersonName(val: unknown) {
  return String(val ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isSamePersonName(a: unknown, b: unknown) {
  const left = normalizePersonName(a);
  const right = normalizePersonName(b);
  return left.length > 0 && right.length > 0 && left === right;
}

function validateStep(step: number, form: FormState, uploads: UploadsState) {
  const missing: string[] = [];
  let message = "Please fill all required fields marked with * before continuing.";

  const need = (fields: string[]) => {
    fields.forEach((f) => {
      if (!isFilled(form[f])) missing.push(f);
    });
  };

  if (step === 0) {
    need([
      "fullName", "gender", "dob", "whatsapp", "email", "pan", "aadhaar",
      "maritalStatus", "guardian", "emergencyContact", "emergencyRelation",
      "emergencyPhone", "medicalCondition",
      "permHouse", "permStreet", "permCity", "permDistrict", "permState", "permPin",
    ]);
    if (form.medicalCondition === "Yes" && !isFilled(form.medicalDetails)) {
      missing.push("medicalDetails");
    }
    if (!form.sameAddress) {
      need(["currHouse", "currStreet", "currCity", "currDistrict", "currState", "currPin"]);
    }
    if (isFilled(form.emergencyContact) && isSamePersonName(form.emergencyContact, form.fullName)) {
      if (!missing.includes("emergencyContact")) missing.push("emergencyContact");
      message = "Emergency contact person cannot be the same as your full name.";
    }

    const wa = String(form.whatsapp || "").replace(/\D/g, "");
    if (isFilled(form.whatsapp) && !isValidMobile10(wa)) {
      if (!missing.includes("whatsapp")) missing.push("whatsapp");
      message = "Enter a valid 10-digit WhatsApp number.";
    }
    const ep = String(form.emergencyPhone || "").replace(/\D/g, "");
    if (isFilled(form.emergencyPhone) && !isValidMobile10(ep)) {
      if (!missing.includes("emergencyPhone")) missing.push("emergencyPhone");
      if (message === "Please fill all required fields marked with * before continuing." || message.startsWith("Enter a valid 10-digit WhatsApp")) {
        message = missing.includes("whatsapp") && !isValidMobile10(wa)
          ? "Enter valid 10-digit WhatsApp and emergency contact numbers."
          : "Enter a valid 10-digit emergency contact number.";
      }
    }

    if (isFilled(form.pan) && !isValidPan(form.pan)) {
      if (!missing.includes("pan")) missing.push("pan");
      message = "Enter a valid PAN (e.g. ABCDE1234F).";
    }
    if (isFilled(form.aadhaar) && !isValidAadhaarLast4(form.aadhaar)) {
      if (!missing.includes("aadhaar")) missing.push("aadhaar");
      message =
        missing.includes("pan") && !isValidPan(form.pan)
          ? "Enter a valid PAN and the last 4 digits of Aadhaar."
          : "Enter the last 4 digits of your Aadhaar number.";
    }
  }

  if (step === 1) {
    need(["nismXA", "nismXB", "registeredXA", "registeredXB", "previouslyAppeared", "needGuidance"]);
    if (form.nismXA === "Passed") need(["nismXA_cert", "nismXA_date", "nismXA_valid"]);
    if (form.nismXB === "Passed") need(["nismXB_cert", "nismXB_date", "nismXB_valid"]);
    if (form.previouslyAppeared === "Yes" && !isFilled(form.attemptDetails)) {
      missing.push("attemptDetails");
    }
  }

  if (step === 2) {
    need([
      "professionalStatus", "currentOrg", "designation", "workExperience", "industry",
      "workMode", "fieldActivities", "reasonJoining",
      "currentCity", "currentState", "willingToTravel", "needTravelSupport",
      "clientFacing", "preferredLang",
    ]);
  }

  if (step === 4) {
    ["photo", "panCard", "aadhaarCard", "gradCert"].forEach((name) => {
      if (!hasUpload(uploads, name)) missing.push(name);
    });
  }

  if (step === 5) {
    need(["esign_name", "esign_date", "esign_place", "esign_sig"]);
    if (!form.allAnnex_agree) missing.push("allAnnex_agree");
  }

  if (step === 6) {
    if (!isFilled(form.selectedProgramme)) {
      missing.push("selectedProgramme");
      message = "Please select a programme to continue.";
    } else if (
      form.selectedProgramme === "onfield" &&
      !isNismCertifiedForOnField(form, uploads)
    ) {
      missing.push("selectedProgramme");
      message = "This programme is only for NISM certified candidates";
    }
  }

  if (missing.length === 0) return null;
  return {
    fields: missing,
    message,
  };
}

/* ══════════════════════════════════════
   FORM STEPS CONFIG
   ══════════════════════════════════════ */
function getSteps(
  form: FormState,
  set: FieldSetter,
  pick: ChipPicker,
  uploads: UploadsState,
  addFile: FileAdder,
  rmFile: FileRemover,
  chk: CheckSetter,
  errors: ErrorsState = {},
) {
  const err = (name: string) => !!errors[name];
  return [
    {
      title: "Personal Details", sub: "Section A: Basic information and contact details", short: "Personal",
      render: () => (
        <>
          <SubHeading>Basic Information</SubHeading>
          <Field label="Full Name (as per PAN / Aadhaar)" name="fullName" placeholder="Your full legal name" value={form.fullName} onChange={set} required error={err("fullName")} />
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Chips label="Gender" name="gender" options={["Male", "Female", "Other", "Prefer not to say"]} value={form.gender} onPick={pick} required error={err("gender")} />
            <Field label="Date of Birth" name="dob" type="date" value={form.dob} onChange={set} required error={err("dob")} />
          </div>
          <Field
            label="WhatsApp Number"
            name="whatsapp"
            type="tel"
            placeholder="10-digit mobile number"
            value={form.whatsapp}
            onChange={set}
            required
            error={err("whatsapp")}
            maxLength={10}
            inputMode="numeric"
            transform={normalizeMobile10Input}
          />
          <Field label="Email Address" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={set} required error={err("email")} />
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Field
              label="PAN Number"
              name="pan"
              placeholder="ABCDE1234F"
              value={form.pan}
              onChange={set}
              required
              error={err("pan")}
              maxLength={10}
              inputMode="text"
              transform={normalizePanInput}
            />
            <Field
              label="Aadhaar Number (last 4 digits only)"
              name="aadhaar"
              placeholder="1234"
              value={form.aadhaar}
              onChange={set}
              required
              error={err("aadhaar")}
              maxLength={4}
              inputMode="numeric"
              transform={normalizeAadhaarLast4Input}
            />
          </div>
          <Chips label="Marital Status" name="maritalStatus" options={["Single", "Married", "Other"]} value={form.maritalStatus} onPick={pick} required error={err("maritalStatus")} />
          <Field label="Father's / Mother's / Guardian's Name" name="guardian" value={form.guardian} onChange={set} required error={err("guardian")} />
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Field label="Emergency Contact Person" name="emergencyContact" value={form.emergencyContact} onChange={set} required error={err("emergencyContact")} />
            <Field label="Relationship" name="emergencyRelation" value={form.emergencyRelation} onChange={set} required error={err("emergencyRelation")} />
          </div>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Field
              label="Emergency Contact Number"
              name="emergencyPhone"
              type="tel"
              placeholder="10-digit mobile number"
              value={form.emergencyPhone}
              onChange={set}
              required
              error={err("emergencyPhone")}
              maxLength={10}
              inputMode="numeric"
              transform={normalizeMobile10Input}
            />
            <Field label="Blood Group (optional)" name="bloodGroup" value={form.bloodGroup} onChange={set} />
          </div>
          <Chips label="Medical condition relevant to travel or field activity?" name="medicalCondition" options={["No", "Yes"]} value={form.medicalCondition} onPick={pick} required error={err("medicalCondition")} />
          {form.medicalCondition === "Yes" && <Field label="Please specify" name="medicalDetails" value={form.medicalDetails} onChange={set} required error={err("medicalDetails")} />}

          <SubHeading>Permanent Address</SubHeading>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Field label="House / Flat No." name="permHouse" value={form.permHouse} onChange={set} required error={err("permHouse")} />
            <Field label="Street / Area" name="permStreet" value={form.permStreet} onChange={set} required error={err("permStreet")} />
          </div>
          <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
            <Field label="City" name="permCity" value={form.permCity} onChange={set} required error={err("permCity")} />
            <Field label="District" name="permDistrict" value={form.permDistrict} onChange={set} required error={err("permDistrict")} />
            <Field label="State" name="permState" value={form.permState} onChange={set} required error={err("permState")} />
          </div>
          <Field label="PIN Code" name="permPin" value={form.permPin} onChange={set} required error={err("permPin")} />

          <SubHeading>Current Residential Address</SubHeading>
          <Checkbox name="sameAddress" label="Same as permanent address" checked={form.sameAddress} onCheck={chk} />
          {!form.sameAddress && (
            <>
              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <Field label="House / Flat No." name="currHouse" value={form.currHouse} onChange={set} required error={err("currHouse")} />
                <Field label="Street / Area" name="currStreet" value={form.currStreet} onChange={set} required error={err("currStreet")} />
              </div>
              <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                <Field label="City" name="currCity" value={form.currCity} onChange={set} required error={err("currCity")} />
                <Field label="District" name="currDistrict" value={form.currDistrict} onChange={set} required error={err("currDistrict")} />
                <Field label="State" name="currState" value={form.currState} onChange={set} required error={err("currState")} />
              </div>
              <Field label="PIN Code" name="currPin" value={form.currPin} onChange={set} required error={err("currPin")} />
            </>
          )}
        </>
      ),
    },
    {
      title: "NISM Certification", sub: "Section B: Certification status and examination details", short: "NISM",
      render: () => (
        <>
          <SubHeading>Existing NISM Qualifications</SubHeading>
          <Chips label="NISM Series X-A: Investment Adviser (Level 1)" name="nismXA" options={["Passed", "Appeared", "Not Attempted"]} value={form.nismXA} onPick={pick} required error={err("nismXA")} />
          {form.nismXA === "Passed" && (
            <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
              <Field label="Certificate No." name="nismXA_cert" value={form.nismXA_cert} onChange={set} required error={err("nismXA_cert")} />
              <Field label="Date of Passing" name="nismXA_date" type="date" value={form.nismXA_date} onChange={set} required error={err("nismXA_date")} />
              <Field label="Valid Till" name="nismXA_valid" type="date" value={form.nismXA_valid} onChange={set} required error={err("nismXA_valid")} />
            </div>
          )}
          <Chips label="NISM Series X-B: Investment Adviser (Level 2)" name="nismXB" options={["Passed", "Appeared", "Not Attempted"]} value={form.nismXB} onPick={pick} required error={err("nismXB")} />
          {form.nismXB === "Passed" && (
            <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
              <Field label="Certificate No." name="nismXB_cert" value={form.nismXB_cert} onChange={set} required error={err("nismXB_cert")} />
              <Field label="Date of Passing" name="nismXB_date" type="date" value={form.nismXB_date} onChange={set} required error={err("nismXB_date")} />
              <Field label="Valid Till" name="nismXB_valid" type="date" value={form.nismXB_valid} onChange={set} required error={err("nismXB_valid")} />
            </div>
          )}
          <Field label="Any Other NISM Certification" name="nismOther" placeholder="e.g. NISM Mutual Fund Distributors" value={form.nismOther} onChange={set} />
          <SubHeading>Examination Details</SubHeading>
          <Chips label="Registered for NISM Series X-A?" name="registeredXA" options={["Yes", "No"]} value={form.registeredXA} onPick={pick} required error={err("registeredXA")} />
          <Chips label="Registered for NISM Series X-B?" name="registeredXB" options={["Yes", "No"]} value={form.registeredXB} onPick={pick} required error={err("registeredXB")} />
          <Chips label="Previously appeared for either exam?" name="previouslyAppeared" options={["Yes", "No"]} value={form.previouslyAppeared} onPick={pick} required error={err("previouslyAppeared")} />
          {form.previouslyAppeared === "Yes" && <Field label="Attempt details and result" name="attemptDetails" value={form.attemptDetails} onChange={set} required error={err("attemptDetails")} />}
          <Chips label="Need guidance for NISM exam registration?" name="needGuidance" options={["Yes", "No"]} value={form.needGuidance} onPick={pick} required error={err("needGuidance")} />
        </>
      ),
    },
    {
      title: "Professional Details", sub: "Section D: Work experience, location, and mobility", short: "Professional",
      render: () => (
        <>
          <SubHeading>Professional Background</SubHeading>
          <Chips label="Current Professional Status" name="professionalStatus" options={["Student", "Fresher", "Salaried Professional", "Self-Employed", "Business Owner", "Career Switcher", "Other"]} value={form.professionalStatus} onPick={pick} required error={err("professionalStatus")} />
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Field label="Current Organisation / College" name="currentOrg" value={form.currentOrg} onChange={set} required error={err("currentOrg")} />
            <Field label="Designation / Course Name" name="designation" value={form.designation} onChange={set} required error={err("designation")} />
          </div>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Field label="Total Work Experience" name="workExperience" placeholder="e.g. 2 years" value={form.workExperience} onChange={set} required error={err("workExperience")} />
            <Field label="Current Industry / Sector" name="industry" value={form.industry} onChange={set} required error={err("industry")} />
          </div>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Field label="Income Range (optional)" name="incomeRange" value={form.incomeRange} onChange={set} />
            <Field label="Notice Period, if employed" name="noticePeriod" value={form.noticePeriod} onChange={set} />
          </div>
          <Chips label="Current Work Mode" name="workMode" options={["Full-Time", "Part-Time", "Freelance", "Self-Employed"]} value={form.workMode} onPick={pick} required error={err("workMode")} />
          <Chips label="Able to participate in field-based activities?" name="fieldActivities" options={["Yes", "No"]} value={form.fieldActivities} onPick={pick} required error={err("fieldActivities")} />
          <TextArea label="Reason for joining this programme" name="reasonJoining" placeholder="What motivated you to apply?" value={form.reasonJoining} onChange={set} required error={err("reasonJoining")} />
          <SubHeading>Location & Mobility</SubHeading>
          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Field label="Current City" name="currentCity" value={form.currentCity} onChange={set} required error={err("currentCity")} />
            <Field label="Current State" name="currentState" value={form.currentState} onChange={set} required error={err("currentState")} />
          </div>
          <Chips label="Willing to travel to Mumbai for on-field training?" name="willingToTravel" options={["Yes", "No"]} value={form.willingToTravel} onPick={pick} required error={err("willingToTravel")} />
          <Chips label="Need support planning travel or accommodation?" name="needTravelSupport" options={["Yes", "No"]} value={form.needTravelSupport} onPick={pick} required error={err("needTravelSupport")} />
          <Chips label="Willing to undertake client-facing activities?" name="clientFacing" options={["Yes", "No"]} value={form.clientFacing} onPick={pick} required error={err("clientFacing")} />
          <Chips label="Preferred language for client interaction" name="preferredLang" options={["English", "Hindi", "Marathi", "Other"]} value={form.preferredLang} onPick={pick} required error={err("preferredLang")} />
        </>
      ),
    },
    {
      title: "Programme Motivation", sub: "Section E: Your goals and expectations", short: "Motivation",
      render: () => (
        <>
          <TextArea label="1. Why do you want to build a career in investment advisory or financial planning?" name="motivation" placeholder="Share what draws you to this field..." value={form.motivation} onChange={set} />
          <TextArea label="2. What do you expect to achieve through this programme?" name="expectations" placeholder="Your learning goals and career expectations..." value={form.expectations} onChange={set} />
          <Chips label="3. Comfortable interacting with clients, conducting meetings, explaining financial-planning services?" name="comfortLevel" options={["Yes", "No", "I would require training and guidance"]} value={form.comfortLevel} onPick={pick} />
          <Select label="4. What are your long-term career plans?" name="longTermGoal" options={["Work in financial advisory", "Build an advisory practice", "Improve financial knowledge", "Career transition into finance", "Other"]} value={form.longTermGoal} onChange={set} />
        </>
      ),
    },
    {
      title: "Document Upload", sub: "Section F: Upload supporting documents", short: "Documents",
      render: () => (
        <>
          <p className="text-sm text-grey-500 mb-5">Fields marked with * are required. Other documents can be skipped if not applicable.</p>
          <Upload label="Recent passport-size photograph" name="photo" files={uploads.photo} onAdd={addFile} onRemove={rmFile} required error={err("photo")} />
          <Upload label="PAN Card copy" name="panCard" files={uploads.panCard} onAdd={addFile} onRemove={rmFile} required error={err("panCard")} />
          <Upload label="Aadhaar Card / valid address proof" name="aadhaarCard" files={uploads.aadhaarCard} onAdd={addFile} onRemove={rmFile} required error={err("aadhaarCard")} />
          <Upload label="Graduation mark sheet / degree certificate" name="gradCert" files={uploads.gradCert} onAdd={addFile} onRemove={rmFile} required error={err("gradCert")} />
          <Upload label="NISM certificate(s), if applicable" name="nismCertDoc" files={uploads.nismCertDoc} onAdd={addFile} onRemove={rmFile} />
          <Upload label="NISM scorecard(s), if applicable" name="nismScorecard" files={uploads.nismScorecard} onAdd={addFile} onRemove={rmFile} />
          <Upload label="Updated resume / CV" name="resumeDoc" files={uploads.resumeDoc} onAdd={addFile} onRemove={rmFile} />
        </>
      ),
    },
    {
      title: "Declarations & Undertakings", sub: "Section G: Read, agree, and e-sign all undertakings", short: "Declarations",
      render: () => (
        <>
          <AnnexureBlock title="Candidate Declaration" body={<p>I declare that all information provided is true, accurate, and complete to the best of my knowledge. I understand that:</p>}
            items={["Any incorrect or misleading information may lead to rejection or cancellation.", "Admission is subject to Fydaa's review and approval.", "I am responsible for submitting valid supporting documents.", "I will maintain professional conduct throughout the programme.", "NISM outcomes are subject to the applicable NISM process.", "I will not misrepresent myself as a registered adviser or Fydaa representative."]} />

          <AnnexureBlock title="Annexure 1: Mumbai On-Field Training Consent" body={<p>I confirm that I understand the programme includes practical on-field training in Mumbai during the third month. I voluntarily consent to:</p>}
            items={["Attend the complete offline/on-field training in Mumbai as scheduled.", "Participate in client interaction, field observation, CRM usage, meeting documentation, and business-development activities.", "Follow instructions provided by programme trainers and Fydaa representatives.", "Arrange and bear responsibility for my travel, stay, meals, and personal expenses unless otherwise communicated.", "Inform the team in advance of any constraint affecting my participation."]} />

          <AnnexureBlock title="Annexure 2: Month 4 Live Implementation Commitment" body={<p>I understand that Month 4 is for implementing skills in live settings. I agree to:</p>}
            items={["Participate sincerely in the implementation and evaluation phase.", "Apply programme learning in a professional, ethical, and responsible manner.", "Complete assigned activities, documentation, CRM updates, and reporting on time.", "Attend review meetings, mentorship sessions, and performance discussions.", "Maintain honesty in reporting meetings, interactions, and activity status.", "Respect privacy and confidentiality of all clients, prospects, and programme information.", "Understand evaluation is based on participation, quality, documentation, and consistency."]} />

          <AnnexureBlock title="Annexure 3: Code of Conduct & Confidentiality" body={<p>I agree to maintain professional conduct and undertake that I will:</p>}
            items={["Treat clients, prospects, trainers, staff, and fellow participants respectfully.", "Not make false promises, return guarantees, or unauthorised financial claims.", "Not share confidential information with unauthorised persons.", "Use programme resources only for legitimate learning and authorised activities.", "Not misuse the Fydaa name, logo, client data, or programme material.", "Follow all instructions relating to ethical conduct and advisory practices.", "Not record, circulate, or distribute training content without written permission."]} />

          <AnnexureBlock title="Annexure 4: Parent / Guardian Consent" body={<p>I confirm awareness of the candidate's application to the Fydaa Investment Adviser Programme. I understand the programme includes classroom learning, NISM certification prep, Mumbai on-field training, and client-facing learning. I give my consent for participation.</p>} items={[]} />
          <div className="bg-grey-50 border border-grey-200 rounded-[14px] p-6 mb-4">
            <h4 className="text-base font-bold text-ink mb-2.5">Parent / Guardian Details (if applicable)</h4>
            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field label="Parent / Guardian Name" name="parentName" value={form.parentName} onChange={set} />
              <Field label="Relationship" name="parentRelation" value={form.parentRelation} onChange={set} />
            </div>
            <Field label="Parent / Guardian Mobile Number" name="parentMobile" type="tel" value={form.parentMobile} onChange={set} />
          </div>

          <AnnexureBlock title="Annexure 5: Employer No-Objection Certificate" body={<p>This certifies the employee has informed their employer of participation. The employer has no objection, subject to operational requirements. This NOC does not create any obligation on the employer to bear programme costs.</p>} items={[]} />
          <div className="bg-grey-50 border border-grey-200 rounded-[14px] p-6 mb-4">
            <h4 className="text-base font-bold text-ink mb-2.5">Employer Details (if applicable)</h4>
            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field label="Authorised Signatory Name" name="empSignatory" value={form.empSignatory} onChange={set} />
              <Field label="Designation" name="empDesignation" value={form.empDesignation} onChange={set} />
            </div>
            <Field label="Organisation Name" name="empOrg" value={form.empOrg} onChange={set} />
          </div>

          {/* Combined agreement + e-sign */}
          <div className="border border-grey-200 rounded-[14px] p-6 mt-6 bg-white">
            <h4 className="text-base font-bold text-ink mb-4">Agreement & Electronic Signature</h4>
            <label className="flex gap-2.5 items-center p-3.5 bg-jade-tint rounded-[10px] border border-jade-200 cursor-pointer mb-4">
              <input type="checkbox" checked={!!form.allAnnex_agree} onChange={(e) => chk("allAnnex_agree", e.target.checked)}
                className={`w-[18px] h-[18px] accent-jade cursor-pointer ${err("allAnnex_agree") ? "outline outline-2 outline-red-400" : ""}`} />
              <span className="text-sm font-semibold text-jade-deep">I have read and agree to the Candidate Declaration and all Annexures (1 through 5) above</span>
            </label>
            {err("allAnnex_agree") && <p className="text-sm text-red-500 mb-3">Please agree to the declarations to continue.</p>}
            <p className="text-sm text-grey-500 mb-4">By signing below, you confirm your agreement to all the declarations and undertakings listed on this page.</p>
            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field label="Full Name" name="esign_name" value={form.esign_name} onChange={set} required error={err("esign_name")} />
              <Field label="Date" name="esign_date" type="date" value={form.esign_date} onChange={set} required error={err("esign_date")} />
            </div>
            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field label="Place" name="esign_place" value={form.esign_place} onChange={set} required error={err("esign_place")} />
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-grey-800 mb-1 tracking-[-0.01em]">Signature (type your full name) <span className="text-red-500">*</span></label>
                <div className={`border rounded-lg h-14 bg-white overflow-hidden ${err("esign_sig") ? "border-red-400" : "border-grey-200"}`}>
                  <input type="text" value={asStr(form.esign_sig)} onChange={(e) => set("esign_sig", e.target.value)}
                    placeholder="Type full name as signature"
                    className="w-full h-full border-none outline-none text-center font-sans text-base font-semibold text-jade bg-transparent px-3" />
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Choose Programme",
      sub: "Select your programme and proceed to payment",
      short: "Programme",
      render: () => {
        const selected = asStr(form.selectedProgramme);
        const selectedOption = getProgrammeOption(selected);
        const onfieldBlocked =
          selected === "onfield" && !isNismCertifiedForOnField(form, uploads);

        return (
          <>
            <p className="text-sm text-grey-600 mb-5 leading-relaxed">
              Choose the programme that fits your current stage. You can proceed to payment after selecting.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
              {PROGRAMME_OPTIONS.map((option) => {
                const isSelected = selected === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      pick("selectedProgramme", option.id);
                      persistSelectedProgramme(option.id);
                    }}
                    className={`text-left rounded-[14px] border p-4 sm:p-5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-jade bg-jade-tint shadow-[0_0_0_1px_rgba(12,74,62,0.15)]"
                        : err("selectedProgramme")
                          ? "border-red-300 bg-white hover:border-grey-300"
                          : "border-grey-200 bg-white hover:border-grey-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span
                        className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-[0.02em] ${
                          option.badgeTone === "jade"
                            ? "bg-jade text-white"
                            : "bg-grey-100 text-grey-600"
                        }`}
                      >
                        {option.badge}
                      </span>
                      <span
                        className={`mt-0.5 w-[18px] h-[18px] rounded-full border-2 shrink-0 flex items-center justify-center ${
                          isSelected ? "border-jade bg-jade" : "border-grey-300 bg-white"
                        }`}
                        aria-hidden
                      >
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </span>
                    </div>
                    <h4 className="text-[16px] font-bold text-ink tracking-[-0.02em] mb-2">
                      {option.title}
                    </h4>
                    <p className="text-[13px] text-grey-600 leading-relaxed mb-4">
                      {option.description}
                    </p>
                    <div className="text-[22px] font-extrabold text-ink tracking-[-0.03em]">
                      {option.feeLabel}{" "}
                      <span className="text-[13px] font-medium text-grey-500">+ taxes</span>
                    </div>
                    <p className="text-[12px] text-grey-500 mt-1">One-time fee</p>
                  </button>
                );
              })}
            </div>

            {selectedOption && (
              <div className="flex items-start gap-2.5 rounded-[12px] bg-jade-tint border border-jade-200 px-4 py-3 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" fill="#0C4A3E" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm font-semibold text-jade-deep leading-snug">
                  {selectedOption.selectionLabel} selected. Fee: {selectedOption.feeLabel} + applicable taxes.
                </p>
              </div>
            )}

            {(onfieldBlocked || err("selectedProgramme")) && selected === "onfield" && (
              <p className="text-sm text-red-500 mt-1">
                This programme is only for NISM certified candidates
              </p>
            )}
            {err("selectedProgramme") && !selected && (
              <p className="text-sm text-red-500 mt-1">Please select a programme to continue.</p>
            )}
          </>
        );
      },
    },
  ];
}

/* ══════════════════════════════════════
   MOBILE VERIFY + OTP (before form)
   ══════════════════════════════════════ */
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

function formatMobileDisplay(digits: string | number) {
  const d = String(digits || "").replace(/\D/g, "").slice(0, 10);
  if (d.length <= 5) return `+91 ${d}`;
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
}

function MobileVerifyPage({
  onBack,
  onSendOtp,
  initialMobile = "",
}: {
  onBack: () => void;
  onSendOtp: (mobile: string) => Promise<void>;
  initialMobile?: string;
}) {
  const [mobile, setMobile] = useState(String(initialMobile || "").replace(/\D/g, "").slice(0, 10));
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setError("");
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setSending(true);
    try {
      await onSendOtp(mobile);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send OTP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-12 sm:pb-[60px] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[400px] mx-auto flex flex-col items-center text-center">
        <button
          type="button"
          onClick={onBack}
          className="self-start text-sm text-grey-500 cursor-pointer border-none bg-none font-sans flex items-center gap-1 hover:text-jade mb-8"
        >
          <ChevronLeft /> Back
        </button>

        <div className="w-12 h-12 rounded-[14px] bg-jade-tint flex items-center justify-center mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="7" y="2" width="10" height="20" rx="2" stroke="#0C4A3E" strokeWidth="1.6" />
            <path d="M10 18h4" stroke="#0C4A3E" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className="text-[22px] sm:text-[24px] font-extrabold tracking-[-0.03em] text-ink mb-2">
          Verify your mobile number
        </h2>
        <p className="text-[14px] sm:text-[15px] text-grey-500 leading-relaxed mb-8 max-w-[320px]">
          We&apos;ll save your progress so you can continue later if needed.
        </p>

        <div className="w-full flex gap-2.5 mb-3">
          <div className="w-[72px] shrink-0 h-[50px] border border-grey-200 rounded-[12px] flex items-center justify-center text-[15px] font-semibold text-grey-800 bg-white">
            +91
          </div>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="10-digit mobile number"
            className={`flex-1 min-w-0 h-[50px] px-4 border rounded-[12px] text-[15px] font-sans text-ink outline-none bg-white placeholder:text-grey-400 focus:border-jade focus:ring-[3px] focus:ring-jade/[.08] ${
              error ? "border-red-400" : "border-grey-200"
            }`}
          />
        </div>

        {error && <p className="w-full text-left text-sm text-red-500 mb-3">{error}</p>}

        <button
          type="button"
          onClick={handleSend}
          disabled={sending || mobile.length !== 10}
          className="w-full mt-2 h-[50px] bg-jade text-white border-none rounded-[12px] text-[15px] font-bold cursor-pointer font-sans hover:bg-jade-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
}

function OtpVerifyPage({
  mobile,
  onBack,
  onChangeMobile,
  onVerified,
  onResend,
}: {
  mobile: string;
  onBack: () => void;
  onChangeMobile: () => void;
  onVerified: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendLeft, setResendLeft] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendLeft <= 0) return;
    const t = setTimeout(() => setResendLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendLeft]);

  const otpValue = otp.join("");

  const setDigit = (index: number, digit: string) => {
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    return next;
  };

  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setDigit(index, "");
      return;
    }
    if (digits.length > 1) {
      const next = [...otp];
      for (let i = 0; i < digits.length && index + i < OTP_LENGTH; i++) {
        next[index + i] = digits[i];
      }
      setOtp(next);
      setError("");
      const focusAt = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputsRef.current[focusAt]?.focus();
      return;
    }
    setDigit(index, digits);
    if (index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError("");
    if (otpValue.length !== OTP_LENGTH) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setVerifying(true);
    try {
      await onVerified(otpValue);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid OTP. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendLeft > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      await onResend();
      setOtp(Array(OTP_LENGTH).fill(""));
      setResendLeft(RESEND_SECONDS);
      inputsRef.current[0]?.focus();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-12 sm:pb-[60px] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[400px] mx-auto flex flex-col items-center text-center">
        <button
          type="button"
          onClick={onBack}
          className="self-start text-sm text-grey-500 cursor-pointer border-none bg-none font-sans flex items-center gap-1 hover:text-jade mb-8"
        >
          <ChevronLeft /> Back
        </button>

        <div className="w-12 h-12 rounded-[14px] bg-jade-tint flex items-center justify-center mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="4" y="4" width="16" height="16" rx="3" stroke="#0C4A3E" strokeWidth="1.6" />
            <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#0C4A3E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="text-[22px] sm:text-[24px] font-extrabold tracking-[-0.03em] text-ink mb-2">
          Enter OTP
        </h2>
        <p className="text-[14px] sm:text-[15px] text-grey-500 leading-relaxed mb-5">
          We&apos;ve sent a 6-digit code to your mobile number.
        </p>

        <div className="inline-flex items-center gap-2 bg-grey-100 rounded-full px-4 py-2 mb-8">
          <span className="text-[14px] font-medium text-grey-800">{formatMobileDisplay(mobile)}</span>
          <button
            type="button"
            onClick={onChangeMobile}
            className="text-[14px] font-semibold text-jade-deep border-none bg-none cursor-pointer hover:underline"
          >
            Change
          </button>
        </div>

        <div className="flex gap-2 sm:gap-2.5 justify-center mb-4 w-full">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => {
                e.preventDefault();
                handleChange(i, e.clipboardData.getData("text"));
              }}
              className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold border rounded-[12px] outline-none bg-white text-ink transition-colors focus:border-jade focus:ring-[3px] focus:ring-jade/[.08] ${
                digit ? "border-jade" : "border-grey-200"
              }`}
            />
          ))}
        </div>

        {error && <p className="w-full text-center text-sm text-red-500 mb-3">{error}</p>}

        <button
          type="button"
          onClick={handleVerify}
          disabled={verifying || otpValue.length !== OTP_LENGTH}
          className="w-full mt-2 h-[50px] bg-jade text-white border-none rounded-[12px] text-[15px] font-bold cursor-pointer font-sans hover:bg-jade-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? "Verifying..." : "Verify & Continue"}
        </button>

        <p className="mt-5 text-[13px] sm:text-[14px] text-grey-500">
          Didn&apos;t receive it?{" "}
          {resendLeft > 0 ? (
            <span>Resend OTP ({resendLeft}s)</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-jade-deep font-semibold border-none bg-none cursor-pointer hover:underline disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

function firstNameFromForm(form: FormState) {
  return asStr(form.fullName).split(" ")[0];
}

function PaymentScreen({
  name,
  applicationNo,
  feeLabel = "₹35,000",
  failed,
  paying,
  toast,
  onPay,
  onBack,
}: {
  name: string;
  applicationNo: string;
  feeLabel?: string;
  failed: boolean;
  paying: boolean;
  toast: string;
  onPay: () => void;
  onBack: () => void;
}) {
  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-12 sm:pb-[60px] max-w-[720px] mx-auto text-center">
      <div className="w-16 h-16 rounded-2xl bg-jade-tint flex items-center justify-center mx-auto mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v18M3 12h18" stroke="#0C4A3E" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-2">
        {failed ? "Payment unsuccessful" : "Complete your payment"}
      </h2>
      <p className="text-[15px] text-grey-600 leading-relaxed max-w-[420px] mx-auto mb-4">
        {failed
          ? `The previous payment attempt did not go through${name ? `, ${name}` : ""}. You can try again to complete the FYIAEP programme fee.`
          : `Your application has been submitted${name ? `, ${name}` : ""}. Pay the programme fee to confirm your seat.`}
      </p>
      {applicationNo && (
        <p className="text-sm text-grey-500 mb-5 font-medium">Application {applicationNo}</p>
      )}
      <p className="text-[28px] font-extrabold tracking-[-0.03em] text-ink mb-1">
        {feeLabel} <span className="text-[14px] font-normal text-grey-500">+ applicable taxes</span>
      </p>
      <p className="text-xs text-grey-500 mb-7 max-w-[380px] mx-auto">
        Please keep this page open until payment is confirmed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={onPay}
          disabled={paying}
          className="px-9 py-3.5 bg-jade text-white border-none rounded-[10px] text-[15px] font-bold cursor-pointer font-sans hover:bg-jade-hover disabled:opacity-50"
        >
          {paying ? "Opening payment…" : failed ? "Retry Payment" : "Pay Programme Fee"}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={paying}
          className="px-9 py-3.5 bg-white border border-grey-200 rounded-[10px] text-[15px] font-semibold cursor-pointer font-sans text-grey-800 hover:border-grey-300 disabled:opacity-50"
        >
          Back to programme page
        </button>
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}

function CancelledScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-12 sm:pb-[60px] max-w-[720px] mx-auto text-center">
      <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-2">Application cancelled</h2>
      <p className="text-[15px] text-grey-600 leading-relaxed max-w-[420px] mx-auto mb-7">
        This application cannot be paid. Please contact admissions if you need help.
      </p>
      <button
        onClick={onBack}
        className="px-9 py-3.5 bg-jade text-white border-none rounded-[10px] text-[15px] font-bold cursor-pointer font-sans"
      >
        Back to programme page
      </button>
    </div>
  );
}

/* ══════════════════════════════════════
   FORM PAGE
   ══════════════════════════════════════ */
function FormPage({
  onBack,
  verifiedMobile = "",
  onSessionExpired,
}: {
  onBack: () => void;
  verifiedMobile?: string;
  onSessionExpired?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [form, setForm] = useState<FormState>(() =>
    verifiedMobile ? { whatsapp: verifiedMobile, mobile: verifiedMobile } : {}
  );
  const [uploads, setUploads] = useState<UploadsState>({});
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [awaitingPayment, setAwaitingPayment] = useState(false);
  const [applicationCancelled, setApplicationCancelled] = useState(false);
  const [applicationNo, setApplicationNo] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState<ErrorsState>({});
  const [saving, setSaving] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const app = await getFyiaepApplication();
        if (cancelled) return;
        const mapped = mapApplicationToForm(app, verifiedMobile);
        // On OTP re-login: never restore a prior programme choice — user must select again
        clearPersistedProgramme();
        mapped.selectedProgramme = "";
        setForm((prev) => ({ ...prev, ...mapped }));
        const status = asStr(app?.applicationStatus);
        setApplicationStatus(status);
        if (app?.applicationNo) setApplicationNo(asStr(app.applicationNo));
        if (isFyiaepPaymentCompleted(status)) {
          setPaymentCompleted(true);
          return;
        }
        if (isFyiaepCancelled(status)) {
          setApplicationCancelled(true);
          return;
        }

        const resume = inferResumeStepFromStatus(app?.applicationStatus, mapped);
        const declarationsDone = !!(mapped.allAnnex_agree || mapped.esign_name);
        // Unpaid users who finished declarations (or already submitted/pending pay)
        // land on Choose Programme so they can pick 2 or 4 months again
        const landOnProgramme =
          isFyiaepAwaitingPayment(status) ||
          resume >= 6 ||
          (declarationsDone && resume >= 5);

        if (landOnProgramme) {
          setAwaitingPayment(false);
          setStep(6);
          setMaxReachedStep(6);
          return;
        }

        setStep(resume);
        setMaxReachedStep(resume);
      } catch {
        // keep defaults
      } finally {
        if (!cancelled) setLoadingApp(false);
      }
    })();
    return () => {
      cancelled = true;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [verifiedMobile]);

  const set: FieldSetter = (name, val) => {
    setForm((p) => ({ ...p, [name]: val }));
    setErrors((p) => {
      if (!p[name]) return p;
      const next = { ...p };
      delete next[name];
      return next;
    });
  };
  const pick: ChipPicker = (name, val) => {
    setForm((p) => ({ ...p, [name]: val }));
    setErrors((p) => {
      if (!p[name]) return p;
      const next = { ...p };
      delete next[name];
      return next;
    });
  };
  const chk: CheckSetter = (name, val) => {
    setForm((p) => ({ ...p, [name]: val }));
    setErrors((p) => {
      if (!p[name]) return p;
      const next = { ...p };
      delete next[name];
      return next;
    });
  };

  const addFile: FileAdder = (name, fileList) => {
    setUploads((p) => ({ ...p, [name]: [...(p[name] || []), ...Array.from(fileList)] }));
    setErrors((p) => {
      if (!p[name]) return p;
      const next = { ...p };
      delete next[name];
      return next;
    });
  };
  const rmFile: FileRemover = (name, i) => {
    setUploads((p) => {
      const arr = [...(p[name] || [])];
      arr.splice(i, 1);
      return { ...p, [name]: arr };
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(""), 2800);
  };

  const steps = getSteps(form, set, pick, uploads, addFile, rmFile, chk, errors);
  const s = steps[step];
  const isLast = step === steps.length - 1;
  const proceedDisabled =
    saving ||
    (isLast &&
      asStr(form.selectedProgramme) === "onfield" &&
      !isNismCertifiedForOnField(form, uploads));

  const handleApiError = (e: unknown) => {
    if (isFyiaepSessionExpiredError(e) || (e instanceof Error && e.message === FYIAEP_SESSION_EXPIRED)) {
      showToast("Session expired. Please verify your mobile again.");
      setTimeout(() => onSessionExpired?.(), 600);
      return;
    }
    showToast(e instanceof Error ? e.message : "Failed to save. Please try again.");
  };

  const persistStep = async (stepIndex: number) => {
    if (!getFyiaepToken()) {
      throw new Error(FYIAEP_SESSION_EXPIRED);
    }
    await saveFyiaepStep(stepIndex, form, uploads);
  };

  const applyServerStatus = (app: Record<string, unknown> | null) => {
    const status = asStr(app?.applicationStatus);
    const appNo = asStr(app?.applicationNo);
    if (status) setApplicationStatus(status);
    if (appNo) setApplicationNo(appNo);

    if (isFyiaepPaymentCompleted(status)) {
      setPaymentCompleted(true);
      setAwaitingPayment(false);
      setApplicationCancelled(false);
      return "paid" as const;
    }
    if (isFyiaepCancelled(status)) {
      setApplicationCancelled(true);
      setAwaitingPayment(false);
      setPaymentCompleted(false);
      return "cancelled" as const;
    }
    if (isFyiaepAwaitingPayment(status)) {
      setAwaitingPayment(true);
      setPaymentCompleted(false);
      setApplicationCancelled(false);
      return "pay" as const;
    }
    return "form" as const;
  };

  const syncFromServer = async () => {
    const app = await getFyiaepApplication();
    return applyServerStatus(app);
  };

  const markPaymentComplete = (status?: string, appNo?: string) => {
    if (status) setApplicationStatus(status);
    if (appNo) setApplicationNo(appNo);
    setPaymentCompleted(true);
    setAwaitingPayment(false);
    setApplicationCancelled(false);
    window.scrollTo(0, 0);
  };

  const submitApplication = async () => {
    await persistStep(step);
    if (!shouldSkipFyiaepSubmit(applicationStatus)) {
      const submitResult = await submitFyiaepApplication();
      const submitData =
        submitResult.data && typeof submitResult.data === "object"
          ? (submitResult.data as Record<string, unknown>)
          : submitResult;
      const nextStatus = asStr(submitData.applicationStatus) || "payment_pending";
      const appNo = asStr(submitData.applicationNo);
      setApplicationStatus(nextStatus);
      if (appNo) setApplicationNo(appNo);
    }
    setAwaitingPayment(true);
    window.scrollTo(0, 0);
  };

  const startCheckout = async () => {
    const synced = await syncFromServer();
    if (synced === "paid" || synced === "cancelled") return;

    // 4-month: unchanged create payload; 2-month: courseType ON_FIELD_TRAINING
    const order = await createCoursePayment(
      asStr(form.selectedProgramme) === "onfield"
        ? { courseType: "ON_FIELD_TRAINING" }
        : undefined,
    );
    if (order.applicationNo) setApplicationNo(order.applicationNo);
    if (order.applicationStatus) setApplicationStatus(order.applicationStatus);

    const captureResult = await openFyiaepCourseCheckout(order);
    const captureStatus = asStr(captureResult.applicationStatus);
    const captureAppNo = asStr(captureResult.applicationNo);

    try {
      const afterCapture = await syncFromServer();
      if (afterCapture === "paid") return;
    } catch {
      // GET is best-effort; capture success is enough to show paid
    }
    if (isCoursePaymentCaptureSuccess(captureResult) || isFyiaepPaymentCompleted(captureStatus)) {
      markPaymentComplete(captureStatus || "payment_completed", captureAppNo);
    }
  };

  const goNext = async () => {
    const result = validateStep(step, form, uploads);
    if (result) {
      const map: ErrorsState = {};
      result.fields.forEach((f) => { map[f] = true; });
      setErrors(map);
      showToast(result.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      if (!isLast) {
        await persistStep(step);
        showToast("Saved successfully");
        const next = step + 1;
        setStep(next);
        setMaxReachedStep((m) => Math.max(m, next));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        await submitApplication();
      }
    } catch (e: unknown) {
      handleApiError(e);
    } finally {
      setSaving(false);
    }
  };

  const saveProgress = async () => {
    // Allow draft save without completing required fields
    setErrors({});
    setSaving(true);
    try {
      await persistStep(step);
      setMaxReachedStep((m) => Math.max(m, step));
      showToast("Progress saved");
    } catch (e: unknown) {
      handleApiError(e);
    } finally {
      setSaving(false);
    }
  };

  const goToStep = (i: number) => {
    if (i < 0 || i >= steps.length) return;
    if (i > maxReachedStep) {
      showToast("Please complete the current section before continuing.");
      return;
    }
    setErrors({});
    setStep(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePay = async () => {
    setSaving(true);
    try {
      await startCheckout();
    } catch (e: unknown) {
      if (isFyiaepAlreadyPaidError(e)) {
        try {
          const synced = await syncFromServer();
          if (synced !== "paid") markPaymentComplete("payment_completed");
        } catch {
          markPaymentComplete("payment_completed");
        }
        return;
      }
      if (e instanceof Error && e.message === FYIAEP_PAYMENT_DISMISSED) {
        try {
          const synced = await syncFromServer();
          if (synced === "paid") return;
        } catch (syncErr) {
          handleApiError(syncErr);
          return;
        }
        showToast("Payment cancelled. You can try again when ready.");
        return;
      }
      handleApiError(e);
    } finally {
      setSaving(false);
    }
  };

  if (paymentCompleted) {
    const name = firstNameFromForm(form);
    return (
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-12 sm:pb-[60px] max-w-[720px] mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-jade-tint flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#0C4A3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-2">
          Payment Successful
        </h2>
        <p className="text-[15px] text-grey-600 leading-relaxed max-w-[420px] mx-auto mb-7">
          Thank you{name ? `, ${name}` : ""}. Your FYIAEP programme fee payment has been received
          {applicationNo ? ` for ${applicationNo}` : ""}.
          Our admissions team will review your application and reach out within 3 working days.
        </p>
        <button onClick={onBack} className="px-9 py-3.5 bg-jade text-white border-none rounded-[10px] text-[15px] font-bold cursor-pointer font-sans">
          Back to Programme page
        </button>
      </div>
    );
  }

  if (applicationCancelled) {
    return <CancelledScreen onBack={onBack} />;
  }

  if (awaitingPayment) {
    const programme = getProgrammeOption(form.selectedProgramme);
    return (
      <PaymentScreen
        name={firstNameFromForm(form)}
        applicationNo={applicationNo}
        feeLabel={programme?.feeLabel || "₹35,000"}
        failed={isFyiaepPaymentFailed(applicationStatus)}
        paying={saving}
        toast={toast}
        onPay={handlePay}
        onBack={onBack}
      />
    );
  }

  if (loadingApp) {
    return (
      <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-12 max-w-[720px] mx-auto text-center text-grey-500 text-sm">
        Loading your application…
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 px-4 sm:px-6 pb-12 sm:pb-[60px] max-w-[720px] mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
        <h2 className="text-[18px] sm:text-[22px] font-extrabold tracking-[-0.03em] text-ink">FYIAEP Application</h2>
        <button onClick={onBack} className="text-sm text-grey-500 cursor-pointer border-none bg-none font-sans flex items-center gap-1 hover:text-jade">
          <ChevronLeft /> Back to Programme page
        </button>
      </div>

      {/* Step bar */}
      <div className="flex gap-1.5 mb-9">
        {steps.map((st, i) => {
          const reachable = i <= maxReachedStep;
          return (
            <div
              key={i}
              className={`flex-1 flex flex-col gap-1 ${reachable ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
              onClick={() => goToStep(i)}
            >
              <div className={`h-1 rounded-sm transition-colors ${i <= step ? "bg-jade" : "bg-grey-200"}`} />
              <span className={`text-[10px] font-medium truncate transition-colors ${
                i === step ? "text-jade-deep font-semibold" : i < step ? "text-grey-600" : "text-grey-400"
              }`}>{st.short}</span>
            </div>
          );
        })}
      </div>

      {/* Section header */}
      <div className="mb-7">
        <h3 className="text-xl font-bold text-ink tracking-[-0.02em]">{s.title}</h3>
        <p className="text-sm text-grey-500 mt-1">{s.sub}</p>
      </div>

      {/* Fields */}
      {s.render()}

      {/* Footer */}
      <div className="flex justify-between items-center pt-6 mt-5 border-t border-grey-200 gap-3 flex-wrap max-sm:flex-col">
        <button disabled={step === 0 || saving} onClick={() => goToStep(step - 1)}
          className="px-6 py-2.5 bg-white border border-grey-200 rounded-[10px] text-sm font-sans text-grey-800 font-medium cursor-pointer flex items-center gap-1.5 hover:border-grey-300 disabled:text-grey-300 disabled:border-grey-150 disabled:cursor-default">
          <ChevronLeft /> Back
        </button>
        <div className="flex gap-2.5 max-sm:w-full">
          <button onClick={saveProgress} disabled={saving}
            className="px-6 py-2.5 bg-white border border-jade-200 rounded-[10px] text-sm font-sans text-jade-deep font-semibold cursor-pointer hover:bg-jade-tint transition-colors max-sm:flex-1 disabled:opacity-50">
            {saving ? "Saving..." : "Save progress"}
          </button>
          <button onClick={goNext} disabled={proceedDisabled}
            className="px-7 py-2.5 bg-jade text-white border-none rounded-[10px] text-sm font-bold font-sans tracking-[-0.01em] cursor-pointer flex items-center gap-1.5 hover:bg-jade-hover transition-colors max-sm:flex-1 disabled:opacity-50">
            {saving ? (isLast ? "Processing..." : "Saving...") : isLast ? "Proceed to Pay" : "Save & Continue"} {!saving && <ChevronRight />}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════ */
export default function FYIAEPPage() {
  const [page, setPage] = useState<PageView>("landing");
  const [verifiedMobile, setVerifiedMobile] = useState("");

  const showLanding = () => {
    setPage("landing");
    window.scrollTo(0, 0);
  };

  const startApply = () => {
    setPage("verify-mobile");
    window.scrollTo(0, 0);
  };

  const handleSessionExpired = () => {
    setPage("verify-mobile");
    window.scrollTo(0, 0);
  };

  const handleSendOtp = async (mobile: string) => {
    await sendFyiaepOtp(mobile, "+91");
    setVerifiedMobile(mobile);
    setPage("enter-otp");
    window.scrollTo(0, 0);
  };

  const handleResendOtp = async () => {
    if (!verifiedMobile) throw new Error("Mobile number missing. Please go back and enter it again.");
    await sendFyiaepOtp(verifiedMobile, "+91");
  };

  const handleOtpVerified = async (otp: string) => {
    await verifyFyiaepOtp(verifiedMobile, otp);
    setPage("form");
    window.scrollTo(0, 0);
  };

  return (
    <div className="font-inter text-ink bg-white min-h-screen">
      {page === "landing" && (
        <>
          <Hero onApply={startApply} />
          <Journey />
          <Curriculum onApply={startApply} />
          <Highlights />
          <WhoIsThisFor />
          <AboutFydaa />
          <CTACard onApply={startApply} />
          <ProgrammeFooter />
        </>
      )}
      {page === "verify-mobile" && (
        <MobileVerifyPage
          onBack={showLanding}
          onSendOtp={handleSendOtp}
          initialMobile={verifiedMobile}
        />
      )}
      {page === "enter-otp" && (
        <OtpVerifyPage
          mobile={verifiedMobile}
          onBack={() => { setPage("verify-mobile"); window.scrollTo(0, 0); }}
          onChangeMobile={() => { setPage("verify-mobile"); window.scrollTo(0, 0); }}
          onVerified={handleOtpVerified}
          onResend={handleResendOtp}
        />
      )}
      {page === "form" && (
        <FormPage
          onBack={showLanding}
          verifiedMobile={verifiedMobile}
          onSessionExpired={handleSessionExpired}
        />
      )}
    </div>
  );
}
