"use client";

import { useEffect } from "react";

const LOADER_SRC = "/assets/moments/moments.js";

/**
 * Starts the page's dealt moment (tasteskill's moment loader, served from public/assets/moments)
 * once React has hydrated, so the loader's classes and stage never race the server HTML. Without
 * script, on a phone or under reduced motion the section simply stands as written.
 */
export function MomentLoader() {
  useEffect(() => {
    if (document.querySelector(`script[src="${LOADER_SRC}"]`)) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = LOADER_SRC;
    document.body.append(script);
  }, []);
  return null;
}
