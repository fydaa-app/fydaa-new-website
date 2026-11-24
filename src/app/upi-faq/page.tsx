import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Validated UPI Handle FAQs",
  description: "Frequently asked questions about SEBI's validated UPI handle system for paying registered intermediaries.",
  path: "/upi-faq",
  noIndex: true,
});

export default function UpiFaqPage() {
  return (
    <main className="fixed inset-0 bg-black">
      <iframe
        title="Validated UPI Handle System FAQ"
        src="/documents/upi-intimation-to-investors.pdf#toolbar=1&navpanes=0"
        className="h-full w-full border-0"
      />
    </main>
  );
}
