import type { ReactNode } from "react";
import QuickAnswers from "@/features/quick-answers/QuickAnswers";

/** Partner microsites have their own chrome but share the help panel. */
export default function PartnerSiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <QuickAnswers />
    </>
  );
}
