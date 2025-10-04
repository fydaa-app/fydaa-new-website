"use client";
import React, { useState, useEffect, useRef } from "react";

const Fydaaexperience = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">("desktop");
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  // Intersection Observer to detect when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Start video when visible
  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play();
    }
  }, [isVisible]);

  // Start feature cycling animation when visible
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

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

  return (
    <div
      ref={sectionRef}
      className="bg-white w-full pb-8 sm:pb-12 md:pb-16 lg:pb-20 h-auto flex flex-col items-center pt-12 sm:pt-16 md:pt-20 lg:pt-28 mb-8 sm:mb-12 md:mb-16"
    >
      <h1 className="text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] font-semibold font-['Gilroy'] text-center px-4 sm:px-6 md:px-8">
        The Fydaa Experience
      </h1>
      <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-regular font-['Inter'] text-center mt-3 sm:mt-4 md:mt-5 lg:mt-6 px-4 sm:px-6 md:px-8 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        Every user is different. That's why our plans are built just for you.
      </p>

      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full max-w-xs sm:max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-8 sm:mt-12 md:mt-16 lg:mt-20 space-y-8 md:space-y-0 md:gap-8 lg:gap-12">
        {/* Left Side - Mobile Device with Video */}
        <div className="w-[200px] h-[380px] sm:w-[220px] sm:h-[420px] md:w-[240px] md:h-[460px] lg:w-[266px] lg:h-[502px] bg-black rounded-[20px] sm:rounded-[25px] md:rounded-[30px] lg:rounded-[39px] order-1 md:order-1 lg:order-1 md:ml-24 lg:ml-28 xl:ml-40 overflow-hidden">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-[50%_25%] scale-[1.25]"
          >
            <source src="/experience/experience.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right Side - Features List */}
        <div className="flex flex-col space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 max-w-full md:max-w-sm lg:max-w-md order-2 md:order-2 lg:order-2 md:mr-12 lg:mr-24 xl:mr-20">
          {/* Feature 1 */}
          <div className="flex items-center space-x-3 sm:space-x-4 relative">
            {activeFeature === 0 && (
              <img
                src="/experience/highlight.png"
                alt="highlight"
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div
              className={`w-1 h-6 sm:h-7 md:h-8 ${
                activeFeature === 0 ? "bg-black" : "bg-gray-400"
              } z-10`}
            ></div>
            <span
              className={`font-['Inter'] text-[14px] sm:text-[15px] md:text-[16px] font-medium ${
                activeFeature === 0 ? "text-black" : "text-gray-500"
              } z-10`}
            >
              Understand Your Money Habits
            </span>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center space-x-3 sm:space-x-4 relative">
            {activeFeature === 1 && (
              <img
                src="/experience/highlight.png"
                alt="highlight"
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div
              className={`w-1 h-6 sm:h-7 md:h-8 ${
                activeFeature === 1 ? "bg-black" : "bg-gray-400"
              } z-10`}
            ></div>
            <span
              className={`font-['Inter'] text-[14px] sm:text-[15px] md:text-[16px] font-medium ${
                activeFeature === 1 ? "text-black" : "text-gray-500"
              } z-10`}
            >
              Assess Your Risk Profile
            </span>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center space-x-3 sm:space-x-4 relative">
            {activeFeature === 2 && (
              <img
                src="/experience/highlight.png"
                alt="highlight"
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div
              className={`w-1 h-6 sm:h-7 md:h-8 ${
                activeFeature === 2 ? "bg-black" : "bg-gray-400"
              } z-10`}
            ></div>
            <span
              className={`font-['Inter'] text-[14px] sm:text-[15px] md:text-[16px] font-medium ${
                activeFeature === 2 ? "text-black" : "text-gray-500"
              } z-10`}
            >
              Set Realistic Goals
            </span>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center space-x-3 sm:space-x-4 relative">
            {activeFeature === 3 && (
              <img
                src="/experience/highlight.png"
                alt="highlight"
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div
              className={`w-1 h-6 sm:h-7 md:h-8 ${
                activeFeature === 3 ? "bg-black" : "bg-gray-400"
              } z-10`}
            ></div>
            <span
              className={`font-['Inter'] text-[14px] sm:text-[15px] md:text-[16px] font-medium ${
                activeFeature === 3 ? "text-black" : "text-gray-500"
              } z-10`}
            >
              Design Your Personal Portfolio
            </span>
          </div>

          {/* Feature 5 */}
          <div className="flex items-center space-x-3 sm:space-x-4 relative">
            {activeFeature === 4 && (
              <img
                src="/experience/highlight.png"
                alt="highlight"
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div
              className={`w-1 h-6 sm:h-7 md:h-8 ${
                activeFeature === 4 ? "bg-black" : "bg-gray-400"
              } z-10`}
            ></div>
            <span
              className={`font-['Inter'] text-[14px] sm:text-[15px] md:text-[16px] font-medium ${
                activeFeature === 4 ? "text-black" : "text-gray-500"
              } z-10`}
            >
              Implementation Made Easy
            </span>
          </div>

          {/* Feature 6 */}
          <div className="flex items-center space-x-3 sm:space-x-4 relative">
            {activeFeature === 5 && (
              <img
                src="/experience/highlight.png"
                alt="highlight"
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div
              className={`w-1 h-6 sm:h-7 md:h-8 ${
                activeFeature === 5 ? "bg-black" : "bg-gray-400"
              } z-10`}
            ></div>
            <span
              className={`font-['Inter'] text-[14px] sm:text-[15px] md:text-[16px] font-medium ${
                activeFeature === 5 ? "text-black" : "text-gray-500"
              } z-10`}
            >
              Track and Tweak
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8 sm:mt-10 md:mt-12">
            <button 
              onClick={handleDownloadApp}
              className="bg-black text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full text-[12px] sm:text-[13px] md:text-sm font-medium font-['Inter'] hover:bg-gray-800 transition-colors w-full sm:w-auto"
            >
              Download Our App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fydaaexperience;
