"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { buttonClasses } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useScrollState } from "@/lib/hooks/use-scroll-direction";
import { cn } from "@/lib/utils/cn";
import { QUICK_ANSWERS } from "./answers";

const items = QUICK_ANSWERS.map((entry) => ({
  id: entry.id,
  title: entry.question,
  content: <p>{entry.answer}</p>,
}));

const contactLinkClass = buttonClasses({ variant: "secondary", size: "md", className: "flex-1 px-4" });

/** Focused-task pages where a floating help button would compete with the form. */
const HIDDEN_ON = ["/login", "/signup", "/partner", "/download", "/careers/jobs"];

/**
 * Pages that answer the questions in a section of their own: the home page has its "Questions"
 * section and nothing fixed but the header and the phone bar (tasteskill's page shell).
 */
const HIDDEN_EXACT = ["/"];

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/**
 * Floating "Quick answers" help panel: curated answers plus ways to reach a person.
 * A non-modal disclosure (not a chat), so it is labelled honestly and never claims to
 * be live or AI-driven.
 */
export default function QuickAnswers() {
  const pathname = usePathname();
  const scroll = useScrollState();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (HIDDEN_EXACT.includes(pathname ?? "")) return null;
  if (HIDDEN_ON.some((path) => pathname === path || pathname?.startsWith(`${path}/`))) return null;

  // On phones the launcher stays out of the first screen (hero CTAs, calculator) and
  // steps aside while the visitor reads down the page; it returns on scroll up.
  const tucked = scroll !== "up" && !open;

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom)+var(--app-bar-h,0px))] right-4 z-[60] flex flex-col items-end gap-3 transition-[bottom] duration-fast ease-smooth-out sm:right-6 lg:bottom-6">
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="t-dialog flex max-h-[min(70vh,560px)] w-[min(380px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-4xl border border-line bg-white shadow-window focus:outline-none"
        >
          <div className="flex items-start justify-between gap-3 border-b border-line bg-mist/60 py-3 pl-5 pr-2">
            <div className="pt-1.5">
              <h2 id={titleId} className="text-base font-semibold text-ink [font-stretch:104%]">
                Quick answers
              </h2>
              <p className="mt-0.5 text-sm text-grey-500">Short answers to common questions.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close quick answers"
              className="flex size-11 shrink-0 items-center justify-center rounded-btn text-grey-600 transition-colors duration-quick hover:bg-white hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-jade"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5">
            <Accordion
              items={items}
              headingLevel={3}
              collapse="css"
              classNames={{
                item: "border-b border-line last:border-b-0",
                trigger:
                  "min-h-12 py-3 text-sm font-semibold text-ink transition-colors duration-quick hover:text-jade [font-stretch:104%]",
                icon: "text-grey-500",
                panel: "pb-4 pr-6 text-sm leading-relaxed text-grey-600",
              }}
            />
          </div>

          <div className="border-t border-line bg-mist px-5 py-4">
            <p className="mb-3 text-sm font-semibold text-ink [font-stretch:104%]">Talk to a person</p>
            <div className="flex flex-wrap gap-2">
              <a href={siteConfig.contact.phoneHref} className={contactLinkClass}>
                Call
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} className={contactLinkClass}>
                Email
              </a>
              <Link href="/#book-a-call" className={contactLinkClass} onClick={() => setOpen(false)}>
                Book a call
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close quick answers" : "Quick answers"}
        className={cn(
          "flex size-12 items-center justify-center rounded-full bg-jade text-white shadow-window transition-[transform,opacity,background-color] duration-fast ease-smooth-out hover:bg-jade-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade active:scale-[0.98] motion-reduce:transition-none sm:size-14 [@media(hover:hover)]:hover:-translate-y-px",
          tucked &&
            "max-md:pointer-events-none max-md:translate-y-20 max-md:opacity-0 max-md:focus-visible:pointer-events-auto max-md:focus-visible:translate-y-0 max-md:focus-visible:opacity-100",
        )}
      >
        {open ? (
          <CloseIcon className="size-6" />
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9.2 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5" />
            <path d="M12 18.5h.01" />
          </svg>
        )}
      </button>
    </div>
  );
}
