"use client";

import { useEffect, useMemo, useState } from 'react';
import { SIP_CATEGORIES, SIP_CATEGORY_ORDER, SIP_TENURE_OPTIONS } from '../data/sipCategories';
import { fmt, sipFV } from '../utils/format';

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

  const { invested, returns, total } = useMemo(() => {
    const monthly = freq === 'daily' ? amount * 30 : amount;
    const investedAmt = monthly * years * 12;
    const fv = sipFV(monthly, years, rate);
    return { invested: investedAmt, returns: fv - investedAmt, total: fv };
  }, [amount, freq, years, rate]);

  function handleAmountChange(e) {
    const raw = e.target.value;
    setAmountInput(raw);
    const n = parseInt(raw.replace(/[^\d]/g, ''), 10) || 0;
    setAmount(n);
  }

  function handleAmountBlur() {
    setAmountInput(amount.toLocaleString('en-IN'));
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
              <span className="hc-amt-mobile">
                {fmt(amount)}
                {freq === 'daily' ? <span className="hc-per"> / day</span> : null}
              </span>
              <span className="hc-rs">₹</span>
              <input
                type="text"
                className="hc-amt"
                inputMode="numeric"
                value={amountInput}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
              />
            </div>
          </div>
          <div className="hc-freq-wrap">
            <button
              type="button"
              className={`hc-freq${freq === 'monthly' ? ' active' : ''}`}
              onClick={() => setFreq('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`hc-freq${freq === 'daily' ? ' active' : ''}`}
              onClick={() => setFreq('daily')}
            >
              Daily
            </button>
          </div>
        </div>

        <input
          type="range"
          className="hc-range"
          min={freq === 'daily' ? 100 : 1000}
          max={freq === 'daily' ? 5000 : 100000}
          step={freq === 'daily' ? 50 : 500}
          value={Math.min(freq === 'daily' ? 5000 : 100000, Math.max(freq === 'daily' ? 100 : 1000, amount))}
          onChange={(e) => {
            const next = Number(e.target.value);
            setAmount(next);
            setAmountInput(next.toLocaleString('en-IN'));
          }}
          style={{
            '--p': `${((Math.min(freq === 'daily' ? 5000 : 100000, Math.max(freq === 'daily' ? 100 : 1000, amount)) - (freq === 'daily' ? 100 : 1000)) / ((freq === 'daily' ? 5000 : 100000) - (freq === 'daily' ? 100 : 1000))) * 100}%`,
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
