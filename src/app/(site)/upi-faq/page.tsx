import { Container } from "@/components/layout/container";
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
/** Long labels wrap on a 320px phone instead of widening the page. */
const WRAPPING_BUTTON = "h-auto min-h-12 whitespace-normal py-3 text-center";

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

/**
 * Splits a validated UPI ID into the parts an investor should check (see the "check" FAQ): the
 * intermediary's name, its category code, the exclusive "@valid" handle and the bank.
 */
function upiIdParts(id: string) {
  const [left = id, right = ""] = id.split("@");
  const dot = left.lastIndexOf(".");
  const name = dot > 0 ? left.slice(0, dot) : left;
  const category = dot > 0 ? left.slice(dot) : "";
  const valid = right.startsWith("valid") ? "@valid" : right ? "@" : "";
  const bank = right.startsWith("valid") ? right.slice("valid".length) : right;
  return { name, category, valid, bank };
}

export default function UpiFaqPage() {
  return (
    <main className="bg-white pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pt-36">
      <Container className="flex flex-col gap-16 sm:gap-20">
        <div className="flex flex-col gap-10 sm:gap-12" data-enter>
          <div className="flex flex-col gap-5">
            <h1 className="max-w-[18ch] text-display text-ink" data-enter-item>
              Pay Fydaa only to our SEBI-validated UPI IDs
            </h1>
            <p
              className="max-w-[56ch] text-lead text-grey-600"
              data-enter-item
              style={{ ["--i" as string]: 1 }}
            >
              As mandated by SEBI, Multistrato Capital Advisors (Fydaa) collects UPI payments only through
              validated UPI IDs. Before paying, check that the ID matches one of these exactly.
            </p>
          </div>

          <div
            className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10"
            data-enter-item
            style={{ ["--i" as string]: 2 }}
          >
            <section
              aria-labelledby="upi-ids"
              className="rounded-4xl border border-line bg-white p-5 shadow-window sm:p-6"
            >
              <h2 id="upi-ids" className="text-title text-ink">
                Our validated UPI IDs
              </h2>
              <ul className="mt-4 border-t border-line">
                {siteConfig.upi.handles.map((id) => {
                  const part = upiIdParts(id);
                  return (
                    <li
                      key={id}
                      className="break-all border-b border-line py-3 text-base font-medium text-ink [font-stretch:104%] sm:text-lg"
                    >
                      {part.name}
                      <span className="font-semibold text-emerald">{part.category}</span>
                      <span className="font-semibold text-jade">{part.valid}</span>
                      {part.bank}
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-4 grid gap-x-6 gap-y-1.5 text-sm text-grey-600 sm:grid-cols-[auto_minmax(0,1fr)]">
                <dt className="font-semibold text-emerald">.ia</dt>
                <dd>The category code for investment advisers</dd>
                <dt className="font-semibold text-jade">@valid</dt>
                <dd>The exclusive handle for SEBI-registered intermediaries, followed by the bank</dd>
              </dl>
            </section>

            <section aria-labelledby="upi-verify" className="rounded-4xl bg-mist p-6 sm:p-8">
              <h2 id="upi-verify" className="text-title text-ink">
                Verify a UPI ID with SEBI
              </h2>
              <p className="mt-2 max-w-[52ch] text-base leading-relaxed text-grey-600">
                SEBI’s online check confirms whether a UPI ID is registered and validated, and shows the
                intermediary’s name and category.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={SEBI_CHECK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses({ size: "lg", className: WRAPPING_BUTTON })}
                >
                  Open SEBI’s verification tool
                </a>
                <a
                  href={PDF_PATH}
                  target="_blank"
                  rel="noopener"
                  className={buttonClasses({ variant: "secondary", size: "lg", className: WRAPPING_BUTTON })}
                >
                  Download the notice (PDF)
                </a>
              </div>
            </section>
          </div>
        </div>

        <section aria-labelledby="upi-faqs" className="flex max-w-3xl flex-col gap-6">
          <h2 id="upi-faqs" className="text-heading text-ink">
            Frequently asked questions
          </h2>
          <FaqList items={FAQS} />
        </section>
      </Container>
    </main>
  );
}
