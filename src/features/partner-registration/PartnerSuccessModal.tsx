"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";

interface Props {
  open: boolean;
  message?: string;
  onOk: () => void;
}

/**
 * Confirmation after the application is submitted: the dialog scales in over a fading scrim
 * (`t-dialog`, `t-scrim`) and the check draws itself (`t-check`). Its one button takes focus and
 * keeps it, since it is the only way forward.
 */
export default function PartnerSuccessModal({
  open,
  message = "We will share the login details in 24-48 hours after verification.",
  onOk,
}: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) buttonRef.current?.focus();
  }, [open]);

  if (!open) return null;

  // The dialog has a single control, so Tab and Shift+Tab stay on it.
  const keepFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
      buttonRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:items-center">
      <div aria-hidden="true" className="t-scrim absolute inset-0 bg-ink/50" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-success-title"
        aria-describedby="partner-success-message"
        onKeyDown={keepFocus}
        className="t-dialog relative w-full max-w-md rounded-4xl border border-line bg-white p-6 shadow-window sm:p-8"
      >
        <svg className="t-check size-14" viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r="26" className="t-check-ring" />
          <path d="M17 29.5l7 7 15-16" className="t-check-path" />
        </svg>
        <h2 id="partner-success-title" className="mt-5 text-title text-ink">
          Thank you for applying
        </h2>
        <p id="partner-success-message" className="mt-2 text-base leading-relaxed text-grey-600">
          {message}
        </p>
        <button ref={buttonRef} type="button" onClick={onOk} className="btn btn-primary btn-lg mt-6 w-full">
          Back to home
        </button>
      </div>
    </div>
  );
}
