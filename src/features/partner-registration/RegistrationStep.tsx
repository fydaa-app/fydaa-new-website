"use client";

import React, { useState, useRef, useEffect } from "react";

import { cn } from "@/lib/utils/cn";
import { INPUT_CLASS, LABEL_CLASS, PRIMARY_BUTTON_CLASS, StepProps, inputClassWithError } from "./types";
import { FieldError, FieldLabel, SlotStatus, StepAlert, StepHeader, VerifiedStatus } from "./Field";
import PhoneInput from "./PhoneInput";
import {
  sendEmailOtp,
  verifyEmailOtp,
  sendMobileOtp,
  verifyMobileOtp,
  confirmArnDetails,
} from "@/features/partner-registration/api";

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN_SECONDS = 30;

/** The Verify button beside the email and phone fields, and Verify OTP beside the code. */
const VERIFY_BUTTON_CLASS = "btn btn-secondary btn-lg w-full sm:w-auto";
const VERIFY_OTP_BUTTON_CLASS = "btn btn-primary btn-lg w-full sm:w-auto";

/** Resend link under an OTP field (44px tall tap target). */
const RESEND_BUTTON_CLASS =
  "inline-flex min-h-11 items-center text-sm font-semibold text-emerald underline decoration-emerald/35 " +
  "underline-offset-4 transition-colors duration-quick hover:decoration-current disabled:cursor-not-allowed " +
  "disabled:text-grey-500 disabled:no-underline";

interface OtpFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onVerify: () => void;
  verifying: boolean;
  disabled: boolean;
  resendIn: number;
  onResend: () => void;
  resendDisabled: boolean;
  error?: string | null;
}

/**
 * One OTP field (like the home page's book-a-call form): a single input that takes typing,
 * pasting and SMS autofill natively, with Verify beside it and Resend under it.
 */
function OtpField({
  id,
  label,
  value,
  onChange,
  onVerify,
  verifying,
  disabled,
  resendIn,
  onResend,
  resendDisabled,
  error,
}: OtpFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="rounded-card border border-line p-4 sm:p-5">
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,13rem)_auto] sm:items-center">
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={OTP_LENGTH}
          placeholder="6-digit OTP"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(INPUT_CLASS, "figure tracking-[0.2em] placeholder:tracking-normal")}
        />
        <button type="button" onClick={onVerify} disabled={disabled} className={VERIFY_OTP_BUTTON_CLASS}>
          {verifying ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
      <div className="mt-1" aria-live="polite">
        {resendIn > 0 ? (
          <span className="inline-flex min-h-11 items-center text-sm text-grey-500">
            Resend in {resendIn}s
          </span>
        ) : (
          <button type="button" onClick={onResend} disabled={resendDisabled} className={RESEND_BUTTON_CLASS}>
            Resend
          </button>
        )}
      </div>
      {error ? <StepAlert key={error} id={`${id}-error`} message={error} className="mt-2" /> : null}
    </div>
  );
}

