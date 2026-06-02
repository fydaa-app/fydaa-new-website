"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import RegisterCvModal from "./RegisterCvModal";

const PageDivider: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [registerCvOpen, setRegisterCvOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setTimeout(() => setContentVisible(true), 300);
          } else {
            setIsVisible(false);
            setContentVisible(false);
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
    <>
      <RegisterCvModal open={registerCvOpen} onClose={() => setRegisterCvOpen(false)} />
    <div
      ref={containerRef}
      className={`relative z-30 mb-0 mt-0 flex min-h-[220px] w-full shrink-0 transform items-center justify-start overflow-hidden rounded-[15px] bg-[#000000] px-4 py-4 transition-all duration-1000 ease-out sm:min-h-[240px] sm:rounded-[20px] sm:px-6 sm:py-5 md:min-h-[250px] md:rounded-[25px] md:px-8 md:py-5 lg:rounded-[30px] lg:px-10 lg:py-6 xl:rounded-[35px] xl:px-12 xl:py-6 2xl:rounded-[40px] 2xl:px-16 2xl:py-7 ${
        isVisible
          ? "opacity-100 scale-100 rotate-0 blur-0"
          : "opacity-0 scale-75 rotate-12 blur-sm"
      }`}
      style={{
        transformOrigin: "center center",
        filter: isVisible ? "none" : "blur(8px)",
        boxShadow: isVisible
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
          : "0 0 0 0 rgba(0, 0, 0, 0)",
      }}
    >
      <img
        src="/careers/carrergradient.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      <div
        className={`absolute inset-0 rounded-[15px] transition-all duration-1000 ease-out sm:rounded-[56px] md:rounded-[56px] lg:rounded-[56px] xl:rounded-[56px] 2xl:rounded-[56px] ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
          animation: isVisible ? "shimmer 2s ease-in-out infinite" : "none",
        }}
      />

      <div className="relative z-10 w-full min-w-0">
        <div
          className={`w-full min-w-0 transition-all duration-700 ease-out ${
            contentVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex w-full flex-col gap-4 text-left sm:gap-5 md:flex-row md:items-start md:justify-between md:gap-6 lg:gap-8 xl:gap-10">
            <div className="min-w-0 flex-1 space-y-2 sm:space-y-3 ml-2 xs:ml-4 sm:ml-6 md:ml-10 lg:ml-14 xl:ml-20 2xl:ml-24">
              <h2 className="font-gilroy text-[22px] font-semibold leading-tight tracking-tight text-white xs:text-[24px] sm:text-[30px] md:text-[34px] lg:text-[42px] xl:text-[48px]">
                Don&apos;t See The Right Role Yet?
              </h2>
              <p className="max-w-2xl font-inter text-[14px] font-normal leading-relaxed text-white/90 sm:text-[15px] md:text-[16px]">
                Register your profile and we&apos;ll match you with opportunities as
                they arise.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRegisterCvOpen(true)}
              className="inline-flex h-9 w-full shrink-0 items-center justify-center gap-1 rounded-[20px] bg-white px-3 font-gilroy text-[13px] font-medium leading-none text-black transition-colors hover:bg-neutral-100 sm:h-[34px] sm:w-[167px] sm:gap-1.5 sm:self-start sm:text-[14px] md:mt-auto md:w-[167px] md:self-end md:translate-y-1 lg:mr-6 lg:translate-y-2 xl:mr-10 2xl:mr-14 2xl:translate-y-3"
            >
              Register Your CV
              <ArrowRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
    </>
  );
};

export default PageDivider;
