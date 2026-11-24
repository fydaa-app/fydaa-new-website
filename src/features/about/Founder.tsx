import Image from "next/image";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

/** The person behind Fydaa: portrait, role and a short, factual career line. */
export default function Founder() {
  return (
    <section aria-labelledby="founder-title" className="section">
      <Container className="grid gap-10 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:items-start lg:gap-16">
        <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-4xl bg-mist md:max-w-none" data-allow-clip>
          <Image
            src="/about-us/Kuntalsir.png"
            alt="Kuntal Bhansali, founder of Fydaa"
            fill
            sizes="(min-width: 1152px) 400px, (min-width: 768px) 36vw, 320px"
            className="object-cover object-top"
          />
        </div>

        <div className="flex flex-col gap-6 md:pt-2">
          <div className="flex flex-col gap-2">
            <h2 id="founder-title" className="max-w-[16ch] text-heading text-ink">
              Founded by Kuntal Bhansali
            </h2>
            <p className="text-base text-grey-500">
              Founder and CEO, {siteConfig.entities.adviser.legalName}
            </p>
          </div>
          <div className="flex max-w-[60ch] flex-col gap-4 text-base leading-relaxed text-grey-600 sm:text-lead">
            <p>
              Kuntal started over 20 years ago as an equity research analyst and went on to become a fund manager with
              Reliance Capital PMS, managing money for high-net-worth individuals.
            </p>
            <p>
              Almost 10 years ago he turned entrepreneur, working in investment banking and fund management. That led
              him to tech startups, where he saw how technology can reach people at scale.
            </p>
            <p>
              Fydaa comes from both: years of managing money, and technology that makes expert financial planning
              available to everyone, not only the wealthy.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
