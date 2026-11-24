import { legalPageSeo } from "@/config/routes";
import { pageMetadata } from "@/lib/seo/metadata";
import { LegalDocument } from "../_components/legal-document";

export const metadata = pageMetadata(legalPageSeo("/legal/vigilance-awareness-week"));

export default function VigilanceAwarenessWeek() {
  return (
    <LegalDocument
      title="Vigilance Awareness Week 2025"
      subtitle={
        <>
          <strong className="font-semibold text-ink">Dates:</strong> October 27th to November 2nd, 2025 <br />
          <strong className="font-semibold text-ink">Theme:</strong> <br />
          <span className="italic">
            “सतर्कता: हमारी साझा जिम्मेदारी” <br />
            (“Vigilance: Our Shared Responsibility”)
          </span>
        </>
      }
    >
      <p>
        Vigilance Awareness Week 2025 is being observed to promote integrity, transparency, and accountability
        in all spheres of public and professional life. <br /> All are encouraged to take the{" "}
        <a href="https://pledge.cvc.nic.in/" target="_blank" rel="noopener noreferrer">
          https://pledge.cvc.nic.in/
        </a>{" "}
        and actively contribute to the promotion of integrity and transparency.
      </p>

      <h2>Participative Vigilance Initiative</h2>
      <p>
        Vigilance Awareness Week is one of the Participative Vigilance initiatives of the Central Vigilance
        Commission in the fight against corruption. It serves as an awareness-building and outreach measure
        that aims to bring together all stakeholders.
      </p>

      <h2>Objective and Significance</h2>
      <p>
        The observance of Vigilance Awareness Week seeks to create greater sensitivity about the importance of
        ethics, integrity, and transparency in governance and public administration. The Commission endeavors
        to promote integrity and eradicate corruption with the active support and participation of all
        citizens.
      </p>

      <h2>Preventive Vigilance Campaign</h2>
      <p>
        Over the past three years, a campaign has been undertaken in the run-up to the week, focusing on
        preventive vigilance initiatives as key areas for improvement and awareness.
      </p>

      <h2>Commemoration</h2>
      <p>
        Every year, Vigilance Awareness Week is observed in the week in which the birthday of{" "}
        <strong>Bharat Ratna Sardar Vallabhbhai Patel</strong> falls, commemorating his contribution to
        building a strong, unified, and ethical nation.
      </p>
    </LegalDocument>
  );
}
