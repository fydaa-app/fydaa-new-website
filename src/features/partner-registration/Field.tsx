"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import {
  ALERT_CLASS,
  ERROR_CLASS,
  LABEL_CLASS,
  REQUIRED_MARK_CLASS,
  STEP_DESCRIPTION_CLASS,
  STEP_TITLE_CLASS,
} from "./types";

/** A field's label, with a red asterisk when it is required (inputs carry `aria-required`). */
export function FieldLabel({
  htmlFor,
  required = false,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={LABEL_CLASS}>
      {children}
      {required ? (
        <span aria-hidden="true" className={REQUIRED_MARK_CLASS}>
          *
        </span>
      ) : null}
    </label>
  );
}

/** Inline error under a field; link it to the input with `aria-describedby`. */
export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className={ERROR_CLASS}>
      {children}
    </p>
  );
}

/**
 * An error returned by the server for this step. Give it `key={message}` so the shake replays
 * when the message changes.
 */
export function StepAlert({ message, className, id }: { message: string; className?: string; id?: string }) {
  return (
    <p id={id} role="alert" className={className ? `${ALERT_CLASS} ${className}` : ALERT_CLASS}>
      {message}
    </p>
  );
}

/**
 * The step's heading. It takes focus when the step changes (PartnerRegistrationCard looks for
 * `data-step-heading`), so keyboard and screen reader users start at the top of the new step.
 */
export function StepHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 tabIndex={-1} data-step-heading className={STEP_TITLE_CLASS}>
        {title}
      </h2>
      <p className={STEP_DESCRIPTION_CLASS}>{description}</p>
    </div>
  );
}

/** Shown in place of the Verify button once an OTP is confirmed. */
export function VerifiedStatus() {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald sm:h-12 sm:px-2">
      <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
      Verified
    </span>
  );
}

/** Quiet status text in the Verify slot, e.g. "OTP sent". */
export function SlotStatus({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center text-sm text-grey-500 sm:h-12 sm:px-2">{children}</span>;
}
