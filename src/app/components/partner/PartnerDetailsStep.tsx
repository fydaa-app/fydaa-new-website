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
  euins: boolean;
}

export default function PartnerDetailsStep({
  formData,
  updateField,
  updateEuins,
  onNext,
  onBack,
}: StepProps) {
  const [errors, setErrors] = useState<FieldErrors>({
    name: false,
    location: false,
    euins: false,
  });
  const [euinFieldErrors, setEuinFieldErrors] = useState<boolean[]>([]);
  const [duplicates, setDuplicates] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const euins =
    formData.euins && formData.euins.length > 0 ? formData.euins : [''];

  const handleEuinChange = (index: number, value: string) => {
    const newEuins = [...euins];
    newEuins[index] = value;
    updateEuins?.(newEuins);
    setEuinFieldErrors((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
    setDuplicates((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  const addEuin = () => {
    updateEuins?.([...euins, '']);
  };

  const removeEuin = (index: number) => {
    const newEuins = euins.filter((_, i) => i !== index);
    if (newEuins.length === 0) newEuins.push('');
    updateEuins?.(newEuins);
  };

  const handleChange = (field: string, value: string) => {
    updateField(field, value);
    if (errors[field as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleNext = async () => {
    if (!formData.partner_id) return;

    const nonEmptyEuins = euins.filter((e) => e.trim());
    if (nonEmptyEuins.length === 0) {
      setErrors((prev) => ({ ...prev, euins: true }));
      setEuinFieldErrors([]);
      return;
    }

    const formatErrors = new Array(euins.length).fill(false);
    let hasFormatError = false;
    euins.forEach((e, idx) => {
      if (e.trim() && !EUIN_REGEX.test(e.trim())) {
        formatErrors[idx] = true;
        hasFormatError = true;
      }
    });

    if (hasFormatError) {
      setEuinFieldErrors(formatErrors);
      setErrors((prev) => ({ ...prev, euins: false }));
      return;
    }

    setEuinFieldErrors(formatErrors);
    setErrors((prev) => ({ ...prev, euins: false }));

    const seen = new Set<string>();
    const dupFlags = new Array(euins.length).fill(false);
    let hasDuplicate = false;
    euins.forEach((e, idx) => {
      const trimmed = e.trim();
      if (trimmed && EUIN_REGEX.test(trimmed)) {
        if (seen.has(trimmed)) {
          dupFlags[idx] = true;
          hasDuplicate = true;
        }
        seen.add(trimmed);
      }
    });

    if (hasDuplicate) {
      setDuplicates(dupFlags);
      return;
    }

    setDuplicates(dupFlags);

    const newErrors: FieldErrors = {
      name: !formData.name.trim(),
      location: !formData.location.trim(),
      euins: false,
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.location || newErrors.euins) return;

    setApiError(null);
    setIsLoading(true);

    try {
      const euinsArray = euins
        .filter((e) => e.trim())
        .map((e) => e.trim());

      await savePartnerDetails({
        partnerId: parseInt(formData.partner_id, 10),
        name: formData.name.trim(),
        location: formData.location.trim(),
        expiryDate: formData.expiry_date || undefined,
        euins: euinsArray.length > 0 ? euinsArray : undefined,
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
        <label className={LABEL_CLASS}>
          EUINs
          <span className="block text-xs text-gray-500 font-normal mt-1">
            (Enter one or more EUINs, e.g. E123456)
          </span>
        </label>
        <div className="space-y-3">
          {euins.map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={euins[index]}
                onChange={(e) => handleEuinChange(index, e.target.value)}
                className={inputClassWithError(
                  euinFieldErrors[index] || duplicates[index] || false,
                )}
                placeholder={`EUIN ${index + 1}`}
              />
              {euins.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEuin(index)}
                  className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Remove EUIN"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              {index === euins.length - 1 && (
                <button
                  type="button"
                  onClick={addEuin}
                  className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Add EUIN"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.euins && (
          <p className="text-xs text-red-500 font-inter mt-1">
            At least one EUIN is required
          </p>
        )}
        {!errors.euins && euinFieldErrors.some(Boolean) && (
          <p className="text-xs text-red-500 font-inter mt-1">
            EUIN must be in format E followed by 6 digits (e.g. E123456)
          </p>
        )}
        {!errors.euins &&
          !euinFieldErrors.some(Boolean) &&
          duplicates.some(Boolean) && (
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
