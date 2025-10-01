"use client";

import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full bg-[#F7F7F7] relative overflow-hidden">
      {/* Background Gradients */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: 'url(/gradient/gradient.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom 0% center',
          backgroundRepeat: 'no-repeat',
          opacity: 1,
          transform: 'translateY(-40px)'
        }}
      ></div>
      
      <div 
        className="absolute -left-20 -bottom-40 w-1/3 h-1/2 pointer-events-none z-40 hidden md:block"
        style={{
          backgroundImage: 'url(/gradient/gradient.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'left bottom',
          backgroundRepeat: 'no-repeat',
          opacity: 0.7
        }}
      ></div>
      
      <div 
        className="absolute -right-20 -bottom-40 w-1/3 h-1/2 pointer-events-none z-40 hidden md:block"
        style={{
          backgroundImage: 'url(/gradient/gradient.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'right bottom',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3
        }}
      ></div>
      
      {/* Main Content Container */}
      <div className="relative z-30 flex flex-col px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 pt-16 pb-16 sm:pt-20 sm:pb-20 md:pt-24 md:pb-24 lg:pt-28 lg:pb-28 xl:pt-32 xl:pb-32 2xl:pt-36 2xl:pb-36">
        
        {/* Hero Text Content */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <div className="space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4 xl:space-y-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-black font-gilroy leading-tight">
              Wealth Shouldn't Be a Privilege
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light text-black font-gilroy leading-tight">
              It Should Be a Possibility For All
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 font-inter font-normal max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-2 sm:px-4">
              We're on a mission to make smart investing accessible, understandable,
              <br className="hidden sm:block" />
              and achievable - no matter your income, background, or experience.
            </p>
          </div>
        </div>
        
        {/* People Icons with continuous horizontal scrolling animation */}
        <div className="w-full overflow-hidden mb-6 sm:mb-8 md:mb-12 lg:mb-12">
          <div className="animate-scroll-seamless">
            <img 
              src="/Heropage/diverse-people.png" 
              alt="Diverse people icons" 
              className="h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px] xl:h-[140px] 2xl:h-[160px] opacity-80 object-contain"
            />
            <img 
              src="/Heropage/diverse-people.png" 
              alt="Diverse people icons" 
              className="h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px] xl:h-[140px] 2xl:h-[160px] opacity-80 object-contain"
            />
            <img 
              src="/Heropage/diverse-people.png" 
              alt="Diverse people icons" 
              className="h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px] xl:h-[140px] 2xl:h-[160px] opacity-80 object-contain"
            />
          </div>
        </div>
        
        {/* Feature Highlights and CTA Button */}
        <div className="text-center">
          <div className="max-w-4xl mx-auto">
            {/* Three Feature Highlights */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-2 md:space-x-4 lg:space-x-6 xl:space-x-8 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <img src="/Heropage/sebi.png" alt="SEBI" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                <span className="text-black font-gilroy font-light text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">SEBI-registered</span>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2">
                <img src="/Heropage/bank.png" alt="Security" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                <span className="text-black font-gilroy font-light text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">Bank-grade security</span>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2">
                <img src="/Heropage/transplant.png" alt="Fees" className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                <span className="text-black font-gilroy font-light text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">Transparent fees</span>
              </div>
            </div>
            
            {/* Start Investing Now Button */}
            <div className="flex justify-center">
              <button className="bg-black text-white px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-2 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 rounded-full font-gilroy font-medium flex items-center space-x-1 sm:space-x-2 hover:bg-gray-800 transition-colors text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                <span>Start Investing Now</span>
                <svg className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
      </div>

      {/* Custom CSS for seamless horizontal scrolling animation */}
      <style jsx>{`
        .animate-scroll-seamless {
          display: flex;
          animation: scroll-seamless 50s linear infinite;
          width: max-content;
        }
        
        @keyframes scroll-seamless {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-scroll-seamless img {
          display: block;
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;