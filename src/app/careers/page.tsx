import { pageMetadata } from "@/lib/seo/metadata";
import CareersView from "./CareersView";

export const metadata = pageMetadata({
  title: "Careers",
  description:
    "Build the future of wealth for every Indian. Explore open roles at Fydaa, a SEBI-registered fintech, or register your CV for upcoming opportunities.",
  path: "/careers",
});

export default function CareersPage() {
  return <CareersView />;
}
