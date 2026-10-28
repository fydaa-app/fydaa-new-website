"use client";

import { ArrowLeft, Clock, Headphones, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";
import { jadeGradient } from "../lib/tokens";
import { PAGE_SHELL } from "../lib/layoutClasses";

/** Same scheduling link as the marketing site (HeroCalculator / About). */
export const BOOK_CALL_URL = "https://www.cal.eu/fydaa/30min?overlayCalendar=true";
export const ADVISOR_PHONE = "+919004501770";
export const WHATSAPP_URL = `https://wa.me/${ADVISOR_PHONE.replace(/\D/g, "")}`;

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-1.99.522.532-1.94-.235-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 6.045L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const HIGHLIGHTS = [
  {
    title: "30-min personal consultation",
    detail: "One-on-one time with an expert on your goals",
    icon: Clock,
    tone: "bg-emerald-50 text-emerald",
  },
  {
    title: "Zero fees",
    detail: "No charge for the advisory call",
    icon: ShieldCheck,
    tone: "bg-sky-50 text-sky-700",
  },
  {
    title: "No upselling, no spam",
    detail: "Clear advice — nothing pushy after",
    icon: CheckCircle2,
    tone: "bg-amber-50 text-amber-700",
  },
];

/**
 * Talk to an Advisor — mobile stack → 2-col desktop / 4xl.
 */
export default function AdvisorTalkPage({ onBack }) {
  return (
    <div className={PAGE_SHELL}>
      <button
        type="button"
        onClick={onBack}
        className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-surface mb-5 sm:mb-6"
        aria-label="Back"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,1.05fr)_minmax(0,1.2fr)] 4xl:grid-cols-[minmax(360px,1fr)_minmax(0,1.35fr)] gap-5 lg:gap-8 xl:gap-10 items-start">
        {/* Hero panel */}
        <div
          className="rounded-card overflow-hidden text-white relative lg:sticky lg:top-8 min-h-[220px] sm:min-h-[260px] lg:min-h-[420px] 4xl:min-h-[480px] flex flex-col"
          style={{ background: jadeGradient }}
        >
          <div className="px-5 sm:px-7 lg:px-8 py-7 sm:py-9 lg:py-10 flex-1 flex flex-col items-center lg:items-start text-center lg:text-left justify-center relative z-10">
            <span className="w-14 h-14 sm:w-16 sm:h-16 4xl:w-[72px] 4xl:h-[72px] rounded-full bg-white/15 border border-white/20 flex items-center justify-center mb-4 sm:mb-5">
              <Headphones size={28} strokeWidth={1.8} className="sm:w-8 sm:h-8" />
            </span>
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] 4xl:text-[36px] font-bold tracking-tight leading-tight">
              Talk to an Advisor
            </h1>
            <p className="text-sm sm:text-[15px] 4xl:text-base text-white/80 mt-2 sm:mt-3 max-w-md leading-relaxed">
              Real advice from real experts — no sales pitch
            </p>
            <div className="hidden lg:block mt-auto pt-10">
              {/* <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/15 text-[12px] font-semibold text-white/90">
                <ShieldCheck size={14} />
                SEBI Registered · INA000015969
              </span> */}
            </div>
          </div>
        </div>

        {/* Actions + highlights */}
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-ink mb-2">
            Get Real Financial Advice
          </h2>
          <p className="text-sm sm:text-[15px] text-muted leading-relaxed mb-5 sm:mb-6 max-w-2xl">
            Speak with SEBI-registered experts who help you plan SIPs, goals, and portfolio decisions — clearly and without pressure.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 sm:mb-8">
            <a
              href={BOOK_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 sm:h-[52px] rounded-btn bg-jade text-white text-[15px] font-semibold hover:bg-jade-hover flex items-center justify-center gap-2.5"
            >
              <Phone size={18} strokeWidth={2} />
              Book a Free Call
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 sm:h-[52px] rounded-btn border-2 border-emerald-200 bg-white text-emerald text-[15px] font-semibold hover:bg-tint flex items-center justify-center gap-2.5"
            >
              <WhatsAppIcon className="text-[#25D366]" />
              Chat on WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6">
            {HIGHLIGHTS.map(({ title, detail, icon: Icon, tone }) => (
              <div
                key={title}
                className="bg-white border border-border rounded-card px-4 py-3.5 sm:py-4 flex sm:flex-col items-center sm:items-start gap-3 shadow-card h-full"
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
                  <Icon size={18} strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink leading-snug">{title}</div>
                  <div className="hidden sm:block text-xs text-muted mt-1 leading-relaxed">{detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center lg:justify-start pb-2 lg:hidden">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tint border border-emerald-100 text-[12px] font-semibold text-jade">
              <ShieldCheck size={14} />
              SEBI Registered · INA000015969
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
