import { pageMetadata } from "@/lib/seo/metadata";
import FYIAEPPage from "@/features/programme/FYIAEPPage";

export const metadata = pageMetadata({
  title: "FYIAEP: Investment Adviser Programme",
  description:
    "Become an industry-ready investment adviser in 4 months: NISM X-A & X-B certification, on-field training and live advisory practice with a SEBI RIA.",
  path: "/programme",
});

export default function ProgrammePage() {
  return (
    <main>
      <FYIAEPPage />
    </main>
  );
}
