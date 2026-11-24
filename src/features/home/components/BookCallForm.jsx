"use client";

import { useEffect, useRef, useState } from 'react';
import { captureEvent, captureNamedButton, toEventName } from '@/lib/posthog';

const CALLING_CODE = '+91';
/** Client-side resend cooldown; the server must still rate-limit send-otp (FYD-93). */
const RESEND_COOLDOWN_SECONDS = 30;

function leadUrl(path) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://crm-prod.fydaa.com/';
  return `${base}referrals/website-lead${path}`;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || data?.success === false) {
    const message =
      data?.message || data?.error || data?.msg || 'Something went wrong. Please try again.';
    throw new Error(typeof message === 'string' ? message : 'Something went wrong. Please try again.');
  }

  return data;
}

export default function BookCallForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const otpRef = useRef(null);

  function validateDetails() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your name.');
      nameRef.current?.focus();
      return null;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      phoneRef.current?.focus();
      return null;
    }
    return trimmedName;
  }

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = window.setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  async function sendOtp({ buttonName = 'Book a Call', step = 'send_otp' } = {}) {
    setError('');
    if (!validateDetails()) return;
    if (resendIn > 0) return;

    captureNamedButton(buttonName, { step });
    setIsSubmitting(true);
    try {
      await postJson(leadUrl('/send-otp'), {
        mobileNumber: phone,
        callingCode: CALLING_CODE,
      });
      captureEvent('book_call_otp_sent', { field_name: 'Phone number' });
      setOtpSent(true);
      setResendIn(RESEND_COOLDOWN_SECONDS);
      setOtp('');
      setTimeout(() => otpRef.current?.focus(), 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyAndCreateLead() {
    setError('');
    const trimmedName = validateDetails();
    if (!trimmedName) return;

    if (!/^\d{4,8}$/.test(otp)) {
      setError('Please enter the OTP sent to your mobile.');
      otpRef.current?.focus();
      return;
    }

    captureNamedButton('Verify', { step: 'verify_otp' });
    setIsSubmitting(true);
    try {
      await postJson(leadUrl('/verify-otp'), {
        mobileNumber: phone,
        otp,
      });

      await postJson(leadUrl(''), {
        name: trimmedName,
        mobileNumber: phone,
      });

      captureEvent('book_call_submitted', {
        button_name: 'Verify',
        field_name: 'OTP',
      });
      setName('');
      setPhone('');
      setOtp('');
      setOtpSent(false);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function onPhoneChange(value) {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    if (otpSent) {
      setOtpSent(false);
      setOtp('');
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 py-6" role="status">
        <svg className="t-check size-14" viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r="26" className="t-check-ring" />
          <path d="M17 29.5l7 7 15-16" className="t-check-path" />
        </svg>
        <h3 className="text-title text-ink">Thanks, we&apos;ve got your details</h3>
        <p className="text-base leading-relaxed text-grey-600">
          A relationship manager will call you within a few hours on working days.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-title text-ink">Book a free call</h3>
      <p className="mb-6 mt-1 text-sm leading-relaxed text-grey-600">
        Leave your number and a relationship manager will call you back within a few hours.
      </p>

      <div className="mb-4 flex flex-col gap-1.5">
        <label htmlFor="callName" className="text-sm font-semibold text-ink">Your name</label>
        <input
          ref={nameRef}
          type="text"
          id="callName"
          name="call_name"
          data-ph-capture="book_call_name"
          aria-label="Your name"
          placeholder="Full name"
          className="h-12 w-full rounded-card border border-line bg-mist px-4 text-base text-ink outline-none transition-colors duration-quick placeholder:text-grey-500 focus:border-jade focus:bg-white focus:ring-2 focus:ring-jade/15 disabled:opacity-60"
          value={name}
          onFocus={() =>
            captureEvent(toEventName('Your name', 'field_focused'), {
              field_name: 'Your name',
              input_name: 'call_name',
            })
          }
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          autoComplete="name"
        />
      </div>

      <div className="mb-4 flex flex-col gap-1.5">
        <label htmlFor="callPhone" className="text-sm font-semibold text-ink">Phone number</label>
        <input
          ref={phoneRef}
          type="tel"
          id="callPhone"
          name="call_phone"
          data-ph-capture="book_call_phone"
          aria-label="Phone number"
          placeholder="10-digit mobile number"
          className="h-12 w-full rounded-card border border-line bg-mist px-4 text-base text-ink outline-none transition-colors duration-quick placeholder:text-grey-500 focus:border-jade focus:bg-white focus:ring-2 focus:ring-jade/15 disabled:opacity-60"
          value={phone}
          onFocus={() =>
            captureEvent(toEventName('Phone number', 'field_focused'), {
              field_name: 'Phone number',
              input_name: 'call_phone',
            })
          }
          onChange={(e) => onPhoneChange(e.target.value)}
          disabled={isSubmitting}
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel"
        />
      </div>

      {otpSent ? (
        <div className="mb-4 flex flex-col gap-1.5">
          <label htmlFor="callOtp" className="text-sm font-semibold text-ink">OTP</label>
          <input
            ref={otpRef}
            type="text"
            id="callOtp"
            name="call_otp"
            data-ph-capture="book_call_otp"
            aria-label="OTP"
            placeholder="Enter OTP"
            className="h-12 w-full rounded-card border border-line bg-mist px-4 text-base text-ink outline-none transition-colors duration-quick placeholder:text-grey-500 focus:border-jade focus:bg-white focus:ring-2 focus:ring-jade/15 disabled:opacity-60"
            value={otp}
            onFocus={() =>
              captureEvent(toEventName('OTP', 'field_focused'), {
                field_name: 'OTP',
                input_name: 'call_otp',
              })
            }
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
            disabled={isSubmitting}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
          <button
            type="button"
            data-ph-event="Resend OTP"
            data-ph-capture="book_call_resend_otp"
            onClick={() => sendOtp({ buttonName: 'Resend OTP', step: 'resend_otp' })}
            disabled={isSubmitting || resendIn > 0}
            aria-live="polite"
            style={{
              cursor: isSubmitting || resendIn > 0 ? 'not-allowed' : 'pointer',
            }}
            className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-emerald disabled:text-grey-500"
          >
            {resendIn > 0 ? `Resend OTP in ${resendIn}s` : 'Resend OTP'}
          </button>
        </div>
      ) : null}

      {error ? (
        <p key={error} role="alert" className="t-shake mb-3 rounded-card bg-red-50 px-3 py-2.5 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className="btn btn-primary btn-lg w-full"
        data-ph-event={otpSent ? 'Verify' : 'Book a Call'}
        data-ph-capture={otpSent ? 'book_call_verify' : 'book_call_submit'}
        onClick={otpSent ? verifyAndCreateLead : () => sendOtp()}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? otpSent
            ? 'Verifying...'
            : 'Sending...'
          : otpSent
            ? 'Verify'
            : 'Book a free call'}
      </button>
      <p className="mt-3 text-xs text-grey-500">We&apos;ll only use your number to call you about Fydaa.</p>
    </div>
  );
}
