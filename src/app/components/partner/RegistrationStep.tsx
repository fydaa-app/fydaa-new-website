'use client';

import React, { useState, useRef, useEffect } from 'react';

import {
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
  StepProps,
  inputClassWithError,
} from './types';
import PhoneInput from './PhoneInput';
import {
  sendEmailOtp,
  verifyEmailOtp,
  sendMobileOtp,
  verifyMobileOtp,
  confirmArnDetails,
} from '../../config/arnPartnerApi';

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN_SECONDS = 30;

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
    e: React.KeyboardEvent<HTMLInputElement>,
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
    email_otp?: string;
    checkboxes?: string;
  }>({});
  const [emailOtpRequested, setEmailOtpRequested] = useState(false);
  const [mobileOtpRequested, setMobileOtpRequested] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [mobileResendCountdown, setMobileResendCountdown] = useState(0);
  const [mobileApiError, setMobileApiError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [agreeCheckbox, setAgreeCheckbox] = useState(false);
  const [indiaResidentCheckbox, setIndiaResidentCheckbox] = useState(false);

  const arnLocked = emailVerified;

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCountdown]);

  useEffect(() => {
    if (mobileResendCountdown > 0) {
      const timer = setInterval(() => {
        setMobileResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mobileResendCountdown]);

  const handleInputChange = (field: string, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
    if (field === 'registration_number') {
      value = value.replace(/\D/g, '');
    }
    updateField(field, value);
  };

  const validateEmailFields = (): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestEmailOtp = async () => {
    if (!validateEmailFields()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await sendEmailOtp(
        formData.registration_number,
        formData.email,
      );

      const returnedPartnerId = response.data?.partnerId;
      if (returnedPartnerId) {
        setPartnerId(returnedPartnerId);
        updateField('partner_id', String(returnedPartnerId));
      }
      setEmailOtpRequested(true);
      setResendCountdown(RESEND_COUNTDOWN_SECONDS);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Failed to send email OTP',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!partnerId) return;
    if (formData.email_otp.length !== OTP_LENGTH) return;

    setIsLoading(true);
    setApiError(null);

    try {
      await verifyEmailOtp(partnerId, formData.email_otp);
      setEmailVerified(true);
      setEmailOtpRequested(false);
      updateField('email_otp', '');
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Failed to verify email OTP',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmailOtp = async () => {
    if (resendCountdown > 0) return;

    if (!validateEmailFields()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await sendEmailOtp(
        formData.registration_number,
        formData.email,
      );

      const returnedPartnerId = response.data?.partnerId;
      if (returnedPartnerId) {
        setPartnerId(returnedPartnerId);
        updateField('partner_id', String(returnedPartnerId));
      }
      updateField('email_otp', '');
      setResendCountdown(RESEND_COUNTDOWN_SECONDS);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Failed to resend email OTP',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestMobileOtp = async () => {
    if (!emailVerified) return;
    if (!partnerId) return;
    if (!formData.phone.trim()) return;

    const numericPhone = formData.phone.replace(/\D/g, '');
    if (numericPhone.length < 10) return;

    setIsLoading(true);
    setMobileApiError(null);

    try {
      await sendMobileOtp(
        partnerId,
        numericPhone,
        '+91',
      );

      updateField('phone', numericPhone);
      setMobileOtpRequested(true);
      setMobileResendCountdown(RESEND_COUNTDOWN_SECONDS);
    } catch (error) {
      setMobileApiError(
        error instanceof Error ? error.message : 'Failed to send mobile OTP',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (!partnerId) return;
    if (formData.mobile_otp.length !== OTP_LENGTH) return;

    setIsLoading(true);
    setMobileApiError(null);

    try {
      await verifyMobileOtp(partnerId, formData.mobile_otp);
      setMobileVerified(true);
      setMobileOtpRequested(false);
      updateField('mobile_otp', '');
    } catch (error) {
      setMobileApiError(
        error instanceof Error ? error.message : 'Failed to verify mobile OTP',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendMobileOtp = async () => {
    if (mobileResendCountdown > 0) return;
    if (!partnerId) return;
    if (!formData.phone.trim()) return;

    const numericPhone = formData.phone.replace(/\D/g, '');
    if (numericPhone.length < 10) return;

    setIsLoading(true);
    setMobileApiError(null);

    try {
      await sendMobileOtp(partnerId, numericPhone, '+91');
      updateField('mobile_otp', '');
      setMobileResendCountdown(RESEND_COUNTDOWN_SECONDS);
    } catch (error) {
      setMobileApiError(
        error instanceof Error ? error.message : 'Failed to resend mobile OTP',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const bothVerified = emailVerified && mobileVerified;

  const handleContinue = async () => {
    setErrors({});
    setApiError(null);
    setMobileApiError(null);

    if (!emailVerified) {
      setErrors({ email: 'Please verify your email OTP' });
      return;
    }

    if (!mobileVerified) {
      setErrors({ phone: 'Please verify your mobile OTP' });
      return;
    }

    if (!formData.phone.trim() && emailVerified) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }

    if (!partnerId) {
      setErrors({ phone: 'Session expired. Please restart registration.' });
      return;
    }

    if (!agreeCheckbox || !indiaResidentCheckbox) {
      setErrors({ checkboxes: 'Please agree to all terms to continue' });
      return;
    }

    setIsConfirming(true);

    try {
      await confirmArnDetails(partnerId);
      onNext?.();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'Failed to confirm ARN details',
      );
    } finally {
      setIsConfirming(false);
    }
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
            readOnly={arnLocked}
            className={`flex-1 h-12 min-w-0 px-3 sm:px-4 border border-gray-300 border-l-0 rounded-r-[12px] text-sm text-[#001E3C] placeholder:text-gray-400 focus:outline-none focus:border-[#001E3C] focus:ring-1 focus:ring-[#001E3C] transition-colors font-inter ${
              arnLocked ? 'bg-gray-100 cursor-not-allowed' : ''
            } ${
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
            readOnly={arnLocked}
            className={`flex-1 h-12 min-w-0 px-3 sm:px-4 border border-gray-300 border-l-0 rounded-l-[12px] text-sm text-[#001E3C] placeholder:text-gray-400 focus:outline-none focus:border-[#001E3C] focus:ring-1 focus:ring-[#001E3C] transition-colors font-inter ${
              arnLocked ? 'bg-gray-100 cursor-not-allowed' : ''
            } ${
              errors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : ''
            }`}
            placeholder="AMFI Registered Email Address"
          />
          <div className="flex items-center h-12 px-3 border border-gray-300 border-l-0 rounded-r-[12px] bg-gray-50">
            {emailVerified ? (
              <div className="flex items-center gap-1 text-green-600 font-inter text-sm">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </div>
            ) : emailOtpRequested ? (
              <span className="text-gray-400 font-inter text-sm">
                OTP Sent
              </span>
            ) : (
              <button
                type="button"
                onClick={handleRequestEmailOtp}
                disabled={isLoading || !formData.registration_number.trim() || !formData.email.trim()}
                className="text-[#001E3C] font-inter text-sm underline underline-offset-2 hover:no-underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        {apiError && !emailVerified && (
          <p className="text-xs text-red-500 font-inter mt-1">
            {apiError}
          </p>
        )}
      </div>

      {emailOtpRequested && !emailVerified && (
        <div>
          <OtpInputRow
            value={formData.email_otp || ''}
            onChange={(val) => handleInputChange('email_otp', val)}
            autoFocus={true}
          />
          <button
            type="button"
            onClick={handleVerifyEmailOtp}
            disabled={isLoading || formData.email_otp.length !== OTP_LENGTH}
            className={`mt-3 w-full h-12 bg-black text-white rounded-[12px] font-medium font-inter hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <div className="mt-3 text-center">
            {resendCountdown > 0 ? (
              <span className="text-sm text-gray-500 font-inter">
                Resend in {resendCountdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendEmailOtp}
                disabled={isLoading}
                className="text-sm text-[#001E3C] font-inter underline underline-offset-2 hover:no-underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend
              </button>
            )}
          </div>
        </div>
      )}

      <PhoneInput
        label="Phone Number"
        value={formData.phone}
        onChange={(value) => handleInputChange('phone', value)}
        placeholder="Mobile number"
        required={emailVerified}
        error={!!errors.phone}
        actionButton={
          emailVerified ? (
            mobileVerified ? (
              <div className="flex items-center gap-1 text-green-600 font-inter text-sm">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1  1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRequestMobileOtp}
                disabled={
                  isLoading || !formData.phone.trim() || !/^\d{10}$/.test(formData.phone)
                }
                className="text-[#001E3C] font-inter text-sm underline underline-offset-2 hover:no-underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Verify'}
              </button>
            )
          ) : (
            <span className="text-gray-400 font-inter text-sm">
              Verify email first
            </span>
          )
        }
      />

      {mobileOtpRequested && !mobileVerified && (
        <div>
          <OtpInputRow
            value={formData.mobile_otp || ''}
            onChange={(val) => handleInputChange('mobile_otp', val)}
            autoFocus={true}
          />
          <button
            type="button"
            onClick={handleVerifyMobileOtp}
            disabled={isLoading || formData.mobile_otp.length !== OTP_LENGTH}
            className={`mt-3 w-full h-12 bg-black text-white rounded-[12px] font-medium font-inter hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <div className="mt-3 text-center">
            {mobileResendCountdown > 0 ? (
              <span className="text-sm text-gray-500 font-inter">
                Resend in {mobileResendCountdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendMobileOtp}
                disabled={isLoading}
                className="text-sm text-[#001E3C] font-inter underline underline-offset-2 hover:no-underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend
              </button>
            )}
          </div>
          {mobileApiError && (
            <p className="text-xs text-red-500 font-inter mt-1 text-center">
              {mobileApiError}
            </p>
          )}
        </div>
      )}

      <div className="space-y-4 pt-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreeCheckbox}
            onChange={(e) => setAgreeCheckbox(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#001E3C] focus:ring-[#001E3C]"
          />
          <span className="font-inter text-sm text-gray-700 leading-relaxed">
            By clicking Continue, you will be creating an account with AssetPlus,
            an AMFI registered Mutual Fund Distribution Platform and agree to our{' '}
            <a href="#" className="text-[#001E3C] underline">
              Terms &amp; Conditions
            </a>{', '}
            <a href="#" className="text-[#001E3C] underline">
              Privacy Policy
            </a>{', '}
            <a href="#" className="text-[#001E3C] underline">
              Disclaimer
            </a>
            {' and '}
            <a href="#" className="text-[#001E3C] underline">
              Agreement
            </a>
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={indiaResidentCheckbox}
            onChange={(e) => setIndiaResidentCheckbox(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#001E3C] focus:ring-[#001E3C]"
          />
          <span className="font-inter text-sm text-gray-700 leading-relaxed">
            I confirm that I am an individual residing in India for tax purposes{' '}
            <a href="#" className="text-[#001E3C] underline">
              Terms &amp; Conditions
            </a>{', '}
            <a href="#" className="text-[#001E3C] underline">
              Privacy Policy
            </a>{', '}
            <a href="#" className="text-[#001E3C] underline">
              Disclaimer
            </a>
            {' and '}
            <a href="#" className="text-[#001E3C] underline">
              Agreement
            </a>
          </span>
        </label>

        {errors.checkboxes && (
          <p className="text-xs text-red-500 font-inter mt-1">
            {errors.checkboxes}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={
          !bothVerified ||
          !agreeCheckbox ||
          !indiaResidentCheckbox ||
          isLoading ||
          isConfirming
        }
        className={`w-full h-12 rounded-[12px] font-medium font-inter transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 ${
          bothVerified &&
          !isConfirming &&
          agreeCheckbox &&
          indiaResidentCheckbox
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isConfirming
          ? 'Confirming...'
          : bothVerified
            ? 'Continue'
            : emailVerified && !mobileVerified
              ? 'Verify mobile to continue'
              : 'Verify email and mobile to continue'}
      </button>
    </div>
  );
}
