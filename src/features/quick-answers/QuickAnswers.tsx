"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { siteConfig } from "@/config/site";
import { QUICK_ANSWERS } from "./answers";

const items = QUICK_ANSWERS.map((entry) => ({
  id: entry.id,
  title: entry.question,
  content: <p className="pb-3 text-sm leading-relaxed text-grey-600">{entry.answer}</p>,
}));

const contactLinkClass =
  "flex items-center justify-center rounded-btn border border-grey-200 bg-white px-3 py-2 text-sm font-semibold text-jade hover:border-jade focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade";

/**
 * Floating "Quick answers" help panel: curated answers plus ways to reach a person.
 * A non-modal disclosure (not a chat), so it is labelled honestly and never claims to
 * be live or AI-driven.
 */
export default function QuickAnswers() {
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

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="flex max-h-[min(70vh,560px)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-modal focus:outline-none"
        >
          <div className="flex items-start justify-between gap-4 border-b border-grey-200 px-5 py-4">
            <div>
              <h2 id={titleId} className="text-base font-bold text-ink">
                Quick answers
              </h2>
              <p className="mt-0.5 text-xs text-grey-600">Common questions, answered instantly.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close quick answers"
              className="rounded-md p-1 text-grey-600 hover:bg-grey-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-jade"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5">
            <Accordion
              items={items}
              headingLevel={3}
              classNames={{
                item: "border-b border-grey-200 last:border-b-0",
                trigger: "py-3 text-sm font-semibold text-ink",
              }}
            />
          </div>

          <div className="border-t border-grey-200 bg-grey-50 px-5 py-4">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-grey-600">Talk to us</p>
            <div className="grid grid-cols-3 gap-2">
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
        className="flex size-14 items-center justify-center rounded-full bg-ink text-white shadow-modal transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          )}
        </svg>
      </button>
    </div>
  );
}
