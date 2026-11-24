"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { labelClasses } from "./field";

export interface CodeInputProps {
  /** Number of digits. */
  length: number;
  value: string;
  onChange: (value: string) => void;
  /** Called once all digits are filled. */
  onComplete?: (value: string) => void;
  /** The input's accessible name; shown above the boxes unless `labelHidden`. */
  label: string;
  /** Keep the label for screen readers only (e.g. when a page heading already says it). */
  labelHidden?: boolean;
  /** "otp" enables SMS one-time-code autofill; "pin" masks the digits. */
  kind?: "otp" | "pin";
  error?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

/**
 * Segmented numeric code entry (OTP or PIN).
 *
 * One real <input> sits transparently over the visual boxes. Typing, deleting, pasting
 * and SMS autofill therefore behave natively, and assistive tech sees a single labelled
 * field instead of N unlabelled ones. PIN digits are masked.
 */
export function CodeInput({
  length,
  value,
  onChange,
  onComplete,
  label,
  labelHidden = false,
  kind = "otp",
  error,
  disabled,
  autoFocus,
  name,
  id,
  className,
}: CodeInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const masked = kind === "pin";
  const activeIndex = Math.min(value.length, length - 1);

  function handleChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, length);
    onChange(digits);
    if (digits.length === length && digits !== value) onComplete?.(digits);
  }

  return (
    <div className={cn("mb-4", className)}>
      <label htmlFor={inputId} className={labelHidden ? "sr-only" : labelClasses}>
        {label}
      </label>
      <div
        className="relative grid w-full max-w-[22rem] gap-1.5 sm:gap-2.5"
        style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}
      >
        {Array.from({ length }, (_, index) => {
          const char = value[index] ?? "";
          return (
            <div
              key={index}
              aria-hidden="true"
              className={cn(
                "figure flex aspect-[46/52] max-h-14 min-h-11 items-center justify-center rounded-btn border-[1.5px] border-line bg-white text-lg font-semibold text-ink transition-colors duration-quick",
                focused && index === activeIndex && "border-jade ring-2 ring-jade/20",
                error && "border-danger",
                disabled && "bg-grey-100",
              )}
            >
              {char ? (masked ? "•" : char) : null}
            </div>
          );
        })}
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type={masked ? "password" : "text"}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={masked ? "off" : "one-time-code"}
          value={value}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="absolute inset-0 size-full cursor-text rounded-btn bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent"
        />
      </div>
      {error ? (
        <p key={error} id={errorId} role="alert" className="t-shake mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
