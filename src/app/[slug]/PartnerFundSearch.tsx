'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AMC_PARTNERS } from '../home/data/amcPartners';
import { searchFunds } from '../dashboard/lib/fundSearchApi';

const FILTERS = ['All', 'Equity', 'Liquid', 'Debt'] as const;

type FundHit = {
  name: string;
  scheme: string;
  subtitle?: string;
  minSip?: number | null;
  minInitial?: number | null;
};

type PartnerFundSearchProps = {
  signupHref?: string;
};

function money(n: number | null | undefined) {
  const value = Number(n);
  if (!Number.isFinite(value) || value <= 0) return null;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export default function PartnerFundSearch({ signupHref = '/signup' }: PartnerFundSearchProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [funds, setFunds] = useState<FundHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const requestId = useRef(0);

  const isSearching = query.trim().length > 0;
  const canSearch = query.trim().length >= 2;

  useEffect(() => {
    const text = query.trim();
    if (!text) {
      requestId.current += 1;
      setFunds([]);
      setError('');
      setHint('');
      setLoading(false);
      return undefined;
    }
    if (text.length < 2) {
      requestId.current += 1;
      setFunds([]);
      setError('');
      setHint('Type at least 2 characters to search');
      setLoading(false);
      return undefined;
    }

    setHint('');
    const id = ++requestId.current;
    setLoading(true);
    const timer = window.setTimeout(() => {
      searchFunds(text, filter)
        .then((result) => {
          if (id !== requestId.current) return;
          setLoading(false);
          setFunds((result.funds || []) as FundHit[]);
          setError(result.message || '');
        })
        .catch(() => {
          if (id !== requestId.current) return;
          setLoading(false);
          setFunds([]);
          setError('Unable to search funds');
        });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query, filter]);

  const logos = useMemo(() => {
    if (isSearching) return [];
    return [...AMC_PARTNERS, ...AMC_PARTNERS];
  }, [isSearching]);

  return (
    <section className="pw-funds" aria-label="Search mutual funds">
      <div className="pw-funds-shell">
        <div className="pw-funds-panel">
          <div className="pw-funds-inner">
            <div className="pw-funds-row">
              <form
                className="pw-search"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  type="search"
                  placeholder="Search Mutual Funds"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search mutual funds"
                />
                <button type="submit" aria-label="Search">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" />
                  </svg>
                </button>
              </form>

              <div className="pw-chips" role="tablist" aria-label="Fund category">
                {FILTERS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={filter === item}
                    className={`pw-chip${item === 'All' ? ' pw-chip-all' : ''}${filter === item ? ' active' : ''}`}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {isSearching ? (
              <div className="pw-fund-results" aria-live="polite">
                {loading ? (
                  <p className="pw-fund-status">Searching funds…</p>
                ) : null}
                {!loading && hint ? <p className="pw-fund-status">{hint}</p> : null}
                {!loading && error ? <p className="pw-fund-status pw-fund-status-error">{error}</p> : null}
                {!loading && !error && !hint && canSearch && funds.length === 0 ? (
                  <p className="pw-fund-status">No funds found for “{query.trim()}”.</p>
                ) : null}
                {!loading && !error && funds.length > 0 ? (
                  <ul className="pw-fund-list">
                    {funds.map((fund) => {
                      const minLabel = money(fund.minSip) || money(fund.minInitial);
                      const href = `${signupHref}${signupHref.includes('?') ? '&' : '?'}fund=${encodeURIComponent(fund.scheme)}`;
                      return (
                        <li key={`${fund.scheme}-${fund.name}`}>
                          <Link href={href} className="pw-fund-card">
                            <div className="pw-fund-card-main">
                              <div className="pw-fund-name">{fund.name}</div>
                              {fund.subtitle ? (
                                <div className="pw-fund-sub">{fund.subtitle}</div>
                              ) : null}
                            </div>
                            <div className="pw-fund-card-meta">
                              {minLabel ? <span className="pw-fund-min">Min {minLabel}</span> : null}
                              <span className="pw-fund-cta">Invest ›</span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            ) : (
              <>
                <div className="pw-amc-label">Invest in Funds from</div>
                <div className="pw-amc-track-wrap">
                  <div className="pw-amc-track">
                    {logos.map((amc, i) => (
                      <div className="pw-amc-card" key={`${amc.name}-${i}`} aria-label={amc.name}>
                        <img src={amc.src} alt="" />
                        <span>{amc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
