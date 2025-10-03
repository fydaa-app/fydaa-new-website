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

  const testimonials = [
    {
      name: "Abhishek Misra",
      image: "/testimonial/misra.jpg", // You'll need to add this image
      video: "https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/IMG_2372.mp4", //Link from AWSgit 
      text: "Hello, my name is Abhishek Misra, and I am a CS professional. I have been using the Fyda app since 2022. I chose the Fyda app because investing through it is very effortless, and more importantly, it allows me to invest in multiple asset classes like gold, real estate, and equity—all within a single app. I would definitely recommend using the Fyda app if you are looking for a disciplined way of investing. Thank you for letting me share my journey with Fyda, and I hope it inspires you to begin your own investment journey.",
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
    <div className="bg-[#000000] pb-8 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24 2xl:pb-28 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] 2xl:rounded-[64px] overflow-hidden">
      {/* Top Section: Real People, Real Progress */}
      <div className="bg-black pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24 2xl:pt-28 pb-8 sm:pb-12 md:pb-14 lg:pb-16 xl:pb-18 2xl:pb-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12">
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto text-center">
          <h1 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] font-semibold text-white mb-6 sm:mb-8 md:mb-10 lg:mb-8 xl:mb-10 2xl:mb-12 font-gilroy">
            Real People, Real Progress
          </h1>

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
                      className="w-full h-full object-cover rounded-2xl"
                      onPlay={handleVideoPlay}
                      onPause={handleVideoPause}
                    />

                    {/* Transparent Click Overlay - Always Present */}
                    <div
                      onClick={handleVideoPlayPause}
                      className="absolute inset-0 cursor-pointer rounded-2xl z-10 flex items-center justify-center"
                    >
                      {/* Custom Play Button - Only Shows When Paused */}
                      {!isVideoPlaying && (
                        <div className="bg-white/90 hover:bg-white rounded-full p-4 sm:p-5 md:p-6 transition-all duration-200 hover:scale-110 pointer-events-none">
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

              {/* Testimonial Card */}
              <div className="w-full max-w-[500px] sm:max-w-[550px] h-[280px] sm:h-[320px] relative">
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
                      <p className="text-white text-sm sm:text-base font-normal leading-relaxed font-['Gilroy'] pl-6 sm:pl-8 pr-2 sm:pr-4">
                        {testimonials[currentTestimonial].text}
                      </p>
                      <span className="text-white text-2xl sm:text-3xl absolute bottom-0 right-0">
                        "
                      </span>
                    </div>
                  </div>
                </div>
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

              {/* Navigation Arrows */}
              <div className="flex items-center justify-center gap-8">
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
                        className="w-full h-full object-cover rounded-2xl"
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                      />

                      {/* Transparent Click Overlay - Always Present */}
                      <div
                        onClick={handleVideoPlayPause}
                        className="absolute inset-0 cursor-pointer rounded-2xl z-10 flex items-center justify-center"
                      >
                        {/* Custom Play Button - Only Shows When Paused */}
                        {!isVideoPlaying && (
                          <div className="bg-white/90 hover:bg-white rounded-full p-4 sm:p-5 md:p-6 transition-all duration-200 hover:scale-110 pointer-events-none">
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
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto text-center lg:text-left">
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
            <div className="flex items-center space-x-1 sm:space-x-2 text-white text-[10px] sm:text-[11px] md:text-[12px] lg:text-xs xl:text-sm 2xl:text-base font-medium font-['Inter'] cursor-pointer hover:text-gray-300 transition-colors">
              <span>Watch Demo</span>
              <svg
                className="w-2 h-2 sm:w-3 sm:h-3 md:w-3 md:h-3 lg:w-3 lg:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialPage;
