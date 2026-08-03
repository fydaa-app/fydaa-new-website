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
import { saveNominee } from '../../config/arnPartnerApi';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

interface NomineeErrors {
  nominee_name: boolean;
  relationship: boolean;
  dob: boolean;
  pan_card: boolean;
}

export default function NomineeStep({
  formData,
  updateField,
  onNext,
  onBack,
  onSubmit,
}: StepProps) {
  const [errors, setErrors] = useState<NomineeErrors>({
    nominee_name: false,
    relationship: false,
    dob: false,
    pan_card: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    if (field === 'nominee_name') {
      value = value.replace(/[^a-zA-Z\s]/g, '');
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
      pan_card:
        !formData.pan_card.trim() || !PAN_REGEX.test(formData.pan_card.trim()),
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
        setApiError(response.message || 'Finprim registration failed');
      } else {
        onSubmit?.(
          'Thank You! Your application has been submitted. We will review and approve within 24 hours.',
        );
      }
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Failed to submit application',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-gilroy font-semibold text-2xl text-[#001E3C]">
          Nominee
        </h2>
        <p className="font-inter text-sm text-gray-600 mt-1">
          Enter nominee details for your application.
        </p>
      </div>

      <div>
        <label htmlFor="nominee_name" className={LABEL_CLASS}>
          Nominee Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nominee_name"
          value={formData.nominee_name}
          onChange={(e) => handleChange('nominee_name', e.target.value)}
          className={inputClassWithError(errors.nominee_name)}
          placeholder="Enter nominee name"
        />
        {errors.nominee_name && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            Nominee name is required
          </p>
        )}
      </div>

      <div>
        <label htmlFor="relationship" className={LABEL_CLASS}>
          Relationship <span className="text-red-500">*</span>
        </label>
        <select
          id="relationship"
          value={formData.relationship}
          onChange={(e) => handleChange('relationship', e.target.value)}
          className={inputClassWithError(errors.relationship)}
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
        {errors.relationship && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            Relationship is required
          </p>
        )}
      </div>

      <div>
        <label htmlFor="dob" className={LABEL_CLASS}>
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="dob"
          value={formData.dob}
          onChange={(e) => handleChange('dob', e.target.value)}
          className={inputClassWithError(errors.dob)}
        />
        {errors.dob && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            Date of birth is required
          </p>
        )}
      </div>

      <div>
        <label htmlFor="pan_card" className={LABEL_CLASS}>
          PAN Card <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="pan_card"
          value={formData.pan_card}
          onChange={(e) => handleChange('pan_card', e.target.value.toUpperCase())}
          className={inputClassWithError(errors.pan_card)}
          placeholder="Enter PAN card number"
          maxLength={10}
        />
        {errors.pan_card && (
          <p className="text-red-500 text-xs mt-1 font-inter">
            Enter a valid PAN (e.g. ABCDE1234F)
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
          onClick={handleSubmit}
          disabled={isLoading}
          className={PRIMARY_BUTTON_CLASS}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
