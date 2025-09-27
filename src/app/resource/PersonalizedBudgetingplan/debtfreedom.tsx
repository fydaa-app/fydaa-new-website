import React from 'react';

const DebtFreedom: React.FC = () => {
  return (
    <div className="w-full bg-[#ffffff] -mt-48">
      {/* Top Section - White Background */}
      <section className="bg-[#ffffff] text-black py-44 px-12 relative z-10 rounded-t-[56px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between gap-16">
            {/* Left Side - Content */}
            <div className="flex-1 max-w-[650px]">
              <h1 className="text-[48px] font-['Gilroy'] font-bold leading-tight mb-16 ml-8">
              How Fydaa Creates Your Perfect Budget
              </h1>
              
              
              {/* Numbered Feature List */}
              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    1
                  </div>
                  <div>
                    <h3 className="text-[20px] font-['Inter'] font-regular mb-3">Understand Your Lifestyle</h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">Income, expenses, habits, and goals.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    2
                  </div>
                  <div>
                    <h3 className="text-[20px] font-['Inter'] font-regular mb-3">Set Realistic Targets</h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">Savings, investments, and spending.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    3
                  </div>
                  <div>
                    <h3 className="text-[20px] font-['Inter'] font-regular mb-3">Allocate Smartly</h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">Essentials, wants, and future funds.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    4
                  </div>
                  <div>
                    <h3 className="text-[20px] font-['Inter'] font-regular mb-3">Automate Savings</h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">Never Miss An EMI And Protect Your Credit Score.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    5
                  </div>
                  <div>
                    <h3 className="text-[20px] font-['Inter'] font-regular mb-3">Monitor & Improve</h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">Adjust as your life and goals change.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Placeholder */}
            <div className="flex-1 flex justify-end mt-12">
              <div className="w-96 h-[700px] bg-gray-100 rounded-3xl flex items-center justify-center shadow-lg">
                <div className="text-center text-gray-500">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xl font-medium">Mobile App</p>
                  <p className="text-base text-gray-400">Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom Section - Light Background */}
              <section className="bg-white text-black py-12 pb-24 px-12 relative">

        
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[44px] font-['Gilroy'] font-bold text-center mb-20 leading-tight">
          A budget isn’t about limits, it’s about freedom
          </h2>
          
          {/* Four Feature Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Top Left */}
            <div className="text-center">
                              <div className="flex justify-center mx-auto mb-3">
                  <img src="/resource/lowcost.png" alt="Lower Interest" className="w-24 h-24" />
                </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">Stay on Track</h3>
              <p className="text-[18px] font-['Inter'] font-normal text-gray-600">Clear direction for your money</p>
            </div>
            
            {/* Top Right */}
            <div className="text-center">
                              <div className="flex justify-center mx-auto mb-3">
                  <img src="/resource/finance.png" alt="Simplified Finances" className="w-24 h-24" />
                </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">Achieve Goals Faster</h3>
              <p className="text-gray-600 text-lg">From vacations to a new home, get there sooner</p>
            </div>
            
            {/* Bottom Left */}
            <div className="text-center">
              <div className="flex justify-center mx-auto mb-3">
                <img src="/resource/creditscore.png" alt="Better Credit Score" className="w-28 h-24" />
              </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">Avoid Debt Traps</h3>
              <p className="text-gray-600 text-lg">Spend within your means</p>
            </div>
            
            {/* Bottom Right */}
            <div className="text-center">
              <div className="flex justify-center mx-auto mb-3">
              <img src="/resource/stress.png" alt="Less Stress" className="w-24 h-24" />
              </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">Feel in Control</h3>
              <p className="text-gray-600 text-lg">Know where every rupee is going</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Gradient Border - Full viewport width */}
      <div className="w-screen -mb-8 -mx-[50vw] left-1/2 relative z-0">
        <img 
          src="/resource/gradientborder.png" 
          alt="Gradient Border" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default DebtFreedom