import { env } from "./env";
import { routes } from "./routes";
import { siteConfig } from "./site";

/** Values passed into the app with the link (Branch hands query params to the app as link data). */
export type AppLinkData = Record<string, string | number | undefined>;

/** TODO(branch): true once NEXT_PUBLIC_BRANCH_LINK is set (TODO.md). Until then every button uses /download. */
export const hasBranchLink = Boolean(env.appLink);

/** The href for every "Get the app" button. */
export function appLinkHref(data?: AppLinkData): string {
  if (!env.appLink) return routes.download.path;
  const url = new URL(env.appLink);
  for (const [key, value] of Object.entries(data ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}

/** The absolute URL a desktop visitor scans from the QR code. */
export function appLinkForQr(data?: AppLinkData): string {
  return env.appLink ? appLinkHref(data) : `${siteConfig.url}${routes.download.path}`;
}
