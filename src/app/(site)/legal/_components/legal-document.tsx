import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/layout/container";

export interface LegalContentsItem {
  /** The `id` of the section's heading. */
  id: string;
  /** The heading's text, word for word. */
  label: string;
}

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * The one layout for every legal page: the title set large on the header's left edge, the
 * document in a readable column (`.legal-prose` in legal.css) and, for long documents, a list of
 * its sections (sticky beside the text on desktops, folded under the title on phones).
 *
 * Legal text stays word for word in each page; this only decides how it is laid out. Navigation
 * added here repeats the page's own headings and is marked `data-legal-chrome`.
 */
export function LegalDocument({
  title,
  subtitle,
  meta,
  contents,
  children,
}: {
  title: ReactNode;
  /** A line under the title, e.g. which entity the document is for. */
  subtitle?: ReactNode;
  /** Small print under the title, e.g. the date the document was last updated. */
  meta?: ReactNode;
  /** The document's sections, for long documents. */
  contents?: LegalContentsItem[];
  children: ReactNode;
}) {
  return (
    <main className="bg-white pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pt-36">
      <Container>
        <header className="flex flex-col gap-4 border-b border-line pb-8 sm:pb-10" data-enter>
          <h1 className="max-w-[18ch] text-display text-ink" data-enter-item>
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-[56ch] text-lead text-grey-600" data-enter-item style={step(1)}>
              {subtitle}
            </p>
          ) : null}
          {meta ? (
            <p className="text-sm text-grey-500" data-enter-item style={step(2)}>
              {meta}
            </p>
          ) : null}
        </header>

        {contents ? (
          <>
            <ContentsDisclosure items={contents} />
            <div className="grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_15rem]">
              <div className="legal-prose min-w-0 pt-10 sm:pt-12">{children}</div>
              <ContentsAside items={contents} />
            </div>
          </>
        ) : (
          <div className="legal-prose pt-10 sm:pt-12">{children}</div>
        )}
      </Container>
    </main>
  );
}

/** Desktop: the sections beside the text, following the reader down the page. */
function ContentsAside({ items }: { items: LegalContentsItem[] }) {
  return (
    <nav aria-label="On this page" className="hidden lg:block" data-legal-chrome>
      <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pb-6 pt-12">
        <p className="text-sm font-semibold text-ink [font-stretch:104%]">On this page</p>
        <ol className="mt-3 border-l border-line">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm leading-snug text-grey-600 transition-colors duration-quick hover:border-jade hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

/** Phones and tablets: the sections folded under the title, so the text starts on the first screen. */
function ContentsDisclosure({ items }: { items: LegalContentsItem[] }) {
  return (
    <nav aria-label="On this page" className="mt-8 lg:hidden" data-legal-chrome>
      <details className="group rounded-card border border-line">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-card px-4 text-sm font-semibold text-ink [font-stretch:104%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade [&::-webkit-details-marker]:hidden">
          On this page
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="size-4 shrink-0 text-grey-500 transition-transform duration-fast ease-smooth-out group-open:-scale-y-100 motion-reduce:transition-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="5 8 10 13 15 8" />
          </svg>
        </summary>
        <ol className="border-t border-line px-4 py-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex min-h-11 items-center text-sm text-grey-600 transition-colors duration-quick hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
