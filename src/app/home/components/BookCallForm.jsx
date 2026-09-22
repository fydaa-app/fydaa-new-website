"use client";

import { useRef, useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BookCallForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  async function handleSubmit() {
    setError('');
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      nameRef.current?.focus();
      return;
    }

    if (!EMAIL_RE.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      emailRef.current?.focus();
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      phoneRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}referrals/website-lead`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          mobileNumber: phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setName('');
      setEmail('');
      setPhone('');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        <label htmlFor="callEmail">Email address</label>
        <input
          ref={emailRef}
          type="email"
          id="callEmail"
          placeholder="name@example.com"
          className="advisory-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          autoComplete="email"
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
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
            setPhone(digits);
          }}
          disabled={isSubmitting}
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel"
        />
      </div>

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
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : undefined}
      >
        {isSubmitting ? 'Submitting...' : 'Book a Call'}
      </button>
      <div className="advisory-privacy">We&apos;ll only use this to contact you. No spam, ever.</div>
    </div>
  );
}
