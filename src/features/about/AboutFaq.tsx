import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { FaqList } from "@/components/ui/faq-list";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/lib/seo/json-ld";
import { faqPageJsonLd } from "@/lib/seo/structured-data";

const { adviser } = siteConfig.entities;

const FAQS = [
  {
    q: "Is Fydaa registered with any financial regulators in India?",
    a: `Yes. Fydaa is offered by ${adviser.legalName}, a SEBI-registered investment adviser (${adviser.sebiRegistrationNumber}), and is also a member of BASL and NISM-certified.`,
  },
  {
    q: "How is Fydaa different from a broker or mutual fund distributor?",
    a: "Brokers and distributors typically earn commissions from the products they sell, which can bias recommendations. As a Registered Investment Adviser, Fydaa charges a transparent fee directly to you and does not earn hidden commissions from fund houses.",
  },
  {
    q: "How does Fydaa make money?",
    a: "Fydaa earns through transparent advisory and subscription fees paid directly by clients, such as the Fydaa Direct Plan, rather than through commissions embedded in the products it recommends.",
  },
  {
    q: "What is the advisory fee of Fydaa?",
    a: "Fees vary by plan and are shown upfront before you subscribe, with no hidden costs. Get in touch with our team for a quote tailored to your goals.",
  },
];

const items = FAQS.map((faq) => ({ id: faq.q, title: faq.q, content: <p>{faq.a}</p> }));

/** About FAQs: who regulates Fydaa and how it is paid. Answers stay in the HTML (and JSON-LD). */
export default function AboutFaq() {
  return (
    <section aria-labelledby="about-faqs" className="section bg-mist">
      <JsonLd data={faqPageJsonLd(FAQS.map((faq) => ({ question: faq.q, answer: faq.a })))} />
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <SectionHeader
          title={<span id="about-faqs">Questions about Fydaa</span>}
          description={
            <>
              Something else on your mind? Email{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="link">
                {siteConfig.contact.email}
              </a>{" "}
              and we&apos;ll get back to you.
            </>
          }
        />
        <FaqList items={items} />
      </Container>
    </section>
  );
}
