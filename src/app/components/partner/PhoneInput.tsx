'use client';

import React from 'react';
import { LABEL_CLASS, inputClassWithError } from './types';

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  actionButton?: React.ReactNode;
}

export default function PhoneInput({
  label,
  value,
  onChange,
  placeholder = 'Mobile number',
  required = false,
  error,
  actionButton,
}: PhoneInputProps) {
  const hasError = !!error;
  const errorBorderClass = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : '';

  const inputClassName = actionButton
    ? `flex-1 h-12 min-w-0 px-3 sm:px-4 border border-gray-300 border-l-0 border-r-0 rounded-none text-sm text-[#001E3C] placeholder:text-gray-400 focus:outline-none focus:border-[#001E3C] focus:ring-1 focus:ring-[#001E3C] transition-colors font-inter ${errorBorderClass}`
    : `flex-1 h-12 min-w-0 px-3 sm:px-4 border border-gray-300 border-l-0 rounded-r-[12px] text-sm text-[#001E3C] placeholder:text-gray-400 focus:outline-none focus:border-[#001E3C] focus:ring-1 focus:ring-[#001E3C] transition-colors font-inter ${errorBorderClass}`;

  return (
    <div>
      <label className={LABEL_CLASS}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="flex">
        <select
          className={`w-[70px] sm:w-[90px] h-12 px-2 sm:px-3 border border-gray-300 border-r-0 rounded-l-[12px] bg-gray-50 text-sm text-[#001E3C] focus:outline-none focus:ring-1 focus:ring-[#001E3C] font-inter ${errorBorderClass}`}
          defaultValue="+91"
        >
          <option value="+91">+91</option>
        </select>
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClassName}
          placeholder={placeholder}
          inputMode="numeric"
          maxLength={10}
        />
        {actionButton && (
          <div className="flex items-center h-12 px-3 border border-gray-300 border-l-0 rounded-r-[12px] bg-gray-50">
            {actionButton}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-inter mt-1">{error}</p>
      )}
    </div>
  );
}
