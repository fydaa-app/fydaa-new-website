"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";
import {
  ICON_BUTTON_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  STEP_ACTIONS_CLASS,
  StepProps,
  inputClassWithError,
} from "./types";
import { FieldError, FieldLabel, StepAlert, StepHeader } from "./Field";
import { Eye, EyeOff } from "lucide-react";
import { saveBankDetails } from "@/features/partner-registration/api";

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_NUMBER_REGEX = /^\d{9,18}$/;

interface BankErrors {
  account_holder: boolean;
  bank_name: boolean;
  account_number: boolean;
  confirm_account_number: boolean;
  ifsc: boolean;
  match: boolean;
}

const INITIAL_ERRORS: BankErrors = {
  account_holder: false,
  bank_name: false,
  account_number: false,
  confirm_account_number: false,
  ifsc: false,
  match: false,
};

export default function BankStep({ formData, updateField, onNext, onBack }: StepProps) {
  const [errors, setErrors] = useState<BankErrors>(INITIAL_ERRORS);
  const [showAccount, setShowAccount] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: BankErrors = {
      account_holder: !formData.account_holder.trim(),
      bank_name: !formData.bank_name.trim(),
      account_number:
        !formData.account_number.trim() || !ACCOUNT_NUMBER_REGEX.test(formData.account_number.trim()),
      confirm_account_number: !formData.confirm_account_number.trim(),
      ifsc: !formData.ifsc.trim() || !IFSC_REGEX.test(formData.ifsc.trim().toUpperCase()),
      match:
        formData.account_number.trim() !== "" &&
        formData.confirm_account_number.trim() !== "" &&
        formData.account_number !== formData.confirm_account_number,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((v) => v);
  };

  const handleChange = (field: string, value: string) => {
    if (field === "account_number" || field === "confirm_account_number") {
      value = value.replace(/\D/g, "");
    }
    if (field === "account_holder") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
    }
    updateField(field, value);
    if (errors[field as keyof BankErrors]) {
      setErrors((prev) => ({ ...prev, [field]: false, match: false }));
    }
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (!formData.partner_id) return;

    setIsLoading(true);
    setApiError(null);

    try {
      await saveBankDetails({
        partnerId: parseInt(formData.partner_id, 10),
        accountHolderName: formData.account_holder,
        bankName: formData.bank_name,
        accountNumber: formData.account_number,
        confirmAccountNumber: formData.confirm_account_number,
        ifscCode: formData.ifsc,
      });
      onNext?.();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to save bank details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader title="Bank details" description="Enter your bank account details." />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="account_holder" required>
            Account holder
          </FieldLabel>
          <input
            type="text"
            id="account_holder"
            autoComplete="name"
            value={formData.account_holder}
            onChange={(e) => handleChange("account_holder", e.target.value)}
            aria-required="true"
            aria-invalid={errors.account_holder || undefined}
            aria-describedby={errors.account_holder ? "account_holder-error" : undefined}
            className={inputClassWithError(errors.account_holder)}
            placeholder="Enter account holder name"
          />
          {errors.account_holder && (
            <FieldError id="account_holder-error">Account holder name is required</FieldError>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="bank_name" required>
            Bank name
          </FieldLabel>
          <input
            type="text"
            id="bank_name"
            autoComplete="off"
            value={formData.bank_name}
            onChange={(e) => handleChange("bank_name", e.target.value)}
            aria-required="true"
            aria-invalid={errors.bank_name || undefined}
            aria-describedby={errors.bank_name ? "bank_name-error" : undefined}
            className={inputClassWithError(errors.bank_name)}
            placeholder="Enter bank name"
          />
          {errors.bank_name && <FieldError id="bank_name-error">Bank name is required</FieldError>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="account_number" required>
            Account number
          </FieldLabel>
          <div className="relative">
            <input
              type={showAccount ? "text" : "password"}
              id="account_number"
              inputMode="numeric"
              autoComplete="off"
              value={formData.account_number}
              onChange={(e) => handleChange("account_number", e.target.value)}
              aria-required="true"
              aria-invalid={errors.account_number || errors.match || undefined}
              aria-describedby={
                [errors.account_number && "account_number-error", errors.match && "account_match-error"]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              className={cn(inputClassWithError(errors.account_number || errors.match), "figure pr-14")}
              placeholder="Enter account number"
            />
            <button
              type="button"
              onClick={() => setShowAccount((v) => !v)}
              className={`${ICON_BUTTON_CLASS} absolute right-0.5 top-0.5`}
              aria-label={showAccount ? "Hide account number" : "Show account number"}
              aria-pressed={showAccount}
            >
              {showAccount ? (
                <EyeOff aria-hidden="true" className="size-5" />
              ) : (
                <Eye aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
          {errors.account_number && (
            <FieldError id="account_number-error">Enter a valid account number (9-18 digits)</FieldError>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="confirm_account_number" required>
            Confirm account number
          </FieldLabel>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              id="confirm_account_number"
              inputMode="numeric"
              autoComplete="off"
              value={formData.confirm_account_number}
              onChange={(e) => handleChange("confirm_account_number", e.target.value)}
              aria-required="true"
              aria-invalid={errors.confirm_account_number || errors.match || undefined}
              aria-describedby={
                [
                  errors.confirm_account_number && "confirm_account_number-error",
                  errors.match && "account_match-error",
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              className={cn(
                inputClassWithError(errors.confirm_account_number || errors.match),
                "figure pr-14",
              )}
              placeholder="Confirm account number"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className={`${ICON_BUTTON_CLASS} absolute right-0.5 top-0.5`}
              aria-label={showConfirm ? "Hide confirmed account number" : "Show confirmed account number"}
              aria-pressed={showConfirm}
            >
              {showConfirm ? (
                <EyeOff aria-hidden="true" className="size-5" />
              ) : (
                <Eye aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
          {errors.confirm_account_number && (
            <FieldError id="confirm_account_number-error">Confirm account number is required</FieldError>
          )}
          {errors.match && <FieldError id="account_match-error">Account numbers do not match</FieldError>}
        </div>
      </div>

      <div className="sm:max-w-[calc(50%-0.75rem)]">
        <FieldLabel htmlFor="ifsc" required>
          IFSC
        </FieldLabel>
        <input
          type="text"
          id="ifsc"
          autoComplete="off"
          autoCapitalize="characters"
          value={formData.ifsc}
          onChange={(e) => handleChange("ifsc", e.target.value.toUpperCase())}
          aria-required="true"
          aria-invalid={errors.ifsc || undefined}
          aria-describedby={errors.ifsc ? "ifsc-error" : undefined}
          className={inputClassWithError(errors.ifsc)}
          placeholder="Enter IFSC code"
        />
        {errors.ifsc && <FieldError id="ifsc-error">Enter a valid IFSC code (e.g. ABCD0123456)</FieldError>}
      </div>

      {apiError && <StepAlert key={apiError} message={apiError} />}

      <div className={STEP_ACTIONS_CLASS}>
        <button type="button" onClick={onBack} disabled={isLoading} className={SECONDARY_BUTTON_CLASS}>
          Back
        </button>
        <button type="button" onClick={handleNext} disabled={isLoading} className={PRIMARY_BUTTON_CLASS}>
          {isLoading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
