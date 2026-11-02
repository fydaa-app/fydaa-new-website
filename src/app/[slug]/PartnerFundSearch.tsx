'use client';

import { useMemo, useState } from 'react';
import { AMC_PARTNERS } from '../home/data/amcPartners';

const FILTERS = ['All', 'Equity', 'Liquid', 'Debt'] as const;

export default function PartnerFundSearch() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AMC_PARTNERS;
    return AMC_PARTNERS.filter((amc) => amc.name.toLowerCase().includes(q));
  }, [query]);

  // Duplicate for seamless marquee (same pattern as home AmcStrip).
  const logos = filtered.length > 0 ? [...filtered, ...filtered] : [];
  const isSearching = query.trim().length > 0;

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

            <div className="pw-amc-label">Invest in Funds from</div>
            {logos.length === 0 ? (
              <p style={{ color: '#525252', fontSize: 14, padding: '8px 4px', textAlign: 'center' }}>
                No fund houses match “{query}”.
              </p>
            ) : (
              <div className={`pw-amc-track-wrap${isSearching ? ' is-static' : ''}`}>
                <div className={`pw-amc-track${isSearching ? ' is-static' : ''}`}>
                  {logos.map((amc, i) => (
                    <div className="pw-amc-card" key={`${amc.name}-${i}`} aria-label={amc.name}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={amc.src} alt="" />
                      <span>{amc.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
