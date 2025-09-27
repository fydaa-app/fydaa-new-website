import React from 'react';

const AdvisoryFydaa: React.FC = () => {
  return (
    <div className="w-full min-h-screen relative bg-white overflow-visible">
        {/* Left Top Gradient */}
        <img 
          src="/advisory/leftgradient.png" 
          alt="Left Gradient" 
          className="absolute -top-[45vh] -left-24  h-[100vh] object-cover z-10"
          style={{ objectPosition: 'top left' }}
        />
        
        {/* Right Top Gradient */}
        <img 
          src="/advisory/rightgradient.png" 
          alt="Right Gradient" 
          className="absolute -top-[45vh] -right-24  h-[100vh] object-cover z-10"
          style={{ objectPosition: 'top right' }}
        />
      
      <div className="w-full h-full flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-20 xl:px-24 relative z-20">
        {/* Header */}
        <div className="text-center mt-48 w-full mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold text-gray-900 leading-tight mb-6 sm:mb-8">
            Traditional Advisors vs Fydaa
          </h1>
          <p className="text-lg font-normal text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We're not here to throw jargon at you. We walk with you through every step.
          </p>
        </div>
        
        {/* Comparison Table */}
        <div className="w-full max-w-5xl mx-auto mb-20">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 xl:gap-12 items-center">
            {/* Left Column - Traditional Advisors */}
            <div className="text-right space-y-8 py-8">
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center justify-end">Not always SEBI-registered</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center justify-end">Often unclear fees or hidden commissions</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center justify-end">Generic advice or one-size-fits-all</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center justify-end">In-person, hard to reach, slow follow-up</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center justify-end">Manual reports, no app or real-time tracking</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center justify-end">May push products for commission</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center justify-end">High consultation fees or % of investments</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center justify-end">Old-school, intimidating language</p>
            </div>
            
            {/* Middle Column - Categories */}
            <div className="bg-black rounded-3xl px-12 py-8 text-center space-y-8 shadow-xl mx-auto">
              <div className="h-6 flex items-center justify-center">
                <h3 className="text-white font-semibold text-sm">Regulation</h3>
              </div>
              <div className="h-6 flex items-center justify-center">
                <h3 className="text-white font-semibold text-sm">Transparency</h3>
              </div>
              <div className="h-6 flex items-center justify-center">
                <h3 className="text-white font-semibold text-sm">Personalization</h3>
              </div>
              <div className="h-6 flex items-center justify-center">
                <h3 className="text-white font-semibold text-sm">Accessibility</h3>
              </div>
              <div className="h-6 flex items-center justify-center">
                <h3 className="text-white font-semibold text-sm">Technology</h3>
              </div>
              <div className="h-6 flex items-center justify-center">
                <h3 className="text-white font-semibold text-sm">Conflict of Interest</h3>
              </div>
              <div className="h-6 flex items-center justify-center">
                <h3 className="text-white font-semibold text-sm">Cost</h3>
              </div>
              <div className="h-6 flex items-center justify-center">
                <h3 className="text-white font-semibold text-sm">User Experience</h3>
              </div>
            </div>
            
            {/* Right Column - Fydaa */}
            <div className="text-left space-y-8 py-8">
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center">100% SEBI-registered advisors</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center">Flat ₹20 fee, no hidden commissions</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center">Plans tailored to your income, goals & risk profile</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center">Instant access via app, chat anytime</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center">App-first, automated tracking + human guidance</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center">No bias - we don't sell products</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center">Affordable ₹20 advice per session</p>
              <p className="text-gray-700 text-base font-normal leading-relaxed h-6 flex items-center">Friendly, simplified explanations for young investors</p>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden space-y-8">
            {/* Category Items */}
            <div className="space-y-6">
              {/* Regulation */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="bg-black rounded-2xl px-4 py-3 mb-4 text-center">
                  <h3 className="text-white font-semibold text-sm">Regulation</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">Traditional:</span> Not always SEBI-registered
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span> 100% SEBI-registered advisors
                  </div>
                </div>
              </div>

              {/* Transparency */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="bg-black rounded-2xl px-4 py-3 mb-4 text-center">
                  <h3 className="text-white font-semibold text-sm">Transparency</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">Traditional:</span> Often unclear fees or hidden commissions
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span> Flat ₹20 fee, no hidden commissions
                  </div>
                </div>
              </div>

              {/* Personalization */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="bg-black rounded-2xl px-4 py-3 mb-4 text-center">
                  <h3 className="text-white font-semibold text-sm">Personalization</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">Traditional:</span> Generic advice or one-size-fits-all
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span> Plans tailored to your income, goals & risk profile
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="bg-black rounded-2xl px-4 py-3 mb-4 text-center">
                  <h3 className="text-white font-semibold text-sm">Accessibility</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">Traditional:</span> In-person, hard to reach, slow follow-up
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span> Instant access via app, chat anytime
                  </div>
                </div>
              </div>

              {/* Technology */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="bg-black rounded-2xl px-4 py-3 mb-4 text-center">
                  <h3 className="text-white font-semibold text-sm">Technology</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">Traditional:</span> Manual reports, no app or real-time tracking
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span> App-first, automated tracking + human guidance
                  </div>
                </div>
              </div>

              {/* Conflict of Interest */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="bg-black rounded-2xl px-4 py-3 mb-4 text-center">
                  <h3 className="text-white font-semibold text-sm">Conflict of Interest</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">Traditional:</span> May push products for commission
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span> No bias - we don't sell products
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="bg-black rounded-2xl px-4 py-3 mb-4 text-center">
                  <h3 className="text-white font-semibold text-sm">Cost</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">Traditional:</span> High consultation fees or % of investments
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span> Affordable ₹20 advice per session
                  </div>
                </div>
              </div>

              {/* User Experience */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="bg-black rounded-2xl px-4 py-3 mb-4 text-center">
                  <h3 className="text-white font-semibold text-sm">User Experience</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium text-red-600">Traditional:</span> Old-school, intimidating language
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium text-green-600">Fydaa:</span> Friendly, simplified explanations for young investors
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