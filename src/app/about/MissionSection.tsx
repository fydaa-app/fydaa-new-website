"use client";
import React, { useState, useEffect } from "react";

const MissionSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/about-us/pie1.png",
    "/about-us/pie2.png",
    "/about-us/pie3.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <main className="w-full h-full m-0 p-0 relative">
      {/* Mission Section - Light Gray Background with Gradient */}
      <section className="relative py-20 px-4 lg:px-8 bg-[#F7F7F7] min-h-screen pb-[600px]">
        {/* First gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: "url(/gradient/gradient.png)",
            backgroundSize: "cover",
            backgroundPosition: "bottom 0% center",
            backgroundRepeat: "no-repeat",
            opacity: 1,
            transform: "translateY(-40px)",
          }}
        ></div>

        {/* Second gradient overlay */}
        <div
          className="absolute -left-20 -bottom-40 w-1/3 h-1/2 pointer-events-none z-10 hidden md:block"
          style={{
            backgroundImage: "url(/gradient/gradient.png)",
            backgroundSize: "cover",
            backgroundPosition: "left bottom",
            backgroundRepeat: "no-repeat",
            opacity: 0.7,
          }}
        ></div>

        {/* Third gradient overlay */}
        <div
          className="absolute -right-20 -bottom-40 w-1/3 h-1/2 pointer-events-none z-10 hidden md:block"
          style={{
            backgroundImage: "url(/gradient/gradient.png)",
            backgroundSize: "cover",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
            opacity: 0.3,
          }}
        ></div>

        <div className="max-w-7xl mx-auto relative h-full">
          {/* Two Equal Halves Container */}
          <div className="flex items-center justify-center min-h-screen relative z-20">
            {/* Left Half - Rotating Images */}
            <div className="w-1/2 flex items-center justify-center relative z-30">
              <div
                className="relative flex items-center justify-center p-[38px]"
                style={{ width: 593, height: 511 }}
              >
                <img
                  src={images[currentImageIndex]}
                  alt={`Pie Chart ${currentImageIndex + 1}`}
                  className="w-[593px] h-[511px] object-contain"
                  key={currentImageIndex}
                />
              </div>
            </div>

            {/* Right Half - Mission Text */}
            <div className="w-1/2 flex items-center justify-center relative z-30 ">
              <div className="text-left max-w-xl">
                <h1
                  className="text-[56px] font-semibold text-gray-900 leading-tight font-gilroy mb-6"
                  style={{ letterSpacing: "-2.24px" }}
                >
                  Our Mission
                </h1>
                <p
                  className="text-[18px] text-gray-700 font-inter font-normal mb-8"
                  style={{ lineHeight: "24.8px", letterSpacing: "-0.36px" }}
                >
                  Fydaa's mission is to break the barriers of geography, jargon,
                  and high fees. Whether you're in a Tier 1 city or a Tier 3
                  town, our SEBI-registered advisors and intelligent tools make
                  expert financial planning simple, transparent, and truly
                  yours.
                </p>
                <h2
                  className="text-[32px] font-medium text-gray-900 font-gilroy mb-4"
                  style={{ lineHeight: "40px", letterSpacing: "-1.28px" }}
                >
                  Different People, Different Portfolios
                </h2>
                <p
                  className="text-[32px] text-gray-700 font-inter font-thin italic"
                  style={{ lineHeight: "36px", letterSpacing: "-2.24px" }}
                >
                  Fydaa is an investment app that adapts to your appetite for
                  investing
                </p>

                <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full font-medium cursor-pointer transition-all duration-200 shadow-sm flex items-center space-x-2 mt-8 group">
                  <span className="font-medium text-[16px] font-inter group-hover:text-white">
                    Start Investing Now
                  </span>
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white group-hover:text-white transform transition-transform duration-300 group-hover:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="flex items-center space-x-2 group cursor-pointer"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MissionSection;
