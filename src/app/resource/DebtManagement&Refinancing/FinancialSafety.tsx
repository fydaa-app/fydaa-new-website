import React from 'react';

const FinancialSafety: React.FC = () => {
  return (
    <section className="bg-[#101828] py-12 px-6 relative">
      {/* Background Blur Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm"></div>
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="bg-[#4D4D4D]/10 backdrop-blur-md rounded-[15px] p-10 border border-gray-700/50 shadow-xl">
          <div className="grid grid-cols-[1fr_auto] gap-4">
            {/* Left Side - Text and Features */}
            <div>
              {/* Top Slogan */}
              <div className="text-green-400 text-[32px] font-['Gilroy'] font-semibold mb-6">
                Your money is 100% Safe and Secure..!
              </div>
              
              {/* Main Headings */}
              <div className="space-y-2 mb-10">
                <h2 className="text-[64px] font-['Cirak'] font-normal text-white leading-tight">
                  Built for Bharat.
                </h2>
                <h3 className="text-[64px] font-['Cirak'] font-normal text-white leading-tight">
                  Backed by Transparency.
                </h3>
              </div>
              
              {/* Feature Boxes Section */}
              <div className="w-full">
                <div className="rounded-xl py-6 px-6 border border-gray-700 bg-[#2A2A2A]/30 backdrop-blur-md">
                  <div className="flex justify-between items-center">
                    <div className="text-white text-center flex-1">
                                        <p className="font-['Gilroy'] font-normal text-[16px]">
                    SEBI-Registered,<br />Zero Commission
                  </p>
                    </div>
                    <div className="w-px h-12 bg-gray-600 mx-6"></div>
                                      <div className="text-white text-center flex-1">
                    <p className="font-['Gilroy'] font-normal text-[16px]">
                      Money stays in your<br />name, with top AMCs
                    </p>
                  </div>
                    <div className="w-px h-12 bg-gray-600 mx-6"></div>
                                      <div className="text-white text-center flex-1">
                    <p className="font-['Gilroy'] font-normal text-[16px]">
                      Data encrypted,<br />2FA enabled
                    </p>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Logo Only */}
            <div className="flex items-center justify-start pl-4">
              <div className="w-72 h-72 flex items-center justify-center">
                <img 
                  src="/resource/rupee.png" 
                  alt="Rupee Symbol" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialSafety;