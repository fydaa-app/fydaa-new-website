"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";
import {
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  STEP_ACTIONS_CLASS,
  StepProps,
  inputClassWithError,
} from "./types";
import { FieldError, FieldLabel, StepAlert, StepHeader } from "./Field";
import { saveNominee } from "@/features/partner-registration/api";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

interface NomineeErrors {
  nominee_name: boolean;
  relationship: boolean;
  dob: boolean;
  pan_card: boolean;
}

export default function NomineeStep({ formData, updateField, onNext, onBack, onSubmit }: StepProps) {
  const [errors, setErrors] = useState<NomineeErrors>({
    nominee_name: false,
    relationship: false,
    dob: false,
    pan_card: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    if (field === "nominee_name") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
    }
    updateField(field, value);
    if (errors[field as keyof NomineeErrors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.partner_id) return;

    const newErrors: NomineeErrors = {
      nominee_name: !formData.nominee_name.trim(),
      relationship: !formData.relationship.trim(),
      dob: !formData.dob.trim(),
      pan_card: !formData.pan_card.trim() || !PAN_REGEX.test(formData.pan_card.trim()),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((v) => v)) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await saveNominee({
        partnerId: parseInt(formData.partner_id, 10),
        nomineeName: formData.nominee_name.trim(),
        relationship: formData.relationship.trim(),
        dateOfBirth: formData.dob.trim(),
        pan: formData.pan_card.trim(),
      });

      if (!response.success) {
        setApiError(response.message || "Finprim registration failed");
      } else {
        onSubmit?.("Your application has been submitted. We will review and approve within 24 hours.");
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to submit application");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader title="Nominee" description="Enter nominee details for your application." />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="nominee_name" required>
            Nominee name
          </FieldLabel>
          <input
            type="text"
            id="nominee_name"
            autoComplete="off"
            value={formData.nominee_name}
            onChange={(e) => handleChange("nominee_name", e.target.value)}
            aria-required="true"
            aria-invalid={errors.nominee_name || undefined}
            aria-describedby={errors.nominee_name ? "nominee_name-error" : undefined}
            className={inputClassWithError(errors.nominee_name)}
            placeholder="Enter nominee name"
          />
          {errors.nominee_name && <FieldError id="nominee_name-error">Nominee name is required</FieldError>}
        </div>

        <div>
          <FieldLabel htmlFor="relationship" required>
            Relationship
          </FieldLabel>
          <select
            id="relationship"
            value={formData.relationship}
            onChange={(e) => handleChange("relationship", e.target.value)}
            aria-required="true"
            aria-invalid={errors.relationship || undefined}
            aria-describedby={errors.relationship ? "relationship-error" : undefined}
            className={cn(inputClassWithError(errors.relationship), "cursor-pointer pr-10")}
          >
            <option value="">Select relationship</option>
            <option value="son">Son</option>
            <option value="daughter">Daughter</option>
            <option value="spouse">Spouse</option>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="brother">Brother</option>
            <option value="sister">Sister</option>
            <option value="other">Other</option>
          </select>
          {errors.relationship && <FieldError id="relationship-error">Relationship is required</FieldError>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="dob" required>
            Date of birth
          </FieldLabel>
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={(e) => handleChange("dob", e.target.value)}
            aria-required="true"
            aria-invalid={errors.dob || undefined}
            aria-describedby={errors.dob ? "dob-error" : undefined}
            className={inputClassWithError(errors.dob)}
          />
          {errors.dob && <FieldError id="dob-error">Date of birth is required</FieldError>}
        </div>

        <div>
          <FieldLabel htmlFor="pan_card" required>
            PAN
          </FieldLabel>
          <input
            type="text"
            id="pan_card"
            autoComplete="off"
            autoCapitalize="characters"
            value={formData.pan_card}
            onChange={(e) => handleChange("pan_card", e.target.value.toUpperCase())}
            aria-required="true"
            aria-invalid={errors.pan_card || undefined}
            aria-describedby={errors.pan_card ? "pan_card-error" : undefined}
            className={inputClassWithError(errors.pan_card)}
            placeholder="Enter PAN card number"
            maxLength={10}
          />
          {errors.pan_card && (
            <FieldError id="pan_card-error">Enter a valid PAN (e.g. ABCDE1234F)</FieldError>
          )}
        </div>
      </div>

      {apiError && <StepAlert key={apiError} message={apiError} />}

      <div className={STEP_ACTIONS_CLASS}>
        <button type="button" onClick={onBack} disabled={isLoading} className={SECONDARY_BUTTON_CLASS}>
          Back
        </button>
        <button type="button" onClick={handleSubmit} disabled={isLoading} className={PRIMARY_BUTTON_CLASS}>
          {isLoading ? "Submitting..." : "Submit application"}
        </button>
      </div>
    </div>
  );
}
