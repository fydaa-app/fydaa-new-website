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
      <header className="container pt-10 text-center sm:pt-14">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--g-deep)]">Features</p>
        <h1 className="mx-auto mt-3 max-w-[18ch]">Everything you need to grow your money</h1>
        <p className="mx-auto mt-4 max-w-[56ch] text-base leading-relaxed text-[var(--ink2)] sm:text-lg">
          Goal-based investing, one view of all your finances and a single score for your financial health.
        </p>
      </header>
      <ProductSections />
    </main>
  );
}
