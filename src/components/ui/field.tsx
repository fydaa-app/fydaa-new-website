"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

// Sentence-case labels (no all-caps), the same treatment as the planner and book-a-call fields.
export const labelClasses = "mb-1.5 block text-sm font-semibold text-ink";

export const inputClasses =
  "h-12 w-full rounded-card border border-line bg-white px-3.5 text-base font-medium text-ink " +
  "placeholder:text-grey-500 transition-colors duration-quick focus:border-jade focus:outline-none focus:ring-2 " +
  "focus:ring-jade/15 aria-[invalid=true]:border-danger disabled:bg-grey-100";

export interface TextFieldProps extends Omit<ComponentProps<"input">, "id" | "prefix"> {
  label: string;
  /** Helper text shown under the input. */
  hint?: ReactNode;
  /** Error message; marks the input invalid and is announced to screen readers. */
  error?: string | null;
  /** Non-interactive adornment rendered inside the input on the left, e.g. "+91". */
  prefix?: ReactNode;
  id?: string;
  containerClassName?: string;
}

/** Labelled text input with hint and error text wired up via aria attributes. */
export function TextField({
  label,
  hint,
  error,
  prefix,
  id,
  className,
  containerClassName,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("mb-4", containerClassName)}>
      <label htmlFor={inputId} className={labelClasses}>
        {label}
      </label>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-grey-600">
            {prefix}
          </span>
        ) : null}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(inputClasses, Boolean(prefix) && "pl-12", className)}
          {...inputProps}
        />
      </div>
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-grey-600">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
