import { legalPageSeo } from "@/config/routes";
import { pageMetadata } from "@/lib/seo/metadata";
import { LegalDocument } from "../_components/legal-document";

export const metadata = pageMetadata(legalPageSeo("/legal/refund-policy"));

export default function Terms() {
  return (
    <LegalDocument
      title="Refund Policy"
      subtitle="Multistrato Capital Advisers Private Limited / fydaa Refund policy"
    >
      <h2>REFUNDS</h2>
      <p>All subscriptions are final and no refund will be issued.</p>
      <h2>QUESTIONS</h2>
      <p>
        If you have any questions concerning our return policy, please contact us at:
        <br />
        +91 9136935300
        <br />
        support@fydaa.com
      </p>
    </LegalDocument>
  );
}
