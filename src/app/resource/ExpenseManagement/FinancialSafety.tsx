import React from "react";

const FinancialSafety: React.FC = () => {
  return (
    <section className="bg-[#101828] py-6 sm:py-8 md:py-10 lg:py-11 xl:py-12 2xl:py-16 px-3 sm:px-4 md:px-5 lg:px-5 xl:px-6 2xl:px-8 relative">
      {/* Background Blur Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm"></div>

      <div className="max-w-[1200px] 2xl:max-w-[1600px] mx-auto relative z-10">
        <div className="bg-[#4D4D4D]/10 backdrop-blur-md rounded-[10px] sm:rounded-[12px] md:rounded-[13px] lg:rounded-[14px] xl:rounded-[15px] 2xl:rounded-[18px] p-4 sm:p-6 md:p-7 lg:p-8 xl:p-10 2xl:p-12 border border-gray-700/50 shadow-xl">
          {/* Changed from grid to flex on mobile, grid on lg+ */}
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] gap-6 md:gap-5 lg:gap-4 xl:gap-4 2xl:gap-6">
            
            {/* Headings Section - order-1 on mobile, spans full width on desktop */}
            <div className="order-1 lg:order-none">
              {/* Top Slogan */}
              <div className="text-green-400 text-lg sm:text-xl md:text-2xl lg:text-[26px] xl:text-[32px] 2xl:text-[40px] font-['Gilroy'] font-semibold mb-3 sm:mb-4 md:mb-5 lg:mb-5 xl:mb-6 2xl:mb-8">
                Your money is 100% Safe and Secure..!
              </div>

              {/* Main Headings */}
              <div className="space-y-1 sm:space-y-1 md:space-y-1 lg:space-y-2 xl:space-y-2 2xl:space-y-3 mb-6 sm:mb-7 md:mb-8 lg:mb-9 xl:mb-10 2xl:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] 2xl:text-[80px] font-['Cirak'] font-normal text-white leading-tight">
                  Built for Bharat.
                </h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] 2xl:text-[80px] font-['Cirak'] font-normal text-white leading-tight">
                  Backed by Transparency.
                </h3>
              </div>
            </div>

            {/* Logo Section - order-2 on mobile, appears on right side on desktop */}
            <div className="order-2 lg:order-none lg:row-span-2 flex items-center justify-center lg:justify-start lg:pl-2 xl:pl-4 2xl:pl-6">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 2xl:w-96 2xl:h-96 flex items-center justify-center">
                <img
                  src="/resource/rupee.png"
                  alt="Rupee Symbol"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Feature Boxes Section - order-3 on mobile, left column on desktop */}
            <div className="order-3 lg:order-none w-full">
              <div className="rounded-lg md:rounded-xl xl:rounded-xl 2xl:rounded-2xl py-3 sm:py-4 md:py-5 lg:py-5 xl:py-6 2xl:py-8 px-3 sm:px-4 md:px-5 lg:px-5 xl:px-6 2xl:px-8 border border-gray-700 bg-[#2A2A2A]/30 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-0 2xl:gap-0">
                  <div className="text-white text-center flex-1 w-full sm:w-auto">
                    <p className="font-['Gilroy'] font-normal text-xs sm:text-sm md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[20px]">
                      SEBI-Registered,
                      <br />
                      Zero Commission
                    </p>
                  </div>
                  <div className="w-full sm:w-px h-px sm:h-8 md:h-10 lg:h-11 xl:h-12 2xl:h-14 bg-gray-600 sm:mx-2 md:mx-3 lg:mx-4 xl:mx-6 2xl:mx-8"></div>
                  <div className="text-white text-center flex-1 w-full sm:w-auto">
                    <p className="font-['Gilroy'] font-normal text-xs sm:text-sm md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[20px]">
                      Money stays in your
                      <br />
                      name, with top AMCs
                    </p>
                  </div>
                  <div className="w-full sm:w-px h-px sm:h-8 md:h-10 lg:h-11 xl:h-12 2xl:h-14 bg-gray-600 sm:mx-2 md:mx-3 lg:mx-4 xl:mx-6 2xl:mx-8"></div>
                  <div className="text-white text-center flex-1 w-full sm:w-auto">
                    <p className="font-['Gilroy'] font-normal text-xs sm:text-sm md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[20px]">
                      Data encrypted,
                      <br />
                      2FA enabled
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialSafety;
