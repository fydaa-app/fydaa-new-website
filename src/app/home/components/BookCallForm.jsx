"use client";

import { useRef, useState } from 'react';

export default function BookCallForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);

  function handleSubmit() {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      nameRef.current?.focus();
      return;
    }
    if (!trimmedPhone || trimmedPhone.length < 10) {
      phoneRef.current?.focus();
      return;
    }

    // TODO(backend): wire this up to the real lead-capture endpoint.
    // e.g. await api.post('/leads/book-call', { name: trimmedName, phone: trimmedPhone })
    setSubmitted(true);
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
        />
      </div>

      <div className="advisory-field">
        <label htmlFor="callPhone">Phone number</label>
        <input
          ref={phoneRef}
          type="tel"
          id="callPhone"
          placeholder="+91 98XXX XXXXX"
          className="advisory-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button type="button" className="advisory-submit" onClick={handleSubmit}>
        Book a Call
      </button>
      <div className="advisory-privacy">We&apos;ll only use this to contact you. No spam, ever.</div>
    </div>
  );
}
