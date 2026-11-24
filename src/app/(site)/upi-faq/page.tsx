import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { buttonClasses } from "@/components/ui/button";
import { FaqList } from "@/components/ui/faq-list";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Validated UPI Handle FAQs",
  description:
    "Fydaa's SEBI-validated UPI IDs for payments, and answers to common questions about SEBI's validated UPI handle system.",
  path: "/upi-faq",
  noIndex: true,
});

const PDF_PATH = "/documents/upi-intimation-to-investors.pdf";
const SEBI_CHECK_URL = "https://siportal.sebi.gov.in/intermediary/sebi-check";

const FAQS = [
  {
    id: "compulsory",
    title: "Do I have to use the new UPI IDs?",
    content: (
      <p>
        You can pay by any mode you prefer: UPI, IMPS, NEFT, RTGS or cheque. If you pay a SEBI-registered
        intermediary by UPI, you must use only the validated UPI IDs allotted to that intermediary.
      </p>
    ),
  },
  {
    id: "check",
    title: "What should I check before paying to a validated UPI ID or QR code?",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Left of the “@”: the intermediary’s name followed by a short category code, for example “brk” for
          brokers or “mf” for mutual funds (“ia” for investment advisers).
        </li>
        <li>Right of the “@”: the exclusive handle “@valid” followed by the bank name.</li>
        <li>
          On the confirmation screen, your UPI app shows a white thumbs-up icon inside a green triangle.
        </li>
        <li>
          A QR code generated for a validated ID shows the same icon, with the UPI ID printed just below it.
        </li>
      </ol>
    ),
  },
  {
    id: "investor-handle",
    title: "Do I need a new UPI ID to invest?",
    content: (
      <p>
        No. Only intermediaries get the new validated IDs. You can keep using your existing UPI ID to pay
        them.
      </p>
    ),
  },
  {
    id: "failed",
    title: "Who do I contact if a payment to a validated UPI ID fails?",
    content: (
      <p>
        Validated UPI IDs use the same banking channel as ordinary UPI handles. For any technical problem with
        a payment, please contact your bank.
      </p>
    ),
  },
];

export default function UpiFaqPage() {
  return (
    <main className="pb-20 pt-28 sm:pt-32">
      <Container size="prose" className="flex flex-col gap-10">
        <SectionHeader
          level={1}
          eyebrow="Investor notice"
          title="Pay Fydaa only to our SEBI-validated UPI IDs"
          description="As mandated by SEBI, Multistrato Capital Advisors (Fydaa) collects UPI payments only through validated UPI IDs. Before paying, check that the ID matches one of these exactly."
        />

        <section
          aria-labelledby="upi-ids"
          className="rounded-card border border-grey-200 bg-white p-5 sm:p-6"
        >
          <h2 id="upi-ids" className="text-title font-bold text-ink">
            Our validated UPI IDs
          </h2>
          <ul className="mt-4 grid gap-2">
            {siteConfig.upi.handles.map((id) => (
              <li
                key={id}
                className="break-all rounded-btn bg-grey-50 px-4 py-3 font-mono text-sm text-ink sm:text-base"
              >
                {id}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="upi-faqs" className="flex flex-col gap-4">
          <h2 id="upi-faqs" className="text-title font-bold text-ink">
            Frequently asked questions
          </h2>
          <FaqList items={FAQS} />
        </section>

        <section aria-labelledby="upi-verify" className="rounded-card bg-jade-tint p-5 sm:p-6">
          <h2 id="upi-verify" className="text-title font-bold text-ink">
            Verify a UPI ID with SEBI
          </h2>
          <p className="mt-2 text-base leading-relaxed text-grey-600">
            SEBI’s online check confirms whether a UPI ID is registered and validated, and shows the
            intermediary’s name and category.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={SEBI_CHECK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({ size: "lg" })}
            >
              Open SEBI’s verification tool
            </a>
            <a
              href={PDF_PATH}
              target="_blank"
              rel="noopener"
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              Download the notice (PDF)
            </a>
          </div>
        </section>
      </Container>
    </main>
  );
}
