import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { FaqList } from "@/components/ui/faq-list";
import { siteConfig } from "@/config/site";
import { FAQS } from "../data/content";

// One answer per question at every width; answers stay in the HTML for search engines.
const items = FAQS.map((faq) => ({ id: faq.q, title: faq.q, content: <p>{faq.a}</p> }));

export default function FaqSection() {
  return (
    <section className="section bg-mist" id="faqs" aria-labelledby="home-faqs">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <SectionHeader
          title={<span id="home-faqs">Questions people ask first</span>}
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
