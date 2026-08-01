'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
  StepProps,
  inputClassWithError,
} from './types';
import PhoneInput from './PhoneInput';
import { Eye, EyeOff } from 'lucide-react';

const OTP_LENGTH = 6;

const otpInputClass =
  'w-10 sm:w-12 h-10 sm:h-12 border border-gray-300 rounded-[12px] text-center text-sm text-[#001E3C] placeholder:text-gray-400 focus:outline-none focus:border-[#001E3C] focus:ring-1 focus:ring-[#001E3C] transition-colors font-inter';

interface OtpRowProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

function OtpInputRow({ value, onChange, autoFocus = false }: OtpRowProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && refs.current[0]) {
      refs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, charValue: string) => {
    if (charValue.length > 1) return;

    let newOtp = '';
    for (let i = 0; i < OTP_LENGTH; i++) {
      newOtp += i === index ? charValue : value[i] || '';
    }
    onChange(newOtp);

    if (charValue && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    onChange(paste);

    setTimeout(() => {
      const nextField = Math.min(paste.length, OTP_LENGTH - 1);
      refs.current[nextField]?.focus();
    }, 0);
  };

  return (
    <div className="flex justify-center gap-1 sm:gap-2 mt-2">
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          ref={(el) => {
            refs.current[index] = el;
          }}
          className={otpInputClass}
        />
      ))}
    </div>
  );
}

export default function RegistrationStep({
  formData,
  updateField,
  onNext,
}: StepProps) {
  const [errors, setErrors] = useState<{
    registration_number?: string;
    email?: string;
    phone?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [emailOtpRequested, setEmailOtpRequested] = useState(false);
  const [mobileOtpRequested, setMobileOtpRequested] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    updateField(field, value);
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.registration_number.trim()) {
      newErrors.registration_number = 'Registration number is required';
    } else if (!/^\d+$/.test(formData.registration_number)) {
      newErrors.registration_number =
        'Registration number must contain only numbers';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain only numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestEmailOtp = () => {
    if (!validate()) return;
    setEmailOtpRequested(true);
  };

  const handleRequestMobileOtp = () => {
    if (!validate()) return;
    setMobileOtpRequested(true);
  };

  const handleVerifyEmailOtp = () => {
    if (formData.email_otp.length === OTP_LENGTH) {
      setEmailVerified(true);
    }
  };

  const handleVerifyMobileOtp = () => {
    if (formData.mobile_otp.length === OTP_LENGTH) {
      setMobileVerified(true);
    }
  };

  const bothVerified = emailVerified && mobileVerified;

  const handleContinue = () => {
    if (!validate()) return;
    if (!emailVerified) {
      setErrors({ email: 'Please verify your email OTP' });
      return;
    }
    if (!mobileVerified) {
      setErrors({ phone: 'Please verify your mobile OTP' });
      return;
    }
    setErrors({});
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-gilroy font-semibold text-2xl text-[#001E3C]">
          ARN Details
        </h2>
        <p className="font-inter text-sm text-gray-600 mt-1">
          Enter your AMFI registration details.
        </p>
      </div>

      <div>
        <label htmlFor="registration_number" className={LABEL_CLASS}>
          Registration Number <span className="text-red-500">*</span>
        </label>
        <div className="flex">
          <span className="flex items-center h-12 px-3 sm:px-4 border border-gray-300 border-r-0 rounded-l-[12px] bg-gray-100 text-sm text-[#001E3C] font-inter">
            ARN-
          </span>
          <input
            type="text"
            id="registration_number"
            value={formData.registration_number}
            onChange={(e) =>
              handleInputChange('registration_number', e.target.value)
            }
            className={`flex-1 h-12 min-w-0 px-3 sm:px-4 border border-gray-300 border-l-0 rounded-r-[12px] text-sm text-[#001E3C] placeholder:text-gray-400 focus:outline-none focus:border-[#001E3C] focus:ring-1 focus:ring-[#001E3C] transition-colors font-inter ${
              errors.registration_number
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : ''
            }`}
            placeholder="12345"
          />
        </div>
        {errors.registration_number && (
          <p className="text-xs text-red-500 font-inter mt-1">
            {errors.registration_number}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={LABEL_CLASS}>
          Email ( Registered with AMFI ) <span className="text-red-500">*</span>
        </label>
        <div className="flex">
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`flex-1 h-12 min-w-0 px-3 sm:px-4 border border-gray-300 rounded-l-[12px] text-sm text-[#001E3C] placeholder:text-gray-400 focus:outline-none focus:border-[#001E3C] focus:ring-1 focus:ring-[#001E3C] transition-colors font-inter ${
              errors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : ''
            }`}
            placeholder="AMFI Registered Email Address"
          />
          <div className="flex items-center h-12 px-3 border border-gray-300 border-l-0 rounded-r-[12px] bg-gray-50">
            {emailVerified ? (
              <div className="flex items-center gap-1 text-green-600 font-inter text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRequestEmailOtp}
                className="text-[#001E3C] font-inter text-sm underline underline-offset-2 hover:no-underline transition-colors"
              >
                Verify
              </button>
            )}
          </div>
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 font-inter mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {emailOtpRequested && !emailVerified && (
        <div>
          <OtpInputRow
            value={formData.email_otp || ''}
            onChange={(val) => updateField('email_otp', val)}
            autoFocus={true}
          />
          <button
            type="button"
            onClick={handleVerifyEmailOtp}
            className="mt-3 w-full h-12 bg-black text-white rounded-[12px] font-medium font-inter hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Verify
          </button>
        </div>
      )}

      <PhoneInput
        label="Phone Number"
        value={formData.phone}
        onChange={(value) => handleInputChange('phone', value)}
        placeholder="Mobile number"
        required
        error={errors.phone}
        actionButton={
          mobileVerified ? (
            <div className="flex items-center gap-1 text-green-600 font-inter text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRequestMobileOtp}
              className="text-[#001E3C] font-inter text-sm underline underline-offset-2 hover:no-underline transition-colors"
            >
              Verify
            </button>
          )
        }
      />

      {mobileOtpRequested && !mobileVerified && (
        <div>
          <OtpInputRow
            value={formData.mobile_otp || ''}
            onChange={(val) => updateField('mobile_otp', val)}
            autoFocus={true}
          />
          <button
            type="button"
            onClick={handleVerifyMobileOtp}
            className="mt-3 w-full h-12 bg-black text-white rounded-[12px] font-medium font-inter hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Verify
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleContinue}
        disabled={!bothVerified}
        className={`w-full h-12 rounded-[12px] font-medium font-inter transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 ${
          bothVerified
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {bothVerified ? 'Continue' : 'Verify mobile and email to continue'}
      </button>
    </div>
  );
}
