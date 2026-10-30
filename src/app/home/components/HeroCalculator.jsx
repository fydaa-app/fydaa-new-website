"use client";

import { useEffect, useMemo, useState } from 'react';
import { SIP_CATEGORIES, SIP_CATEGORY_ORDER, SIP_TENURE_OPTIONS } from '../data/sipCategories';
import { fmt, sipFV } from '../utils/format';

const LIMITS = {
  daily: { min: 100, max: 1000, step: 50 },
  monthly: { min: 1000, max: 100000, step: 500 }, // max ₹1 lakh
};

function clampAmount(value, frequency) {
  const { min, max } = LIMITS[frequency];
  return Math.min(max, Math.max(min, value));
}

export default function HeroCalculator() {
  const [cat, setCat] = useState('equity');
  const [freq, setFreq] = useState('monthly'); // 'monthly' | 'daily'
  const [years, setYears] = useState(10);
  const [amountInput, setAmountInput] = useState('5,000'); // raw text in the field
  const [amount, setAmount] = useState(5000); // parsed number used for the calc

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    const apply = () => setIsMobile(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  const category = SIP_CATEGORIES[cat];
  const rate = isMobile && cat === 'multi' ? 11 : category.rate;
  const rateLabel = isMobile && cat === 'multi' ? '11% CAGR' : category.rateLabel;
  const limits = LIMITS[freq];
  const clampedAmount = clampAmount(amount, freq);

  const { invested, returns, total } = useMemo(() => {
    const monthly = freq === 'daily' ? clampedAmount * 30 : clampedAmount;
    const investedAmt = monthly * years * 12;
    const fv = sipFV(monthly, years, rate);
    return { invested: investedAmt, returns: fv - investedAmt, total: fv };
  }, [clampedAmount, freq, years, rate]);

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
    // Reject digits that would push past the max — keep current value as-is
    if (next > limits.max) return;
    setAmount(next);
    setAmountInput(display);
  }

  function handleAmountPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData?.getData('text') || '';
    const { amount: next, display } = parseAmount(pasted);
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

  return (
    <div className="hero-calc-col">
    <div className="hero-calc" id="heroCalc">
      <div className="hc-cats" id="hcCats">
        {SIP_CATEGORY_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            className={`hc-cat${cat === key ? ' active' : ''}`}
            onClick={() => setCat(key)}
          >
            {SIP_CATEGORIES[key].label}
          </button>
        ))}
      </div>

      <div className="hc-body">
        <div className="hc-tagline">{category.tagline}</div>
        <div className="hc-rate">Expected return: {rateLabel}*</div>

        <div className="hc-row">
          <div className="hc-field">
            <div className="hc-label">You invest</div>
            <div className="hc-amt-wrap">
              <span className="hc-rs">₹</span>
              <input
                type="text"
                className="hc-amt"
                inputMode="numeric"
                pattern="[0-9,]*"
                min={limits.min}
                max={limits.max}
                maxLength={limits.max.toLocaleString('en-IN').length}
                value={amountInput}
                onChange={handleAmountChange}
                onPaste={handleAmountPaste}
                onBlur={handleAmountBlur}
                aria-valuemin={limits.min}
                aria-valuemax={limits.max}
              />
              {freq === 'daily' ? <span className="hc-per"> / day</span> : null}
            </div>
          </div>
          <div className="hc-freq-wrap">
            <button
              type="button"
              className={`hc-freq${freq === 'monthly' ? ' active' : ''}`}
              onClick={() => handleFreqChange('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`hc-freq${freq === 'daily' ? ' active' : ''}`}
              onClick={() => handleFreqChange('daily')}
            >
              Daily
            </button>
          </div>
        </div>

        <input
          type="range"
          className="hc-range"
          min={limits.min}
          max={limits.max}
          step={limits.step}
          value={clampedAmount}
          onChange={(e) => applyAmount(Number(e.target.value))}
          style={{
            '--p': `${((clampedAmount - limits.min) / (limits.max - limits.min)) * 100}%`,
          }}
          aria-label="Investment amount"
        />

        <div className="hc-tenure-row">
          <div className="hc-label">For</div>
          <div className="hc-tenure-pills">
            {SIP_TENURE_OPTIONS.map((y) => (
              <button
                key={y}
                type="button"
                className={`hc-tp${years === y ? ' active' : ''}`}
                onClick={() => setYears(y)}
              >
                {y}Y
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hc-result">
        <div className="hc-result-grid">
          <div className="hc-res-item">
            <div className="hc-res-label">Invested</div>
            <div className="hc-res-val">{fmt(invested)}</div>
          </div>
          <div className="hc-res-item">
            <div className="hc-res-label">Returns</div>
            <div className="hc-res-val hc-green">{fmt(returns)}</div>
          </div>
        </div>
        <div className="hc-total-row">
          <div className="hc-res-label">Total value</div>
          <div className="hc-total">{fmt(total)}</div>
        </div>
        <div className="hc-split" aria-hidden="true">
          <i style={{ width: `${total > 0 ? (invested / total) * 100 : 0}%` }} />
          <i className="hc-split-return" style={{ width: `${total > 0 ? (returns / total) * 100 : 0}%` }} />
        </div>
      </div>

      <a
        href="https://www.cal.eu/fydaa/30min?overlayCalendar=true"
        className="hc-cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        Start this SIP →
      </a>
    </div>
    <p className="hc-note">* Based on historical returns</p>
    </div>
  );
}
