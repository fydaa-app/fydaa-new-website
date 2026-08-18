'use client';

import React, { useState } from 'react';
import {
  INPUT_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  StepProps,
  inputClassWithError,
} from './types';
import { Plus, X } from 'lucide-react';
import { savePartnerDetails } from '../../config/arnPartnerApi';

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

  const otherEuins =
    formData.other_euins && formData.other_euins.length > 0
      ? formData.other_euins
      : [''];

  const handleMainEuinChange = (value: string) => {
    updateField('main_euin', value);
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
    updateOtherEuins?.([...otherEuins, '']);
  };

  const removeOtherEuin = (index: number) => {
    const newOtherEuins = otherEuins.filter((_, i) => i !== index);
    if (newOtherEuins.length === 0) newOtherEuins.push('');
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

    const allValidEuins = [
      mainEuin,
      ...nonEmptyOtherEuins.filter((e) => EUIN_REGEX.test(e.trim())),
    ];

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
        main_euin: nonEmptyOtherEuins
          .filter((e) => EUIN_REGEX.test(e.trim()))
          .includes(mainEuin),
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
      const otherEuinsArray = otherEuins
        .filter((e) => e.trim())
        .map((e) => e.trim());

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
      setApiError(
        error instanceof Error
          ? error.message
          : 'Failed to save partner details',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-gilroy font-semibold text-2xl text-[#001E3C]">
          Partner Details
        </h2>
        <p className="font-inter text-sm text-gray-600 mt-1">
          Enter your business and registration details.
        </p>
      </div>

      <div>
        <label htmlFor="name" className={LABEL_CLASS}>
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={inputClassWithError(errors.name)}
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            Name is required
          </p>
        )}
      </div>

      <div>
        <label htmlFor="location" className={LABEL_CLASS}>
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className={inputClassWithError(errors.location)}
          placeholder="Enter location"
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            Location is required
          </p>
        )}
      </div>

      <div>
        <label htmlFor="expiry_date" className={LABEL_CLASS}>
          Expiry Date
        </label>
        <input
          type="date"
          id="expiry_date"
          value={formData.expiry_date}
          onChange={(e) => updateField('expiry_date', e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="main_euin" className={LABEL_CLASS}>
          Main EUIN <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="main_euin"
          value={formData.main_euin}
          onChange={(e) => handleMainEuinChange(e.target.value)}
          className={inputClassWithError(
            euinFieldErrors.main_euin || duplicates.main_euin || errors.main_euin,
          )}
          placeholder="Enter main EUIN (e.g. E123456)"
        />
        {(euinFieldErrors.main_euin || errors.main_euin) && (
          <p className="text-xs text-red-500 font-inter mt-1">
            Main EUIN is required and must be in format E followed by 6 digits (e.g. E123456)
          </p>
        )}
        {duplicates.main_euin && (
          <p className="text-xs text-red-500 font-inter mt-1">
            Main EUIN must not match any Other EUIN
          </p>
        )}
      </div>

      <div>
        <label className={LABEL_CLASS}>
          Other EUINs
          <span className="block text-xs text-gray-500 font-normal mt-1">
            (Add additional EUINs, e.g. E654321)
          </span>
        </label>
        <div className="space-y-3">
          {otherEuins.map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={otherEuins[index]}
                onChange={(e) => handleOtherEuinChange(index, e.target.value)}
                className={inputClassWithError(
                  euinFieldErrors.other_euins[index] ||
                    duplicates.other_euins[index] ||
                    false,
                )}
                placeholder={`EUIN ${index + 1}`}
              />
              {otherEuins.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOtherEuin(index)}
                  className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Remove EUIN"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              {index === otherEuins.length - 1 && (
                <button
                  type="button"
                  onClick={addOtherEuin}
                  className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Add EUIN"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.other_euins && (
          <p className="text-xs text-red-500 font-inter mt-1">
            At least one Other EUIN is required
          </p>
        )}
        {!errors.other_euins && euinFieldErrors.other_euins.some(Boolean) && (
          <p className="text-xs text-red-500 font-inter mt-1">
            EUIN must be in format E followed by 6 digits (e.g. E123456)
          </p>
        )}
        {!errors.other_euins &&
          !euinFieldErrors.other_euins.some(Boolean) &&
          duplicates.other_euins.some(Boolean) && (
            <p className="text-xs text-red-500 font-inter mt-1">
              Duplicate EUIN values are not allowed
            </p>
          )}
      </div>

      {apiError && (
        <p className="text-xs text-red-500 font-inter">{apiError}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className={SECONDARY_BUTTON_CLASS}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isLoading}
          className={PRIMARY_BUTTON_CLASS}
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
