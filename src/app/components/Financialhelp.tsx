"use client";

import React, { useState } from "react";

const FinancialPlanInterface: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  return (
    <div className="p-0 bg-black flex flex-col items-center justify-start min-h-[2400px] m-0 rounded-[56px] relative overflow-hidden">
      {/* Gradient Image - positioned left of title */}
      <div className="absolute left-0 top-20 w-[850px] h-[600px] -translate-x-1/2 z-20">
        <img
          src="/FinancialPlan/Gradient.png"
          alt="Decorative gradient"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Gradient Image - positioned right of title */}
      <div className="absolute right-0 top-96 w-[950px] h-[800px] translate-x-1/2 z-20">
        <img
          src="/FinancialPlan/Gradient.png"
          alt="Decorative gradient"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="text-center mt-28 relative z-10">
        <h1 className="text-[56px] font-semibold text-white text-center font-['Gilroy'] leading-none">
          One Hand for All Your Financial Help
        </h1>
        <p className="text-[18px] font-normal text-[#E6E6E6] text-center font-['Inter'] mt-6 leading-relaxed">
          One app, many goals - everything you need to manage money smartly, in one place.
        </p>
      </div>
      
      {/* Cards Container with Infinite Scroll Animation */}
      <div className="relative mt-16 overflow-hidden" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
        <div className="animate-scroll-seamless-cards gap-12">
        {/* Card 1 */}
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
                      <img
                        src="/FinancialPlan/debtmanagement.png"
                        alt="Investment Planning icon"
                        width={80}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">
                        Investment Planning
                      </h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">
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
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized tax-saving report
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment-linked deductions
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Capital gains advice
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
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
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Expense tracking & categorization
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly spending analysis
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Budget recommendations
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
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
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  {/* Stroke/Border Effect */}
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment tracking dashboard
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Health score of your portfolio
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Rebalancing tips
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
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
         <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
           <div className="card-flip-container">
             <div className="card-flip-inner">
               {/* Front of Card */}
               <div className="card-front">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-16 relative z-10">
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
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                     <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy']">
                       HERE'S WHAT YOU GET
                     </h2>
                     <div className="space-y-3 w-full">
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Personalized tax-saving report
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Investment-linked deductions
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Capital gains advice
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
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
         <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
           <div className="card-flip-container">
             <div className="card-flip-inner">
               {/* Front of Card */}
               <div className="card-front">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-16 relative z-10">
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
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                     <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy']">
                       HERE'S WHAT YOU GET
                     </h2>
                     <div className="space-y-3 w-full">
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Net worth snapshot
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Savings-to-expense ratio
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Risk exposure analysis
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
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
         <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
           <div className="card-flip-container">
             <div className="card-flip-inner">
               {/* Front of Card */}
               <div className="card-front">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-16 relative z-10">
                     <div className="w-[80px] h-[100px] relative mt-4">
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
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                     <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy']">
                       HERE'S WHAT YOU GET
                     </h2>
                     <div className="space-y-3 w-full">
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Income-expense allocation plan
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Dynamic budgeting tracker
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Realistic savings goals
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
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
         <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
           <div className="card-flip-container">
             <div className="card-flip-inner">
               {/* Front of Card */}
               <div className="card-front">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-16 relative z-10">
                     <div className="w-[80px] h-[100px] relative mt-4">
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
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                     <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy']">
                       HERE'S WHAT YOU GET
                     </h2>
                     <div className="space-y-3 w-full">
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Personalized debt repayment roadmap
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Refinance suggestions to reduce EMI burden
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Consolidation options for multiple loans
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
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
         <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
           <div className="card-flip-container">
             <div className="card-flip-inner">
               {/* Front of Card */}
               <div className="card-front">
                 <div 
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-16 relative z-10">
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
                   className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                   }}
                 >
                   {/* Stroke/Border Effect */}
                   <div 
                     className="absolute inset-0 rounded-[56px] pointer-events-none"
                     style={{
                       background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                       padding: '2px',
                       mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                       maskComposite: 'xor',
                       WebkitMaskComposite: 'xor'
                     }}
                   />
                   
                   <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                     <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy']">
                       HERE'S WHAT YOU GET
                     </h2>
                     <div className="space-y-3 w-full">
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Personalized emergency fund target
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Savings options for liquidity
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                           Monthly reminders to build the corpus
                         </p>
                       </div>
                       <div className="flex items-start space-x-3">
                         <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                         <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
                      <img src="/FinancialPlan/debtmanagement.png" alt="Investment Planning icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Investment Planning</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Align your investment with your time horizon and risk appetite.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Risk assessment test
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Asset allocation strategy
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Suggested mutual funds/ETFs
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Periodic rebalancing reminders
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
                      <img src="/FinancialPlan/expensemanagement.png" alt="Expense Management icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Expense Management</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Gain clarity on where your money goes every month.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Smart categorization of expenses
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Expense-saving tips
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly budget deviation alerts
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Spending summary dashboard
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
                      <img src="/FinancialPlan/personalbudget.png" alt="Portfolio Management icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Portfolio Management</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Track, optimize, and enhance your overall investment performance.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment tracking dashboard
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Health score of your portfolio
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Rebalancing tips
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Alerts on overexposure or underperformance
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-1">
                      <img src="/FinancialPlan/Tax1Consultancy.png" alt="Tax consultancy icon" width={180} height={220} className="object-contain scale-150" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Tax Consultancy</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Expert help in planning your taxes and maximizing exemptions.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized tax-saving report
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment-linked deductions
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Capital gains advice
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Year-end tax planning session
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-1">
                      <img src="/FinancialPlan/Financialhealth.png" alt="Financial health checkup icon" width={180} height={220} className="object-contain scale-150" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Financial Health Checkup</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">A complete diagnostic of your current financial condition.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Net worth snapshot
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Savings-to-expense ratio
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Risk exposure analysis
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Report with expert suggestions
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
                      <img src="/FinancialPlan/personalbudget.png" alt="Personalized budgeting plan icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Personalized Budgeting Plan</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">A custom budget, created around your income, lifestyle, and future goals.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Income-expense allocation plan
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Dynamic budgeting tracker
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Realistic savings goals
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly report card
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
                      <img src="/FinancialPlan/debtmanagement.png" alt="Debt management and refinancing icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Debt Management & Refinancing</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Pay off your liabilities smarter with expert-backed strategies tailored for your financial health.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized debt repayment roadmap
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Refinance suggestions to reduce EMI burden
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Consolidation options for multiple loans
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly progress tracking
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-2">
                      <img src="/FinancialPlan/Emergency1FundSetup.png" alt="Emergency fund setup and guidance icon" width={180} height={220} className="object-contain scale-150" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Emergency Fund Setup & Guidance</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Build a reliable financial cushion for emergencies, job loss, or medical needs.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized emergency fund target
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Savings options for liquidity
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly reminders to build the corpus
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Guidance on fund placement (FDs, liquid funds)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
                      <img src="/FinancialPlan/debtmanagement.png" alt="Investment Planning icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Investment Planning</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Align your investment with your time horizon and risk appetite.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Risk assessment test
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Asset allocation strategy
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Suggested mutual funds/ETFs
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Periodic rebalancing reminders
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
                      <img src="/FinancialPlan/expensemanagement.png" alt="Expense Management icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Expense Management</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Gain clarity on where your money goes every month.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Smart categorization of expenses
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Expense-saving tips
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly budget deviation alerts
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Spending summary dashboard
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
                      <img src="/FinancialPlan/personalbudget.png" alt="Portfolio Management icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Portfolio Management</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Track, optimize, and enhance your overall investment performance.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment tracking dashboard
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Health score of your portfolio
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Rebalancing tips
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Alerts on overexposure or underperformance
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-1">
                      <img src="/FinancialPlan/Tax1Consultancy.png" alt="Tax consultancy icon" width={180} height={220} className="object-contain scale-150" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Tax Consultancy</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Expert help in planning your taxes and maximizing exemptions.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized tax-saving report
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Investment-linked deductions
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Capital gains advice
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Year-end tax planning session
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-1">
                      <img src="/FinancialPlan/Financialhealth.png" alt="Financial health checkup icon" width={180} height={220} className="object-contain scale-150" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Financial Health Checkup</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">A complete diagnostic of your current financial condition.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Net worth snapshot
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Savings-to-expense ratio
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Risk exposure analysis
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Report with expert suggestions
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
                      <img src="/FinancialPlan/personalbudget.png" alt="Personalized budgeting plan icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Personalized Budgeting Plan</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">A custom budget, created around your income, lifestyle, and future goals.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Income-expense allocation plan
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Dynamic budgeting tracker
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Realistic savings goals
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly report card
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4">
                      <img src="/FinancialPlan/debtmanagement.png" alt="Debt management and refinancing icon" width={80} height={100} className="object-contain" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Debt Management & Refinancing</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Pay off your liabilities smarter with expert-backed strategies tailored for your financial health.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized debt repayment roadmap
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Refinance suggestions to reduce EMI burden
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Consolidation options for multiple loans
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly progress tracking
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
        <div className="w-80 h-[425px] relative flex-shrink-0 cursor-pointer">
          <div className="card-flip-container">
            <div className="card-flip-inner">
              {/* Front of Card */}
              <div className="card-front">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-16 relative z-10">
                    <div className="w-[80px] h-[100px] relative mt-4 pl-1 pt-2">
                      <img src="/FinancialPlan/Emergency1FundSetup.png" alt="Emergency fund setup and guidance icon" width={180} height={220} className="object-contain scale-150" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-white text-[24px] font-semibold leading-tight font-['Gilroy']">Emergency Fund Setup & Guidance</h2>
                      <p className="text-[14px] font-thin leading-relaxed text-gray-300 font-['Gilroy']">Build a reliable financial cushion for emergencies, job loss, or medical needs.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="card-back">
                <div 
                  className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-[56px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                      padding: '2px',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'xor',
                      WebkitMaskComposite: 'xor'
                    }}
                  />
                  <div className="flex flex-col items-start space-y-6 relative z-10 mt-8">
                    <h2 className="text-white text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                      HERE'S WHAT YOU GET
                    </h2>
                    <div className="space-y-3 w-full">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Personalized emergency fund target
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Savings options for liquidity
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Monthly reminders to build the corpus
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                        <p className="text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                          Guidance on fund placement (FDs, liquid funds)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="text-white text-3xl font-light">Rs. 199</div>
                    <div className="w-10 h-10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
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
      <div className="flex items-center justify-center space-x-8 mt-16">
        {/* Create Your Custom Plan Button */}
        <button className="px-6 py-2 bg-white text-black font-medium text-[14px] font-['Gilroy'] rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
          Create Your Custom Plan
        </button>
        
        {/* Talk to Us Link */}
        <div className="flex items-center space-x-2 group cursor-pointer">
          <span className="text-white font-medium text-[16px] font-['Inter'] hover:text-gray-300 transition-colors duration-300">Talk to Us</span>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-white group-hover:translate-x-1 transition-transform duration-300"
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
      
      {/* Text Section */}
      <div className="text-center mt-32">
        <h2 className="text-[56px] font-semibold text-white font-['Gilroy'] leading-tight">
          Unsure About Your Needs?
        </h2>
        <h3 className="text-[56px] font-light text-white font-['Gilroy'] leading-tight mt-4">
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
      <div className="relative max-w-6xl w-full mt-16">
        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentCard((prev) => prev === 0 ? 2 : prev - 1)}
          className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 z-[100] w-12 h-12 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button 
          onClick={() => setCurrentCard((prev) => prev === 2 ? 0 : prev + 1)}
          className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 z-[100] w-12 h-12 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
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
                  <div id="f" key={cardIndex} className={`w-full flex-shrink-0 ${cardIndex === 1 || cardIndex === 2 ? 'flex justify-center' : ''}`}>
                    <div
                      className={`bg-transparent backdrop-blur-sm rounded-[56px] p-10 w-full flex items-stretch relative z-10 ${cardIndex === 1 || cardIndex === 2 ? 'max-w-4xl' : 'max-w-6xl'}`}
                      style={{
                        background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                      }}
                    >
                      {/* Stroke/Border Effect */}
                      <div 
                        className="absolute inset-0 rounded-[56px] pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 50%)',
                          padding: '2px',
                          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          maskComposite: 'xor',
                          WebkitMaskComposite: 'xor'
                        }}
                      />
                      
                      {/* Left Section */}
                      <div className="flex-1">
                        {/* Header */}
                        <div className="text-left mb-10">
                          <h1 className="text-[30px] font-semibold text-white mb-2 tracking-tight font-['Gilroy']">
                            {card.title}
                          </h1>
                          <p className="text-white/70 text-[12px] font-normal font-['Gilroy']">
                            {card.subtitle}
                          </p>
                        </div>

                        {/* Services Grid */}
                        <div className={`grid ${cardIndex === 1 ? 'grid-cols-4 grid-rows-2 gap-6' : cardIndex === 2 ? 'grid-cols-3 grid-rows-2 gap-4' : 'grid-cols-6 grid-rows-2 gap-6'}`}>
                          {card.services.map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center">
                              <div className="w-12 h-12 mb-3">
                                <img
                                  src={`/FinancialPlan/${item.img}`}
                                  alt={item.text}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <p
                                className="text-white text-xs font-semibold leading-tight"
                                style={{ fontFamily: "Gilroy, Inter, sans-serif", fontSize: "10px" }}
                              >
                                {item.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Section (Human + Circles) */}
                      <div className="flex flex-col items-center justify-center w-1/3 relative">
                        {/* 3 Circles - positioned at top right */}
                        <div className="absolute top-0 right-0 flex flex-col gap-3">
                          <div className="w-5 h-5 rounded-full bg-white"></div>
                          <div className="w-5 h-5 rounded-full bg-white"></div>
                          <div className="w-5 h-5 rounded-full bg-white"></div>
                        </div>
                        
                        {/* Human shape */}
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-white mb-4"></div>
                          <div className="w-20 h-28 rounded-3xl bg-white"></div>
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
        <div className="absolute inset-0 flex items-center justify-center space-x-8 -mt-36">
          {/* Book a Free Call Button */}
          <button className="px-6 py-2 bg-white text-black font-medium text-[14px] font-['Gilroy'] rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Book a Free Call
          </button>
          
          {/* Chat on WhatsApp Link */}
          <div className="flex items-center space-x-2 group cursor-pointer">
            <span className="text-white font-medium text-[16px] font-['Inter'] hover:text-gray-300 transition-colors duration-300">Chat on WhatsApp</span>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white group-hover:translate-x-1 transition-transform duration-300"
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
       <div className="w-full -mt-44 relative z-0">
         <img 
           src="/FinancialPlan/space.png" 
           alt="Space background" 
           className="w-full h-auto object-cover"
         />
         
         {/* Text and buttons overlay on space image */}
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pt-64">
           {/* Main heading */}
           <h1 className="text-white text-[56px] font-normal italic leading-tight mb-2 max-w-7xl font-['Inter']">
             EMI nahi SIP se achieve karo apne sapne.
           </h1>
           
           {/* Subtitle */}
           <p className="text-white/80 text-[18px] font-normal leading-relaxed mb-8 max-w-4xl font-['Inter']">
             EMIs often mean borrowing for things you can't afford yet, adding stress and interest. SIPs help you build wealth gradually, giving you control and peace of mind while you plan your dreams.
           </p>
           
           {/* Action buttons */}
           <div className="flex items-center justify-center space-x-8">
             {/* Start a SIP Button */}
             <button className="px-6 py-2 bg-white text-black font-medium text-[14px] font-['Gilroy'] rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
               Start a SIP
             </button>
             
             {/* Read More Link */}
             <div className="flex items-center space-x-2 group cursor-pointer">
               <span className="text-white font-medium text-[16px] font-['Inter'] hover:text-gray-300 transition-colors duration-300">Read More</span>
               <svg 
                 width="20" 
                 height="20" 
                 viewBox="0 0 24 24" 
                 fill="none" 
                 className="text-white group-hover:translate-x-1 transition-transform duration-300"
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
  );
};

export default FinancialPlanInterface;