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

interface FieldErrors {
  name: boolean;
  location: boolean;
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
  });

  const euins =
    formData.euins && formData.euins.length > 0 ? formData.euins : [''];

  const handleEuinChange = (index: number, value: string) => {
    const newEuins = [...euins];
    newEuins[index] = value;
    updateEuins?.(newEuins);
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

  const handleNext = () => {
    const newErrors: FieldErrors = {
      name: !formData.name.trim(),
      location: !formData.location.trim(),
    };
    setErrors(newErrors);
    if (newErrors.name || newErrors.location) return;
    onNext();
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
            (Enter one or more EUINs)
          </span>
        </label>
        <div className="space-y-3">
          {euins.map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={euins[index]}
                onChange={(e) => handleEuinChange(index, e.target.value)}
                className={INPUT_CLASS}
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
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button type="button" onClick={onBack} className={SECONDARY_BUTTON_CLASS}>
          Back
        </button>
        <button type="button" onClick={handleNext} className={PRIMARY_BUTTON_CLASS}>
          Continue
        </button>
      </div>
    </div>
  );
}
