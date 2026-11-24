/**
 * Serialise structured data for a <script type="application/ld+json"> tag.
 * `<`, `>` and `&` are escaped so data containing "</script>" cannot break out of
 * the tag (XSS), while the JSON stays valid for crawlers.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Safe: content is escaped by serializeJsonLd and never contains raw HTML.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
