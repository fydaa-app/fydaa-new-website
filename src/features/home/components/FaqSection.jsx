"use client";

import { Accordion } from '@/components/ui/accordion';
import { FAQS } from '../data/content';

const items = FAQS.map((faq) => ({
  id: faq.q,
  title: faq.q,
  content: (
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
  ),
}));

export default function FaqSection() {
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

          {/* One panel open at a time; answers stay in the HTML for search engines. */}
          <Accordion
            items={items}
            collapse="css"
            icon={() => (
              <span className="arr" aria-hidden="true">
                ▼
              </span>
            )}
            classNames={{
              root: 'faq-list',
              item: 'faq-item',
              openItem: 'open',
              heading: 'faq-heading',
              trigger: 'faq-q',
              panel: 'faq-a',
            }}
          />
        </div>
      </div>
    </section>
  );
}
