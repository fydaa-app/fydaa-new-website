import { legalPageSeo } from "@/config/routes";
import { pageMetadata } from "@/lib/seo/metadata";
import { LegalDocument } from "../_components/legal-document";

export const metadata = pageMetadata(legalPageSeo("/legal/grievance-redressal"));

const Grievance = () => {
  const contacts = [
    {
      designation: "Customer Care",
      name: "Rinku Das",
      address:
        "903, Eco Star Building, Off Aarey Road, Churi Wadi,Goregaon(East), Mumbai, Maharashtra -400063",
      phone: "9136935300",
      email: "rinku.das@fydaa.com",
      hours: "10.00 A.M – 7.00 P.M",
    },
    {
      designation: "Head of Customer Care",
      name: "Rajat Tomar",
      address:
        "903, Eco Star Building, Off Aarey Road, Churi Wadi,Goregaon(East), Mumbai, Maharashtra -400063",
      phone: "8077746386",
      email: "rajat.tomar@fydaa.com",
      hours: "10.00 A.M – 7.00 P.M",
    },
    {
      designation: "Compliance Officer",
      name: "Kuntal Bhansali",
      address:
        "903, Eco Star Building, Off Aarey Road, Churi Wadi,Goregaon(East), Mumbai, Maharashtra -400063",
      phone: "9930768002",
      email: "kuntal@multistratocapital.com",
      hours: "10.00 A.M – 7.00 P.M",
    },
    {
      designation: "CEO",
      name: "Kuntal Bhansali",
      address:
        "903, Eco Star Building, Off Aarey Road, Churi Wadi,Goregaon(East), Mumbai, Maharashtra -400063",
      phone: "9930768002",
      email: "kuntal@multistratocapital.com",
      hours: "10.00 A.M – 7.00 P.M",
    },
    {
      designation: "Principal Officer",
      name: "Kuntal Bhansali",
      address:
        "903, Eco Star Building, Off Aarey Road, Churi Wadi,Goregaon(East), Mumbai, Maharashtra -400063",
      phone: "9930768002",
      email: "kuntal@multistratocapital.com",
      hours: "10.00 A.M – 7.00 P.M",
    },
  ];

  return (
    <LegalDocument
      title="Grievance Redressal"
      subtitle={
        <>
          We&apos;re here to help resolve your concerns. Reach out to our dedicated team through any of the
          channels below.
        </>
      }
    >
      <ul className="legal-contacts">
        {contacts.map((contact, index) => (
          <li key={index} className="grid gap-x-10 gap-y-4 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
            <div>
              <h2>{contact.designation}</h2>
              <p className="text-grey-600">{contact.name}</p>
            </div>

            <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-grey-500" data-legal-chrome>
                  Address
                </dt>
                <dd>{contact.address}</dd>
              </div>
              <div>
                <dt className="text-grey-500" data-legal-chrome>
                  Phone
                </dt>
                <dd>
                  <a href={`tel:${contact.phone}`} className="figure">
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-grey-500" data-legal-chrome>
                  Email
                </dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </dd>
              </div>
              <div>
                <dt className="text-grey-500" data-legal-chrome>
                  Hours
                </dt>
                <dd>{contact.hours}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <p className="mt-10">
        For immediate assistance, please contact our Customer Care team. We aim to respond to all inquiries
        within 24 hours.
      </p>
    </LegalDocument>
  );
};

export default Grievance;
