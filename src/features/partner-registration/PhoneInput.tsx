'use client';

import React from 'react';
import { LABEL_CLASS, INPUT_CLASS } from './types';

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  readOnly?: boolean;
  actionButton?: React.ReactNode;
}

export default function PhoneInput({
  label,
  value,
  onChange,
  placeholder = 'Mobile number',
  required = false,
  error = false,
  readOnly = false,
  actionButton,
}: PhoneInputProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange(numericValue);
  };

  return (
    <div>
      <label className={LABEL_CLASS}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex">
        <input
          type="text"
          value={value}
          onChange={handlePhoneChange}
          readOnly={readOnly}
          className={`flex-1 min-w-0 h-12 px-3 sm:px-4 border border-gray-300 border-l-0 rounded-l-xl text-sm text-ink placeholder:text-gray-500 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors font-inter ${
            readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
          } ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : ''
          }`}
          placeholder={placeholder}
          inputMode="numeric"
          maxLength={10}
        />
        {actionButton && (
          <div className="flex items-center h-12 px-3 border border-gray-300 border-l-0 rounded-r-xl bg-gray-50">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}
