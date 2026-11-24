import type { CSSProperties } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const step = (i: number) => ({ "--i": i }) as CSSProperties;
const { adviser, distributor } = siteConfig.entities;

/**
 * About hero: the mission set large, one way in, both registrations, and a still line of people
 * standing on a hairline ground (who "for all" means). No marquee.
 */
export default function HeroSection() {
  return (
    <section aria-labelledby="about-title" className="pt-28 sm:pt-32 lg:pt-36" data-enter>
      <Container className="flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h1 id="about-title" className="max-w-[19ch] text-display text-ink" data-enter-item style={step(0)}>
            Wealth shouldn&apos;t be a privilege. It should be a possibility for all.
          </h1>
          <p className="max-w-[52ch] text-pretty text-lead text-grey-600" data-enter-item style={step(1)}>
            We&apos;re on a mission to make smart investing accessible, understandable, and achievable, no
            matter your income, background or experience.
          </p>
          <div
            className="flex flex-col gap-x-6 gap-y-4 pt-2 sm:flex-row sm:items-center"
            data-enter-item
            style={step(2)}
          >
            <ButtonLink
              href="/#book-a-call"
              size="lg"
              data-ph-event="Book a Free Call"
              className="self-start"
            >
              Book a free call
            </ButtonLink>
            <p className="flex flex-col text-sm text-grey-500">
              <span>
                SEBI-registered investment adviser,{" "}
                <span className="whitespace-nowrap">{adviser.sebiRegistrationNumber}</span>.
              </span>
              <span>
                AMFI-registered mutual fund distributor,{" "}
                <span className="whitespace-nowrap">{distributor.arn}</span>.
              </span>
            </p>
          </div>
        </div>
        <div className="overflow-hidden" data-allow-clip data-enter-item style={step(3)}>
          <Image
            src="/Heropage/diverse-people.png"
            alt="Line drawings of people of different ages, backgrounds and abilities"
            width={1596}
            height={151}
            loading="eager"
            sizes="(min-width: 1152px) 1088px, 760px"
            className="h-16 w-auto max-w-none sm:h-20 lg:h-auto lg:w-full"
          />
        </div>
      </Container>
    </section>
  );
}
