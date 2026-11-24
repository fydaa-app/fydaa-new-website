import type { CSSProperties } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
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

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/** What the app does, in the product's own names. */
const IN_THE_APP = [
  { title: "Goal investing", body: "A SIP for each thing you're saving for, and how close each goal is." },
  {
    title: "Money Vault",
    body: "Bank accounts, investments, loans and assets in one view, with your net worth.",
  },
  {
    title: "Wealth Score",
    body: "One number out of 100 for how healthy your finances are, and what to fix first.",
  },
];

/**
 * One link for every "Download App" button, QR code and campaign: phones are sent
 * straight to their store, everyone else can pick one.
 */
export default async function DownloadPage() {
  const platform = storePlatformFor((await headers()).get("user-agent"));
  if (platform === "android") redirect(siteConfig.apps.android);
  if (platform === "ios") redirect(siteConfig.apps.ios);

  return (
    <main className="relative m-0 w-full bg-white">
      <section aria-labelledby="download-title" className="pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-36" data-enter>
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-6">
            <h1
              id="download-title"
              className="max-w-[12ch] text-display text-ink"
              data-enter-item
              style={step(0)}
            >
              Get the Fydaa app
            </h1>
            <p className="max-w-[46ch] text-pretty text-lead text-grey-600" data-enter-item style={step(1)}>
              Track your goals, SIPs and portfolio on your phone. Open this page on your phone and it takes
              you straight to your app store.
            </p>
            <div className="flex flex-wrap gap-3 pt-2" data-enter-item style={step(2)}>
              <ButtonLink href={siteConfig.apps.android} size="lg" data-ph-event="Download App Android">
                Get it on Google Play
              </ButtonLink>
              <ButtonLink
                href={siteConfig.apps.ios}
                size="lg"
                variant="secondary"
                data-ph-event="Download App iOS"
              >
                Download on the App Store
              </ButtonLink>
            </div>
          </div>

          <div data-enter-item style={step(3)}>
            <h2 className="text-sm font-semibold text-grey-500">In the app</h2>
            <ul className="mt-3">
              {IN_THE_APP.map((item) => (
                <li key={item.title} className="border-t border-line py-5">
                  <h3 className="text-title text-ink">{item.title}</h3>
                  <p className="mt-1 max-w-[44ch] text-base leading-relaxed text-grey-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </main>
  );
}
