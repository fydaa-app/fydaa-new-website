"use client";
import React, { useState, useEffect, useRef } from "react";

const TestimonialPage: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [hasTyped, setHasTyped] = useState(false);
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">(
    "desktop"
  );
  const inflationTextRef = useRef<HTMLDivElement>(null);
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const testimonials = [
    {
      name: "Abhishek Mishra",
      image: "/testimonial/misra.jpg", // You'll need to add this image
      video:
        "https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/IMG_2372.mp4", //Link from AWSgit
      text: "Hello, my name is Abhishek Misra, and I am a CS professional. I have been using the Fydaa app since 2022. I chose the Fydaa app because investing through it is very effortless, and more importantly, it allows me to invest in multiple asset classes like gold, real estate, and equity—all within a single app. I would definitely recommend using the Fydaa app if you are looking for a disciplined way of investing. Thank you for letting me share my journey with Fyda, and I hope it inspires you to begin your own investment journey.",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Device detection
  useEffect(() => {
    const detectDevice = () => {
      if (typeof window !== "undefined") {
        const userAgent = window.navigator.userAgent.toLowerCase();

        if (/iphone|ipad|ipod/.test(userAgent)) {
          setDeviceType("ios");
        } else if (/android/.test(userAgent)) {
          setDeviceType("android");
        } else {
          setDeviceType("desktop");
        }
      }
    };

    detectDevice();
  }, []);

  useEffect(() => {
    setIsExpanded(false);
  }, [currentTestimonial]);

  // Handler for download app button
  const handleDownloadApp = () => {
    const iosUrl =
      "https://apps.apple.com/in/app/fydaa-your-money-for-tomorrow/id1622175190";
    const androidUrl =
      "https://play.google.com/store/apps/details?id=com.app.fydaa&hl=en";

    if (deviceType === "ios") {
      window.open(iosUrl, "_blank");
    } else if (deviceType === "android") {
      window.open(androidUrl, "_blank");
    } else {
      // For desktop users, show both options or default to iOS
      window.open(iosUrl, "_blank");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTyped) {
            typeWriter();
          } else if (!entry.isIntersecting) {
            // Reset when out of view to trigger animation again
            setHasTyped(false);
            setTypedText("");
          }
        });
      },
      { threshold: 0.5 }
    );

    if (inflationTextRef.current) {
      observer.observe(inflationTextRef.current);
    }

    return () => observer.disconnect();
  }, [hasTyped]);

  const typeWriter = () => {
    // Clear any existing text and reset state
    setTypedText("");
    setHasTyped(true);

    const fullText = "Inflation makes your dreams\nmore expensive daily.|";
    let currentIndex = 0;

    // Clear any existing intervals
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
    }

    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        const currentChar = fullText[currentIndex];
        if (currentChar) {
          setTypedText((prev) => prev + currentChar);
        }
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        typewriterIntervalRef.current = null;
      }
    }, 100);

    // Store interval reference to prevent multiple instances
    typewriterIntervalRef.current = typeInterval;
  };

  const handleVideoPlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const handleVideoPlay = () => setIsVideoPlaying(true);
  const handleVideoPause = () => setIsVideoPlaying(false);

  return (
    <div className="relative bg-[#000000]  rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] 2xl:rounded-[64px] overflow-hidden">
      {/* Mobile Gradient - positioned left of title */}
      <div className="absolute left-0 top-10 w-[150px] h-[100px] -translate-x-1/2 z-20 block sm:hidden">
        <img
          src="/FinancialPlan/Gradient.png"
          alt="Decorative gradient"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Mobile Gradient - positioned right of title */}
      <div className="absolute right-0 top-20 w-[150px] h-[100px] translate-x-1/2 z-20 block sm:hidden">
        <img
          src="/FinancialPlan/Gradient.png"
          alt="Decorative gradient"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Desktop Gradient Image - positioned left of title */}
      <div className="absolute left-0 top-10 sm:top-16 md:top-20 w-[200px] h-[150px] sm:w-[400px] sm:h-[300px] md:w-[600px] md:h-[450px] lg:w-[850px] lg:h-[600px] -translate-x-1/2 z-20 hidden sm:block">
        <img
          src="/FinancialPlan/Gradient.png"
          alt="Decorative gradient"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Desktop Gradient Image - positioned right of title */}
      <div className="absolute right-0 top-20 sm:top-32 md:top-48 lg:top-96 w-[200px] h-[150px] sm:w-[400px] sm:h-[300px] md:w-[600px] md:h-[450px] lg:w-[950px] lg:h-[800px] translate-x-1/2 z-20 hidden sm:block">
        <img
          src="/FinancialPlan/Gradient.png"
          alt="Decorative gradient"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient positioned left of the Wealth Growth Plan card */}
      <div className="absolute left-[-253px] top-[900px] w-[800px] h-[950px] -rotate-[100deg] z-30 hidden sm:block">
        <img
          src="/FinancialPlan/Gradient.png"
          alt="Decorative gradient"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Top Section: Real People, Real Progress */}
      <div className="bg-black pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24 2xl:pt-28 pb-8 sm:pb-12 md:pb-14 lg:pb-16 xl:pb-18 2xl:pb-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12">
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto text-center">
          <h2 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] font-semibold text-white mb-6 sm:mb-8 md:mb-10 lg:mb-8 xl:mb-10 2xl:mb-12 font-gilroy">
            Real People, Real Progress
          </h2>

          {/* Navigation Arrows and Testimonial Content */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-8 sm:mb-10 md:mb-12 lg:mb-24 xl:mb-28 2xl:mb-32 gap-6 sm:gap-8 md:gap-10 lg:gap-0">
            {/* Mobile Layout - Different order */}

            <div className="flex flex-col lg:hidden items-center gap-6 sm:gap-8 w-full">
              {/* Video */}
              <div className="w-full max-w-[280px] sm:max-w-[320px] h-[280px] sm:h-[350px] bg-gray-600 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                {testimonials[currentTestimonial].video ? (
                  <>
                    <video
                      ref={videoRef}
                      src={testimonials[currentTestimonial].video}
                      controls
                      muted
                      loop
                      className="w-full h-full object-cover rounded-2xl [&:fullscreen]:!object-contain"
                      onPlay={handleVideoPlay}
                      onPause={handleVideoPause}
                    />

                    {/* Transparent Click Overlay - Only Render on Desktop */}
                    {deviceType === "desktop" && (
                      <div
                        onClick={handleVideoPlayPause}
                        className="absolute inset-0 cursor-pointer rounded-2xl z-10 flex items-center justify-center"
                      >
                        {/* Custom Play Button - Only Shows When Paused */}
                        {!isVideoPlaying && (
                          <div className="bg-white/90 hover:bg-white rounded-full p-4 sm:p-5 md:p-6 transition-all duration-200 hover:scale-110 pointer-events-auto">
                            <svg
                              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-black"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-white text-sm text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <p className="text-gray-400">Profile Image</p>
                  </div>
                )}
              </div>

              {/* Testimonial Card + Navigation Arrows - Wrapped together */}
              <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 w-full">
                {/* Left Arrow */}
                <button
                  onClick={prevTestimonial}
                  className="text-white hover:text-gray-300 transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Testimonial Card - Dynamic Height */}
                <div
                  className={`w-full max-w-[500px] sm:max-w-[550px] ${
                    isExpanded
                      ? "min-h-[280px] sm:min-h-[320px]"
                      : "h-[280px] sm:h-[320px]"
                  } relative transition-all duration-300`}
                >
                  <div
                    className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)",
                    }}
                  >
                    {/* Stroke/Border Effect */}
                    <div
                      className="absolute inset-0 rounded-[56px] pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)",
                        padding: "2px",
                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        maskComposite: "xor",
                        WebkitMaskComposite: "xor",
                      }}
                    />

                    <div className="flex flex-col items-start space-y-4 sm:space-y-6 relative z-10">
                      <div className="relative w-full">
                        <span className="text-white text-2xl sm:text-3xl absolute -top-1 sm:-top-2 left-0">
                          "
                        </span>
                        <p
                          className={`text-white text-sm sm:text-base font-normal leading-relaxed font-['Gilroy'] pl-6 sm:pl-8 pr-2 sm:pr-4 ${
                            !isExpanded ? "line-clamp-6" : ""
                          }`}
                        >
                          {testimonials[currentTestimonial].text}
                        </p>
                        <span className="text-white text-2xl sm:text-3xl absolute bottom-0 right-0">
                          "
                        </span>
                      </div>

                      {/* Read More / Read Less Button */}
                      {testimonials[currentTestimonial].text.length > 200 && (
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium transition-colors duration-200 self-start pl-6 sm:pl-8"
                        >
                          {isExpanded ? "Read less" : "Read more"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={nextTestimonial}
                  className="text-white hover:text-gray-300 transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Name */}
              <div className="text-center">
                <h3
                  className="text-xl sm:text-2xl font-semibold font-['Gilroy']"
                  style={{
                    background:
                      "linear-gradient(135deg, #A8A8A8 20%, #FFFFFF 81%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {testimonials[currentTestimonial].name}
                </h3>
              </div>
            </div>

            {/* Desktop Layout - Original order */}
            <div className="hidden lg:flex lg:flex-row justify-between items-center w-full">
              {/* Left Arrow */}
              <button
                onClick={prevTestimonial}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6 lg:w-6 lg:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Testimonial Content - Image and Card side by side, Name above card */}
              <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-4 md:gap-5 lg:gap-8 xl:gap-10 2xl:gap-12">
                {/* Left Side - Profile Image */}
                <div className="w-full max-w-[280px] sm:max-w-[320px] lg:w-[359px] h-[280px] sm:h-[350px] lg:h-[519px] bg-gray-600 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                  {testimonials[currentTestimonial].video ? (
                    <>
                      <video
                        ref={videoRef}
                        src={testimonials[currentTestimonial].video}
                        controls
                        muted
                        loop
                        className="w-full h-full object-cover rounded-2xl [&:fullscreen]:!object-contain"
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                      />

                      {/* Transparent Click Overlay - Always Present */}
                      <div
                        onClick={handleVideoPlayPause}
                        className="absolute inset-0 rounded-2xl z-10 flex items-center justify-center"
                        style={{
                          pointerEvents: isVideoPlaying ? "none" : "auto",
                        }}
                      >
                        {/* Custom Play Button - Enable pointer events only on this */}
                        {!isVideoPlaying && (
                          <div
                            className="bg-white/90 hover:bg-white rounded-full p-4 sm:p-5 md:p-6 transition-all duration-200 hover:scale-110"
                            style={{ pointerEvents: "auto" }}
                          >
                            <svg
                              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-black"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-white text-sm text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <p className="text-gray-400">Profile Image</p>
                    </div>
                  )}
                </div>

                {/* Right Side - Name above Card */}
                <div className="flex flex-col gap-4">
                  {/* Name above the card */}
                  <div className="text-center lg:text-left">
                    <h3
                      className="text-xl sm:text-2xl lg:text-[30px] font-semibold font-['Gilroy']"
                      style={{
                        background:
                          "linear-gradient(135deg, #A8A8A8 20%, #FFFFFF 81%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {testimonials[currentTestimonial].name}
                    </h3>
                  </div>

                  {/* Testimonial Card below the name */}
                  <div className="w-full max-w-[500px] sm:max-w-[550px] lg:w-[600px] h-[280px] sm:h-[320px] lg:h-[350px] relative">
                    <div
                      className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)",
                      }}
                    >
                      {/* Stroke/Border Effect */}
                      <div
                        className="absolute inset-0 rounded-[56px] pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)",
                          padding: "2px",
                          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          maskComposite: "xor",
                          WebkitMaskComposite: "xor",
                        }}
                      />

                      <div className="flex flex-col items-start space-y-4 sm:space-y-6 lg:space-y-8 relative z-10">
                        <div className="relative w-full">
                          <span className="text-white text-2xl sm:text-3xl lg:text-4xl absolute -top-1 sm:-top-2 left-0">
                            "
                          </span>
                          <p className="text-white text-sm sm:text-base lg:text-[18px] font-normal leading-relaxed font-['Gilroy'] pl-6 sm:pl-8 pr-2 sm:pr-4">
                            {testimonials[currentTestimonial].text}
                          </p>
                          <span className="text-white text-2xl sm:text-3xl lg:text-4xl absolute bottom-0 right-0">
                            "
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={nextTestimonial}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6 lg:w-6 lg:h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Inflation Message */}
      <div className="bg-black py-8 sm:py-12 md:py-16 lg:py-28 xl:py-32 2xl:py-36 px-4 sm:px-6 md:px-8 lg:px-0 mt-2 sm:mt-3 md:mt-4 lg:mt-4 xl:mt-6 2xl:mt-8 relative overflow-hidden">
        {/* Background Image - Full width */}
        <img
          src="/testimonial/silver.png"
          alt="Silver decorative element"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />

        {/* Text Overlay - Centered within the grey strip only */}
        <div
          ref={inflationTextRef}
          className="absolute inset-0 z-10 flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8"
        >
          <p className="text-[16px] sm:text-[20px] md:text-[24px] lg:text-6xl xl:text-7xl 2xl:text-[100px] text-white font-inter font-normal leading-tight break-words whitespace-pre-line text-center">
            {typedText}
          </p>
        </div>
      </div>

      {/* Bottom Section: Call to Action */}
      <div className="bg-black pb-8 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24 2xl:pb-28 px-4 sm:px-6 md:px-8 mt-8 sm:mt-10 md:mt-12 lg:mt-28 xl:mt-32 2xl:mt-36">
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-7xl xl:max-w-7xl 2xl:max-w-7xl mx-auto">
          {/* Grid Layout: Single column on mobile, Two columns on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 items-center overflow-visible">
            {/* Left Side: Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h2 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-2xl xl:text-3xl 2xl:text-4xl text-white font-semibold mb-2 sm:mb-3 md:mb-4 font-gilroy">
                Start Early, Start Small
              </h2>
              <h3 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-6xl xl:text-7xl 2xl:text-8xl text-white font-light mb-3 sm:mb-4 md:mb-5 lg:mb-4 xl:mb-6 2xl:mb-8 font-gilroy">
                JUST START
              </h3>
              <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] text-white font-inter font-normal mb-6 sm:mb-8 md:mb-10 lg:mb-8 xl:mb-10 2xl:mb-12">
                Every day you delay costs you money.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-5 lg:gap-4 xl:gap-6 2xl:gap-8">
                <button
                  onClick={handleDownloadApp}
                  className="bg-white text-black px-3 sm:px-4 md:px-5 lg:px-4 xl:px-6 2xl:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-2 xl:py-2.5 2xl:py-3 rounded-full text-[10px] sm:text-[11px] md:text-[12px] lg:text-xs xl:text-sm 2xl:text-base font-medium font-['Inter'] hover:bg-gray-100 transition-colors"
                >
                  Download Our App
                </button>

                {/* Book a Free Call Link */}
                <div
                  className="flex items-center space-x-2 group cursor-pointer pointer-events-auto"
                  onClick={() => {
                    window.open(
                      "https://cal.com/fydaa-backend-zr5zm3/30min",
                      "_blank"
                    );
                  }}
                >
                  <span className="text-white font-medium text-[10px] sm:text-[11px] md:text-[12px] lg:text-xs xl:text-sm 2xl:text-base font-['Inter'] hover:text-gray-300 transition-colors duration-300">
                    Book a Free Call
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

            {/* Right Side: Image */}
            <div className="flex items-center justify-center lg:justify-center order-1 lg:order-2 relative h-[400px] lg:h-[500px] -mb-32 lg:mb-0 -top-10 lg:top-0">
              <img
                src="/testimonial/call2action.png"
                alt="Fydaa App"
                className="absolute w-[170%] max-w-none h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialPage;
