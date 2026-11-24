import DashboardApp from "@/features/dashboard/App";
import SessionWatch from "@/features/onboarding/SessionWatch";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Dashboard",
  description: "Your Fydaa investments, goals and orders.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardPage() {
  return (
    <>
      <SessionWatch />
      <DashboardApp />
    </>
  );
}
