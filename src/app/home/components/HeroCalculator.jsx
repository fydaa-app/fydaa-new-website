"use client";

import { useMemo, useState } from 'react';
import { SIP_CATEGORIES, SIP_CATEGORY_ORDER, SIP_TENURE_OPTIONS } from '../data/sipCategories';
import { fmt, sipFV } from '../utils/format';

export default function HeroCalculator() {
  const [cat, setCat] = useState('equity');
  const [freq, setFreq] = useState('monthly'); // 'monthly' | 'daily'
  const [years, setYears] = useState(10);
  const [amountInput, setAmountInput] = useState('5,000'); // raw text in the field
  const [amount, setAmount] = useState(5000); // parsed number used for the calc

  const category = SIP_CATEGORIES[cat];

  const { invested, returns, total } = useMemo(() => {
    const monthly = freq === 'daily' ? amount * 30 : amount;
    const investedAmt = monthly * years * 12;
    const fv = sipFV(monthly, years, category.rate);
    return { invested: investedAmt, returns: fv - investedAmt, total: fv };
  }, [amount, freq, years, category.rate]);

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
        <div className="hc-rate">Expected return: {category.rateLabel}</div>

        <div className="hc-row">
          <div className="hc-field">
            <div className="hc-label">You invest</div>
            <div className="hc-amt-wrap">
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
  );
}
