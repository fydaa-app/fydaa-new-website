import React from "react";

const DebtFreedom: React.FC = () => {
  return (
    <div className="w-full bg-[#ffffff] -mt-48">
      {/* Top Section - White Background */}
      <section className="bg-[#ffffff] text-black py-40 px-12 relative z-10 rounded-t-[56px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between gap-16">
            {/* Left Side - Content */}
            <div className="flex-1 max-w-[650px]">
              <h1 className="text-[44px] font-['Gilroy'] font-bold leading-tight mb-16 ml-8">
                Your Roadmap to a Stronger, Safer Portfolio
              </h1>

              {/* Numbered Feature List */}
              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    1
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-normal text-[20px]">
                      Review Current Investments
                    </h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">
                      Understand your portfolio’s strengths and weaknesses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    2
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-normal text-[20px]">
                      Diversify Smartly
                    </h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">
                      Spread risk across multiple asset classes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    3
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-normal text-[20px]">
                      Rebalance Regularly
                    </h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">
                      Adjust your portfolio to market conditions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    4
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-normal text-[20px]">
                      Track Performance
                    </h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">
                      Monitor results and make data-backed changes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    5
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-normal text-[20px]">
                      Stay Informed
                    </h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">
                      Get regular updates and insights from our experts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Placeholder */}
            <div className="flex-1 flex justify-end mt-12">
              <div className="w-96 h-[700px] ">
                <img
                  src="/resource/app.png"
                  alt="Mobile App"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section - Light Background */}
      <section className="bg-white text-black py-12 pb-24 px-12 relative">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[44px] font-['Gilroy'] font-bold text-center mb-20 leading-tight">
            Because your investments deserve expert care
          </h2>

          {/* Four Feature Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Top Left */}
            <div className="text-center">
              <div className="flex justify-center mx-auto mb-3">
                <img
                  src="/resource/PortfolioManagement/returns.png"
                  alt="Lower Interest"
                  className="w-24 h-24"
                />
              </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">
                Maximise Returns
              </h3>
              <p className="text-[18px] font-['Inter'] font-normal text-gray-600">
                Make the most of your capital
              </p>
            </div>

            {/* Top Right */}
            <div className="text-center">
              <div className="flex justify-center mx-auto mb-3">
                <img
                  src="/resource/PortfolioManagement/risk.png"
                  alt="Simplified Finances"
                  className="w-24 h-24"
                />
              </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">
                Reduce Risk
              </h3>
              <p className="text-gray-600 text-lg">
                Avoid overexposure to a single asset
              </p>
            </div>

            {/* Bottom Left */}
            <div className="text-center">
              <div className="flex justify-center mx-auto mb-3">
                <img
                  src="/resource/PortfolioManagement/time.png"
                  alt="Better Credit Score"
                  className="w-28 h-24"
                />
              </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">
                Save Time
              </h3>
              <p className="text-gray-600 text-lg">
                Let professionals handle the tracking and adjustments
              </p>
            </div>

            {/* Bottom Right */}
            <div className="text-center">
              <div className="flex justify-center mx-auto mb-3">
                <img
                  src="/resource/PortfolioManagement/love.png"
                  alt="Less Stress"
                  className="w-24 h-24"
                />
              </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">
                Stay Aligned
              </h3>
              <p className="text-gray-600 text-lg">
                Keep your portfolio in sync with your changing goals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Gradient Border - Full viewport width */}
      <div
        className="w-screen -mb-8 relative z-0"
        style={{ marginLeft: "calc(-50vw + 50%)" }}
      >
        <img
          src="/resource/gradientborder.png"
          alt="Gradient Border"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default DebtFreedom;
