"use client";

import { useState } from 'react';
import { FAQS } from '../data/content';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null); // only one open at a time, matches reference behaviour

  return (
    <section className="faqs" id="faqs">
      <div className="container">
        <div className="faq-grid">
          <div className="faq-left">
            <h2>Questions?</h2>
            <p>
              If you don&apos;t find what you&apos;re looking for, reach out to us at{' '}
              <a href="mailto:support@fydaa.com" style={{ textDecoration: 'underline' }}>support@fydaa.com</a>{' '}
              and we&apos;ll get back to you quickly.
            </p>
          </div>

          <div className="faq-list">
            {FAQS.map((faq, i) => {
              const open = openIndex === i;
              return (
                <div className={`faq-item${open ? ' open' : ''}`} key={faq.q}>
                  <div className="faq-q" onClick={() => setOpenIndex(open ? null : i)}>
                    {faq.q}
                    <span className="arr">▼</span>
                  </div>
                  <div className="faq-a">
                    <div className="faq-a-inner">
                      {faq.mobileA ? (
                        <>
                          <span className="copy-desktop">{faq.a}</span>
                          <span className="copy-mobile">{faq.mobileA}</span>
                        </>
                      ) : (
                        faq.a
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
