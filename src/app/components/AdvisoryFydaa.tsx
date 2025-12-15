import React from "react";

const AdvisoryFydaa: React.FC = () => {
  return (
    <div className="w-full pb-8 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24 2xl:pb-28 relative bg-[#F7F7F7] overflow-visible">
      {/* Left Top Gradient */}
      <img
        src="/advisory/leftgradient.png"
        alt="Left Gradient"
        className="absolute -top-[20vh] sm:-top-[25vh] md:-top-[30vh] lg:-top-[35vh] xl:-top-[40vh] 2xl:-top-[45vh] -left-4 sm:-left-6 md:-left-8 lg:-left-12 xl:-left-16 2xl:-left-24 h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh] 2xl:h-[100vh] object-cover z-10"
        style={{ objectPosition: "top left" }}
      />

      {/* Right Top Gradient */}
      <img
        src="/advisory/rightgradient.png"
        alt="Right Gradient"
        className="absolute -top-[20vh] sm:-top-[25vh] md:-top-[30vh] lg:-top-[35vh] xl:-top-[40vh] 2xl:-top-[45vh] -right-4 sm:-right-6 md:-right-8 lg:-right-12 xl:-right-16 2xl:-right-24 h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh] 2xl:h-[100vh] object-cover z-10"
        style={{ objectPosition: "top right" }}
      />

      <div className="w-full h-full flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-20 xl:px-24 relative z-20">
        {/* Header */}
        <div className="text-center mt-16 sm:mt-20 md:mt-24 lg:mt-48 xl:mt-56 2xl:mt-64 w-full mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-18 2xl:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-[56px] xl:text-[64px] 2xl:text-[72px] font-semibold text-gray-900 leading-tight mb-6 sm:mb-7 md:mb-8 lg:mb-8 xl:mb-10 2xl:mb-12 px-4 sm:px-6">
            Fydaa vs Traditional Advisors
          </h2>
          <p className="text-lg sm:text-xl md:text-xl lg:text-lg xl:text-xl 2xl:text-2xl font-normal text-gray-600 leading-relaxed max-w-3xl sm:max-w-4xl md:max-w-4xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto px-4 sm:px-6">
            We're not here to throw jargon at you. We walk with you through
            every step.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="w-full max-w-[320px] sm:max-w-sm md:max-w-md lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-20 xl:mb-24 2xl:mb-28">
          {/* Desktop Layout */}
          <table className="hidden lg:table w-full border-separate border-spacing-x-8 xl:border-spacing-x-12 2xl:border-spacing-x-16 border-spacing-y-0">
            <thead>
              <tr>
                {/* Empty header for the first column */}
                <th className="w-1/4"></th>

                {/* Header for the middle column (Fydaa) */}
                <th className="text-left font-bold text-xl leading-6 tracking-tight w-1/3 pb-4">
                  Fydaa
                </th>

                {/* Header for the right column (Traditional Advisors) */}
                <th className="text-left font-bold text-xl leading-6 tracking-tight w-1/3 pb-4">
                  Traditional Advisors
                </th>
              </tr>
            </thead>

            <tbody className="outline outline-2 outline-black-200 rounded-3xl outline-offset-0">
              <tr>
                <td className="bg-black rounded-t-3xl px-12 lg:px-12 xl:px-16 2xl:px-20 pt-8 lg:pt-8 xl:pt-10 2xl:pt-12 pb-4 lg:pb-4 xl:pb-5 2xl:pb-6 shadow-xl w-1/4">
                  <div className="h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-start">
                    <h3 className="text-white font-semibold text-sm lg:text-sm xl:text-base 2xl:text-lg">
                      Regulation
                    </h3>
                  </div>
                </td>
                <td className="relative pt-8 lg:pt-8 xl:pt-10 2xl:pt-12 pb-4 lg:pb-4 xl:pb-5 2xl:pb-6 border-r-2 border-black pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3 rounded-tr-3xl">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-start">
                    100% SEBI-registered advisors
                  </p>
                  {/* Gradient bottom border */}
                  <div
                    className="
absolute bottom-0 
-left-16 lg:-left-16 
xl:-left-[5.5rem] 
2xl:-left-[7rem] 
w-[calc(100%+4rem)] lg:w-[calc(100%+4rem)] 
xl:w-[calc(100%+5.5rem)] 
2xl:w-[calc(100%+7rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>

                <td className="relative pt-8 lg:pt-8 xl:pt-10 2xl:pt-12 pb-4 lg:pb-4 xl:pb-5 2xl:pb-6 w-1/3 pr-8 lg:pr-8 xl:pr-10 2xl:pr-12">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-start">
                    Not always SEBI-registered
                  </p>

                  <div
                    className="
absolute bottom-0 
-left-8 xl:-left-12 2xl:-left-16 
w-[calc(100%+2rem)] xl:w-[calc(100%+3rem)] 2xl:w-[calc(100%+4rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
              </tr>

              <tr>
                <td className="bg-black px-12 lg:px-12 xl:px-16 2xl:px-20 py-4 lg:py-4 xl:py-5 2xl:py-6 shadow-xl w-1/4">
                  <div className="h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-start">
                    <h3 className="text-white font-semibold text-sm lg:text-sm xl:text-base 2xl:text-lg">
                      Transparency
                    </h3>
                  </div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 border-r-2 border-black pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    Flat ₹20 fee, no hidden commissions
                  </p>
                  <div
                    className="
absolute bottom-0 
-left-16 lg:-left-16 
xl:-left-[5.5rem] 
2xl:-left-[7rem] 
w-[calc(100%+4rem)] lg:w-[calc(100%+4rem)] 
xl:w-[calc(100%+5.5rem)] 
2xl:w-[calc(100%+7rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    Often unclear fees or hidden commissions
                  </p>

                  <div
                    className="
absolute bottom-0 
-left-8 xl:-left-12 2xl:-left-16 
w-[calc(100%+2rem)] xl:w-[calc(100%+3rem)] 2xl:w-[calc(100%+4rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
              </tr>

              <tr>
                <td className="bg-black px-12 lg:px-12 xl:px-16 2xl:px-20 py-4 lg:py-4 xl:py-5 2xl:py-6 shadow-xl w-1/4">
                  <div className="h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-start">
                    <h3 className="text-white font-semibold text-sm lg:text-sm xl:text-base 2xl:text-lg">
                      Personalization
                    </h3>
                  </div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 border-r-2 border-black pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    Plans tailored to your income, goals & risk profile
                  </p>
                  <div
                    className="
absolute bottom-0 
-left-16 lg:-left-16 
xl:-left-[5.5rem] 
2xl:-left-[7rem] 
w-[calc(100%+4rem)] lg:w-[calc(100%+4rem)] 
xl:w-[calc(100%+5.5rem)] 
2xl:w-[calc(100%+7rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    Generic advice or one-size-fits-all
                  </p>

                  <div
                    className="
absolute bottom-0 
-left-8 xl:-left-12 2xl:-left-16 
w-[calc(100%+2rem)] xl:w-[calc(100%+3rem)] 2xl:w-[calc(100%+4rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
              </tr>

              <tr>
                <td className="bg-black px-12 lg:px-12 xl:px-16 2xl:px-20 py-4 lg:py-4 xl:py-5 2xl:py-6 shadow-xl w-1/4">
                  <div className="h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-start">
                    <h3 className="text-white font-semibold text-sm lg:text-sm xl:text-base 2xl:text-lg">
                      Accessibility
                    </h3>
                  </div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 border-r-2 border-black pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    Instant access via app, chat anytime
                  </p>
                  <div
                    className="
absolute bottom-0 
-left-16 lg:-left-16 
xl:-left-[5.5rem] 
2xl:-left-[7rem] 
w-[calc(100%+4rem)] lg:w-[calc(100%+4rem)] 
xl:w-[calc(100%+5.5rem)] 
2xl:w-[calc(100%+7rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    In-person, hard to reach, slow follow-up
                  </p>

                  <div
                    className="
absolute bottom-0 
-left-8 xl:-left-12 2xl:-left-16 
w-[calc(100%+2rem)] xl:w-[calc(100%+3rem)] 2xl:w-[calc(100%+4rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
              </tr>

              <tr>
                <td className="bg-black px-12 lg:px-12 xl:px-16 2xl:px-20 py-4 lg:py-4 xl:py-5 2xl:py-6 shadow-xl w-1/4">
                  <div className="h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-start">
                    <h3 className="text-white font-semibold text-sm lg:text-sm xl:text-base 2xl:text-lg">
                      Technology
                    </h3>
                  </div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 border-r-2 border-black pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    App-first, automated tracking + human guidance
                  </p>
                  <div
                    className="
absolute bottom-0 
-left-16 lg:-left-16 
xl:-left-[5.5rem] 
2xl:-left-[7rem] 
w-[calc(100%+4rem)] lg:w-[calc(100%+4rem)] 
xl:w-[calc(100%+5.5rem)] 
2xl:w-[calc(100%+7rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    Manual reports, no app or real-time tracking
                  </p>

                  <div
                    className="
absolute bottom-0 
-left-8 xl:-left-12 2xl:-left-16 
w-[calc(100%+2rem)] xl:w-[calc(100%+3rem)] 2xl:w-[calc(100%+4rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
              </tr>

              <tr>
                <td className="bg-black px-12 lg:px-12 xl:px-16 2xl:px-20 py-4 lg:py-4 xl:py-5 2xl:py-6 shadow-xl w-1/4">
                  <div className="h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-start">
                    <h3 className="text-white font-semibold text-sm lg:text-sm xl:text-base 2xl:text-lg">
                      Conflict of Interest
                    </h3>
                  </div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 border-r-2 border-black pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-start">
                    No bias - we don't sell products
                  </p>
                  <div
                    className="
absolute bottom-0 
-left-16 lg:-left-16 
xl:-left-[5.5rem] 
2xl:-left-[7rem] 
w-[calc(100%+4rem)] lg:w-[calc(100%+4rem)] 
xl:w-[calc(100%+5.5rem)] 
2xl:w-[calc(100%+7rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    May push products for commission
                  </p>

                  <div
                    className="
absolute bottom-0 
-left-8 xl:-left-12 2xl:-left-16 
w-[calc(100%+2rem)] xl:w-[calc(100%+3rem)] 2xl:w-[calc(100%+4rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
              </tr>

              <tr>
                <td className="bg-black px-12 lg:px-12 xl:px-16 2xl:px-20 py-4 lg:py-4 xl:py-5 2xl:py-6 shadow-xl w-1/4">
                  <div className="h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-start">
                    <h3 className="text-white font-semibold text-sm lg:text-sm xl:text-base 2xl:text-lg">
                      Cost
                    </h3>
                  </div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 border-r-2 border-black pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    Affordable ₹20 advice per session
                  </p>
                  <div
                    className="
absolute bottom-0 
-left-16 lg:-left-16 
xl:-left-[5.5rem] 
2xl:-left-[7rem] 
w-[calc(100%+4rem)] lg:w-[calc(100%+4rem)] 
xl:w-[calc(100%+5.5rem)] 
2xl:w-[calc(100%+7rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
                <td className="relative py-4 lg:py-4 xl:py-5 2xl:py-6 pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    High consultation fees or % of investments
                  </p>

                  <div
                    className="
absolute bottom-0 
-left-8 xl:-left-12 2xl:-left-16 
w-[calc(100%+2rem)] xl:w-[calc(100%+3rem)] 2xl:w-[calc(100%+4rem)] 
h-[2px] bg-gradient-to-r from-black via-black/50 to-transparent
"
                  ></div>
                </td>
              </tr>

              <tr>
                <td className="bg-black rounded-b-3xl px-12 lg:px-12 xl:px-16 2xl:px-20 pt-4 lg:pt-4 xl:pt-5 2xl:pt-6 pb-8 lg:pb-8 xl:pb-10 2xl:pb-12 shadow-xl w-1/4">
                  <div className="h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-start">
                    <h3 className="text-white font-semibold text-sm lg:text-sm xl:text-base 2xl:text-lg">
                      User Experience
                    </h3>
                  </div>
                </td>
                <td className="pt-4 lg:pt-4 xl:pt-5 2xl:pt-6 pb-8 lg:pb-8 xl:pb-10 2xl:pb-12 border-r-2 border-black pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3 rounded-br-3xl ">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    Friendly, simplified explanations for young investors
                  </p>
                </td>
                <td className="pt-4 lg:pt-4 xl:pt-5 2xl:pt-6 pb-8 lg:pb-8 xl:pb-10 2xl:pb-12 pr-8 lg:pr-8 xl:pr-10 2xl:pr-12 w-1/3">
                  <p className="text-gray-700 text-base lg:text-base xl:text-lg 2xl:text-xl font-normal leading-relaxed h-6 lg:h-6 xl:h-7 2xl:h-8 flex items-center justify-center">
                    Old-school, intimidating language
                  </p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden space-y-3 sm:space-y-4 md:space-y-5">
            {/* Category Items */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              {/* Regulation */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="bg-black rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 mb-2 sm:mb-3 md:mb-4 text-center">
                  <h3 className="text-white font-semibold text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                    Regulation
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">
                      Traditional:
                    </span>{" "}
                    Not always SEBI-registered
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span>{" "}
                    100% SEBI-registered advisors
                  </div>
                </div>
              </div>

              {/* Transparency */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="bg-black rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 mb-2 sm:mb-3 md:mb-4 text-center">
                  <h3 className="text-white font-semibold text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                    Transparency
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">
                      Traditional:
                    </span>{" "}
                    Often unclear fees or hidden commissions
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span>{" "}
                    Flat ₹20 fee, no hidden commissions
                  </div>
                </div>
              </div>

              {/* Personalization */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="bg-black rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 mb-2 sm:mb-3 md:mb-4 text-center">
                  <h3 className="text-white font-semibold text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                    Personalization
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">
                      Traditional:
                    </span>{" "}
                    Generic advice or one-size-fits-all
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span>{" "}
                    Plans tailored to your income, goals & risk profile
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="bg-black rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 mb-2 sm:mb-3 md:mb-4 text-center">
                  <h3 className="text-white font-semibold text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                    Accessibility
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">
                      Traditional:
                    </span>{" "}
                    In-person, hard to reach, slow follow-up
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span>{" "}
                    Instant access via app, chat anytime
                  </div>
                </div>
              </div>

              {/* Technology */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="bg-black rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 mb-2 sm:mb-3 md:mb-4 text-center">
                  <h3 className="text-white font-semibold text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                    Technology
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">
                      Traditional:
                    </span>{" "}
                    Manual reports, no app or real-time tracking
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span>{" "}
                    App-first, automated tracking + human guidance
                  </div>
                </div>
              </div>

              {/* Conflict of Interest */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="bg-black rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 mb-2 sm:mb-3 md:mb-4 text-center">
                  <h3 className="text-white font-semibold text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                    Conflict of Interest
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">
                      Traditional:
                    </span>{" "}
                    May push products for commission
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span>{" "}
                    No bias - we don't sell products
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="bg-black rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 mb-2 sm:mb-3 md:mb-4 text-center">
                  <h3 className="text-white font-semibold text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                    Cost
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">
                      Traditional:
                    </span>{" "}
                    High consultation fees or % of investments
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span>{" "}
                    Affordable ₹20 advice per session
                  </div>
                </div>
              </div>

              {/* User Experience */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="bg-black rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 mb-2 sm:mb-3 md:mb-4 text-center">
                  <h3 className="text-white font-semibold text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                    User Experience
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-[11px] md:text-[12px] lg:text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">
                      Traditional:
                    </span>{" "}
                    Old-school, intimidating language
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span>{" "}
                    Friendly, simplified explanations for young investors
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisoryFydaa;
