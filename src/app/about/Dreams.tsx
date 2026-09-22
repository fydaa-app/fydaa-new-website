"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import animationData from "../../animations/homepage_animation.json";

const MD_QUERY = "(min-width: 768px)";

function scrollToBookCall() {
  const el = document.getElementById("book-a-call");
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  } else {
    window.location.href = "/#book-a-call";
  }
}

/** Text layout positions from reference — image / theme / CTAs stay current */
function BookCallButton() {
  return (
    <button
      type="button"
      className="px-4 py-2 sm:px-6 sm:py-2 bg-jade text-white font-medium text-[12px] sm:text-[14px] font-['Gilroy'] rounded-full hover:bg-jade-hover transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 pointer-events-auto"
      onClick={scrollToBookCall}
    >
      Book a Free Call
    </button>
  );
}

export default function Dreams() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<any>(null);
  const animationContainerRef = useRef<HTMLDivElement | null>(null);
  const headerTitleRef = useRef<HTMLHeadingElement | null>(null);
  const animationTriggered = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(MD_QUERY);
    const apply = () => setIsDesktop(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = sessionStorage.getItem("scrollToId");
    if (!id) return;
    const element = document.getElementById(id);
    if (element) {
      const top =
        element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
    sessionStorage.removeItem("scrollToId");
  }, []);

  const destroyLottie = useCallback(() => {
    if (animRef.current) {
      try {
        animRef.current.destroy();
      } catch {
        /* ignore */
      }
      animRef.current = null;
    }
    setIsLottieLoaded(false);
    animationTriggered.current = false;
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      destroyLottie();
      return;
    }

    let mounted = true;

    const load = async () => {
      try {
        const lottieModule = await import("lottie-web");
        const lottie = lottieModule.default || lottieModule;
        if (!mounted || !containerRef.current) return;

        if (animRef.current) {
          try {
            animRef.current.destroy();
          } catch {
            /* ignore */
          }
          animRef.current = null;
        }

        animRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: false,
          autoplay: false,
          animationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            className: "lottie-animation",
          },
        });

        animRef.current.addEventListener("DOMLoaded", () => {
          if (!mounted) return;
          setIsLottieLoaded(true);
          animRef.current?.goToAndStop(0, true);
        });
      } catch (error) {
        console.error("Failed to load Lottie:", error);
      }
    };

    load();

    return () => {
      mounted = false;
      destroyLottie();
    };
  }, [isDesktop, destroyLottie]);

  useEffect(() => {
    if (!isDesktop || !isLottieLoaded) return;

    const handleScroll = () => {
      if (
        !animRef.current ||
        !headerTitleRef.current ||
        !animationContainerRef.current
      )
        return;

      const headerRect = headerTitleRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const START = 100;

      if (headerRect.bottom < START) {
        animationTriggered.current = true;
        const containerRect =
          animationContainerRef.current.getBoundingClientRect();
        const scrolled = START - headerRect.bottom;
        const maxScroll = (windowHeight + containerRect.height) * 0.68;
        const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
        animRef.current.goToAndStop(
          Math.floor(progress * animRef.current.totalFrames),
          true
        );
      } else {
        animationTriggered.current = false;
        animRef.current.goToAndStop(0, true);
      }
    };

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isDesktop, isLottieLoaded]);

  return (
    <div className="dreams-section bg-grey-50 relative mt-5 sm:mt-6 md:mt-7 lg:mt-8 xl:mt-9 2xl:mt-10 mb-0">
      {/* Header — reference text layout */}
      <header className="relative z-30 px-4 sm:px-6 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            ref={headerTitleRef}
            className="!font-gilroy !font-semibold !text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl xl:!text-[56px] !leading-tight text-gray-900 mb-4 sm:mb-6"
          >
            For Your Dreams And Aspirations
          </h2>
          <p className="!font-inter text-gray-600 max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto !text-sm sm:!text-base md:!text-lg lg:!text-[18px] !font-normal !leading-relaxed px-2">
            At Fydaa, we help you direct every rupee with purpose - whether
            you&apos;re spending on today, saving for tomorrow, or investing for
            the future.
          </p>
        </div>
        <div className="h-0 sm:h-2 md:h-4" />
      </header>

      {/* Main — reference text positions; current pipe image + theme */}
      <div className="relative w-full max-w-full md:max-w-5xl mx-auto px-0 md:px-4 lg:px-6">
        <div
          ref={animationContainerRef}
          className="relative w-full min-h-0 md:min-h-[1600px] pb-0 sm:pb-2 md:pb-3 lg:pb-4 xl:pb-6"
        >
          {/* Current pipe + Lottie — desktop only */}
          {isDesktop && (
            <>
              <img
                src="/dreams/new.pipe.png"
                alt=""
                className="absolute h-full object-contain pointer-events-none"
                style={{
                  top: "150px",
                  left: "44%",
                  transform: "translateX(-48%) scale(0.93)",
                  transformOrigin: "center top",
                }}
                aria-hidden
              />
              <div
                ref={containerRef}
                className="absolute w-full h-full z-30 pointer-events-none"
                style={{
                  top: "-300px",
                  left: "45%",
                  transform: "translateX(-48%) scale(1.3)",
                  transformOrigin: "center top",
                }}
                aria-hidden
              />
            </>
          )}

          <div className="relative z-40 h-full">
            {/* Consume Mindfully — reference layout */}
            <div
              id="short-term"
              className="md:absolute top-[30px] sm:top-[50px] left-0 sm:left-4 md:left-8 lg:left-16 w-full max-w-full md:max-w-[300px] lg:max-w-[450px] xl:max-w-[500px] 2xl:max-w-[550px] animate-slide-in-left max-md:[animation:none] px-4 md:px-0 pt-8 md:pt-0 mb-16 md:mb-0 text-center md:text-left"
            >
              <h3 className="!font-gilroy !font-medium !text-sm sm:!text-sm md:!text-lg lg:!text-2xl xl:!text-2xl 2xl:!text-3xl text-gray-900 mb-1">
                Consume Mindfully
              </h3>
              <p
                className="text-gray-500 mb-2 italic font-inter text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl"
                style={{ fontWeight: 400 }}
              >
                Fulfil dreams without draining your future
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl font-inter">
                We help you plan for your car, wedding, or that solo trip
                without falling into high-interest EMIs. With Fydaa, you set the
                goal, build a plan, and reach it on your terms.
              </p>
              <div className="flex flex-row gap-2 sm:gap-3 justify-center md:justify-start">
                <BookCallButton />
              </div>
            </div>

            {/* Strategic Saving — reference layout */}
            <div
              id="medium-term"
              className="md:absolute top-[400px] sm:top-[600px] md:top-[700px] right-0 md:right-0 lg:right-48 w-full max-w-full md:max-w-[300px] lg:max-w-[450px] xl:max-w-[500px] 2xl:max-w-[550px] animate-slide-in-right delay-200 max-md:[animation:none] px-4 md:px-0 mb-16 md:mb-0 text-center md:text-left"
            >
              <h3 className="!font-gilroy !font-medium !text-sm sm:!text-sm md:!text-lg lg:!text-2xl xl:!text-2xl 2xl:!text-3xl text-gray-900 mb-1">
                Strategic Saving
              </h3>
              <p
                className="text-gray-500 mb-2 italic font-inter text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl"
                style={{ fontWeight: 400 }}
              >
                Be ready for life&apos;s curveballs
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl font-inter">
                From emergency funds to marriage funds - we help you create
                savings pockets that keep you stress-free. Small, consistent
                action beats last-minute panic.
              </p>
              <div className="flex flex-row gap-2 sm:gap-3 justify-center md:justify-start">
                <BookCallButton />
              </div>
            </div>

            {/* Invest to Build Wealth — reference layout */}
            <div
              id="long-term"
              className="md:absolute top-[700px] sm:top-[1000px] md:top-[1320px] left-0 sm:left-4 md:left-8 lg:left-16 w-full max-w-full md:max-w-[300px] lg:max-w-[450px] xl:max-w-[500px] 2xl:max-w-[550px] animate-slide-in-left delay-300 max-md:[animation:none] px-4 md:px-0 mb-16 md:mb-0 text-center md:text-left"
            >
              <h3 className="!font-gilroy !font-medium !text-sm sm:!text-sm md:!text-lg lg:!text-2xl xl:!text-2xl 2xl:!text-3xl text-gray-900 mb-1">
                Invest to Build Wealth
              </h3>
              <p
                className="text-gray-500 mb-2 italic font-inter text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl"
                style={{ fontWeight: 400 }}
              >
                Your money should work while you sleep
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed text-xs sm:text-xs md:text-base lg:text-xl xl:text-xl 2xl:text-2xl font-inter">
                Investing isn&apos;t just for the rich. Start small, start smart
                — and compound your way to financial freedom. Fydaa gives you
                expert-backed plans for your goals and profile.
              </p>
              <div className="flex flex-row gap-2 sm:gap-3 justify-center md:justify-start">
                <BookCallButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-0 sm:h-2 md:h-4 lg:h-6 xl:h-8 2xl:h-10" />
    </div>
  );
}
