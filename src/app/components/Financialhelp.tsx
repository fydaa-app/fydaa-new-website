"use client";

import React, { useState } from "react";

const FinancialPlanInterface: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 bg-black flex flex-col items-center justify-start min-h-[1400px] sm:min-h-[1800px] md:min-h-[2200px] lg:min-h-[2600px] mb-20 sm:mb-0 m-0 rounded-[16px] sm:rounded-[24px] md:rounded-[32px] lg:rounded-[40px] xl:rounded-[48px] 2xl:rounded-[56px] relative overflow-hidden">
      {/* Gradient Image - positioned left of title */}
      <div className="absolute left-0 top-10 sm:top-16 md:top-20 w-[200px] h-[150px] sm:w-[400px] sm:h-[300px] md:w-[600px] md:h-[450px] lg:w-[850px] lg:h-[600px] -translate-x-1/2 z-20 hidden sm:block">
        <img
          src="/FinancialPlan/Gradient.png"
          alt="Decorative gradient"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Gradient Image - positioned right of title */}
      <div className="absolute right-0 top-20 sm:top-32 md:top-48 lg:top-96 w-[200px] h-[150px] sm:w-[400px] sm:h-[300px] md:w-[600px] md:h-[450px] lg:w-[950px] lg:h-[800px] translate-x-1/2 z-20 hidden sm:block">
        <img
          src="/FinancialPlan/Gradient.png"
          alt="Decorative gradient"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="text-center mt-8 sm:mt-16 md:mt-20 lg:mt-28 relative z-10 px-4 sm:px-6 md:px-8">
        <h1 className="text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] font-semibold text-white text-center font-['Gilroy'] leading-tight">
          One Hand for All Your Financial Help
        </h1>
        <p className="text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-normal text-[#E6E6E6] text-center font-['Inter'] mt-3 sm:mt-4 md:mt-5 lg:mt-6 leading-relaxed max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
          One app, many goals - everything you need to manage money smartly, in one place.
        </p>
      </div>
      
      {/* Cards Container with Infinite Scroll Animation */}
      <div className="relative mt-16 overflow-hidden" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
        <div className="animate-scroll-seamless-cards gap-12">
        {/* Card 1 */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img
                        src="/FinancialPlan/debtmanagement.png"
                        alt="Investment Planning icon"
                        width={80}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] font-semibold leading-tight font-['Gilroy']">
                        Investment Planning
                      </h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">
                        Align your investment with your time  
                        horizon and risk appetite.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">
                      Rs. 199
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="text-white"
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
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized tax-saving report
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment-linked deductions
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Capital gains advice
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Year-end tax planning session
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">
                      Rs. 199
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="text-white"
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
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img
                        src="/FinancialPlan/expensemanagement.png"
                        alt="Expense Management icon"
                        width={80}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">
                        Expense Management
                      </h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">
                        Gain clarity on where your money goes every month.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">
                      Rs. 199
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="text-white"
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
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Expense tracking & categorization
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly spending analysis
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Budget recommendations
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Cost optimization tips
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">
                      Rs. 199
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="text-white"
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
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img
                        src="/FinancialPlan/personalbudget.png"
                        alt="Portfolio Management icon"
                        width={80}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">
                        Portfolio Management
                      </h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">
                        Track, Optimize, and enhance your overall investment performance.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">
                      Rs. 199
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="text-white"
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
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment tracking dashboard
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Health score of your portfolio
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Rebalancing tips
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Alerts on overexposure or underperformance
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">
                      Rs. 199
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="text-white"
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
              </div>
            </div>
          </div>
        </div>
         {/* Card 4 */}
         <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
           <div className="card-flip-container">
             <div className="card-flip-inner">
               {/* Front of Card */}
               <div className="card-front">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                     <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-1">
                       <img
                         src="/FinancialPlan/Tax1Consultancy.png"
                         alt="Tax consultancy icon"
                         width={180}
                         height={220}
                         className="object-contain scale-150"
                       />
                     </div>
                     <div className="space-y-2">
                       <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">
                         Tax Consultancy
                       </h2>
                       <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">
                         Expert help in planning your taxes and maximizing exemptions.
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                     <div className="text-white text-3xl font-light">
                       Rs. 199
                     </div>
                     <div className="w-10 h-10 flex items-center justify-center">
                       <svg 
                         width="20" 
                         height="20" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         className="text-white"
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
               </div>

               {/* Back of Card */}
               <div className="card-back">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                     <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy']">
                       HERE'S WHAT YOU GET
                     </h2>
                     <div className="space-y-3 w-full">
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Personalized tax-saving report
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Investment-linked deductions
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Capital gains advice
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Year-end tax planning session
                         </p>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                     <div className="text-white text-3xl font-light">
                       Rs. 199
                     </div>
                     <div className="w-10 h-10 flex items-center justify-center">
                       <svg 
                         width="20" 
                         height="20" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         className="text-white"
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
               </div>
             </div>
           </div>
         </div>
         {/* Card 5 */}
         <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
           <div className="card-flip-container">
             <div className="card-flip-inner">
               {/* Front of Card */}
               <div className="card-front">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                     <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-1">
                       <img
                         src="/FinancialPlan/Financialhealth.png"
                         alt="Financial health checkup icon"
                         width={180}
                         height={220}
                         className="object-contain scale-150"
                       />
                     </div>
                     <div className="space-y-2">
                       <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">
                         Financial Health Checkup
                       </h2>
                       <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">
                         A complete diagnostic of your current financial condition.
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                     <div className="text-white text-3xl font-light">
                       Rs. 199
                     </div>
                     <div className="w-10 h-10 flex items-center justify-center">
                       <svg 
                         width="20" 
                         height="20" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         className="text-white"
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
               </div>

               {/* Back of Card */}
               <div className="card-back">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                     <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy']">
                       HERE'S WHAT YOU GET
                     </h2>
                     <div className="space-y-3 w-full">
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Net worth snapshot
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Savings-to-expense ratio
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Risk exposure analysis
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Report with expert suggestions
                         </p>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                     <div className="text-white text-3xl font-light">
                       Rs. 199
                     </div>
                     <div className="w-10 h-10 flex items-center justify-center">
                       <svg 
                         width="20" 
                         height="20" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         className="text-white"
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
               </div>
             </div>
           </div>
         </div>
         {/* Card 6 */}
         <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
           <div className="card-flip-container">
             <div className="card-flip-inner">
               {/* Front of Card */}
               <div className="card-front">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                     <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                       <img
                         src="/FinancialPlan/personalbudget.png"
                         alt="Personalized budgeting plan icon"
                         width={80}
                         height={100}
                         className="object-contain"
                       />
                     </div>
                     <div className="space-y-2">
                       <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">
                         Personalized Budgeting Plan
                       </h2>
                       <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">
                         A custom budget, created around your income, lifestyle, and future goals.
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                     <div className="text-white text-3xl font-light">
                       Rs. 199
                     </div>
                     <div className="w-10 h-10 flex items-center justify-center">
                       <svg 
                         width="20" 
                         height="20" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         className="text-white"
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
               </div>

               {/* Back of Card */}
               <div className="card-back">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                     <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy']">
                       HERE'S WHAT YOU GET
                     </h2>
                     <div className="space-y-3 w-full">
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Income-expense allocation plan
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Dynamic budgeting tracker
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Realistic savings goals
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Monthly report card
                         </p>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                     <div className="text-white text-3xl font-light">
                       Rs. 199
                     </div>
                     <div className="w-10 h-10 flex items-center justify-center">
                       <svg 
                         width="20" 
                         height="20" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         className="text-white"
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
               </div>
             </div>
           </div>
         </div>
         {/* Card 7 */}
         <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
           <div className="card-flip-container">
             <div className="card-flip-inner">
               {/* Front of Card */}
               <div className="card-front">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                     <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                       <img
                         src="/FinancialPlan/debtmanagement.png"
                         alt="Debt management and refinancing icon"
                         width={80}
                         height={100}
                         className="object-contain"
                       />
                     </div>
                     <div className="space-y-2">
                       <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">
                         Debt Management & Refinancing
                       </h2>
                       <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">
                         Pay off your liabilities smarter with expert-backed strategies tailored for your financial health.
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                     <div className="text-white text-3xl font-light">
                       Rs. 199
                     </div>
                     <div className="w-10 h-10 flex items-center justify-center">
                       <svg 
                         width="20" 
                         height="20" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         className="text-white"
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
               </div>

               {/* Back of Card */}
               <div className="card-back">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                     <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy']">
                       HERE'S WHAT YOU GET
                     </h2>
                     <div className="space-y-3 w-full">
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Personalized debt repayment roadmap
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Refinance suggestions to reduce EMI burden
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Consolidation options for multiple loans
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Monthly progress tracking
                         </p>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                     <div className="text-white text-3xl font-light">
                       Rs. 199
                     </div>
                     <div className="w-10 h-10 flex items-center justify-center">
                       <svg 
                         width="20" 
                         height="20" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         className="text-white"
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
               </div>
             </div>
           </div>
         </div>
         {/* Card 8 */}
         <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
           <div className="card-flip-container">
             <div className="card-flip-inner">
               {/* Front of Card */}
               <div className="card-front">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                     <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-2">
                       <img
                         src="/FinancialPlan/Emergency1FundSetup.png"
                         alt="Emergency fund setup and guidance icon"
                         width={180}
                         height={220}
                         className="object-contain scale-150"
                       />
                     </div>
                     <div className="space-y-2">
                       <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">
                         Emergency Fund Setup & Guidance
                       </h2>
                       <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">
                         Build a reliable financial cushion for emergencies, job loss, or medical needs.
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                     <div className="text-white text-3xl font-light">
                       Rs. 199
                     </div>
                     <div className="w-10 h-10 flex items-center justify-center">
                       <svg 
                         width="20" 
                         height="20" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         className="text-white"
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
               </div>

               {/* Back of Card */}
               <div className="card-back">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                     <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy']">
                       HERE'S WHAT YOU GET
                     </h2>
                     <div className="space-y-3 w-full">
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Personalized emergency fund target
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Savings options for liquidity
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Monthly reminders to build the corpus
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Guidance on fund placement (FDs, liquid funds)
                         </p>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between relative z-10">
                     <div className="text-white text-3xl font-light">
                       Rs. 199
                     </div>
                     <div className="w-10 h-10 flex items-center justify-center">
                       <svg 
                         width="20" 
                         height="20" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         className="text-white"
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
               </div>
             </div>
           </div>
         </div>
        
        {/* Duplicate cards for seamless loop - All 8 cards */}
        
        {/* Duplicate Card 1 - Investment Planning */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img src="/FinancialPlan/debtmanagement.png" alt="Investment Planning icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Investment Planning</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Align your investment with your time horizon and risk appetite.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Risk assessment test
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Asset allocation strategy
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Suggested mutual funds/ETFs
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Periodic rebalancing reminders
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 2 - Expense Management */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img src="/FinancialPlan/expensemanagement.png" alt="Expense Management icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Expense Management</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Gain clarity on where your money goes every month.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Smart categorization of expenses
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Expense-saving tips
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly budget deviation alerts
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Spending summary dashboard
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 3 - Portfolio Management */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img src="/FinancialPlan/personalbudget.png" alt="Portfolio Management icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Portfolio Management</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Track, optimize, and enhance your overall investment performance.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment tracking dashboard
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Health score of your portfolio
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Rebalancing tips
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Alerts on overexposure or underperformance
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 4 - Tax Consultancy */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-1">
                      <img src="/FinancialPlan/Tax1Consultancy.png" alt="Tax consultancy icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Tax Consultancy</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Expert help in planning your taxes and maximizing exemptions.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized tax-saving report
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment-linked deductions
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Capital gains advice
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Year-end tax planning session
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 5 - Financial Health Checkup */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-1">
                      <img src="/FinancialPlan/Financialhealth.png" alt="Financial health checkup icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Financial Health Checkup</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">A complete diagnostic of your current financial condition.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Net worth snapshot
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Savings-to-expense ratio
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Risk exposure analysis
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Report with expert suggestions
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 6 - Personalized Budgeting Plan */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img src="/FinancialPlan/personalbudget.png" alt="Personalized budgeting plan icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Personalized Budgeting Plan</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">A custom budget, created around your income, lifestyle, and future goals.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Income-expense allocation plan
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Dynamic budgeting tracker
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Realistic savings goals
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly report card
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 7 - Debt Management & Refinancing */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img src="/FinancialPlan/debtmanagement.png" alt="Debt management and refinancing icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Debt Management & Refinancing</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Pay off your liabilities smarter with expert-backed strategies tailored for your financial health.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized debt repayment roadmap
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Refinance suggestions to reduce EMI burden
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Consolidation options for multiple loans
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly progress tracking
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 8 - Emergency Fund Setup & Guidance */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-2">
                      <img src="/FinancialPlan/Emergency1FundSetup.png" alt="Emergency fund setup and guidance icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Emergency Fund Setup & Guidance</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Build a reliable financial cushion for emergencies, job loss, or medical needs.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized emergency fund target
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Savings options for liquidity
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly reminders to build the corpus
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Guidance on fund placement (FDs, liquid funds)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Set of Duplicate Cards for Even Smoother Loop */}
        
        {/* Duplicate Card 9 - Investment Planning */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img src="/FinancialPlan/debtmanagement.png" alt="Investment Planning icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Investment Planning</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Align your investment with your time horizon and risk appetite.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Risk assessment test
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Asset allocation strategy
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Suggested mutual funds/ETFs
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Periodic rebalancing reminders
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 10 - Expense Management */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img src="/FinancialPlan/expensemanagement.png" alt="Expense Management icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Expense Management</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Gain clarity on where your money goes every month.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Smart categorization of expenses
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Expense-saving tips
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly budget deviation alerts
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Spending summary dashboard
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 11 - Portfolio Management */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img src="/FinancialPlan/personalbudget.png" alt="Portfolio Management icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Portfolio Management</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Track, optimize, and enhance your overall investment performance.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment tracking dashboard
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Health score of your portfolio
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Rebalancing tips
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Alerts on overexposure or underperformance
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 12 - Tax Consultancy */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-1">
                      <img src="/FinancialPlan/Tax1Consultancy.png" alt="Tax consultancy icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Tax Consultancy</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Expert help in planning your taxes and maximizing exemptions.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized tax-saving report
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment-linked deductions
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Capital gains advice
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Year-end tax planning session
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 13 - Financial Health Checkup */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-1">
                      <img src="/FinancialPlan/Financialhealth.png" alt="Financial health checkup icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Financial Health Checkup</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">A complete diagnostic of your current financial condition.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Net worth snapshot
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Savings-to-expense ratio
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Risk exposure analysis
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Report with expert suggestions
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 14 - Personalized Budgeting Plan */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img src="/FinancialPlan/personalbudget.png" alt="Personalized budgeting plan icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Personalized Budgeting Plan</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">A custom budget, created around your income, lifestyle, and future goals.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Income-expense allocation plan
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Dynamic budgeting tracker
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Realistic savings goals
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly report card
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 15 - Debt Management & Refinancing */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[50px] h-[60px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                      <img src="/FinancialPlan/debtmanagement.png" alt="Debt management and refinancing icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Debt Management & Refinancing</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Pay off your liabilities smarter with expert-backed strategies tailored for your financial health.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized debt repayment roadmap
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Refinance suggestions to reduce EMI burden
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Consolidation options for multiple loans
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly progress tracking
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Card 16 - Emergency Fund Setup & Guidance */}
        <div className="w-[250px] h-[300px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-8 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-2">
                      <img src="/FinancialPlan/Emergency1FundSetup.png" alt="Emergency fund setup and guidance icon" width={50} height={60} className="object-contain sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-semibold leading-tight font-['Gilroy']">Emergency Fund Setup & Guidance</h2>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Build a reliable financial cushion for emergencies, job loss, or medical needs.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                    <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized emergency fund target
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Savings options for liquidity
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly reminders to build the corpus
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Guidance on fund placement (FDs, liquid funds)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-xl sm:text-2xl md:text-3xl font-light">Rs. 199</div>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white sm:w-5 sm:h-5 md:w-5 sm:h-5 lg:w-5 lg:h-5">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-8 mt-12 sm:mt-14 md:mt-16 px-4">
        {/* Create Your Custom Plan Button */}
        <button className="px-4 py-1.5 sm:px-5 sm:py-2 bg-white text-black font-medium text-[12px] sm:text-[13px] md:text-[14px] font-['Gilroy'] rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        onClick={() => window.open('https://cal.com/fydaa-backend-zr5zm3/30min', '_blank')}>
          Create Your Custom Plan
        </button>
      </div>
      
      {/* Text Section */}
      <div className="text-center mt-16 sm:mt-24 md:mt-28 lg:mt-32 px-4 sm:px-6 md:px-8">
        <h2 className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] xl:text-[56px] font-semibold text-white font-['Gilroy'] leading-tight">
          Unsure About Your Needs?
        </h2>
        <h3 className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] xl:text-[56px] font-light text-white font-['Gilroy'] leading-tight mt-2 sm:mt-3 md:mt-4">
          Our Recommended Packages
        </h3>
      </div>
      
      {/* Gradient positioned left of the Wealth Growth Plan card */}
      <div className="absolute left-[-253px] top-[1050px] w-[800px] h-[950px] -rotate-[100deg] z-30">
        <img
          src="/FinancialPlan/Gradient.png"
          alt="Decorative gradient"
          className="w-full h-full object-cover opacity-70"
        />
      </div>
      
      {/* Carousel Container */}
      <div className="relative max-w-xs sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl w-full mt-12 sm:mt-14 md:mt-16 px-4 sm:px-6 md:px-8">
        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentCard((prev) => prev === 0 ? 2 : prev - 1)}
          className="absolute left-[-20px] sm:left-[-30px] md:left-[-40px] lg:left-[-50px] top-1/2 transform -translate-y-1/2 z-[100] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 bg-black/50 rounded-full backdrop-blur-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          onClick={() => setCurrentCard((prev) => prev === 2 ? 0 : prev + 1)}
          className="absolute right-[-20px] sm:right-[-30px] md:right-[-40px] lg:right-[-50px] top-1/2 transform -translate-y-1/2 z-[100] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 bg-black/50 rounded-full backdrop-blur-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Card Data */}
        {(() => {
          const cards = [
            {
              title: "Wealth Growth Plan",
              subtitle: "Accelerate growth, maximize your potential",
              services: [
                { img: "debtmanagement.png", text: "Debt Management & Refinancing" },
                { img: "expensemanagement.png", text: "Expense Management" },
                { img: "emergencyfund.png", text: "Emergency Fund Setup & Guidance" },
                { img: "InvestmentStrategy.png", text: "Investment Planning" },
                { img: "PortfolioManagement.png", text: "Portfolio Management" },
                { img: "TaxConsultancy.png", text: "Tax Consultancy" },
                { img: "personalbudget.png", text: "Personalized Budgeting Plan" },
                { img: "discplan.png", text: "Disciplined Saving Planning (SIP)" },
                { img: "Financialhealth.png", text: "Financial Health Checkup" },
                { img: "Retirementplanning.png", text: "Retirement Planning" },
                { img: "Insurance.png", text: "Insurance" },
                { img: "Educationalcontent.png", text: "Educational Content" },
              ]
            },
            {
              title: "Financial Foundation Plan",
              subtitle: "Start saving smart, build long-term wealth",
              services: [
                { img: "debtmanagement.png", text: "Debt Management & Refinancing" },
                { img: "discplan.png", text: "Disciplined Saving Strategy (SIP)" },
                { img: "emergencyfund.png", text: "Emergency Fund Setup & Guidance" },
                { img: "InvestmentStrategy.png", text: "Investment Planning" },
                { img: "personalbudget.png", text: "Goals setup" },
                { img: "Insurance.png", text: "Insurance" },
                { img: "Financialhealth.png", text: "Financial Health Monitoring" },
                { img: "Educationalcontent.png", text: "Educational Content" },
               
              ]
            },
            {
              title: "Financial Fresh Start Plan",
              subtitle: "Regain balance, build a strong base",
              services: [
                { img: "debtmanagement.png", text: "Debt Management & Refinancing" },
                { img: "expensemanagement.png", text: "Expense Optimization" },
                { img: "Financialhealth.png", text: "1:1 Financial Counselling" },
                { img: "personalbudget.png", text: "Smart Budgeting" },
                { img: "expensemanagement.png", text: "Expense-Saving Balance" },
                { img: "Educationalcontent.png", text: "Educational Content" },  
              ]
            }
          ];

          return (
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentCard * 100}%)` }}
              >
                {cards.map((card, cardIndex) => (
                  <div id="f" key={cardIndex} className="w-full flex-shrink-0 flex justify-center">
                    <div
                      className="bg-transparent backdrop-blur-sm rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col relative z-10 w-fit max-w-full mx-auto"
                      style={{
                        background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                      }}
                    >
                      {/* Stroke/Border Effect */}
                      <div 
                        className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 50%)',
                          padding: '2px',
                          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          maskComposite: 'xor',
                          WebkitMaskComposite: 'xor'
                        }}
                      />
                      
                      {/* Left Section */}
                      <div>
                        {/* Header */}
                        <div className="text-left mb-6 sm:mb-8 md:mb-10">
                          <h1 className="text-[20px] sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px] font-semibold text-white mb-1 sm:mb-2 tracking-tight font-['Gilroy']">
                            {card.title}
                          </h1>
                          <p className="text-white/70 text-[10px] sm:text-[11px] md:text-[12px] font-normal font-['Gilroy']">
                            {card.subtitle}
                          </p>
                        </div>

                        {/* Services Grid */}
                        <div className={`grid ${cardIndex === 1 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6' : cardIndex === 2 ? 'grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6'}`}>
                          {card.services.map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center min-h-[60px] sm:min-h-[70px] md:min-h-[80px]">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-3 flex-shrink-0">
                                <img
                                  src={`/FinancialPlan/${item.img}`}
                                  alt={item.text}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <p
                                className="text-white text-[8px] sm:text-[9px] md:text-[10px] font-semibold leading-tight flex-grow flex items-center justify-center"
                                style={{ fontFamily: "Gilroy, Inter, sans-serif" }}
                              >
                                {item.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center space-x-3 mt-8">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentCard(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              currentCard === index 
                ? 'bg-white scale-125' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>


    
      
      {/* Cover Image with Buttons Overlay */}
      <div className="w-full mt-0 relative z-20">
        <img 
          src="/FinancialPlan/covercut.png" 
          alt="Cover image" 
          className="w-full h-auto object-cover"
        />
        
        {/* Buttons positioned on top of the image */}
        <div className="absolute inset-0 flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-8 -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20 px-4">
          {/* Book a Free Call Button */}
          <button className="px-4 py-2 sm:px-6 sm:py-2 bg-white text-black font-medium text-[12px] sm:text-[14px] font-['Gilroy'] rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={() => window.open('https://cal.com/fydaa-backend-zr5zm3/30min', '_blank')}>
            Book a Free Call
          </button>
          
          {/* Chat on WhatsApp Link */}
          <div className="flex items-center space-x-2 group cursor-pointer">
            <span className="text-white font-medium text-[14px] sm:text-[16px] font-['Inter'] hover:text-gray-300 transition-colors duration-300">Chat on WhatsApp</span>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
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
      
             {/* Space image positioned to overlap covercut image */}
       <div className="w-full -mt-20 sm:-mt-32 md:-mt-40 lg:-mt-44 mb-32 sm:mb-32 relative z-0">
         <img 
           src="/FinancialPlan/space.png" 
           alt="Space background" 
           className="w-full h-auto object-cover"
         />
         
         {/* Text and buttons overlay on space image */}
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 pt-48 sm:pt-64 md:pt-72 lg:pt-80">
           {/* Main heading */}
           <h1 className="text-white text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[56px] font-normal italic leading-tight mb-2 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-7xl font-['Inter']">
             EMI nahi SIP se achieve karo apne sapne.
           </h1>
           
           {/* Subtitle */}
           <p className="text-white/80 text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-normal leading-relaxed mb-6 sm:mb-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl font-['Inter']">
             EMIs often mean borrowing for things you can't afford yet, adding stress and interest. SIPs help you build wealth gradually, giving you control and peace of mind while you plan your dreams.
           </p>
           
           {/* Action buttons */}
           <div className="flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-8">
             {/* Start a SIP Button */}
             <button className="px-4 py-2 sm:px-6 sm:py-2 bg-white text-black font-medium text-[12px] sm:text-[14px] font-['Gilroy'] rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
             onClick={() => window.open('https://cal.com/fydaa-backend-zr5zm3/30min', '_blank')}>
               Start a SIP
             </button>
             
          </div>
         </div> 
       </div>
    </div>
  );
};

export default FinancialPlanInterface;