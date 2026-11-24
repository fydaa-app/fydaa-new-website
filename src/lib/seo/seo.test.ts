import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "./json-ld";
import { pageMetadata, rootMetadata } from "./metadata";

describe("serializeJsonLd", () => {
  it("escapes characters that could close the script tag", () => {
    const output = serializeJsonLd({ name: "</script><script>alert(1)</script>&" });
    expect(output).not.toContain("</script>");
    expect(output).not.toContain("<");
    expect(JSON.parse(output)).toEqual({ name: "</script><script>alert(1)</script>&" });
  });
});

describe("pageMetadata", () => {
  it("sets a canonical path and matching social metadata", () => {
    const metadata = pageMetadata({ title: "About", description: "About Fydaa", path: "/about" });
    expect(metadata.title).toBe("About");
    expect(metadata.alternates?.canonical).toBe("/about");
    expect(metadata.openGraph).toMatchObject({ url: "/about", title: "About | Fydaa" });
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it("marks private pages noindex", () => {
    const metadata = pageMetadata({ title: "Login", description: "Log in", path: "/login", noIndex: true });
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe("rootMetadata", () => {
  it("defines the metadata base and a title template", () => {
    const metadata = rootMetadata();
    expect(String(metadata.metadataBase)).toBe("https://fydaa.com/");
    expect(metadata.title).toMatchObject({ template: "%s | Fydaa" });
  });
});
