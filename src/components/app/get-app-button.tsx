"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { appLinkForQr, appLinkHref, type AppLinkData } from "@/config/app-link";
import { siteConfig } from "@/config/site";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const PhoneIcon = (
  <svg
    viewBox="0 0 24 24"
    className="size-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <rect x="6" y="2.5" width="12" height="19" rx="3" />
    <path d="M10.5 18.5h3" strokeLinecap="round" />
  </svg>
);

/** A QR code for `url`, drawn with the qrcode library only when it's needed. */
export function AppQr({ url, className }: { url: string; className?: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    void import("qrcode").then(({ toString }) =>
      toString(url, {
        type: "svg",
        margin: 0,
        errorCorrectionLevel: "M",
        color: { dark: "#0E2721", light: "#FFFFFF00" },
      }).then((markup) => {
        if (live) setSvg(markup);
      }),
    );
    return () => {
      live = false;
    };
  }, [url]);
  return (
    <div
      role="img"
      aria-label="QR code to get the Fydaa app"
      className={cn("aspect-square w-full [&_svg]:block [&_svg]:size-full", className)}
      // The markup is generated locally by the qrcode library from our own URL.
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    >
      {svg ? undefined : <span className="block size-full animate-pulse rounded-btn bg-mist" />}
    </div>
  );
}

/** Both store buttons, each tracked with its own event. */
export function StoreButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <a
        href={siteConfig.apps.ios}
        className={buttonClasses({ variant: "secondary" })}
        data-ph-event="Download App iOS"
        target="_blank"
        rel="noopener noreferrer"
      >
        App Store
      </a>
      <a
        href={siteConfig.apps.android}
        className={buttonClasses({ variant: "secondary" })}
        data-ph-event="Download App Android"
        target="_blank"
        rel="noopener noreferrer"
      >
        Google Play
      </a>
    </div>
  );
}

/**
 * The one "Get the app" action. Phones and tablets get a link straight to the store (or the Branch
 * link with `data`); a desktop with a mouse gets a button that opens a QR popover instead, since
 * there's nothing to install on a laptop. Which one shows is decided in CSS (`.get-app-*`).
 */
export function GetAppButton({
  children = "Get the app",
  data,
  size = "lg",
  align = "start",
  side = "bottom",
  qrTitle = "Get Fydaa on your phone",
  qrNote = "Point your phone's camera at the code. It opens the App Store or Google Play.",
  className,
  icon = true,
}: {
  children?: ReactNode;
  /** Passed into the app with the link (and the QR code), e.g. the goal the visitor planned. */
  data?: AppLinkData;
  size?: "md" | "lg";
  /** Which edge of the button the desktop popover lines up with. */
  align?: "start" | "end";
  /** Open the popover above the button (near the bottom of the first screen) or below it. */
  side?: "top" | "bottom";
  qrTitle?: string;
  qrNote?: string;
  className?: string;
  icon?: boolean;
}) {
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const classes = cn(buttonClasses({ size }), className);

  return (
    <div ref={wrapRef} className="get-app relative inline-flex">
      <a href={appLinkHref(data)} className={cn("get-app-link", classes)} data-ph-event="Download App">
        {icon ? PhoneIcon : null}
        {children}
      </a>
      <button
        ref={buttonRef}
        type="button"
        className={cn("get-app-qr", classes)}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        data-ph-event="Download App QR"
      >
        {icon ? PhoneIcon : null}
        {children}
      </button>
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={qrTitle}
          className={cn(
            "t-pop absolute z-[120] w-72 rounded-4xl border border-line bg-white p-5 text-left shadow-window",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2",
            align === "end" ? "right-0" : "left-0",
            side === "top"
              ? align === "end"
                ? "origin-bottom-right"
                : "origin-bottom-left"
              : align === "end"
                ? "origin-top-right"
                : "origin-top-left",
          )}
        >
          <p className="text-title text-ink">{qrTitle}</p>
          <div className="mt-4 rounded-card border border-line p-4">
            <AppQr url={appLinkForQr({ ...data, source: "web_qr" })} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-grey-600">{qrNote}</p>
          <StoreButtons className="mt-4" />
        </div>
      ) : null}
    </div>
  );
}
