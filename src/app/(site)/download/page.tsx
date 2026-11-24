import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { storePlatformFor } from "@/features/app-download/platform";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Download the app",
  description: "Get the Fydaa app on Google Play or the App Store.",
  path: "/download",
  noIndex: true,
});

/**
 * One link for every "Download App" button, QR code and campaign: phones are sent
 * straight to their store, everyone else can pick one.
 */
export default async function DownloadPage() {
  const platform = storePlatformFor((await headers()).get("user-agent"));
  if (platform === "android") redirect(siteConfig.apps.android);
  if (platform === "ios") redirect(siteConfig.apps.ios);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 pb-16 pt-28 text-center">
      <h1 className="text-display font-bold text-ink">Get the Fydaa app</h1>
      <p className="mt-4 text-base leading-relaxed text-grey-600">
        Track your goals, SIPs and portfolio on the go. Open this page on your phone to go straight to your
        app store.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href={siteConfig.apps.android} size="lg" data-ph-event="Download App Android">
          Get it on Google Play
        </ButtonLink>
        <ButtonLink href={siteConfig.apps.ios} size="lg" variant="secondary" data-ph-event="Download App iOS">
          Download on the App Store
        </ButtonLink>
      </div>
    </main>
  );
}
