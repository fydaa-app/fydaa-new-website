"use client";

import { useState } from "react";
import { sendFyiaepOtp, verifyFyiaepOtp } from "@/features/programme/api";
import { FormPage } from "./components/Application";
import { ProgrammeLanding } from "./components/Landing";
import { MobileVerifyPage, OtpVerifyPage } from "./components/Verify";

type PageView = "landing" | "verify-mobile" | "enter-otp" | "form";

/**
 * The FYIAEP programme page. One route holds the whole journey: the landing page, mobile
 * verification, the 7-step application and payment. Each view has its own h1; the server
 * renders the landing view.
 */
export default function FYIAEPPage() {
  const [page, setPage] = useState<PageView>("landing");
  const [verifiedMobile, setVerifiedMobile] = useState("");

  const showLanding = () => {
    setPage("landing");
    window.scrollTo(0, 0);
  };

  const startApply = () => {
    setPage("verify-mobile");
    window.scrollTo(0, 0);
  };

  const handleSessionExpired = () => {
    setPage("verify-mobile");
    window.scrollTo(0, 0);
  };

  const handleSendOtp = async (mobile: string) => {
    await sendFyiaepOtp(mobile, "+91");
    setVerifiedMobile(mobile);
    setPage("enter-otp");
    window.scrollTo(0, 0);
  };

  const handleResendOtp = async () => {
    if (!verifiedMobile) throw new Error("Mobile number missing. Please go back and enter it again.");
    await sendFyiaepOtp(verifiedMobile, "+91");
  };

  const handleOtpVerified = async (otp: string) => {
    await verifyFyiaepOtp(verifiedMobile, otp);
    setPage("form");
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white text-ink">
      {page === "landing" && <ProgrammeLanding onApply={startApply} />}
      {page === "verify-mobile" && (
        <MobileVerifyPage onBack={showLanding} onSendOtp={handleSendOtp} initialMobile={verifiedMobile} />
      )}
      {page === "enter-otp" && (
        <OtpVerifyPage
          mobile={verifiedMobile}
          onBack={() => {
            setPage("verify-mobile");
            window.scrollTo(0, 0);
          }}
          onChangeMobile={() => {
            setPage("verify-mobile");
            window.scrollTo(0, 0);
          }}
          onVerified={handleOtpVerified}
          onResend={handleResendOtp}
        />
      )}
      {page === "form" && (
        <FormPage
          onBack={showLanding}
          verifiedMobile={verifiedMobile}
          onSessionExpired={handleSessionExpired}
        />
      )}
    </div>
  );
}
