"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GetAppButton } from "@/components/app/get-app-button";
import { buttonClasses } from "@/components/ui/button";
import { legalRoutes, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import "./site-footer.css";

const { adviser, distributor, principalOfficer } = siteConfig.entities;

const PRODUCT_LINKS = [routes.features, routes.programme, routes.download] as const;
const COMPANY_LINKS = [routes.about, routes.careers, routes.partner, routes.upiFaq] as const;
const SOCIAL = [
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "Facebook", href: siteConfig.social.facebook },
] as const;

function LinkColumn({
  id,
  title,
  links,
  className,
}: {
  id: string;
  title: string;
  links: readonly { path: string; label: string }[];
  className?: string;
}) {
  return (
    <nav aria-labelledby={id} className={cn("footer__col", className)}>
      <h3 id={id} className="footer__head">
        {title}
      </h3>
      <ul>
        {links.map((route) => (
          <li key={route.path}>
            <Link
              href={route.path}
              className="footer__link"
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

/**
 * The close of the home page (tasteskill close-word): the main action once more, word for word,
 * then the name set across the content box. Row 1 of the home page's last section.
 */
function Close() {
  return (
    <div className="closing__cta close--word">
      <div className="close__head">
        <h2 className="close__title">Your first goal SIP, from ₹1,000 a month</h2>
        <GetAppButton size="md" side="top" align="end" icon={false} data={{ source: "web_close" }}>
          Get the app
        </GetAppButton>
      </div>
      <p className="close__name" aria-hidden="true">
        {siteConfig.name}
      </p>
    </div>
  );
}

/**
 * Site footer (tasteskill footer-dark): contact, the link columns, UPI payment details, both
 * registrations and the full regulatory disclaimer, on the one dark ground. On the home page it is
 * also the page's closing section, two screens: the close, then this directory.
 */
export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [qrOpen, setQrOpen] = useState(false);

  return (
    // On the home page the footer is its closing section (tasteskill: footer.closing carries #contact).
    <footer id={isHome ? "contact" : "footer"} className={cn("site-footer", isHome && "closing g2")}>
      <div className="wrap">
        {isHome ? <Close /> : null}

        <div className="footer__directory">
          <div className="footer__grid">
            <div className="footer__company">
              <Link href="/" aria-label={`${siteConfig.name} home`} className="footer__logo">
                <img src="/fydaa-logo.png" alt={siteConfig.name} width={409} height={147} />
              </Link>
              <address className="footer__contact">
                <a href={siteConfig.contact.phoneHref} className="footer__link">
                  {siteConfig.contact.phone}
                </a>
                <a href={`mailto:${siteConfig.contact.email}`} className="footer__link">
                  {siteConfig.contact.email}
                </a>
                <span>Off Aarey Road, Goregaon (East), Mumbai</span>
              </address>
              <div>
                <h3 className="footer__head">Pay advisory fees by UPI</h3>
                <ul className="footer__inline">
                  <li>
                    <Link href={routes.upiFaq.path} className="footer__link">
                      UPI handles
                    </Link>
                  </li>
                  <li>
                    <button type="button" onClick={() => setQrOpen(true)} className="footer__link">
                      Scan the QR code
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <LinkColumn id="footer-product" title="Product" links={PRODUCT_LINKS} />
            <LinkColumn id="footer-company" title="Company" links={COMPANY_LINKS} />
            <LinkColumn id="footer-legal" title="Legal" links={legalRoutes} className="footer__col--legal" />
          </div>

          <section aria-labelledby="footer-disclaimer" className="footer__legal-text">
            <h3 id="footer-disclaimer" className="footer__head">
              Registrations and disclaimer
            </h3>
            <dl className="footer__entities">
              <div>
                <dt>{adviser.legalName}</dt>
                <dd>
                  Type of Registration: Non-Individual. RIA Registration Number:{" "}
                  <span className="font-mono">{adviser.sebiRegistrationNumber}</span>, Validity: Perpetual.
                  Registered Office Address: 903, Ecostar Building, Off Aarey Road, Churi Wadi, Goregaon
                  (East), Mumbai, Maharashtra – 400063. GST number:{" "}
                  <span className="font-mono">{adviser.gstin}</span>
                </dd>
              </div>
              <div>
                <dt>{distributor.legalName}</dt>
                <dd>
                  AMFI registered ARN:{" "}
                  <span className="font-mono">{distributor.arn.replace("ARN-", "")}</span>
                </dd>
              </div>
              <div>
                <dt>Contact details of Principal Officer</dt>
                <dd>
                  Name: {principalOfficer}. Email: {siteConfig.contact.email}
                </dd>
              </div>
              <div>
                <dt>SEBI regional/local address</dt>
                <dd>
                  SEBI Bhavan BKC, Plot No.C4-A, ‘G’ Block, Bandra-Kurla Complex, Bandra (East), Mumbai -
                  400051, Maharashtra. E-mail: sebi@sebi.gov.in
                </dd>
              </div>
            </dl>
            <div className="footer__disclaimer">
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
          </section>

          <div className="footer__row">
            <p>
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Fydaa. Investment advice by{" "}
              {adviser.legalName}.
            </p>
            <ul className="footer__social">
              {SOCIAL.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="footer__link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

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
