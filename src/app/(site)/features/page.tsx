import "@/features/home/styles/home.css";
import ProductSections from "@/features/home/components/ProductSections";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Features",
  description:
    "Goal-based SIPs, a money vault for every rupee, one view of all your finances and a single financial-health score. See what you can do with Fydaa.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <main className="fydaa-home relative m-0 w-full pb-12 pt-16 sm:pb-16 sm:pt-20 md:pb-24">
      <ProductSections />
    </main>
  );
}
