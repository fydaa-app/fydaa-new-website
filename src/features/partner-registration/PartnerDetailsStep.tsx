"use client";

import React, { useState } from "react";
import {
  ICON_BUTTON_CLASS,
  INPUT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  STEP_ACTIONS_CLASS,
  StepProps,
  inputClassWithError,
} from "./types";
import { FieldError, FieldLabel, StepAlert, StepHeader } from "./Field";
import { Plus, X } from "lucide-react";
import { savePartnerDetails } from "@/features/partner-registration/api";

const EUIN_REGEX = /^E\d{6}$/;

interface FieldErrors {
  name: boolean;
  location: boolean;
  main_euin: boolean;
  other_euins: boolean;
}

interface EuinErrorFlags {
  main_euin: boolean;
  other_euins: boolean[];
}

export default function PartnerDetailsStep({
  formData,
  updateField,
  updateOtherEuins,
  onNext,
  onBack,
}: StepProps) {
  const [errors, setErrors] = useState<FieldErrors>({
    name: false,
    location: false,
    main_euin: false,
    other_euins: false,
  });
  const [euinFieldErrors, setEuinFieldErrors] = useState<EuinErrorFlags>({
    main_euin: false,
    other_euins: [],
  });
  const [duplicates, setDuplicates] = useState<EuinErrorFlags>({
    main_euin: false,
    other_euins: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const otherEuins = formData.other_euins && formData.other_euins.length > 0 ? formData.other_euins : [""];

  const handleMainEuinChange = (value: string) => {
    updateField("main_euin", value);
    setEuinFieldErrors((prev) => ({ ...prev, main_euin: false }));
    setDuplicates((prev) => ({ ...prev, main_euin: false }));
  };

  const handleOtherEuinChange = (index: number, value: string) => {
    const newOtherEuins = [...otherEuins];
    newOtherEuins[index] = value;
    updateOtherEuins?.(newOtherEuins);
    setEuinFieldErrors((prev) => {
      const updated = { ...prev, other_euins: [...prev.other_euins] };
      updated.other_euins[index] = false;
      return updated;
    });
    setDuplicates((prev) => {
      const updated = { ...prev, other_euins: [...prev.other_euins] };
      updated.other_euins[index] = false;
      return updated;
    });
  };

  const addOtherEuin = () => {
    updateOtherEuins?.([...otherEuins, ""]);
  };

  const removeOtherEuin = (index: number) => {
    const newOtherEuins = otherEuins.filter((_, i) => i !== index);
    if (newOtherEuins.length === 0) newOtherEuins.push("");
    updateOtherEuins?.(newOtherEuins);
  };

  const handleChange = (field: string, value: string) => {
    updateField(field, value);
    if (errors[field as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleNext = async () => {
    if (!formData.partner_id) return;

    const mainEuin = formData.main_euin.trim();

    if (!mainEuin) {
      setErrors((prev) => ({ ...prev, main_euin: true }));
      setEuinFieldErrors((prev) => ({ ...prev, main_euin: true }));
      return;
    }

    if (!EUIN_REGEX.test(mainEuin)) {
      setErrors((prev) => ({ ...prev, main_euin: false }));
      setEuinFieldErrors((prev) => ({ ...prev, main_euin: true }));
      return;
    }

    setErrors((prev) => ({ ...prev, main_euin: false }));
    setEuinFieldErrors((prev) => ({ ...prev, main_euin: false }));

    const nonEmptyOtherEuins = otherEuins.filter((e) => e.trim());
    const otherEuinFormatErrors = new Array(otherEuins.length).fill(false);
    let otherHasFormatError = false;
    otherEuins.forEach((e, idx) => {
      if (e.trim() && !EUIN_REGEX.test(e.trim())) {
        otherEuinFormatErrors[idx] = true;
        otherHasFormatError = true;
      }
    });

    if (otherHasFormatError) {
      setEuinFieldErrors((prev) => ({
        ...prev,
        other_euins: otherEuinFormatErrors,
      }));
      setErrors((prev) => ({ ...prev, other_euins: false }));
      return;
    }

    setEuinFieldErrors((prev) => ({
      ...prev,
      other_euins: otherEuinFormatErrors,
    }));
    setErrors((prev) => ({ ...prev, other_euins: false }));

    const allValidEuins = [mainEuin, ...nonEmptyOtherEuins.filter((e) => EUIN_REGEX.test(e.trim()))];

    const seen = new Set<string>();
    let hasDuplicate = false;
    allValidEuins.forEach((e) => {
      if (seen.has(e)) {
        hasDuplicate = true;
      }
      seen.add(e);
    });

    if (hasDuplicate) {
      const dupFlags = {
        main_euin: nonEmptyOtherEuins.filter((e) => EUIN_REGEX.test(e.trim())).includes(mainEuin),
        other_euins: new Array(otherEuins.length).fill(false),
      };
      nonEmptyOtherEuins.forEach((e, idx) => {
        const trimmed = e.trim();
        if (trimmed && EUIN_REGEX.test(trimmed)) {
          const count = allValidEuins.filter((val) => val === trimmed).length;
          if (count > 1) {
            dupFlags.other_euins[idx] = true;
          }
        }
      });
      setDuplicates(dupFlags);
      return;
    }

    setDuplicates({
      main_euin: false,
      other_euins: new Array(otherEuins.length).fill(false),
    });

    const newErrors: FieldErrors = {
      name: !formData.name.trim(),
      location: !formData.location.trim(),
      main_euin: false,
      other_euins: false,
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.location || newErrors.main_euin || newErrors.other_euins) return;

    setApiError(null);
    setIsLoading(true);

    try {
      const otherEuinsArray = otherEuins.filter((e) => e.trim()).map((e) => e.trim());

      await savePartnerDetails({
        partnerId: parseInt(formData.partner_id, 10),
        name: formData.name.trim(),
        location: formData.location.trim(),
        expiryDate: formData.expiry_date || undefined,
        yourEuinNumber: mainEuin,
        euins: otherEuinsArray.length > 0 ? otherEuinsArray : undefined,
      });

      onNext?.();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to save partner details");
    } finally {
      setIsLoading(false);
    }
  };

  const mainEuinInvalid = euinFieldErrors.main_euin || duplicates.main_euin || errors.main_euin;
  const otherEuinsInvalid =
    errors.other_euins || euinFieldErrors.other_euins.some(Boolean) || duplicates.other_euins.some(Boolean);

  return (
    <div className="flex flex-col gap-6">
      <StepHeader title="Partner details" description="Enter your business and registration details." />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="name" required>
            Name
          </FieldLabel>
          <input
            type="text"
            id="name"
            autoComplete="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            aria-required="true"
            aria-invalid={errors.name || undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClassWithError(errors.name)}
            placeholder="Enter your name"
          />
          {errors.name && <FieldError id="name-error">Name is required</FieldError>}
        </div>

        <div>
          <FieldLabel htmlFor="location" required>
            Location
          </FieldLabel>
          <input
            type="text"
            id="location"
            autoComplete="address-level2"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            aria-required="true"
            aria-invalid={errors.location || undefined}
            aria-describedby={errors.location ? "location-error" : undefined}
            className={inputClassWithError(errors.location)}
            placeholder="Enter location"
          />
          {errors.location && <FieldError id="location-error">Location is required</FieldError>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="expiry_date">Expiry date</FieldLabel>
          <input
            type="date"
            id="expiry_date"
            value={formData.expiry_date}
            onChange={(e) => updateField("expiry_date", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <FieldLabel htmlFor="main_euin" required>
            Main EUIN
          </FieldLabel>
          <input
            type="text"
            id="main_euin"
            autoComplete="off"
            value={formData.main_euin}
            onChange={(e) => handleMainEuinChange(e.target.value)}
            aria-required="true"
            aria-invalid={mainEuinInvalid || undefined}
            aria-describedby={
              [
                (euinFieldErrors.main_euin || errors.main_euin) && "main_euin-error",
                duplicates.main_euin && "main_euin-duplicate",
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={inputClassWithError(mainEuinInvalid)}
            placeholder="Enter main EUIN (e.g. E123456)"
          />
          {(euinFieldErrors.main_euin || errors.main_euin) && (
            <FieldError id="main_euin-error">
              Main EUIN is required and must be in format E followed by 6 digits (e.g. E123456)
            </FieldError>
          )}
          {duplicates.main_euin && (
            <FieldError id="main_euin-duplicate">Main EUIN must not match any Other EUIN</FieldError>
          )}
        </div>
      </div>

      <fieldset
        aria-describedby={otherEuinsInvalid ? "other_euins-hint other_euins-error" : "other_euins-hint"}
      >
        <legend className="block text-sm font-semibold text-ink">Other EUINs</legend>
        <p id="other_euins-hint" className="mb-2 mt-0.5 text-sm text-grey-500">
          Add any additional EUINs, e.g. E654321.
        </p>
        <div className="flex flex-col gap-3">
          {otherEuins.map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={otherEuins[index]}
                onChange={(e) => handleOtherEuinChange(index, e.target.value)}
                aria-label={`Other EUIN ${index + 1}`}
                aria-invalid={
                  euinFieldErrors.other_euins[index] || duplicates.other_euins[index] || undefined
                }
                className={inputClassWithError(
                  euinFieldErrors.other_euins[index] || duplicates.other_euins[index] || false,
                )}
                placeholder={`EUIN ${index + 1}`}
              />
              {otherEuins.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOtherEuin(index)}
                  className={`${ICON_BUTTON_CLASS} hover:text-danger`}
                  aria-label={`Remove EUIN ${index + 1}`}
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              )}
              {index === otherEuins.length - 1 && (
                <button
                  type="button"
                  onClick={addOtherEuin}
                  className={ICON_BUTTON_CLASS}
                  aria-label="Add EUIN"
                >
                  <Plus aria-hidden="true" className="size-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.other_euins && (
          <FieldError id="other_euins-error">At least one Other EUIN is required</FieldError>
        )}
        {!errors.other_euins && euinFieldErrors.other_euins.some(Boolean) && (
          <FieldError id="other_euins-error">
            EUIN must be in format E followed by 6 digits (e.g. E123456)
          </FieldError>
        )}
        {!errors.other_euins &&
          !euinFieldErrors.other_euins.some(Boolean) &&
          duplicates.other_euins.some(Boolean) && (
            <FieldError id="other_euins-error">Duplicate EUIN values are not allowed</FieldError>
          )}
      </fieldset>

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
