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
            <div className="flex flex-col items-center max-w-full sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1100px] mx-auto px-4 pt-8 sm:pt-12 md:pt-16 lg:pt-[100px] xl:pt-24 2xl:pt-32 pb-[30px] sm:pb-[50px] md:pb-[60px] lg:pb-[80px] xl:pb-[100px] 2xl:pb-[120px] 3xl:pb-[150px] ">
              <h2 className="text-white font-gilroy font-semibold text-[20px] sm:text-[28px] md:text-[36px] lg:text-[44px] xl:text-[48px] 2xl:text-[56px] 3xl:text-[64px] leading-[24px] sm:leading-[32px] md:leading-[40px] lg:leading-[48px] xl:leading-[52px] 2xl:leading-[60px] 3xl:leading-[68px] mb-3 sm:mb-4 md:mb-[16px] lg:mb-[18px] xl:mb-[20px] 2xl:mb-[24px]">
                From Tracking to Growing, We Handle It All
              </h2>

              <p className="text-[#E6E6E6] font-inter font-normal text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px] 3xl:text-[20px] leading-[18px] sm:leading-[19px] md:leading-[20px] lg:leading-[22px] xl:leading-[24px] 2xl:leading-[26px] 3xl:leading-[28px] tracking-[-0.36px] max-w-[280px] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[800px] xl:max-w-[1100px] 2xl:max-w-[1400px] 3xl:max-w-[1800px] mx-auto mb-3 sm:mb-4 md:mb-6 lg:mb-[32px] xl:mb-[40px] 2xl:mb-[48px] 3xl:mb-[56px]">
                We monitor your investments, rebalance your portfolio, and
                suggest changes based on market trends and your evolving needs.
                All you need to do is watch your wealth grow.
              </p>
            </div>
            {/* Video Player Container */}
            <div className="bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl w-full max-w-[280px] sm:max-w-[350px] md:max-w-[500px] lg:max-w-[800px] xl:max-w-[1000px] 2xl:max-w-[1200px] mb-4 sm:mb-6 md:mb-8 lg:mb-[30px] xl:mb-12 2xl:mb-16 mx-auto">
              {/* 16:9 Aspect Ratio Wrapper for 1920x1080 video */}
              <div
                className="relative w-full"
                style={{ aspectRatio: "16 / 9" }}
              >
                <video
                  className="w-full h-full rounded-lg sm:rounded-xl md:rounded-2xl object-cover"
                  controls
                  preload="metadata"
                >
                  <source
                    src="https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/6.+Portfolio+Management.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
