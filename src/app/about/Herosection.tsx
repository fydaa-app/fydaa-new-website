"use client";

import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="w-full bg-grey-50 relative overflow-hidden">
      {/* Main Content Container */}
      <div className="relative z-30 flex flex-col px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pt-28 pb-20 sm:pt-32 sm:pb-24 md:pt-36 md:pb-28 lg:pt-40 lg:pb-32 xl:pt-44 xl:pb-36 2xl:pt-48 2xl:pb-48">
        {/* Hero Text Content */}
        <div className="text-center mb-12 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 2xl:mb-20">
          <div className="space-y-6 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8 2xl:space-y-10">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-ink font-inter tracking-[-0.035em] leading-[1.15]">
              Wealth Shouldn&apos;t Be a Privilege
            </h1>
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-ink font-inter tracking-[-0.035em] leading-[1.15]">
              It Should Be a <span className="text-jade">Possibility</span> For All
            </h1>
            <p className="text-sm sm:text-sm md:text-base lg:text-sm xl:text-lg 2xl:text-xl text-grey-600 font-inter font-normal leading-[1.8] max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl mx-auto px-2 sm:px-4">
              We&apos;re on a mission to make smart investing accessible,
              understandable,
              <br className="hidden sm:block" />
              and achievable - no matter your income, background, or experience.
            </p>
          </div>
        </div>

        {/* People Icons with continuous horizontal scrolling animation */}
        <div className="w-full overflow-hidden mb-10 sm:mb-8 md:mb-10 lg:mb-8 xl:mb-12 2xl:mb-16">
          <div className="animate-scroll-seamless">
            <img
              src="/Heropage/diverse-people.png"
              alt="Diverse people icons"
              className="h-[80px] sm:h-[70px] md:h-[80px] lg:h-[90px] xl:h-[120px] 2xl:h-[140px] opacity-80 object-contain"
            />
            <img
              src="/Heropage/diverse-people.png"
              alt="Diverse people icons"
              className="h-[80px] sm:h-[70px] md:h-[80px] lg:h-[90px] xl:h-[120px] 2xl:h-[140px] opacity-80 object-contain"
            />
            <img
              src="/Heropage/diverse-people.png"
              alt="Diverse people icons"
              className="h-[80px] sm:h-[70px] md:h-[80px] lg:h-[90px] xl:h-[120px] 2xl:h-[140px] opacity-80 object-contain"
            />
          </div>
        </div>

        {/* Feature Highlights and CTA Button */}
        <div className="text-center">
          <div className="max-w-4xl mx-auto">
            {/* Three Feature Highlights */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-6 2xl:space-x-8 mb-6 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-8 2xl:mb-10">
              <div className="flex items-center space-x-2 sm:space-x-2">
                <img
                  src="/Heropage/sebi.png"
                  alt="SEBI"
                  className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7"
                />
                <span className="text-grey-600 font-inter font-medium text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-lg">
                  SEBI-registered
                </span>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-2">
                <img
                  src="/Heropage/bank.png"
                  alt="Security"
                  className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7"
                />
                <span className="text-grey-600 font-inter font-medium text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-lg">
                  Bank-grade security
                </span>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-2">
                <img
                  src="/Heropage/transplant.png"
                  alt="Fees"
                  className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7"
                />
                <span className="text-grey-600 font-inter font-medium text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-lg">
                  Transparent fees
                </span>
              </div>
            </div>

            {/* Start Investing Now Button */}
            {/* <div className="flex justify-center">
              <button 
                onClick={() => window.open('https://www.cal.eu/fydaa/30min?overlayCalendar=true', '_blank')}
                className="bg-black text-white px-5 sm:px-5 md:px-6 lg:px-6 xl:px-8 2xl:px-10 py-2.5 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 rounded-full font-gilroy font-medium flex items-center space-x-2 sm:space-x-2 hover:bg-gray-800 transition-colors text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-lg"
              >
                <span>Start Investing Now</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              
            </div> */}

            {/* Replaced Buttons */}
            <div className="flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-8">
              {/* Book a Free Call Button */}
              <button
                className="inline-flex items-center gap-2 bg-jade text-white px-6 py-3 rounded-[10px] font-inter font-bold text-[12px] sm:text-[14px] tracking-[-0.01em] hover:bg-jade-hover active:scale-[0.985] transition-all pointer-events-auto"
                onClick={() =>
                  window.open(
                    "https://www.cal.eu/fydaa/30min?overlayCalendar=true",
                    "_blank"
                  )
                }
              >
                Book a Free Call
              </button>

              {/* Start Investing Link */}
              <a
                className="flex items-center space-x-2 group pointer-events-auto"
                href="https://www.cal.eu/fydaa/30min?overlayCalendar=true"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-ink font-inter font-semibold text-[14px] sm:text-[16px] hover:text-jade transition-colors duration-300">
                  Start Investing
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-ink sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:text-jade transition-all duration-300"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for seamless horizontal scrolling animation */}
      <style jsx>{`
        .animate-scroll-seamless {
          display: flex;
          animation: scroll-seamless 50s linear infinite;
          width: max-content;
        }

        @keyframes scroll-seamless {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll-seamless img {
          display: block;
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
