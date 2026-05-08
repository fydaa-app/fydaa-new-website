import React from "react";
import FyiapProgramBoxes from "./FyiapProgramBoxes";

export default function CareerHeroCard() {
  return (
    <section className="w-full">
      <div className="w-full">
        <div className="relative bg-black text-white rounded-b-[46px] shadow-[0_16px_50px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="pointer-events-none select-none absolute left-0 top-[45%] w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 rotate-[60deg] z-20">
            <img
              src="/gradient/gradient.png"
              alt=""
              aria-hidden
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="pointer-events-none select-none absolute right-0 top-[170px] w-[1100px] h-[1100px] translate-x-1/2 rotate-[-30deg] z-20">
            <img
              src="/gradient/gradient.png"
              alt=""
              aria-hidden
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="relative z-10 px-6 sm:px-10 text-center pt-24 sm:pt-28 md:pt-40 pb-14 sm:pb-16">
            <h1
              className="font-gilroy text-center tracking-normal text-white mx-auto max-w-[56rem] md:max-w-none whitespace-normal md:whitespace-nowrap text-3xl leading-[2.375rem] sm:text-4xl sm:leading-[2.875rem] md:text-[2.75rem] md:leading-[3.375rem] lg:text-[56px] lg:leading-[68px] [-webkit-text-stroke:1px_rgb(0,0,0)] [paint-order:stroke_fill]"
            >
              <span className="font-light">Build The Future Of </span>
              <span className="font-semibold">Wealth</span>
              <span className="font-light"> For Every Indian</span>
            </h1>

            <p
              className="font-inter font-normal text-[18px] leading-[24.8px] text-center text-[#E6E6E6] max-w-3xl mx-auto mt-6 sm:mt-8 md:mt-10 tracking-[-0.36px]"
            >
              Join a SEBI-registered fintech, making smart investing accessible
              to millions - regardless of income or background.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-10">
              <div className="flex flex-col items-center text-center gap-1.5">
                <span className="font-gilroy font-thin text-4xl sm:text-5xl md:text-[3.25rem] leading-none text-white">
                  8+
                </span>
                <span className="font-inter font-normal text-sm sm:text-base text-white">
                  Open Roles
                </span>
              </div>

              <div className="flex flex-col items-center text-center gap-1.5">
                <span className="font-gilroy font-thin text-4xl sm:text-5xl md:text-[3.25rem] leading-none text-white">
                  SEBI
                </span>
                <span className="font-gilroy font-medium text-sm sm:text-base text-white leading-snug max-w-[12rem]">
                  Registered &amp; Regulated
                </span>
              </div>

              <div className="flex flex-col items-center text-center gap-1.5">
                <span className="font-gilroy font-thin text-4xl sm:text-5xl md:text-[3.25rem] leading-none text-white">
                  20yrs
                </span>
                <span className="font-gilroy font-medium text-sm sm:text-base text-white">
                  Industry Experience
                </span>
              </div>
            </div>

            <div className="mt-6 md:mt-16">
              <FyiapProgramBoxes />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
