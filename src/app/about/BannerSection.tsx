"use client";
import React, { useState, useEffect } from "react";

const BannerSection: React.FC = () => {
  const [currentDeviceType, setCurrentDeviceType] = useState<"ios" | "android" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const detectCurrentDeviceType = () => {
      if (typeof window !== "undefined") {
        const userAgentString = window.navigator.userAgent.toLowerCase();

        if (/iphone|ipad|ipod/.test(userAgentString)) {
          setCurrentDeviceType("ios");
        } else if (/android/.test(userAgentString)) {
          setCurrentDeviceType("android");
        } else {
          setCurrentDeviceType("desktop");
        }
      }
    };

    detectCurrentDeviceType();
  }, []);

  const handleAppDownloadClick = () => {
    const iosAppStoreUrl =
      "https://apps.apple.com/in/app/fydaa-your-money-for-tomorrow/id1622175190";
    const androidPlayStoreUrl =
      "https://play.google.com/store/apps/details?id=com.app.fydaa&hl=en";

    if (currentDeviceType === "ios") {
      window.open(iosAppStoreUrl, "_blank");
    } else if (currentDeviceType === "android") {
      window.open(androidPlayStoreUrl, "_blank");
    } else {
      window.open(iosAppStoreUrl, "_blank");
    }
  };

  return (
    <div className="bg-[#101828] min-h-[320px] sm:min-h-[380px] md:min-h-[440px] rounded-[56px] -mt-20 sm:-mt-24 md:-mt-28 relative z-50 overflow-hidden flex flex-col items-center justify-center pb-8 sm:pb-12 md:pb-14">
      {/* Gradient aligned at top */}
      <img
        src="/about-us/RectangleGradient.png"
        alt="Gradient"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
      />

      <div className="relative flex flex-col items-center justify-center px-4 sm:px-8 md:px-0">
        {/* Fydaa logo 1x */}
        <img
          src="/about-us/fydaalogo2.png"
          alt="Fydaa Logo"
          className="relative z-10 w-[140px] sm:w-[180px] md:w-[220px] lg:w-[280px] h-auto"
        />

        {/* Texts with negative margin to overlap logo */}
        <div className="-mt-12 sm:-mt-16 md:-mt-20 z-20 max-w-4xl px-2 sm:px-0">
          <h1 className="font-gilroy-semibold text-[22px] sm:text-[28px] md:text-[34px] lg:text-[40px] leading-[28px] sm:leading-[36px] md:leading-[44px] lg:leading-[52px] tracking-[0px] text-[#FFFFFF] text-center opacity-100">
            Bharosa Humara, Fydaa Aapka
          </h1>

          <p className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[16px] leading-[16px] sm:leading-[20px] md:leading-[22px] tracking-[-0.36px] text-[#E6E6E6] text-center opacity-100 mt-3 max-w-full sm:max-w-lg md:max-w-xl mx-auto">
            Let's embark on this journey together, towards a tomorrow filled
            with financial freedom and growth.
            <br />
            Welcome to Fydaa - where your money is managed for tomorrow, today.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 mt-8 sm:mt-12 px-4 sm:px-0 max-w-full">
        <button
          onClick={handleAppDownloadClick}
          className="bg-white text-black px-3 sm:px-4 md:px-5 lg:px-4 xl:px-6 2xl:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-2 xl:py-2.5 2xl:py-3 rounded-full text-[10px] sm:text-[11px] md:text-[12px] lg:text-xs xl:text-sm 2xl:text-base font-medium font-['Inter'] hover:bg-gray-100 transition-colors"
        >
          Download Our App
        </button>

        <div
          className="flex items-center space-x-2 group cursor-pointer pointer-events-auto"
          onClick={() => {
            window.open("https://cal.com/fydaa-backend-zr5zm3/30min", "_blank");
          }}
        >
          <span className="text-white font-medium text-[10px] sm:text-[11px] md:text-[12px] lg:text-xs xl:text-sm 2xl:text-base font-['Inter'] hover:text-gray-300 transition-colors duration-300">
            Talk to Us
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5 group-hover:translate-x-1 transition-transform duration-300"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
