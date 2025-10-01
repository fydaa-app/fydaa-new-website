import React from 'react';

const DebtFreedom: React.FC = () => {
  return (
    <div className="w-full bg-[#ffffff] -mt-48">
      {/* Top Section - White Background */}
      <section className="bg-[#ffffff] text-black py-40 px-12 relative z-10 rounded-t-[56px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between gap-16">
            {/* Left Side - Content */}
            <div className="flex-1 max-w-[650px]">
              <h1 className="text-[48px] font-['Gilroy'] font-bold leading-tight mb-16 ml-8">
                 Your 5-Step Path to the Right Insurance Plan
              </h1>
              
              
              {/* Numbered Feature List */}
              <div className="space-y-12">
                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    1
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-normal text-[20px]">Understand Your Needs</h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">Identify risks based on your family, lifestyle, and goals.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    2
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-normal text-[20px]">Choose the Right Cover</h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">Select between term, health, life, or asset insurance.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    3
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-normal text-[20px]">Decide the Coverage Amount</h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">Ensure it’s enough to handle emergencies.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    4
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-normal text-[20px]">Compare & Select</h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">We shortlist the best policies with competitive premiums.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="bg-white text-gray-700 w-[50px] h-[50px] rounded-full flex items-center justify-center font-['Inter'] font-semibold text-[22px] flex-shrink-0 mt-1 shadow-md">
                    5
                  </div>
                  <div>
                    <h3 className="font-['Inter'] font-normal text-[20px]">Review Annually</h3>
                    <p className="font-['Inter'] text-[16px] text-gray-600">Update coverage as your life and income change</p>
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
             Because your family’s future deserves more than luck 
          </h2>
          
          {/* Four Feature Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Top Left */}
            <div className="text-center">
                              <div className="flex justify-center mx-auto mb-3">
                  <img src="/resource/Emergencyfund/familysupport.png" alt="Lower Interest" className="w-24 h-24" />
                </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">Financial Protection</h3>
              <p className="text-[18px] font-['Inter'] font-normal text-gray-600">Ensure your loved ones are secure even in your absence</p>
            </div>
            
            {/* Top Right */}
            <div className="text-center">
                              <div className="flex justify-center mx-auto mb-3">
                  <img src="/resource/Emergencyfund/peace.png" alt="Simplified Finances" className="w-24 h-24" />
                </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">Peace of Mind</h3>
              <p className="text-gray-600 text-lg">Live life knowing you’re covered for emergencies</p>
            </div>
            
            {/* Bottom Left */}
            <div className="text-center">
              <div className="flex justify-center mx-auto mb-3">
                <img src="/resource/Emergencyfund/smart.png" alt="Better Credit Score" className="w-28 h-24" />
              </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">Smart Premiums</h3>
              <p className="text-gray-600 text-lg">Get maximum cover without overpaying</p>
            </div>
            
            {/* Bottom Right */}
            <div className="text-center">
              <div className="flex justify-center mx-auto mb-3">
              <img src="/resource/Emergencyfund/claim.png" alt="Less Stress" className="w-24 h-24" />
              </div>
              <h3 className="text-[32px] font-['Inter'] font-normal mb-3">Claim Assistance</h3>
              <p className="text-gray-600 text-lg">We help you navigate claims smoothly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Gradient Border - Full viewport width */}
      <div className="w-screen -mb-8 relative z-0" style={{ marginLeft: 'calc(-50vw + 50%)' }}>
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