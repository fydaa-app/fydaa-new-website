'use client';

import { useState } from 'react';
import { checkPartnerMobile } from '../config/partnerWebsiteApi';

type PartnerMobileCheckProps = {
  slug: string;
};

export default function PartnerMobileCheck({ slug }: PartnerMobileCheckProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const canCheck = /^\d{10}$/.test(mobileNumber) && !isChecking;

  const handleChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(digitsOnly);
    setMessage(null);
    setError(null);
  };

  const handleCheck = async () => {
    if (!canCheck) return;

    setIsChecking(true);
    setMessage(null);
    setError(null);

    try {
      const result = await checkPartnerMobile(slug, mobileNumber);
      setMessage(result.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to check this number. Please try again.',
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section style={{ marginTop: 32, marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Check mobile number</h2>
      <p style={{ marginBottom: 12, fontSize: 14 }}>
        Enter a 10-digit mobile number to check referral linkage.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{10}"
          maxLength={10}
          value={mobileNumber}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="10-digit mobile number"
          aria-label="Mobile number"
          style={{
            width: 220,
            maxWidth: '100%',
            padding: '8px 10px',
            fontSize: 14,
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
        <button
          type="button"
          onClick={handleCheck}
          disabled={!canCheck}
          style={{
            padding: '8px 14px',
            fontSize: 14,
            border: '1px solid #333',
            borderRadius: 4,
            background: canCheck ? '#111' : '#999',
            color: '#fff',
            cursor: canCheck ? 'pointer' : 'not-allowed',
          }}
        >
          {isChecking ? 'Checking...' : 'Check'}
        </button>
      </div>
      {message ? (
        <p style={{ marginTop: 12, fontSize: 14 }}>{message}</p>
      ) : null}
      {error ? (
        <p style={{ marginTop: 12, fontSize: 14, color: '#b00020' }}>{error}</p>
      ) : null}
    </section>
  );
}
