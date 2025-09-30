"use client";
import React from "react";

const BannerSection: React.FC = () => {
  return (
    <div className="bg-[#101828] min-h-screen rounded-[56px] -mt-[100px] relative z-50 overflow-hidden flex flex-col items-center justify-center pb-[100px]">
      {/* Gradient aligned at top */}
      <img
        src="/about-us/RectangleGradient.png"
        alt="Gradient"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="relative flex flex-col items-center justify-center">
        {/* Fydaa logo */}
        <img
          src="/about-us/fydaalogo2.png"
          alt="Fydaa Logo"
          className="relative z-10 w-[600px] h-auto"
        />

        {/* Texts with negative margin to overlap logo */}
        <div className="-mt-[150px] z-20">
          <h1 className="font-gilroy-semibold text-[56px] leading-[74px] tracking-[0px] text-[#FFFFFF] text-center opacity-100">
            Bharosa Humara, Fydaa Aapka
          </h1>

          <p className="font-inter font-normal text-[18px] leading-[24.8px] tracking-[-0.36px] text-[#E6E6E6] text-center opacity-100 mt-4 max-w-4xl">
            Let's embark on this journey together, towards a tomorrow filled
            with financial freedom and growth.
            <br />
            Welcome to Fydaa - where your money is managed for tomorrow, today.
          </p>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-8 mt-16">
        {/* Create Your Custom Plan Button */}
        <button className="px-6 py-2 bg-white text-black font-medium text-[14px] font-['Gilroy'] rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
          Download our App{" "}
        </button>

        <div className="inline-flex items-center space-x-2 cursor-pointer group">
          <span className="text-white font-medium text-[16px] font-['Inter'] group-hover:text-gray-300 transition-colors duration-300 px-2">
            Talk to Us
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white transform transition-transform duration-300 group-hover:translate-x-1"
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
