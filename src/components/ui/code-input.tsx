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
  /** Visible label, also the input's accessible name. */
  label: string;
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
      <label htmlFor={inputId} className={labelClasses}>
        {label}
      </label>
      <div className="relative inline-flex gap-2.5">
        {Array.from({ length }, (_, index) => {
          const char = value[index] ?? "";
          return (
            <div
              key={index}
              aria-hidden="true"
              className={cn(
                "flex h-[52px] w-[46px] items-center justify-center rounded-[10px] border-[1.5px] border-grey-300 bg-white text-lg font-bold text-ink transition-colors",
                focused && index === activeIndex && "border-jade ring-2 ring-jade/20",
                error && "border-red-600",
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
          className="absolute inset-0 size-full cursor-text rounded-[10px] bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent"
        />
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
