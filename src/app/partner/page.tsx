import PartnerRegistrationCard from '@/app/components/partner/PartnerRegistrationCard';
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Become a Partner",
  description:
    "AMFI-registered mutual fund distributors can partner with Fydaa: register your ARN, verify your details and grow with our advisory platform.",
  path: "/partner",
});


export default function PartnerPage() {
  return <PartnerRegistrationCard />;
}
