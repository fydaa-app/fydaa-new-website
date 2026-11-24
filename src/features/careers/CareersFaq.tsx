import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { FaqList } from "@/components/ui/faq-list";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/lib/seo/json-ld";
import { faqPageJsonLd } from "@/lib/seo/structured-data";

/** Questions candidates ask. Answers only state what the careers and programme pages already offer. */
const FAQS = [
  {
    id: "apply",
    question: "How do I apply for a role?",
    answer: "Open the role you're interested in and select “Apply now”. You'll fill in a short form and upload your CV.",
  },
  {
    id: "no-match",
    question: "I don't see a role that fits me. What can I do?",
    answer: "Register your CV with us. When a role that matches your profile opens, our team will reach out.",
  },
  {
    id: "location",
    question: "Where are the roles based, and how much experience do I need?",
    answer: "Each listing shows its location and the experience range we're looking for, so you can check fit before applying.",
  },
  {
    id: "programme",
    question: "I'm new to advisory. Is there a way in?",
    answer:
      "Our FYIAEP programme prepares you for the NISM Series X-A and X-B certifications and gives you on-field advisory experience, with a path to a role at Fydaa.",
    link: { href: routes.programme.path, label: "Explore the programme" },
  },
  {
    id: "regulated",
    question: "Is Fydaa a regulated company?",
    answer: `Yes. Fydaa is offered by ${siteConfig.entities.adviser.legalName}, a SEBI Registered Investment Adviser (${siteConfig.entities.adviser.sebiRegistrationNumber}).`,
  },
];

export default function CareersFaq() {
  return (
    <section aria-labelledby="careers-faq" className="bg-grey-100 py-16">
      <JsonLd data={faqPageJsonLd(FAQS.map((faq) => ({ question: faq.question, answer: faq.answer })))} />
      <Container className="flex flex-col gap-8">
        <SectionHeader
          eyebrow="FAQs"
          title={<span id="careers-faq">Questions from candidates</span>}
          description={
            <>
              Can&apos;t find your answer? Email{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-jade underline">
                {siteConfig.contact.email}
              </a>
              .
            </>
          }
        />
        <FaqList
          items={FAQS.map((faq) => ({
            id: faq.id,
            title: faq.question,
            content: (
              <p>
                {faq.answer}
                {faq.link ? (
                  <>
                    {" "}
                    <Link href={faq.link.href} className="font-semibold text-jade underline">
                      {faq.link.label}
                    </Link>
                  </>
                ) : null}
              </p>
            ),
          }))}
        />
      </Container>
    </section>
  );
}
