import type { ReactNode } from "react";
import { MobileAppBar } from "@/components/app/mobile-app-bar";
import { SiteChrome } from "@/components/layout/site-chrome";
import QuickAnswers from "@/features/quick-answers/QuickAnswers";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteChrome>{children}</SiteChrome>
      <MobileAppBar />
      <QuickAnswers />
    </>
  );
}
