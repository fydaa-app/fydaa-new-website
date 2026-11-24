import { AppQr, GetAppButton, StoreButtons } from "@/components/app/get-app-button";
import { Container } from "@/components/layout/container";
import { appLinkForQr } from "@/config/app-link";

/**
 * The last word before the footer: get the app. On a desktop the QR code is right there to scan;
 * on a phone the button goes straight to the store.
 */
export default function GetAppSection() {
  return (
    <section aria-labelledby="get-app-title" className="section">
      <Container>
        <div className="grid gap-10 rounded-section border border-line bg-white p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:p-14">
          <div className="flex flex-col gap-5">
            <h2 id="get-app-title" className="max-w-[14ch] text-heading text-ink">
              Start with one goal, in the Fydaa app
            </h2>
            <p className="max-w-[50ch] text-lead text-grey-600">
              Set up in a few minutes with your PAN and mobile number. Change or stop a SIP whenever you like.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="lg:hidden">
                <GetAppButton data={{ source: "web_closing" }}>Get the app</GetAppButton>
              </div>
              <StoreButtons />
            </div>
          </div>
          <div className="hidden w-52 flex-col items-center gap-3 rounded-4xl bg-mist p-5 lg:flex">
            <AppQr url={appLinkForQr({ source: "web_closing_qr" })} className="rounded-card bg-white p-3" />
            <p className="text-center text-sm text-grey-600">Scan with your phone camera</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
