import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { FaqList } from '@/components/ui/faq-list';
import { siteConfig } from '@/config/site';
import { FAQS } from '../data/content';

// One answer per question at every width; answers stay in the HTML for search engines.
const items = FAQS.map((faq) => ({ id: faq.q, title: faq.q, content: <p>{faq.a}</p> }));

export default function FaqSection() {
  return (
    <section className="faqs" id="faqs" aria-labelledby="home-faqs">
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
        <SectionHeader
          title={<span id="home-faqs">Questions?</span>}
          description={
            <>
              If you don&apos;t find what you&apos;re looking for, email{' '}
              <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-jade underline">
                {siteConfig.contact.email}
              </a>{' '}
              and we&apos;ll get back to you quickly.
            </>
          }
        />
        <FaqList items={items} />
      </Container>
    </section>
  );
}
