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
    <div className="bg-[#F7F7F7] relative my-5 sm:my-6 md:my-7 lg:my-8 xl:my-9 2xl:my-10">
      {/* Header */}
      <header className="relative z-30 px-4 sm:px-6 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            ref={headerTitleRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-semibold text-gray-900 mb-4 sm:mb-6 font-gilroy leading-tight"
          >
            For Your Dreams And Aspirations
          </h1>
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
          className="relative w-full min-h-[800px] md:min-h-[1200px] sm:min-h-[1400px] md:min-h-[1600px] pb-0 sm:pb-2 md:pb-3 lg:pb-4 xl:pb-6"
        >
          {/* Pipe background - hidden on mobile */}
          <img
            src="/dreams/pipe.png"
            alt="Pipe Background"
            className="absolute h-full object-contain transform scale-110 md:scale-125 hidden md:block"
            style={{
              top: "-300px",
              left: "45%",
              transform: "translateX(-48%) scale(1.3)",
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
                without falling into high-interest EMIs. With Fydaa, you set
                the goal, build a plan, and reach it on your terms.
              </p>
              <div className="flex flex-row gap-2 sm:gap-3 justify-center md:justify-start">
                <button 
                  className="bg-black text-white px-3 sm:px-3 md:px-5 lg:px-6 xl:px-7 2xl:px-8 py-1.5 sm:py-1.5 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3 rounded-[20px] font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm font-gilroy text-[11px] sm:text-[11px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]"
                  onClick={() => window.open('https://cal.com/fydaa-backend-zr5zm3/30min', '_blank')}
                >
                  Start Planning
                </button>
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
              <div className="flex flex-row gap-2 sm:gap-3 justify-center md:justify-start">
                <button 
                  className="bg-black text-white px-3 sm:px-3 md:px-5 lg:px-6 xl:px-7 2xl:px-8 py-1.5 sm:py-1.5 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3 rounded-[20px] font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm font-gilroy text-[11px] sm:text-[11px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]"
                  onClick={() => window.open('https://cal.com/fydaa-backend-zr5zm3/30min', '_blank')}
                >
                  Start Planning
                </button>
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
              <div className="flex flex-row gap-2 sm:gap-3 justify-center md:justify-start">
                <button 
                  className="bg-black text-white px-3 sm:px-3 md:px-5 lg:px-6 xl:px-7 2xl:px-8 py-1.5 sm:py-1.5 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3 rounded-[20px] font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm font-gilroy text-[11px] sm:text-[11px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px]"
                  onClick={() => window.open('https://cal.com/fydaa-backend-zr5zm3/30min', '_blank')}
                >
                  Start Planning
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing at exact end */}
      <div className="h-0 sm:h-2 md:h-4 lg:h-6 xl:h-8 2xl:h-10"></div>
    </div>
  );
}
