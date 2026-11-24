import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { inter } from "./fonts";
import { JsonLd } from "@/lib/seo/json-ld";
import { rootMetadata } from "@/lib/seo/metadata";
import { siteGraphJsonLd } from "@/lib/seo/structured-data";
import PostHogProvider from "@/features/analytics/PostHogProvider";


export const metadata: Metadata = rootMetadata();

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth">

      <body
        className={`${inter.variable} m-0 p-0 font-sans text-ink antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DMWN4CQK6D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DMWN4CQK6D');
          `}
        </Script>
        <JsonLd data={siteGraphJsonLd()} />
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}

