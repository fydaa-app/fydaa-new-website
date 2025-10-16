import React from "react";
import { ServiceData } from "@/data/services/types";

interface FeatureSectionProps {
  data: ServiceData["featureSection"];
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ data }) => {
  return (
    <div className="w-full bg-[#ffffff] -mt-48">
      {/* Top Section - White Background */}
      <section className="bg-[#ffffff] text-black relative z-40 rounded-t-[24px] sm:rounded-t-[32px] md:rounded-t-[40px] lg:rounded-t-[56px] xl:rounded-t-[64px] 2xl:rounded-t-[72px] mt-[200px] py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 2xl:py-20 3xl:py-24 overflow-visible ">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16">
            {/* Left Side - Content */}
            <div className="flex-1 max-w-[650px]">
              <h1 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[42px] xl:text-[48px] 2xl:text-[56px] 3xl:text-[64px] font-['Gilroy'] font-bold leading-tight mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 2xl:mb-20 3xl:mb-24 ml-4 sm:ml-5 md:ml-6 lg:ml-7 xl:ml-8 2xl:ml-10 3xl:ml-12">
                {data.mainHeading}{" "}
                {data.mainHeadingItalic && (
                  <span className="text-gray-400 font-normal italic">
                    {data.mainHeadingItalic}
                  </span>
                )}{" "}
                {data.mainHeadingRegular}
              </h1>

              {/* Mobile Image - Shows below h1 on mobile only */}
              <div className="lg:hidden flex justify-center my-4">
                <div className="w-64 h-[350px] sm:w-80 sm:h-[450px]">
                  <img
                    src="/resource/app.png"
                    alt="Mobile App"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Numbered Feature List */}
              <div className="space-y-6 sm:space-y-8 md:space-y-9 lg:space-y-10 xl:space-y-12 2xl:space-y-14 3xl:space-y-16 pl-4 sm:pl-0">
                {data.steps.map((step) => (
                  <div
                    key={step.number}
                    className="flex items-start gap-3 sm:gap-4 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 3xl:gap-8"
                  >
                    <div className="bg-white text-gray-700 w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] md:w-[44px] md:h-[44px] lg:w-[47px] lg:h-[47px] xl:w-[50px] xl:h-[50px] 2xl:w-[58px] 2xl:h-[58px] 3xl:w-[66px] 3xl:h-[66px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[16px] sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[22px] 2xl:text-[26px] 3xl:text-[30px] flex-shrink-0 mt-1 shadow-md ml-4 sm:ml-5 md:ml-6 lg:ml-7 xl:ml-8 2xl:ml-10 3xl:ml-12">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-['Inter'] font-normal text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[20px] 2xl:text-[24px] 3xl:text-[28px]">
                        {step.title}
                      </h3>
                      <p className="font-['Inter'] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[19px] 3xl:text-[22px] text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Placeholder - Desktop only */}
            <div className="hidden lg:flex flex-1 justify-end mt-12">
              <div className="w-64 h-[500px] sm:w-72 sm:h-[550px] md:w-80 md:h-[600px] lg:w-96 lg:h-[700px] xl:w-[28rem] xl:h-[750px] 2xl:w-[32rem] 2xl:h-[800px]">
                <img
                  src="/resource/app.png"
                  alt="Mobile App"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section - Light Background */}
      <section className="bg-white text-black z-40 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 2xl:py-20 3xl:py-24 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 3xl:px-20 relative -mt-1">
        <div className="max-w-full mx-auto">
          <h2 className="text-[26px] sm:text-[30px] md:text-[34px] lg:text-[39px] xl:text-[44px] 2xl:text-[52px] 3xl:text-[60px] font-['Gilroy'] font-bold text-center pb-8 sm:pb-10 md:pb-12 lg:pb-14 xl:pb-16 2xl:pb-20 3xl:pb-24 ">
            {data.bottomSection.heading}
          </h2>

          {/* Four Feature Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16 2xl:gap-20 3xl:gap-24 max-w-6xl mx-auto">
            {data.bottomSection.benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mx-auto ">
                  <img
                    src={benefit.iconPath}
                    alt={benefit.title}
                    className="h-16 sm:h-18 md:h-20 lg:h-22 xl:h-24 2xl:h-28 3xl:h-32 w-auto"
                  />
                </div>
                <h3 className="text-[20px] sm:text-[22px] md:text-[26px] lg:text-[29px] xl:text-[32px] 2xl:text-[38px] 3xl:text-[44px] font-['Inter'] font-normal ">
                  {benefit.title}
                </h3>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] 2xl:text-[21px] 3xl:text-[24px] font-['Inter'] font-normal text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Gradient Border - Full viewport width */}
      {/* <div
        className="w-screen -mb-8 relative z-0"
        style={{ marginLeft: "calc(-50vw + 50%)" }}
      >
        <img
          src="/resource/gradientborder.png"
          alt="Gradient Border"
          className="w-full h-full object-cover"
        />
      </div> */}
    </div>
  );
};

export default FeatureSection;