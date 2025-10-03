'use client'
import React, { useState, useEffect, useRef } from 'react';

const PageDivider: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            
            // Stagger the stats animation
            setTimeout(() => setStatsVisible(true), 300);
          } else {
            // Reset when out of view to trigger animation again
            setIsVisible(false);
            setStatsVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`w-full bg-[#000000] rounded-[15px] sm:rounded-[20px] md:rounded-[25px] lg:rounded-[30px] xl:rounded-[35px] 2xl:rounded-[40px] flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 relative z-30 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-14 2xl:py-16 mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24 2xl:mb-28 mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28 overflow-hidden transition-all duration-1000 ease-out transform ${
        isVisible 
          ? 'opacity-100 scale-100 rotate-0 blur-0' 
          : 'opacity-0 scale-75 rotate-12 blur-sm'
      }`}
      style={{
        transformOrigin: 'center center',
        filter: isVisible ? 'none' : 'blur(8px)',
        boxShadow: isVisible 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)' 
          : '0 0 0 0 rgba(0, 0, 0, 0)'
      }}
    >
      {/* Animated border glow effect */}
      <div 
        className={`absolute inset-0 rounded-[15px] sm:rounded-[20px] md:rounded-[25px] lg:rounded-[30px] xl:rounded-[35px] 2xl:rounded-[40px] transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100' 
            : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: isVisible ? 'shimmer 2s ease-in-out infinite' : 'none'
        }}
      />
      
      <div className="w-full">
        {/* Statistics Grid with staggered animation */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 transition-all duration-700 ease-out transform ${
          statsVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          {/* First Stat */}
          <div className="text-center">
            <div className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[40px] 2xl:text-[48px] font-thin text-white mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-8 leading-tight">70%</div>
            <p className="text-white text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] font-inter font-normal leading-tight max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px] 2xl:max-w-[240px] mx-auto">
              70% rely on unverified advice or random app
            </p>
          </div>

          {/* Second Stat */}
          <div className="text-center">
            <div className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[40px] 2xl:text-[48px] font-thin text-white mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-8 leading-tight">92%</div>
            <p className="text-white text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] font-inter font-normal leading-tight max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px] 2xl:max-w-[240px] mx-auto">
              92% of millennials say they want to invest but don't know how
            </p>
          </div>

          {/* Third Stat */}
          <div className="text-center">
            <div className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[40px] 2xl:text-[48px] font-thin text-white mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-8 leading-tight">27%</div>
            <p className="text-white text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] font-inter font-normal leading-tight max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px] 2xl:max-w-[240px] mx-auto">
              Financial literacy rate in India is 27% and the global avg: 35%
            </p>
          </div>

          {/* Fourth Stat */}
          <div className="text-center">
            <div className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[40px] 2xl:text-[48px] font-thin text-white mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-8 leading-tight">3%</div>
            <p className="text-white text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] font-inter font-normal leading-tight max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px] 2xl:max-w-[240px] mx-auto">
              Only 3% of Indians invest in mutual funds
            </p>
          </div>
        </div>
      </div>
      
      {/* CSS Keyframes for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default PageDivider;
