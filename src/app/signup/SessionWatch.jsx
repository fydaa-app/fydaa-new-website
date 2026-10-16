"use client";

import { useEffect } from "react";
import { accessTokenExpiresAt, endSession, getAccessToken, isAccessTokenExpired } from "./lib/authApi";

/** Signs the user out when the saved access token is past its expiry. */
export default function SessionWatch() {
  useEffect(() => {
    let timer = 0;

    function check() {
      if (!getAccessToken()) return;
      if (isAccessTokenExpired()) endSession();
    }

    function arm() {
      window.clearTimeout(timer);
      check();
      const exp = accessTokenExpiresAt();
      if (exp == null) return;
      const delay = Math.max(0, exp - Date.now());
      timer = window.setTimeout(check, delay);
    }

    arm();
    const interval = window.setInterval(check, 15000);
    window.addEventListener("focus", check);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
      window.removeEventListener("focus", check);
    };
  }, []);

  return null;
}
