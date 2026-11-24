"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils/cn";
import { FieldLabel } from "./Field";
import { inputClassWithError } from "./types";

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  readOnly?: boolean;
  /** The Verify button, or its status ("OTP sent", "Verified"), beside the field. */
  actionButton?: React.ReactNode;
  /** Id of the error or hint below the field. */
  describedBy?: string;
}

/** Indian mobile number: "+91" shown in the field, 10 digits typed. */
export default function PhoneInput({
  label,
  value,
  onChange,
  placeholder = "Mobile number",
  required = false,
  error = false,
  readOnly = false,
  actionButton,
  describedBy,
}: PhoneInputProps) {
  const inputId = useId();
  const prefixId = `${inputId}-prefix`;
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(numericValue);
  };

  return (
    <div>
      <FieldLabel htmlFor={inputId} required={required}>
        {label}
      </FieldLabel>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="relative">
          <span
            id={prefixId}
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base text-grey-600"
          >
            +91
          </span>
          <input
            id={inputId}
            type="tel"
            autoComplete="tel-national"
            value={value}
            onChange={handlePhoneChange}
            readOnly={readOnly}
            aria-required={required || undefined}
            aria-invalid={error || undefined}
            aria-describedby={[prefixId, describedBy].filter(Boolean).join(" ")}
            className={cn(inputClassWithError(error, readOnly), "pl-14")}
            placeholder={placeholder}
            inputMode="numeric"
            maxLength={10}
          />
        </div>
        {actionButton ? (
          <div aria-live="polite" className="flex">
            {actionButton}
          </div>
        ) : null}
      </div>
    </div>
  );
}
