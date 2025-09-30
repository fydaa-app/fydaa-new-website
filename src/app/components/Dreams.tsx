"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import animationData from "../../animations/homepage_animation.json";

export default function Dreams() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<any>(null);
  const animationContainerRef = useRef<HTMLDivElement | null>(null);
  const headerTitleRef = useRef<HTMLHeadingElement | null>(null);
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);
  const animationTriggered = useRef(false);

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
            console.warn('Error destroying previous animation:', error);
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
            className: "lottie-animation"
          },
        });

        // Wait for animation to be ready
        animRef.current.addEventListener('DOMLoaded', () => {
          if (mounted) {
            setIsLottieLoaded(true);
            // Set animation to frame 0 initially
            animRef.current.goToAndStop(0, true);
          }
        });

        // Error handling
        animRef.current.addEventListener('error', (error: any) => {
          console.error('Lottie animation error:', error);
        });

      } catch (error) {
        console.error('Failed to load Lottie:', error);
      }
    };

    loadLottieAnimation();

    return () => {
      mounted = false;
      if (animRef.current) {
        try {
          animRef.current.destroy();
        } catch (error) {
          console.warn('Cleanup error:', error);
        }
        animRef.current = null;
      }
    };
  }, []);

  // Scroll-driven animation control
  useEffect(() => {
    if (!isLottieLoaded) return;

    const handleScroll = () => {
      if (!animRef.current || !headerTitleRef.current || !animationContainerRef.current) return;

      const headerTitle = headerTitleRef.current;
      const headerRect = headerTitle.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // ===== ANIMATION START POINT SETTING =====
      const ANIMATION_START_OFFSET = 100; // Start animation when header is 200px from top (earlier trigger)
      
      // Check if heading has reached the animation start point
      const headerTitleAtStartPoint = headerRect.bottom < ANIMATION_START_OFFSET;
      
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
        const maxScrollDistance = (windowHeight + containerRect.height) * scrollDistanceMultiplier;
        
        // Map the scroll position to animation progress
        const scrollProgress = Math.max(0, Math.min(1, 
          scrolledSinceTrigger / maxScrollDistance
        ));
        
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
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial call to check viewport
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isLottieLoaded]);


  return (
    <div className="pb-20 bg-white relative">
      {/* Header */}
      <header className="relative z-30 px-6 pt-16 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 ref={headerTitleRef} className="text-[56px] font-semibold text-gray-900 mb-6 font-gilroy leading-tight">
            For Your Dreams And Aspirations
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-[18px] font-normal leading-relaxed font-inter">
            At Fydala, we help you direct every rupee with purpose - whether
            you&apos;re spending on today, saving for tomorrow, or investing for the
            future.
          </p>
        </div>
        {/* Bottom spacing */}
        <div className="h-16"></div>
      </header>

      {/* Main Container with Pipe Background and Content */}
      <div className="relative w-full max-w-5xl mx-auto px-6">
        {/* Pipe Background + Animation */}
        <div ref={animationContainerRef} className="relative w-full h-[1400px] md:h-[1600px]">
          {/* Pipe background */}
          <img
            src="/dreams/pipe.png"
            alt="Pipe Background"
            className="absolute h-full object-contain transform scale-110 md:scale-125"
            style={{ 
              top: '-300px',
              left: '45%',
              transform: 'translateX(-48%) scale(1.3)',
              transformOrigin: 'center top'
            }}
          />

          {/* Lottie animation overlay */}
          <div
            ref={containerRef}
            className="absolute w-full h-full z-30 pointer-events-none"
            style={{ 
              top: '-300px',
              left: '45%',
              transform: 'translateX(-48%) scale(1.3)',
              transformOrigin: 'center top'
            }}
            aria-hidden="true"
          />

          {/* Content Sections positioned within the pipe */}
          <div className="relative z-40 h-full">
            {/* Consume Mindfully */}
            <div className="absolute top-[50px] md:top-[50px] left-0 md:left-8 lg:left-16 w-full max-w-md animate-slide-in-left">
              <h2 className="text-[32px] font-medium text-gray-900 mb-4 font-gilroy">
                Consume Mindfully
              </h2>
              <p className="text-gray-500 mb-6 italic font-inter" style={{ fontSize: '24px', fontWeight: 100 }}>
                Fulfil dreams without draining your future
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed text-base font-inter">
                We help you plan for your car, wedding, or that solo trip without
                falling into high-interest EMIs. With Fydala, you set the goal,
                build a plan, and reach it on your terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-black text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm text-[12px] md:text-[14px] font-gilroy">
                  Start Planning
                </button>
                <button className="text-black hover:text-gray-800 transition-colors flex items-center gap-2 text-[12px] md:text-[14px] font-gilroy">
                  Talk to us <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>

            {/* Strategic Saving */}
            <div className="absolute top-[600px] md:top-[700px] right-0 md:right-0 lg:right-48 w-full max-w-md animate-slide-in-right delay-200">
              <h2 className="text-[32px] font-medium text-gray-900 mb-4 font-gilroy">
                Strategic Saving
              </h2>
              <p className="text-gray-500 mb-6 italic font-inter" style={{ fontSize: '24px', fontWeight: 100 }}>
                Be ready for life&apos;s curveballs
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed text-base font-inter">
                From emergency funds to marriage funds - we help you create savings
                pockets that keep you stress-free. Small, consistent action beats
                last-minute panic.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-black text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm text-[12px] md:text-[14px] font-gilroy">
                  Start Planning
                </button>
                <button className="text-black hover:text-gray-800 transition-colors flex items-center gap-2 text-[12px] md:text-[14px] font-gilroy">
                  Talk to us <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>

            {/* Invest to Build Wealth */}
            <div className="absolute top-[1000px] md:top-[1320px] left-0 md:left-8 lg:left-16 w-full max-w-md animate-slide-in-left delay-300">
              <h2 className="text-[32px] font-medium text-gray-900 mb-4 font-gilroy">
                Invest to Build Wealth
              </h2>
              <p className="text-gray-500 mb-6 italic font-inter" style={{ fontSize: '24px', fontWeight: 100 }}>
                Your money should work while you sleep
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed text-base font-inter">
                Investing isn&apos;t just for the rich. Start small, start smart — and
                compound your way to financial freedom. Fydala gives you expert-backed
                plans for your goals and profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-black text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm text-[12px] md:text-[14px] font-gilroy">
                  Start planning
                </button>
                <button className="text-black hover:text-gray-800 transition-colors flex items-center gap-2 text-[12px] md:text-[14px] font-gilroy">
                  Talk to us <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom spacing */}
      <div className="h-48"></div>
    </div>
  );
}