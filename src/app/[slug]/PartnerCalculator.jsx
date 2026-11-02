'use client';

import { useMemo, useState } from 'react';
import { SIP_CATEGORIES, SIP_CATEGORY_ORDER, SIP_TENURE_OPTIONS } from '../home/data/sipCategories';
import { fmt, sipFV } from '../home/utils/format';

const LIMITS = {
  daily: { min: 100, max: 1000 },
  monthly: { min: 1000, max: 100000 },
};

function clampAmount(value, frequency) {
  const { min, max } = LIMITS[frequency];
  return Math.min(max, Math.max(min, value));
}

export default function PartnerCalculator({ signupHref = '/signup' }) {
  const [cat, setCat] = useState('gold');
  const [freq, setFreq] = useState('monthly');
  const [years, setYears] = useState(10);
  const [amountInput, setAmountInput] = useState('5,000');
  const [amount, setAmount] = useState(5000);
  const [fundMode, setFundMode] = useState('recommended');

  const category = SIP_CATEGORIES[cat];
  const limits = LIMITS[freq];
  const clampedAmount = clampAmount(amount, freq);

  const { total } = useMemo(() => {
    const monthly = freq === 'daily' ? clampedAmount * 30 : clampedAmount;
    const fv = sipFV(monthly, years, category.rate);
    return { total: fv };
  }, [clampedAmount, freq, years, category.rate]);

  function applyAmount(next, frequency = freq) {
    const clamped = clampAmount(next, frequency);
    setAmount(clamped);
    setAmountInput(clamped.toLocaleString('en-IN'));
  }

  function parseAmount(raw) {
    const digits = String(raw).replace(/[^\d]/g, '');
    if (!digits) return { amount: 0, display: '' };
    const next = parseInt(digits, 10);
    return { amount: next, display: next.toLocaleString('en-IN') };
  }

  function handleAmountChange(e) {
    const { amount: next, display } = parseAmount(e.target.value);
    if (next > limits.max) return;
    setAmount(next);
    setAmountInput(display);
  }

  function handleAmountBlur() {
    applyAmount(amount || limits.min);
  }

  function handleFreqChange(nextFreq) {
    if (nextFreq === freq) return;
    setFreq(nextFreq);
    applyAmount(amount, nextFreq);
  }

  const ctaLabel = `Start my ${category.label}`;

  return (
    <div className="pw-calc-wrap">
      <div className="pw-calc">
        <div className="pw-calc-cats" role="tablist" aria-label="Asset class">
          {SIP_CATEGORY_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={cat === key}
              className={`pw-calc-cat${cat === key ? ' active' : ''}`}
              onClick={() => setCat(key)}
            >
              {SIP_CATEGORIES[key].label}
            </button>
          ))}
        </div>

        <div className="pw-calc-body">
          <div className="pw-calc-head">
            <h3 className="pw-calc-tagline">{category.tagline}</h3>
            <div className="pw-calc-freq" role="group" aria-label="Investment frequency">
              <button
                type="button"
                className={`pw-calc-freq-btn${freq === 'daily' ? ' active' : ''}`}
                onClick={() => handleFreqChange('daily')}
              >
                Daily
              </button>
              <button
                type="button"
                className={`pw-calc-freq-btn${freq === 'monthly' ? ' active' : ''}`}
                onClick={() => handleFreqChange('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="pw-calc-io">
            <div className="pw-calc-invest">
              <div className="pw-calc-label">You invest</div>
              <label className="pw-calc-amt-box">
                <span className="pw-calc-rs">₹</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountInput}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                  aria-label="Investment amount"
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </label>
              <div className="pw-calc-per">{freq === 'daily' ? 'per day' : 'per month'}</div>
            </div>

            <div className="pw-calc-arrow" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </div>

            <div className="pw-calc-result">
              <div className="pw-calc-total">{fmt(total)}</div>
              <div className="pw-calc-meta">
                In {years} YRS | {category.rate}% CAGR
              </div>
            </div>
          </div>

          <div className="pw-calc-row">
            <span className="pw-calc-row-label">Tenure</span>
            <select
              className="pw-calc-select"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              aria-label="Tenure"
            >
              {SIP_TENURE_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y} years
                </option>
              ))}
            </select>
          </div>

          <div className="pw-calc-row">
            <span className="pw-calc-row-label">Fund</span>
            <div className="pw-calc-fund-toggle" role="group" aria-label="Fund selection">
              <button
                type="button"
                className={fundMode === 'recommended' ? 'active' : ''}
                onClick={() => setFundMode('recommended')}
              >
                Recommended
              </button>
              <button
                type="button"
                className={fundMode === 'own' ? 'active' : ''}
                onClick={() => setFundMode('own')}
              >
                Choose my own
              </button>
            </div>
          </div>

          {fundMode === 'recommended' ? (
            <div className="pw-calc-fund-hint">Recommended {category.label} fund</div>
          ) : (
            <div className="pw-calc-fund-hint">Pick funds after you start</div>
          )}

          <a href={signupHref} className="pw-calc-cta">
            {ctaLabel}
          </a>

          <a href={signupHref} className="pw-calc-lumpsum">
            Want to invest One-Time / Lump-sum?
          </a>
        </div>
      </div>
      <p
        className="pw-calc-note"
        style={{
          color: '#a3a3a3',
          fontSize: '11px',
          fontWeight: 400,
          fontStyle: 'italic',
          lineHeight: 1.35,
          margin: '10px 4px 0',
          textAlign: 'right',
        }}
      >
        * Based on historical returns
      </p>
    </div>
  );
}
