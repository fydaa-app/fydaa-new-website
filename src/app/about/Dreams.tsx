"use client";

import React, { useEffect, useRef, useState } from "react";
import animationData from "../../animations/homepage_animation.json";

export default function Dreams() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<any>(null);
  const animationContainerRef = useRef<HTMLDivElement | null>(null);
  const headerTitleRef = useRef<HTMLHeadingElement | null>(null);
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);
  const animationTriggered = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const id = sessionStorage.getItem("scrollToId");
    if (id) {
      const scrollToWithOffset = (id: string, offset = 80) => {
        const element = document.getElementById(id);
        if (element) {
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      };

      scrollToWithOffset(id, 80);
      sessionStorage.removeItem("scrollToId");
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadLottieAnimation = async () => {
      try {
        // Dynamic import with error handling
        const lottieModule = await import("lottie-web");
        const lottie = lottieModule.default || lottieModule;

        if (!mounted || !containerRef.current) return;

        // Clean up existing animation
        if (animRef.current) {
          try {
            animRef.current.destroy();
          } catch (error) {
            console.warn("Error destroying previous animation:", error);
          }
          animRef.current = null;
        }

        // Create new animation
        animRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: false,
          autoplay: false,
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            className: "lottie-animation",
          },
        });

        // Wait for animation to be ready
        animRef.current.addEventListener("DOMLoaded", () => {
          if (mounted) {
            setIsLottieLoaded(true);
            // Set animation to frame 0 initially
            animRef.current.goToAndStop(0, true);
          }
        });

        // Error handling
        animRef.current.addEventListener("error", (error: any) => {
          console.error("Lottie animation error:", error);
        });
      } catch (error) {
        console.error("Failed to load Lottie:", error);
      }
    };

    loadLottieAnimation();

    return () => {
      mounted = false;
      if (animRef.current) {
        try {
          animRef.current.destroy();
        } catch (error) {
          console.warn("Cleanup error:", error);
        }
        animRef.current = null;
      }
    };
  }, []);

  // Scroll-driven animation control
  useEffect(() => {
    if (!isLottieLoaded) return;

    const handleScroll = () => {
      if (
        !animRef.current ||
        !headerTitleRef.current ||
        !animationContainerRef.current
      )
        return;

      const headerTitle = headerTitleRef.current;
      const headerRect = headerTitle.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // ===== ANIMATION START POINT SETTING =====
      const ANIMATION_START_OFFSET = 100; // Start animation when header is 200px from top (earlier trigger)

      // Check if heading has reached the animation start point
      const headerTitleAtStartPoint =
        headerRect.bottom < ANIMATION_START_OFFSET;

      if (headerTitleAtStartPoint) {
        // Animation is triggered, now control it with scroll
        if (!animationTriggered.current) {
          animationTriggered.current = true;
        }

        // Get the animation container position
        const container = animationContainerRef.current;
        const containerRect = container.getBoundingClientRect();

        // Calculate the scroll position relative to when animation triggers
        // Distance scrolled since the trigger point
        const scrolledSinceTrigger = ANIMATION_START_OFFSET - headerRect.bottom;

        // ADJUST THIS: Control how much scroll distance is needed for full animation
        // Smaller value = animation completes faster, Larger value = animation needs more scroll
        const scrollDistanceMultiplier = 0.68; // Further reduced to make animation complete much earlier
        const maxScrollDistance =
          (windowHeight + containerRect.height) * scrollDistanceMultiplier;

        // Map the scroll position to animation progress
        const scrollProgress = Math.max(
          0,
          Math.min(1, scrolledSinceTrigger / maxScrollDistance)
        );

        // Set animation frame based on scroll progress
        const totalFrames = animRef.current.totalFrames;
        const targetFrame = Math.floor(scrollProgress * totalFrames);

        // Update animation to current frame
        animRef.current.goToAndStop(targetFrame, true);
      } else {
        // Header is still visible, reset animation to frame 0
        animationTriggered.current = false;
        animRef.current.goToAndStop(0, true);
      }
    };

    // Throttled scroll handler
    let rafId: number | null = null;
    const throttledScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    // Add scroll listener
    window.addEventListener("scroll", throttledScroll, { passive: true });

    // Initial call to check viewport
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isLottieLoaded]);

  return (
    <div className="bg-grey-50 relative mt-5 sm:mt-6 md:mt-7 lg:mt-8 xl:mt-9 2xl:mt-10 mb-0 pb-8 md:pb-12">
      {/* Header */}
      <header className="relative z-30 px-4 sm:px-6 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            ref={headerTitleRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-semibold text-gray-900 mb-4 sm:mb-6 font-gilroy leading-tight"
          >
            For Your Dreams And Aspirations
          </h2>
          <p className="text-gray-600 max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-[18px] font-normal leading-relaxed font-inter px-2">
            At Fydaa, we help you direct every rupee with purpose - whether
            you&apos;re spending on today, saving for tomorrow, or investing for
            the future.
          </p>
        </div>
        {/* Bottom spacing */}
        <div className="h-0 sm:h-2 md:h-4"></div>
      </header>

      {/* Main Container with Pipe Background and Content */}
      <div className="relative w-full max-w-full md:max-w-5xl mx-auto px-0 md:px-4 lg:px-6">
        {/* Pipe Background + Animation */}
        <div
          ref={animationContainerRef}
          className="relative w-full min-h-[800px] sm:min-h-[1250px] md:min-h-[1600px]"
        >
          {/* Pipe background - hidden on mobile */}
          <img
            src="/dreams/new.pipe.png"
            alt="Pipe Background"
            className="absolute h-full object-contain hidden md:block"
            style={{
              top: "150px",
              left: "44%",
              transform: "translateX(-48%) scale(0.93)",
              transformOrigin: "center top",
            }}
          />

          {/* Lottie animation overlay - hidden on mobile */}
          <div
            ref={containerRef}
            className="absolute w-full h-full z-30 pointer-events-none hidden md:block"
            style={{
              top: "-300px",
              left: "45%",
              transform: "translateX(-48%) scale(1.3)",
              transformOrigin: "center top",
            }}
            aria-hidden="true"
          />

          {/* Content Sections positioned within the pipe */}
          <div className="relative z-40 h-full">
            {/* Consume Mindfully */}
            <div
              id="short-term"
              className="md:absolute top-[30px] sm:top-[50px] left-0 sm:left-4 md:left-8 lg:left-16 w-full max-w-full md:max-w-[300px] lg:max-w-[450px] xl:max-w-[500px] 2xl:max-w-[550px] animate-slide-in-left px-4 md:px-0 pt-20 md:pt-0 mb-24 md:mb-0 text-center md:text-left"
            >
              <h2 className="text-sm sm:text-sm md:text-lg lg:text-2xl xl:text-2xl 2xl:text-3xl font-medium text-gray-900 mb-1 sm:mb-1 font-gilroy">
                Consume Mindfully
              </h2>
              <p
                className="text-gray-500 mb-2 sm:mb-2 italic font-inter text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl"
                style={{ fontWeight: 400 }}
              >
                Fulfil dreams without draining your future
              </p>
              <p className="text-gray-700 mb-4 sm:mb-4 leading-relaxed text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl font-inter">
                We help you plan for your car, wedding, or that solo trip
                without falling into high-interest EMIs. With Fydaa, you set the
                goal, build a plan, and reach it on your terms.
              </p>
              <div className="flex flex-row gap-2 sm:gap-3 justify-center md:justify-start items-center">
                <button
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-black text-white font-medium text-[12px] sm:text-[14px] font-['Gilroy'] rounded-full hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 pointer-events-auto"
                  onClick={() =>
                    window.open(
                      "https://www.cal.eu/fydaa/30min?overlayCalendar=true",
                      "_blank"
                    )
                  }
                >
                  Book a Free Call
                </button>

                <div
                  className="flex items-center space-x-2 group cursor-pointer pointer-events-auto"
                  onClick={() => {
                    window.open("https://wa.me/9136935300", "_blank");
                  }}
                >
                  <span className="text-black font-gilroy font-semibold text-[14px] sm:text-[16px] group-hover:text-gray-700 transition-colors duration-300">
                    Chat on WhatsApp
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-black sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
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

            {/* Strategic Saving */}
            <div
              id="medium-term"
              className="md:absolute top-[400px] sm:top-[600px] md:top-[700px] right-0 sm:right-0 md:right-0 lg:right-48 w-full max-w-full md:max-w-[300px] lg:max-w-[450px] xl:max-w-[500px] 2xl:max-w-[550px] animate-slide-in-right delay-200 px-4 md:px-0 mb-24 md:mb-0 text-center md:text-left"
            >
              <h2 className="text-sm sm:text-sm md:text-lg lg:text-2xl xl:text-2xl 2xl:text-3xl font-medium text-gray-900 mb-1 sm:mb-1 font-gilroy">
                Strategic Saving
              </h2>
              <p
                className="text-gray-500 mb-2 sm:mb-2 italic font-inter text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl"
                style={{ fontWeight: 400 }}
              >
                Be ready for life&apos;s curveballs
              </p>
              <p className="text-gray-700 mb-4 sm:mb-4 leading-relaxed text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl font-inter">
                From emergency funds to marriage funds - we help you create
                savings pockets that keep you stress-free. Small, consistent
                action beats last-minute panic.
              </p>
              <div className="flex flex-row gap-2 sm:gap-3 justify-center md:justify-start items-center">
                <button
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-black text-white font-medium text-[12px] sm:text-[14px] font-['Gilroy'] rounded-full hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 pointer-events-auto"
                  onClick={() =>
                    window.open(
                      "https://www.cal.eu/fydaa/30min?overlayCalendar=true",
                      "_blank"
                    )
                  }
                >
                  Book a Free Call
                </button>

                <div
                  className="flex items-center space-x-2 group cursor-pointer pointer-events-auto"
                  onClick={() => {
                    window.open("https://wa.me/9136935300", "_blank");
                  }}
                >
                  <span className="text-black font-gilroy font-semibold text-[14px] sm:text-[16px] group-hover:text-gray-700 transition-colors duration-300">
                    Chat on WhatsApp
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-black sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
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

            {/* Invest to Build Wealth */}
            <div
              id="long-term"
              className="md:absolute top-[700px] sm:top-[1000px] md:top-[1320px] left-0 sm:left-4 md:left-8 lg:left-16 w-full max-w-full md:max-w-[300px] lg:max-w-[450px] xl:max-w-[500px] 2xl:max-w-[550px] animate-slide-in-left delay-300 px-4 md:px-0 mb-24 md:mb-0 text-center md:text-left"
            >
              <h2 className="text-sm sm:text-sm md:text-lg lg:text-2xl xl:text-2xl 2xl:text-3xl font-medium text-gray-900 mb-1 sm:mb-1 font-gilroy">
                Invest to Build Wealth
              </h2>
              <p
                className="text-gray-500 mb-2 sm:mb-2 italic font-inter text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl"
                style={{ fontWeight: 400 }}
              >
                Your money should work while you sleep
              </p>
              <p className="text-gray-700 mb-4 sm:mb-4 leading-relaxed text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl font-inter">
                Investing isn&apos;t just for the rich. Start small, start smart
                — and compound your way to financial freedom. Fydaa gives you
                expert-backed plans for your goals and profile.
              </p>
              <div className="flex flex-row gap-2 sm:gap-3 justify-center md:justify-start items-center">
                <button
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-black text-white font-medium text-[12px] sm:text-[14px] font-['Gilroy'] rounded-full hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 pointer-events-auto"
                  onClick={() =>
                    window.open(
                      "https://www.cal.eu/fydaa/30min?overlayCalendar=true",
                      "_blank"
                    )
                  }
                >
                  Book a Free Call
                </button>

                <div
                  className="flex items-center space-x-2 group cursor-pointer pointer-events-auto"
                  onClick={() => {
                    window.open("https://wa.me/9136935300", "_blank");
                  }}
                >
                  <span className="text-black font-gilroy font-semibold text-[14px] sm:text-[16px] group-hover:text-gray-700 transition-colors duration-300">
                    Chat on WhatsApp
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-black sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
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
          </div>
        </div>
      </div>
    </div>
  );
}
