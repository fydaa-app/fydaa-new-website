import { StatusPage } from "@/components/feedback/status-page";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { robotsFor } from "@/lib/seo/metadata";
import type { Metadata } from "next";

/**
 * Global 404. Rendered directly under the root layout (outside every route group), so
 * it brings its own navigation and footer. Next.js marks it noindex automatically.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: robotsFor(true),
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <StatusPage
        eyebrow="Error 404"
        title="We couldn't find that page"
        description="The link may be broken or the page may have moved. These are good places to start:"
        actions={
          <>
            <ButtonLink href={routes.home.path} size="lg">
              Go to home
            </ButtonLink>
            <ButtonLink href={routes.signup.path} variant="secondary" size="lg">
              Start investing
            </ButtonLink>
          </>
        }
      />
      <Footer />
    </>
  );
}
