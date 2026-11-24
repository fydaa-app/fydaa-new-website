"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseButton } from "./CareersDialog";

/** Confirmation inside a careers dialog: the check draws once (transitions.dev success check). */
export default function CareersApplySuccess({
  titleId,
  title,
  children,
  onDone,
}: {
  titleId: string;
  title: string;
  children: ReactNode;
  onDone: () => void;
}) {
  const doneRef = useRef<HTMLButtonElement>(null);

  // The submit button that had focus is gone; keep keyboard users inside the dialog.
  useEffect(() => {
    doneRef.current?.focus();
  }, []);

  return (
    <div className="relative overflow-y-auto">
      <CloseButton onClick={onDone} className="absolute right-3 top-3" />
      <div role="status" className="flex flex-col items-start gap-4 px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12">
        <svg className="t-check size-14" viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r="26" className="t-check-ring" />
          <path d="M17 29.5l7 7 15-16" className="t-check-path" />
        </svg>
        <h2 id={titleId} className="text-title text-ink">
          {title}
        </h2>
        <p className="max-w-[46ch] text-base leading-relaxed text-grey-600">{children}</p>
        <button ref={doneRef} type="button" onClick={onDone} className="btn btn-primary btn-md mt-2">
          Done
        </button>
      </div>
    </div>
  );
}
