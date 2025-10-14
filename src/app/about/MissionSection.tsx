"use client";
import React, { useState, useEffect } from "react";

const MissionSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const images = [
    "/about-us/pie1.png",
    "/about-us/pie2.png",
    "/about-us/pie3.png",
  ];

  // Preload all images
  useEffect(() => {
    const imagePromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => setIsLoaded(true))
      .catch((err) => console.error("Failed to preload images", err));
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, isLoaded]);

  const handleClick = () => {
    window.open("https://cal.com/fydaa-backend-zr5zm3/30min", "_blank");
  };

  return (
    <main className="w-full h-full m-0 p-0 relative ">
      <section className="relative bg-[#F7F7F7] pt-16 pb-36 sm:pt-20 sm:pb-44 md:pt-24 md:pb-52 lg:pt-28 lg:pb-60 xl:pt-32 xl:pb-72 2xl:pt-40 2xl:pb-80 3xl:pt-48 3xl:pb-96 px-5 overflow-hidden">
        {/* Gradient Background Full Width Full Height */}
        <div className="absolute -top-[300px] -left-8 -right-8 z-10 flex gap-0">
          <img
            src="/resource/gradient.png"
            alt="Gradient"
            className="h-screen w-1/2 object-cover opacity-60"
          />
          <img
            src="/resource/gradient.png"
            alt="Gradient"
            className="h-screen w-1/2 object-cover opacity-60"
          />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Left side: Pie image only on md+ */}
          <div className="hidden md:flex md:w-1/2 justify-center relative">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Pie Chart ${index + 1}`}
                className="absolute max-w-full max-h-[600px] object-contain transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: currentImageIndex === index ? 1 : 0,
                  pointerEvents: currentImageIndex === index ? "auto" : "none",
                }}
              />
            ))}
          </div>

          {/* Right side: Text and on mobile the image above text */}
          <div className="w-full md:w-1/2 relative">
            {/* Image above text on mobile only */}
            <div className="block md:hidden mb-6 w-full flex justify-center relative min-h-[300px]">
              {images.map((src, index) => (
                <img
                  key={`mobile-${index}`}
                  src={src}
                  alt={`Pie Chart ${index + 1}`}
                  className="absolute max-w-[400px] w-full object-contain transition-opacity duration-1000 ease-in-out"
                  style={{
                    opacity: currentImageIndex === index ? 1 : 0,
                    pointerEvents: currentImageIndex === index ? "auto" : "none",
                  }}
                />
              ))}
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-semibold text-gray-900 leading-tight font-gilroy mb-6"
              style={{ letterSpacing: "-1.5px" }}
            >
              Our Mission
            </h1>
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 font-inter mb-8"
              style={{ lineHeight: "1.5rem", letterSpacing: "-0.2px" }}
            >
              Fydaa's mission is to break the barriers of geography, jargon, and
              high fees. Whether you're in a Tier 1 city or a Tier 3 town, our
              SEBI-registered advisors and intelligent tools make expert
              financial planning simple, transparent, and truly yours.
            </p>

            <h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-medium text-gray-900 font-gilroy mb-4"
              style={{ lineHeight: "2.5rem", letterSpacing: "-1px" }}
            >
              Different People, Different Portfolios
            </h2>
            <p
              className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] text-gray-700 font-inter italic"
              style={{ lineHeight: "2.25rem", letterSpacing: "-1.5px" }}
            >
              Fydaa is an investment app that adapts to your appetite for
              investing
            </p>

            <button
              onClick={handleClick}
              style={{
                pointerEvents: "auto",
                position: "relative",
                zIndex: 10,
              }}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium cursor-pointer transition-all duration-200 shadow-sm flex items-center space-x-2 mt-8 group"
            >
              <span className="font-medium text-base sm:text-lg font-inter group-hover:text-white">
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
          </div>
        </div>
      </section>
    </main>
  );
};
export default MissionSection;
