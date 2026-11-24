import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { FaqList } from "@/components/ui/faq-list";
import { JsonLd } from "@/lib/seo/json-ld";
import { faqPageJsonLd } from "@/lib/seo/structured-data";
const FAQS = [
  {
    q: "Is Fydaa registered with any financial regulators in India?",
    a: "Yes. Fydaa is offered by Multistrato Capital Advisors Pvt. Ltd., a SEBI-Registered Investment Adviser (INA000015969), and is also a member of BASL and NISM-certified.",
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

export default function AboutFaq() {
  return (
    <section aria-labelledby="about-faqs" className="bg-white py-12 sm:py-16 md:py-20">
      <JsonLd data={faqPageJsonLd(FAQS.map((faq) => ({ question: faq.q, answer: faq.a })))} />
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeader
          title={<span id="about-faqs">FAQs</span>}
          description="Feel free to reach out if you have any other questions."
        />
        <FaqList className="max-w-3xl" items={FAQS.map((faq) => ({ id: faq.q, title: faq.q, content: <p>{faq.a}</p> }))} />
      </Container>
    </section>
  );
}
