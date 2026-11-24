"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { buttonClasses } from "@/components/ui/button";
import { legalRoutes, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

const { adviser, distributor, principalOfficer } = siteConfig.entities;

const SOCIAL: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "Fydaa on LinkedIn",
    href: siteConfig.social.linkedin,
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    label: "Fydaa on Instagram",
    href: siteConfig.social.instagram,
    icon: (
      <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 7.75 4zm9.5 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    ),
  },
  {
    label: "Fydaa on Facebook",
    href: siteConfig.social.facebook,
    icon: (
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.009 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.082 24 18.092 24 12.073z" />
    ),
  },
];

const PRODUCT_LINKS = [routes.features, routes.programme, routes.download] as const;
const COMPANY_LINKS = [routes.about, routes.careers, routes.partner, routes.upiFaq] as const;

const columnLink =
  "flex min-h-11 items-center text-sm text-grey-600 transition-colors duration-quick hover:text-ink lg:min-h-9";

function LinkColumn({
  id,
  title,
  links,
}: {
  id: string;
  title: string;
  links: readonly { path: string; label: string }[];
}) {
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className="mb-2 text-sm font-semibold text-ink [font-stretch:104%]">
        {title}
      </h2>
      <ul>
        {links.map((route) => (
          <li key={route.path}>
            <Link
              href={route.path}
              className={columnLink}
              prefetch={route.path === routes.download.path ? false : undefined}
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Site footer: contact, product/company/legal links, UPI payment details and the regulatory disclaimer. */
export default function Footer() {
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <footer id="footer" className="relative z-50 border-t border-line bg-mist pb-10 pt-14 text-ink sm:pt-16">
      <Container className="flex flex-col gap-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label={`${siteConfig.name} home`} className="w-fit">
              <img
                src="/fydaa-logo.png"
                alt={siteConfig.name}
                width={409}
                height={147}
                className="h-9 w-auto"
              />
            </Link>
            <address className="flex flex-col gap-1 text-sm not-italic leading-relaxed text-grey-600">
              <a
                href={siteConfig.contact.phoneHref}
                className="inline-flex min-h-11 w-fit items-center font-semibold text-ink hover:text-jade lg:min-h-8"
              >
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex min-h-11 w-fit items-center font-semibold text-ink hover:text-jade lg:min-h-8"
              >
                {siteConfig.contact.email}
              </a>
              <span className="mt-1 hidden max-w-xs sm:inline">
                903, Ecostar Building, Off Aarey Road, Goregaon (East), Mumbai 400063
              </span>
            </address>
            <ul className="-ml-2.5 flex items-center gap-1">
              {SOCIAL.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex size-11 items-center justify-center rounded-btn text-grey-600 transition-colors duration-quick hover:bg-white hover:text-ink"
                  >
                    <svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <LinkColumn id="footer-product" title="Product" links={PRODUCT_LINKS} />
          <LinkColumn id="footer-company" title="Company" links={COMPANY_LINKS} />

          <div className="flex flex-col gap-8 sm:col-span-2 sm:grid sm:grid-cols-2 lg:col-span-1 lg:flex">
            <nav aria-labelledby="footer-legal">
              <h2 id="footer-legal" className="mb-2 text-sm font-semibold text-ink [font-stretch:104%]">
                Legal
              </h2>
              <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-1">
                {legalRoutes.map((route) => (
                  <li key={route.path}>
                    <Link href={route.path} className={columnLink}>
                      {route.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h2 className="mb-3 text-sm font-semibold text-ink [font-stretch:104%]">
                Pay advisory fees by UPI
              </h2>
              <div className="flex flex-wrap gap-2">
                <Link href={routes.upiFaq.path} className={buttonClasses({ variant: "secondary" })}>
                  UPI handles
                </Link>
                <button
                  type="button"
                  onClick={() => setQrOpen(true)}
                  className={buttonClasses({ variant: "secondary" })}
                >
                  Scan QR code
                </button>
              </div>
            </div>
          </div>
        </div>

        <section aria-labelledby="footer-disclaimer" className="border-t border-line pt-8">
          <h2 id="footer-disclaimer" className="mb-3 text-sm font-semibold text-ink">
            Disclaimer
          </h2>
          <div className="grid gap-x-10 gap-y-3 text-xs leading-relaxed text-grey-600 sm:text-[0.8125rem] lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <p>
                By using this website, you understand the information being presented is provided for
                informational purposes only and agree to our Terms of Service and Privacy Policy. Fydaa relies
                on information from various sources believed to be reliable, but cannot guarantee the accuracy
                and completeness of that information.
              </p>
              <p>
                The information contained in this communication is provided for general informational purposes
                only, and should not be construed as investment advice. Any links provided to other sites are
                offered as a matter of convenience and are not intended to imply that Fydaa or its affiliates
                endorses, sponsors, promotes and/or is affiliated with the owners of or participants in those
                sites, or endorses any information contained on those sites, unless expressly stated
                otherwise.
              </p>
              <p>
                ‘Registration granted by SEBI, membership of BASL and certification from NISM in no way
                guarantee performance of the intermediary or provide any assurance of returns to investors.’
              </p>
              <p>
                “Investment in securities market are subject to market risks. Read all the related documents
                carefully before investing.”
              </p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-ink">{adviser.legalName}</dt>
                <dd>
                  Type of Registration: Non-Individual. RIA Registration Number:{" "}
                  {adviser.sebiRegistrationNumber}, Validity: Perpetual
                  <br />
                  Registered Office Address: 903, Ecostar Building, Off Aarey Road, Churi Wadi, Goregaon
                  (East), Mumbai, Maharashtra – 400063.
                  <br />
                  GST number: {adviser.gstin}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">{distributor.legalName}</dt>
                <dd>AMFI registered ARN: {distributor.arn.replace("ARN-", "")}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Contact details of Principal Officer</dt>
                <dd>
                  Name: {principalOfficer}
                  <br />
                  Email: {siteConfig.contact.email}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">SEBI regional/local address</dt>
                <dd>
                  SEBI Bhavan BKC, Plot No.C4-A, ‘G’ Block, Bandra-Kurla Complex, Bandra (East), Mumbai -
                  400051, Maharashtra
                  <br />
                  E-mail: sebi@sebi.gov.in
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <p className="text-sm text-grey-500">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Fydaa. Investment advice by{" "}
          {adviser.legalName}.
        </p>
      </Container>

      {qrOpen ? <QrDialog onClose={() => setQrOpen(false)} /> : null}
    </footer>
  );
}

function QrDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="t-scrim fixed inset-0 z-[9999] flex items-end justify-center bg-ink/50 sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="scan-qr-title"
        onClick={(event) => event.stopPropagation()}
        className="t-dialog flex max-h-[92dvh] w-full flex-col rounded-t-4xl bg-white text-ink shadow-modal outline-none sm:w-[min(560px,95vw)] sm:rounded-4xl"
      >
        <h2 id="scan-qr-title" className="px-5 pb-2 pt-5 text-title">
          Scan to pay with UPI
        </h2>
        <p className="px-5 text-sm text-grey-600">
          These QR codes pay our SEBI-validated UPI IDs. Your UPI app should show a green triangle with a
          thumbs-up.
        </p>
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto px-5 py-4 sm:grid-cols-2">
          {siteConfig.upi.qrCodes.map((qr) => (
            <figure
              key={qr.handle}
              className="flex flex-col items-center gap-2 rounded-card border border-line p-3"
            >
              <img
                src={qr.src}
                alt={`UPI QR code for ${qr.handle}`}
                width={220}
                height={220}
                className="h-auto w-full max-w-[220px]"
              />
              <figcaption className="break-all text-center font-mono text-xs text-grey-600">
                {qr.handle}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-line px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <Link
            href={routes.upiFaq.path}
            className={buttonClasses({ variant: "secondary" })}
            onClick={onClose}
          >
            UPI FAQs
          </Link>
          <button type="button" onClick={onClose} className={buttonClasses()}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
