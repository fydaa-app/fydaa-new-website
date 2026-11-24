export type AppStorePlatform = "android" | "ios";

/** Phone/tablet platform from a User-Agent, or null for desktop and unknown agents. */
export function storePlatformFor(userAgent: string | null | undefined): AppStorePlatform | null {
  const ua = userAgent ?? "";
  if (/android/i.test(ua)) return "android";
  // iPadOS 13+ reports as Macintosh; "Mobile" distinguishes it from desktop Safari.
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && /mobile/i.test(ua))) return "ios";
  return null;
}
