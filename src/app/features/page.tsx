import "../home/styles/home.css";
import ProductSections from "../home/components/ProductSections";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Features",
  description:
    "Goal-based SIPs, a money vault for every rupee, one view of all your finances and a single financial-health score. See what you can do with Fydaa.",
  path: "/features",
});


export default function FeaturesPage() {
  return (
    <main className="fydaa-home w-full m-0 relative pt-16 pb-12 sm:pt-20 sm:pb-16 md:pb-24">
      <ProductSections />
    </main>
  );
}
