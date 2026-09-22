"use client";

import React, { useState, useEffect, useRef } from "react";

const STATS = [
  { value: "70%", label: "Rely on unverified advice or random app" },
  { value: "92%", label: "Millennials say they want to invest but don't know how" },
  { value: "27%", label: "Financial literacy rate in India" },
  { value: "3%", label: "Indians invest in mutual funds" },
];

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
            setTimeout(() => setStatsVisible(true), 300);
          } else {
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
      className={`relative z-30 mb-8 mt-0 flex w-full items-center justify-center overflow-hidden rounded-[15px] bg-jade px-4 py-6 font-inter transition-all duration-1000 ease-out sm:mb-12 sm:rounded-[20px] sm:px-6 sm:py-8 md:mb-16 md:rounded-[25px] md:px-8 md:py-10 lg:mb-20 lg:rounded-[30px] lg:px-10 lg:py-12 xl:mb-24 xl:rounded-[35px] xl:px-12 xl:py-14 2xl:mb-28 2xl:rounded-[40px] 2xl:px-16 2xl:py-16 ${
        isVisible ? "scale-100 rotate-0 opacity-100 blur-0" : "scale-75 rotate-12 opacity-0 blur-sm"
      }`}
      style={{
        transformOrigin: "center center",
        filter: isVisible ? "none" : "blur(8px)",
      }}
    >
      <div className="w-full">
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-4 lg:gap-10 xl:gap-12 2xl:gap-16 transition-all duration-700 ease-out ${
            statsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {STATS.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="mb-2 text-[20px] font-extrabold leading-tight tracking-[-0.03em] text-white sm:mb-3 sm:text-[24px] md:mb-4 md:text-[28px] lg:mb-5 lg:text-[32px] xl:mb-6 xl:text-[40px] 2xl:mb-8 2xl:text-[48px]">
                {stat.value}
              </div>
              <p className="mx-auto max-w-[140px] text-[10px] font-normal leading-tight text-white/70 sm:max-w-[160px] sm:text-[11px] md:max-w-[180px] md:text-[12px] lg:max-w-[200px] lg:text-[13px] xl:max-w-[220px] xl:text-[14px] 2xl:max-w-[240px] 2xl:text-[15px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageDivider;
