"use client";

import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full min-h-screen bg-[#F7F7F7] relative overflow-hidden">
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
      <div className="relative z-30 flex flex-col justify-center min-h-screen px-4 py-8 sm:py-20 md:py-24 lg:py-28">
        
        {/* Hero Text Content */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-16">
          <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-black font-gilroy leading-tight">
              Wealth Shouldn't Be a Privilege
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black font-gilroy leading-tight">
              It Should Be a Possibility For All
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-lg text-gray-600 font-inter font-normal max-w-2xl mx-auto px-2">
              We're on a mission to make smart investing accessible, understandable,
              <br className="hidden sm:block" />
              and achievable - no matter your income, background, or experience.
            </p>
          </div>
        </div>
        
        {/* People Icons with continuous horizontal scrolling animation */}
        <div className="w-full overflow-hidden mb-8 sm:mb-12 md:mb-16 lg:mb-12">
          <div className="animate-scroll-seamless">
            <img 
              src="/Heropage/diverse-people.png" 
              alt="Diverse people icons" 
              className="h-[80px] sm:h-[100px] md:h-[120px] lg:h-[160px] xl:h-[160px] opacity-80 object-contain"
            />
            <img 
              src="/Heropage/diverse-people.png" 
              alt="Diverse people icons" 
              className="h-[80px] sm:h-[100px] md:h-[120px] lg:h-[160px] xl:h-[160px] opacity-80 object-contain"
            />
            <img 
              src="/Heropage/diverse-people.png" 
              alt="Diverse people icons" 
              className="h-[80px] sm:h-[100px] md:h-[120px] lg:h-[160px] xl:h-[160px] opacity-80 object-contain"
            />
          </div>
        </div>
        
        {/* Feature Highlights and CTA Button */}
        <div className="text-center">
          <div className="max-w-4xl mx-auto">
            {/* Three Feature Highlights */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-6 lg:space-x-8 mb-4 sm:mb-6 md:mb-8">
              <div className="flex items-center space-x-2">
                <img src="/Heropage/sebi.png" alt="SEBI" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="text-black font-gilroy font-light text-xs sm:text-sm md:text-base lg:text-lg">SEBI-registered</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <img src="/Heropage/bank.png" alt="Security" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="text-black font-gilroy font-light text-xs sm:text-sm md:text-base lg:text-lg">Bank-grade security</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <img src="/Heropage/transplant.png" alt="Fees" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="text-black font-gilroy font-light text-xs sm:text-sm md:text-base lg:text-lg">Transparent fees</span>
              </div>
            </div>
            
            {/* Start Investing Now Button */}
            <div className="flex justify-center">
              <button className="bg-black text-white px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-3 rounded-full font-gilroy font-medium flex items-center space-x-2 hover:bg-gray-800 transition-colors text-xs sm:text-sm md:text-base">
                <span>Start Investing Now</span>
                <svg className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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