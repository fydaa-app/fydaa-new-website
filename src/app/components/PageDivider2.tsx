"use client";
import React, { useState, useEffect, useRef } from "react";

const PageDivider2: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking functions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);

            // Stagger the animations
            setTimeout(() => setTextVisible(true), 300);
            setTimeout(() => setButtonsVisible(true), 600);
          } else {
            // Reset when out of view to trigger animation again
            setIsVisible(false);
            setTextVisible(false);
            setButtonsVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full bg-[#000000] rounded-[15px] sm:rounded-[20px] md:rounded-[25px] lg:rounded-[30px] xl:rounded-[35px] flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 relative z-30 py-6 sm:py-8 md:py-10 lg:py-8 pb-20 mb-0 overflow-hidden transition-all duration-1000 ease-out transform cursor-pointer ${
        isVisible
          ? "opacity-100 scale-100 rotate-0 blur-0"
          : "opacity-0 scale-75 rotate-12 blur-sm"
      }`}
      style={{
        transformOrigin: "center center",
        filter: isVisible ? "none" : "blur(8px)",
        boxShadow: isVisible
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
          : "0 0 0 0 rgba(0, 0, 0, 0)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient aligned at top */}
      <img
        src="/about-us/RectangleGradient.png"
        alt="Gradient"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
      />
      {/* Animated border glow effect */}
      <div
        className={`absolute inset-0 rounded-[15px] sm:rounded-[20px] md:rounded-[25px] lg:rounded-[30px] xl:rounded-[35px] transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
          animation: isVisible ? "shimmer 2s ease-in-out infinite" : "none",
        }}
      />

      {/* Mouse-following hover gradient effect */}
      {/* {isHovering && (
        <div 
          className="absolute pointer-events-none transition-opacity duration-200"
          style={{
            left: mousePosition.x - 150, // Center the gradient on mouse
            top: mousePosition.y - 150,
            width: 300,
            height: 300,
            opacity: isHovering ? 0.8 : 0,
            zIndex: 10
          }}
        >
          <img 
            src="/pagedivider/hoverover.png" 
            alt="Hover gradient effect"
            className="w-full h-full object-cover rounded-full"
            style={{
              filter: 'brightness(1.2) contrast(1.1)',
              mixBlendMode: 'overlay'
            }}
          />
        </div>
      )} */}

      <div className="w-full max-w-7xl mx-auto">
        {/* Content with animations */}
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
          {/* Main Heading - Fade in + Slide up */}
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-semibold text-white leading-tight font-inter px-2 sm:px-4 md:px-6 lg:px-8 transition-all duration-1000 ease-out transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            You Lose Crores... Just in Hidden Fees
          </h2>

          {/* Text Content - Staggered reveal */}
          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto px-4">
            <p
              className={`text-white text-sm font-inter font-normal leading-relaxed transition-all duration-700 ease-out transform ${
                textVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              Regular agents or platforms often take 1.5-2% yearly as trail
              commission, silently eating away your compounding.
            </p>
            <p
              className={`text-white text-sm font-inter font-normal leading-relaxed transition-all duration-700 ease-out transform delay-200 ${
                textVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              Fydaa charges a nominal fixed fee per month with full
              transparency, <br />
              so you grow more, keep more.
            </p>

            {/* Buttons - Scale animation */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 pt-4 transition-all duration-800 ease-out transform ${
                buttonsVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <button
                className="bg-white text-black px-6 py-1.5 rounded-full font-gilroy-medium text-sm hover:bg-gray-100 hover:scale-105 transition-all duration-300 transform"
                onClick={() =>
                  window.open(
                    "https://www.cal.eu/fydaa/30min?overlayCalendar=true",
                    "_blank"
                  )
                }
              >
                Start a Fydaa SIP
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Keyframes for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PageDivider2;
