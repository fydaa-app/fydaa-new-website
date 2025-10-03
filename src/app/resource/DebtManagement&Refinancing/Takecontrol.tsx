import React from "react";

const TakeControl: React.FC = () => {
  return (
    <main className="w-full h-full m-0 p-0 relative">
      {/* Top Section - Light Background */}
      <section className="relative py-28 sm:py-32 md:py-34 lg:py-32 xl:py-40 2xl:py-48 px-0 mx-0">
        <div className="w-full mx-0 px-0 relative">
          <div className="text-left mt-16 sm:mt-18 md:mt-20 lg:mt-16 xl:mt-20 2xl:mt-24 mx-0 px-0">
            {/* Left Content */}
            <div className="space-y-6 relative z-20 mx-0 px-0">
              {/* Remove the justify-between wrapper */}
              <div className="flex flex-col lg:flex-row gap-8 sm:gap-6 md:gap-6 lg:gap-8 items-start">
                {/* Text Content */}
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 pl-[50px] leading-tight font-gilroy">
                    Take Control of Your Debt, <br /> Regain Your Peace of Mind
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-xl text-gray-700 pl-[50px] leading-relaxed font-inter mt-4">
                    Struggling with EMIs, credit card dues, or multiple loans?
                    You're not alone. Fydaa helps you <br />
                    simplify your repayments, lower your interest rates, and get
                    your finances back on track, <br />
                    so you can breathe easy again.
                  </p>

                  <button className="bg-black text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-medium cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-sm text-xs sm:text-xs md:text-sm lg:text-base xl:text-base 2xl:text-lg ml-[50px] mt-6 mb-8 sm:mb-10 md:mb-12 lg:mb-0">
                    Book a Free Call
                  </button>
                </div>

                {/* Image - Now properly aligned to right and top */}
                <div className="flex-shrink-0 -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-[150px] xl:-mt-40 2xl:-mt-48 ml-8 sm:ml-0 md:ml-0 lg:ml-0 xl:ml-0 2xl:ml-0">
                  <img
                    src="/resource/DebtManagement&Refinancing/icon.png"
                    alt="DebtManagement"
                    className="p-1 sm:p-2 md:p-3 lg:p-8 xl:p-10 2xl:p-12 w-full max-w-[150px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-md xl:max-w-lg 2xl:max-w-xl"
                  />
                </div>
              </div>

              {/* Gradient - Keep absolute positioning */}
              <div className="absolute -top-[500px] -left-8 -right-8 -z-10 flex gap-0">
                <img
                  src="/resource/gradient.png"
                  alt="Gradient"
                  className="h-screen w-1/2 object-cover opacity-60"
                />
                <img
                  src="/resource/gradient.png"
                  alt="Gradient"
                  className="h-screen w-1/2 object-cover opacity-60"
                />
              </div>
            </div>

            {/* Blue circle image - positioned below content */}
            <div className="mt-24 sm:mt-28 md:mt-32 lg:mt-[200px] xl:mt-48 2xl:mt-56 relative z-0 flex justify-center overflow-visible mx-0 px-0 w-full">
              <div className="relative overflow-visible w-full mx-0 px-0">
                <img
                  src="/resource/blue.png"
                  alt="Blue Circle"
                  className="w-full h-[600px] sm:h-[700px] md:h-[800px] lg:h-auto xl:h-auto 2xl:h-auto object-cover mx-0 px-0"
                />
                {/* Text overlay on blue circle */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-8 sm:pt-12 md:pt-16 lg:pt-[100px] xl:pt-24 2xl:pt-32 pb-4 sm:pb-6 md:pb-8 lg:pb-[60px] xl:pb-16 2xl:pb-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 2xl:px-16">
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-[44px] xl:text-4xl 2xl:text-5xl font-bold text-white mb-[16px] leading-tight font-gilroy">
                    Make Your Debt Work for You, Not Against You
                  </h2>
                  <p className="text-xs sm:text-xs md:text-sm lg:text-[16px] xl:text-base 2xl:text-lg text-gray-200 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[1100px] xl:max-w-4xl 2xl:max-w-5xl leading-relaxed mb-4 sm:mb-6 md:mb-8 lg:mb-[40px] xl:mb-12 2xl:mb-16 font-inter">
                    Debt management and refinancing are not just about paying
                    off what you owe, they're about creating a repayment plan
                    that works for your lifestyle and future goals. At Fydaa, we
                    guide you through smart repayment strategies, consolidation
                    options, and refinancing deals so you save more and stress
                    less.
                  </p>

                  {/* Video Placeholder */}
                  <div className="bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl 2xl:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-[24px] xl:p-8 2xl:p-10 shadow-2xl relative overflow-hidden w-full max-w-[280px] sm:max-w-[350px] md:max-w-[500px] lg:max-w-[800px] xl:max-w-[1000px] 2xl:max-w-[1200px] mb-4 sm:mb-6 md:mb-8 lg:mb-[30px] xl:mb-12 2xl:mb-16 mx-auto">
                    {/* Video Screen */}
                    <div className="bg-gray-700 rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl xl:rounded-xl 2xl:rounded-xl h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] 2xl:h-[450px] w-full flex items-center justify-center relative mb-2 sm:mb-3 md:mb-4 lg:mb-[16px] xl:mb-6 2xl:mb-8">
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
          </div>
        </div>
      </section>
    </main>
  );
};

export default TakeControl;
