"use client";

import { useRef, useState } from 'react';

const CALLING_CODE = '+91';

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

  async function sendOtp() {
    setError('');
    if (!validateDetails()) return;

    setIsSubmitting(true);
    try {
      await postJson(leadUrl('/send-otp'), {
        mobileNumber: phone,
        callingCode: CALLING_CODE,
      });
      setOtpSent(true);
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
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
          We&apos;ve got your details!
        </div>
        <div style={{ fontSize: '.9rem', color: 'var(--ink2)', lineHeight: 1.6 }}>
          One of our relationship managers will get back to you within a few hours.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="advisory-form-title">Book a call with our team</div>
      <div className="advisory-form-sub">
        Share your details and one of our relationship managers will get back to you within a few hours.
      </div>

      <div className="advisory-field">
        <label htmlFor="callName">Your name</label>
        <input
          ref={nameRef}
          type="text"
          id="callName"
          placeholder="Full name"
          className="advisory-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          autoComplete="name"
        />
      </div>

      <div className="advisory-field">
        <label htmlFor="callPhone">Phone number</label>
        <input
          ref={phoneRef}
          type="tel"
          id="callPhone"
          placeholder="10-digit mobile number"
          className="advisory-input"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          disabled={isSubmitting}
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel"
        />
      </div>

      {otpSent ? (
        <div className="advisory-field">
          <label htmlFor="callOtp">OTP</label>
          <input
            ref={otpRef}
            type="text"
            id="callOtp"
            placeholder="Enter OTP"
            className="advisory-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
            disabled={isSubmitting}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
          <button
            type="button"
            onClick={sendOtp}
            disabled={isSubmitting}
            style={{
              marginTop: 8,
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'var(--g)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            Resend OTP
          </button>
        </div>
      ) : null}

      {error ? (
        <div
          style={{
            marginBottom: 12,
            padding: '10px 12px',
            borderRadius: 10,
            background: '#FEF2F2',
            color: '#B91C1C',
            fontSize: '0.85rem',
          }}
        >
          {error}
        </div>
      ) : null}

      <button
        type="button"
        className="advisory-submit"
        onClick={otpSent ? verifyAndCreateLead : sendOtp}
        disabled={isSubmitting}
        style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : undefined}
      >
        {isSubmitting
          ? otpSent
            ? 'Verifying...'
            : 'Sending...'
          : otpSent
            ? 'Verify'
            : 'Book a Call'}
      </button>
      <div className="advisory-privacy">We&apos;ll only use this to contact you. No spam, ever.</div>
    </div>
  );
}