export default function RegistrationStep({ formData, updateField, onNext }: StepProps) {
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
    if (field === "registration_number") {
      value = value.replace(/\D/g, "");
    }
    updateField(field, value);
  };

  const validateEmailFields = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.registration_number.trim()) {
      newErrors.registration_number = "Registration number is required";
    } else if (!/^\d+$/.test(formData.registration_number)) {
      newErrors.registration_number = "Registration number must contain only numbers";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestEmailOtp = async () => {
    if (!validateEmailFields()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await sendEmailOtp(formData.registration_number, formData.email);

      const returnedPartnerId = response.data?.partnerId;
      if (returnedPartnerId) {
        setPartnerId(returnedPartnerId);
        updateField("partner_id", String(returnedPartnerId));
      }
      setEmailOtpRequested(true);
      setResendCountdown(RESEND_COUNTDOWN_SECONDS);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to send email OTP");
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
      updateField("email_otp", "");
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to verify email OTP");
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
      const response = await sendEmailOtp(formData.registration_number, formData.email);

      const returnedPartnerId = response.data?.partnerId;
      if (returnedPartnerId) {
        setPartnerId(returnedPartnerId);
        updateField("partner_id", String(returnedPartnerId));
      }
      updateField("email_otp", "");
      setResendCountdown(RESEND_COUNTDOWN_SECONDS);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to resend email OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestMobileOtp = async () => {
    if (!emailVerified) return;
    if (!partnerId) {
      setMobileApiError("Session expired. Please verify your email again.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrors((prev) => ({ ...prev, phone: "Phone number is required" }));
      return;
    }

    const numericPhone = formData.phone.replace(/\D/g, "");
    if (numericPhone.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        phone: "Enter a valid 10-digit mobile number",
      }));
      return;
    }

    setIsLoading(true);
    setMobileApiError(null);
    setErrors((prev) => ({ ...prev, phone: undefined }));

    try {
      await sendMobileOtp(partnerId, numericPhone, "+91");

      updateField("phone", numericPhone);
      updateField("mobile_otp", "");
      setMobileOtpRequested(true);
      setMobileResendCountdown(RESEND_COUNTDOWN_SECONDS);
    } catch (error) {
      setMobileApiError(error instanceof Error ? error.message : "Failed to send mobile OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (!partnerId) return;
    if ((formData.mobile_otp || "").length !== OTP_LENGTH) return;

    setIsLoading(true);
    setMobileApiError(null);

    try {
      await verifyMobileOtp(partnerId, formData.mobile_otp);
      setMobileVerified(true);
      setMobileOtpRequested(false);
      updateField("mobile_otp", "");
    } catch (error) {
      setMobileApiError(error instanceof Error ? error.message : "Failed to verify mobile OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendMobileOtp = async () => {
    if (mobileResendCountdown > 0) return;
    if (!partnerId) return;
    if (!formData.phone.trim()) return;

    const numericPhone = formData.phone.replace(/\D/g, "");
    if (numericPhone.length < 10) return;

    setIsLoading(true);
    setMobileApiError(null);

    try {
      await sendMobileOtp(partnerId, numericPhone, "+91");
      updateField("mobile_otp", "");
      setMobileResendCountdown(RESEND_COUNTDOWN_SECONDS);
    } catch (error) {
      setMobileApiError(error instanceof Error ? error.message : "Failed to resend mobile OTP");
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
      setErrors({ email: "Please verify your email OTP" });
      return;
    }

    if (!mobileVerified) {
      setErrors({ phone: "Please verify your mobile OTP" });
      return;
    }

    if (!formData.phone.trim() && emailVerified) {
      setErrors({ phone: "Phone number is required" });
      return;
    }

    if (!partnerId) {
      setErrors({ phone: "Session expired. Please restart registration." });
      return;
    }

    if (!agreeCheckbox || !indiaResidentCheckbox) {
      setErrors({ checkboxes: "Please agree to all terms to continue" });
      return;
    }

    setIsConfirming(true);

    try {
      await confirmArnDetails(partnerId);
      onNext?.();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to confirm ARN details");
    } finally {
      setIsConfirming(false);
    }
  };

  const emailErrorId = "email-error";
  const phoneErrorId = "phone-error";

  return (
    <div className="flex flex-col gap-6">
      <StepHeader title="ARN details" description="Enter your AMFI registration details." />

      <div>
        <FieldLabel htmlFor="registration_number" required>
          Registration number
        </FieldLabel>
        <div className="flex">
          <span
            id="registration_number-prefix"
            className="inline-flex h-12 shrink-0 items-center rounded-l-card border border-r-0 border-line bg-grey-100 px-3.5 text-base font-semibold text-grey-600"
          >
            ARN-
          </span>
          <input
            type="text"
            id="registration_number"
            inputMode="numeric"
            autoComplete="off"
            value={formData.registration_number}
            onChange={(e) => handleInputChange("registration_number", e.target.value)}
            readOnly={arnLocked}
            aria-required="true"
            aria-invalid={errors.registration_number ? true : undefined}
            aria-describedby={
              errors.registration_number
                ? "registration_number-prefix registration_number-error"
                : "registration_number-prefix"
            }
            className={cn(inputClassWithError(!!errors.registration_number, arnLocked), "rounded-l-none")}
            placeholder="12345"
          />
        </div>
        {errors.registration_number && (
          <FieldError id="registration_number-error">{errors.registration_number}</FieldError>
        )}
      </div>

      <div>
        <FieldLabel htmlFor="email" required>
          Email registered with AMFI
        </FieldLabel>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <input
            type="email"
            id="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            readOnly={arnLocked}
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? emailErrorId : undefined}
            className={inputClassWithError(!!errors.email, arnLocked)}
            placeholder="AMFI registered email address"
          />
          <div aria-live="polite" className="flex">
            {emailVerified ? (
              <VerifiedStatus />
            ) : emailOtpRequested ? (
              <SlotStatus>OTP sent</SlotStatus>
            ) : (
              <button
                type="button"
                onClick={handleRequestEmailOtp}
                disabled={isLoading || !formData.registration_number.trim() || !formData.email.trim()}
                className={VERIFY_BUTTON_CLASS}
              >
                Verify
              </button>
            )}
          </div>
        </div>
        {errors.email && <FieldError id={emailErrorId}>{errors.email}</FieldError>}
        {apiError && !emailVerified && !emailOtpRequested && (
          <StepAlert key={apiError} message={apiError} className="mt-3" />
        )}
      </div>

      {emailOtpRequested && !emailVerified && (
        <OtpField
          id="email_otp"
          label="OTP sent to your email"
          value={formData.email_otp || ""}
          onChange={(val) => handleInputChange("email_otp", val)}
          onVerify={handleVerifyEmailOtp}
          verifying={isLoading}
          disabled={isLoading || formData.email_otp.length !== OTP_LENGTH}
          resendIn={resendCountdown}
          onResend={handleResendEmailOtp}
          resendDisabled={isLoading}
          error={apiError}
        />
      )}

      <div>
        <PhoneInput
          label="Phone number registered with AMFI"
          value={formData.phone}
          onChange={(value) => {
            handleInputChange("phone", value);
            if (mobileOtpRequested || mobileVerified) {
              setMobileOtpRequested(false);
              setMobileVerified(false);
              updateField("mobile_otp", "");
              setMobileApiError(null);
            }
          }}
          placeholder="AMFI registered mobile number"
          required={emailVerified}
          error={!!errors.phone}
          readOnly={mobileVerified}
          describedBy={errors.phone ? phoneErrorId : undefined}
          actionButton={
            emailVerified ? (
              mobileVerified ? (
                <VerifiedStatus />
              ) : mobileOtpRequested ? (
                <SlotStatus>OTP sent</SlotStatus>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestMobileOtp}
                  disabled={
                    isLoading || !formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))
                  }
                  className={VERIFY_BUTTON_CLASS}
                >
                  {isLoading ? "Sending..." : "Verify"}
                </button>
              )
            ) : (
              <SlotStatus>Verify email first</SlotStatus>
            )
          }
        />
        {errors.phone && <FieldError id={phoneErrorId}>{errors.phone}</FieldError>}
        {mobileApiError && !mobileOtpRequested && !mobileVerified && (
          <StepAlert key={mobileApiError} message={mobileApiError} className="mt-3" />
        )}
      </div>

      {mobileOtpRequested && !mobileVerified && (
        <OtpField
          id="mobile_otp"
          label="OTP sent to your mobile"
          value={formData.mobile_otp || ""}
          onChange={(val) => handleInputChange("mobile_otp", val)}
          onVerify={handleVerifyMobileOtp}
          verifying={isLoading}
          disabled={isLoading || (formData.mobile_otp || "").length !== OTP_LENGTH}
          resendIn={mobileResendCountdown}
          onResend={handleResendMobileOtp}
          resendDisabled={isLoading}
          error={mobileApiError}
        />
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Declarations</legend>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
          <input
            type="checkbox"
            checked={agreeCheckbox}
            onChange={(e) => setAgreeCheckbox(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-grey-300 text-jade focus:ring-2 focus:ring-jade focus:ring-offset-2"
          />
          <span className="text-sm leading-relaxed text-grey-600">
            By continuing, you will be creating an account with Fydaa, an AMFI registered Mutual Fund
            Distribution Platform and agree to our{" "}
            <a
              href="https://fydaa.s3.ap-south-1.amazonaws.com/fydaa-term-doc/TermsAndConditions.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Terms &amp; Conditions
            </a>
            {", "}
            <a
              href="https://fydaa.s3.ap-south-1.amazonaws.com/fydaa-term-doc/PrivacyPolicyFydaa.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Privacy Policy
            </a>
            {", "}
            <a
              href="https://fydaa.s3.ap-south-1.amazonaws.com/fydaa-term-doc/Disclaimer.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Disclaimer
            </a>
            {" and "}
            <a
              href="https://fydaa.s3.ap-south-1.amazonaws.com/fydaa-term-doc/PartnerAgreementFydaa.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Agreement
            </a>
          </span>
        </label>

        <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
          <input
            type="checkbox"
            checked={indiaResidentCheckbox}
            onChange={(e) => setIndiaResidentCheckbox(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-grey-300 text-jade focus:ring-2 focus:ring-jade focus:ring-offset-2"
          />
          <span className="text-sm leading-relaxed text-grey-600">
            I confirm that I am an individual residing in India for tax purposes
          </span>
        </label>

        {errors.checkboxes && <FieldError id="declarations-error">{errors.checkboxes}</FieldError>}
      </fieldset>

      {apiError && emailVerified && <StepAlert key={apiError} message={apiError} />}

      <div className="flex border-t border-line pt-6 sm:justify-end">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!bothVerified || !agreeCheckbox || !indiaResidentCheckbox || isLoading || isConfirming}
          // The label is long on narrow phones: let it wrap instead of widening the form.
          className={`${PRIMARY_BUTTON_CLASS} h-auto min-h-12 whitespace-normal py-3 text-center`}
        >
          {isConfirming
            ? "Confirming..."
            : bothVerified
              ? "Continue"
              : emailVerified && !mobileVerified
                ? "Verify mobile to continue"
                : "Verify email and mobile to continue"}
        </button>
      </div>
    </div>
  );
}
