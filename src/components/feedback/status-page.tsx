import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export interface StatusPageProps {
  /** Short sentence-case context line above the title, e.g. "Error 404". */
  eyebrow: string;
  title: string;
  description: ReactNode;
  /** Primary actions (buttons/links). */
  actions: ReactNode;
}

const helpfulLinks = [routes.about, routes.features, routes.careers, routes.login];
const step = (i: number) => ({ "--i": i }) as CSSProperties;

const rowLink =
  "flex min-h-14 items-center justify-between gap-4 border-t border-line py-3 text-base font-semibold text-ink transition-colors duration-quick [font-stretch:104%] hover:text-jade focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade";

/** Left-aligned status message used by the 404 and error pages: what happened, then ways on. */
export function StatusPage({ eyebrow, title, description, actions }: StatusPageProps) {
  return (
    <main className="relative m-0 w-full bg-white">
      <section className="pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-36" data-enter>
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3" data-enter-item style={step(0)}>
              <p className="text-sm font-semibold text-emerald">{eyebrow}</p>
              <h1 className="max-w-[16ch] text-display text-ink">{title}</h1>
            </div>
            <div className="max-w-[52ch] text-pretty text-lead text-grey-600" data-enter-item style={step(1)}>
              {description}
            </div>
            <div className="flex flex-wrap gap-3 pt-2" data-enter-item style={step(2)}>
              {actions}
            </div>
          </div>

          <nav aria-label="Helpful links" data-enter-item style={step(3)}>
            <ul className="border-b border-line">
              {helpfulLinks.map((route) => (
                <li key={route.path}>
                  <Link href={route.path} className={rowLink}>
                    {route.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={siteConfig.contact.phoneHref} className={rowLink}>
                  Call us
                  <span className="figure text-sm font-medium text-grey-500">{siteConfig.contact.phone}</span>
                </a>
              </li>
            </ul>
          </nav>
        </Container>
      </section>
    </main>
  );
}
