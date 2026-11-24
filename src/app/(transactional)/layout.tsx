import type { Metadata } from "next";
import type { ReactNode } from "react";
import { robotsFor } from "@/lib/seo/metadata";

/**
 * Payment, mandate and KYC callback pages (URLs are configured at the providers, so
 * they keep their legacy paths). Never indexed.
 */
export const metadata: Metadata = {
  title: "Status",
  robots: robotsFor(true),
};

export default function TransactionalLayout({ children }: { children: ReactNode }) {
  return children;
}
