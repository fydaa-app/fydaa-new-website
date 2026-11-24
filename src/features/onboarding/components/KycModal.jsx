"use client";

import React, { useEffect, useId, useRef } from "react";
import { SuccessCheck } from "./UI";

/**
 * The PAN check's answer: already KYC-compliant (a success check draws), needs KYC, or needs a
 * KYC update. Opens like a dialog (transitions.dev #06: the panel scales up from 96% over a
 * fading scrim). It has one way forward, so focus goes to it and stays inside.
 *
 * status: 'compliant' | 'noncompliant' | 'modify'
 */
export default function KycModal({
  open,
  onComplete,
  status = "noncompliant",
  title = "Complete your KYC",
  subtitle = "Your KYC needs to be completed before you can invest.",
  cta = "Complete your KYC",
}) {
  const titleId = useId();
  const bodyId = useId();
  const ctaRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    ctaRef.current?.focus();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;
  const ok = status === "compliant";

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center sm:p-6">
      <div aria-hidden="true" className="t-scrim absolute inset-0 bg-ink/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        onKeyDown={(event) => {
          // One focusable control: keep Tab on it.
          if (event.key === "Tab") {
            event.preventDefault();
            ctaRef.current?.focus();
          }
        }}
        className="t-dialog relative w-full max-w-sm rounded-4xl border border-line bg-paper p-6 shadow-window sm:p-8"
      >
        {ok ? (
          <SuccessCheck className="size-14" />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-14 items-center justify-center rounded-full bg-marigold-tint"
          >
            <span className="flex gap-1.5">
              <i className="block h-6 w-2 -rotate-[38deg] rounded-full bg-marigold" />
              <i className="block h-6 w-2 -rotate-[38deg] rounded-full bg-marigold/50" />
            </span>
          </span>
        )}
        <h2 id={titleId} className="mt-5 text-title text-ink">
          {title}
        </h2>
        <p id={bodyId} className="mt-2 text-base leading-relaxed text-grey-600">
          {subtitle}
        </p>
        <button
          ref={ctaRef}
          type="button"
          onClick={onComplete}
          className="btn btn-primary btn-lg mt-6 w-full"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
