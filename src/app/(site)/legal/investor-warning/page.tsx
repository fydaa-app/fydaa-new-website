import { legalPageSeo } from "@/config/routes";
import { pageMetadata } from "@/lib/seo/metadata";
import { LegalDocument } from "../_components/legal-document";

export const metadata = pageMetadata(legalPageSeo("/legal/investor-warning"));

const InvestorWarning = () => {
  return (
    <LegalDocument
      title="Investor Warning - Fraudulent Misuse of Our Details"
      subtitle="Important security information to protect you from fraud."
    >
      <section className="legal-alert">
        <h2>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="legal-alert-icon"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          IMPORTANT WARNING
        </h2>
        <p>
          We have been informed that fraudulent entities are misusing our company name, registration details,
          and SEBI registration number to deceive investors. Please be extremely cautious and verify all
          communications.
        </p>
      </section>

      <section>
        <h2>1. How to Identify Fraudulent Communications</h2>
        <p>Be suspicious of communications that:</p>
        <ul>
          <li>Ask for money transfers to personal accounts</li>
          <li>Promise guaranteed returns or unrealistic profits</li>
          <li>Request sensitive personal information via email or phone</li>
          <li>Use unofficial email addresses or phone numbers</li>
          <li>Create urgency or pressure you to act quickly</li>
          <li>Ask for upfront payments or processing fees</li>
        </ul>
      </section>

      <section>
        <h2>2. Our Official Contact Information</h2>
        <div className="legal-panel">
          <p>
            <strong>Official Email:</strong> <a href="mailto:support@fydaa.com">support@fydaa.com</a>
          </p>
          <p>
            <strong>Official Phone:</strong> +91 9136935300
          </p>
          <p>
            <strong>Official Website:</strong> www.fydaa.com
          </p>
          <p>
            <strong>Registered Office:</strong> #903, Ecostar Building, Off Aarey Road, Churi Wadi, Goregaon
            (East), Mumbai, Maharashtra - 400063
          </p>
        </div>
      </section>

      <section>
        <h2>3. What to Do If You Suspect Fraud</h2>
        <p>If you receive suspicious communications:</p>
        <ol>
          <li>Do not respond or provide any personal information</li>
          <li>Do not transfer any money or make payments</li>
          <li>
            Contact us immediately at <a href="mailto:support@fydaa.com">support@fydaa.com</a>
          </li>
          <li>Report to local police and cybercrime authorities</li>
          <li>Inform SEBI about the fraudulent activity</li>
          <li>Keep records of all suspicious communications</li>
        </ol>
      </section>

      <section>
        <h2>4. Our Legitimate Services</h2>
        <p>Fydaa provides legitimate investment advisory services:</p>
        <ul>
          <li>We never ask for money transfers to personal accounts</li>
          <li>All payments are made through official channels</li>
          <li>We provide detailed invoices and receipts</li>
          <li>Our advisers are properly licensed and registered</li>
          <li>We maintain transparent fee structures</li>
        </ul>
      </section>

      <section>
        <h2>5. Report Fraudulent Activity</h2>
        <p>If you encounter fraudulent misuse of our details, please report it immediately:</p>
        <div className="legal-panel">
          <p>
            <strong>Email:</strong> <a href="mailto:support@fydaa.com"> support@fydaa.com</a>
          </p>
          <p>
            <strong>Phone:</strong> +91 9136935300
          </p>
          <p>
            <strong>SEBI:</strong> sebi@sebi.gov.in
          </p>
        </div>
      </section>
    </LegalDocument>
  );
};

export default InvestorWarning;
