import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export interface StatusPageProps {
  eyebrow: string;
  title: string;
  description: ReactNode;
  /** Primary actions (buttons/links). */
  actions: ReactNode;
}

const helpfulLinks = [routes.about, routes.features, routes.careers, routes.login];

/** Centered status message used by the 404 and error pages. */
export function StatusPage({ eyebrow, title, description, actions }: StatusPageProps) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 pb-16 pt-28 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-jade">{eyebrow}</p>
      <h1 className="mt-3 text-heading font-bold text-ink">{title}</h1>
      <div className="mt-4 text-base leading-relaxed text-grey-600">{description}</div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
      <nav aria-label="Helpful links" className="mt-10">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
          {helpfulLinks.map((route) => (
            <li key={route.path}>
              <Link href={route.path} className="text-jade underline-offset-4 hover:underline">
                {route.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={siteConfig.contact.phoneHref} className="text-jade underline-offset-4 hover:underline">
              Call {siteConfig.contact.phone}
            </a>
          </li>
        </ul>
      </nav>
    </main>
  );
}
