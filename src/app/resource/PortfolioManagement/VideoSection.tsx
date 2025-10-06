
import React from "react";

const VideoSection: React.FC = () => {
  return (
    <section
      className="
    relative z-30 
    mt-20 
    sm:mt-20 
    md:mt-28 
    lg:mt-40 
    xl:mt-48 
    2xl:mt-56
    flex justify-center overflow-visible pointer-events-none
    pb-[60px] sm:pb-[80px] md:pb-[100px] lg:pb-[120px] xl:pb-[140px]
  "
    >
      <div className="relative w-full max-w-screen-4xl mx-auto">
        <div className="relative w-full">
          {/* Blue.png - (top layer) */}

          <img
            src="/resource/blue.png"
            alt="Blue Circle"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[95vw] h-[220px] sm:h-[440px] md:h-[660px] lg:h-[880px] xl:h-[880px] 2xl:h-[880px] scale-[1.5] sm:scale-150 z-10"
          />

          {/* Square.png - responsive wrapper background (background layer) */}
          <img
            src="/resource/square.png"
            alt="Square Background"
            className="absolute inset-x-0 top-0 w-full h-[1700px] object-cover pointer-events-none -z-10"
          />

          {/* Content container */}
          <div className="relative z-20 flex flex-col items-center text-center px-2 sm:px-4 md:px-6 lg:px-8 pointer-events-auto">
            {/* Heading and description */}
            <div className="flex flex-col items-center max-w-full sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1100px] mx-auto px-4 pt-8 sm:pt-12 md:pt-16 lg:pt-[100px] xl:pt-24 2xl:pt-32">
              <h2 className="text-white font-gilroy font-semibold text-[20px] sm:text-[28px] md:text-[36px] lg:text-[44px] xl:text-[48px] 2xl:text-[56px] 3xl:text-[64px] leading-[24px] sm:leading-[32px] md:leading-[40px] lg:leading-[48px] xl:leading-[52px] 2xl:leading-[60px] 3xl:leading-[68px] mb-3 sm:mb-4 md:mb-[16px] lg:mb-[18px] xl:mb-[20px] 2xl:mb-[24px]">
                    From Tracking to Growing, We Handle It All
              </h2>

              <p className="text-[#E6E6E6] font-inter font-normal text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px] 3xl:text-[20px] leading-[18px] sm:leading-[19px] md:leading-[20px] lg:leading-[22px] xl:leading-[24px] 2xl:leading-[26px] 3xl:leading-[28px] tracking-[-0.36px] max-w-[280px] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[800px] xl:max-w-[1100px] 2xl:max-w-[1400px] 3xl:max-w-[1800px] mx-auto mb-3 sm:mb-4 md:mb-6 lg:mb-[32px] xl:mb-[40px] 2xl:mb-[48px] 3xl:mb-[56px]">
               We monitor your investments, rebalance your portfolio, and
                    suggest changes based on market trends and your evolving
                    needs. All you need to do is watch your wealth grow.
              </p>
            </div>

            {/* Video Placeholder */}
            <div className="bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl 2xl:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-[24px] xl:p-8 2xl:p-10 shadow-2xl relative overflow-hidden w-full max-w-[280px] sm:max-w-[350px] md:max-w-[500px] lg:max-w-[800px] xl:max-w-[1000px] 2xl:max-w-[1200px] mb-4 sm:mb-6 md:mb-8 lg:mb-[30px] xl:mb-12 2xl:mb-16 mx-auto">
              {/* Video Screen */}
              <div className="bg-gray-700 rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl xl:rounded-xl 2xl:rounded-xl aspect-video w-full flex items-center justify-center relative mb-2 sm:mb-3 md:mb-4 lg:mb-[16px] xl:mb-6 2xl:mb-8">
                {/* Play Button */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-[80px] lg:h-[80px] xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-0 h-0 border-l-[8px] sm:border-l-[12px] md:border-l-[16px] lg:border-l-[20px] xl:border-l-[24px] 2xl:border-l-[28px] border-l-blue-600 border-t-[5px] sm:border-t-[8px] md:border-t-[10px] lg:border-t-[12px] xl:border-t-[14px] 2xl:border-t-[16px] border-t-transparent border-b-[5px] sm:border-b-[8px] md:border-b-[10px] lg:border-b-[12px] xl:border-b-[14px] 2xl:border-b-[16px] border-b-transparent ml-0.5 sm:ml-1"></div>
                </div>

                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl xl:rounded-xl 2xl:rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-50"></div>
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-between bg-gray-700 rounded-md sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-lg 2xl:rounded-lg p-2 sm:p-3 md:p-4 lg:p-4 xl:p-5 2xl:p-6 w-full">
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-4 xl:space-x-5 2xl:space-x-6">
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                    </svg>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="flex-1 mx-2 sm:mx-3 md:mx-4 lg:mx-4 xl:mx-5 2xl:mx-6 min-w-0">
                  <div className="w-full bg-gray-600 rounded-full h-1 sm:h-1.5 md:h-2 lg:h-2 xl:h-2.5 2xl:h-3">
                    <div
                      className="bg-red-500 h-1 sm:h-1.5 md:h-2 lg:h-2 xl:h-2.5 2xl:h-3 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-4 xl:space-x-5 2xl:space-x-6">
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.533 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.372-.836 2.942-2.106 2.106-1.372a1.533 1.533 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

