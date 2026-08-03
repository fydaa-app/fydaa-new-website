'use client';

import React, { useState } from 'react';
import { LABEL_CLASS, INPUT_CLASS } from './types';

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  actionButton?: React.ReactNode;
}

export default function PhoneInput({
  label,
  value,
  onChange,
  placeholder = 'Mobile number',
  required = false,
  error = false,
  actionButton,
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState('+91');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    onChange(numericValue);
  };

  return (
    <div>
      <label className={LABEL_CLASS}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="h-12 px-3 border border-gray-300 border-r-0 rounded-l-[12px] bg-gray-100 text-sm text-[#001E3C] font-inter focus:outline-none focus:border-[#001E3C] focus:ring-1 focus:ring-[#001E3C] transition-colors"
        >
          <option value="+91">+91</option>
          <option value="+1">+1</option>
          <option value="+44">+44</option>
          <option value="+65">+65</option>
          <option value="+1-441">+1-441</option>
          <option value="+971">+971</option>
          <option value="+86">+86</option>
        </select>
        <input
          type="text"
          value={value}
          onChange={handlePhoneChange}
          className={`flex-1 min-w-0 h-12 px-3 sm:px-4 border border-gray-300 border-l-0 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'focus:border-[#001E3C] focus:ring-[#001E3C]'
          } rounded-r-[12px] text-sm text-[#001E3C] placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors font-inter`}
          placeholder={placeholder}
          inputMode="numeric"
          maxLength={15}
        />
        {actionButton && (
          <div className="flex items-center h-12 px-3 border border-gray-300 border-l-0 rounded-r-[12px] bg-gray-50">
            {actionButton}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-inter mt-1">{label} is required</p>
      )}
    </div>
  );
}
