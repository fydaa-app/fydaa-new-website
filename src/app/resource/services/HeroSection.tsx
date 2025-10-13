"use client";
import React from "react";
import { ServiceData } from "@/data/services/types";

interface TakeControlProps {
  data: ServiceData["heroSection"];
}

const HeroSection: React.FC<TakeControlProps> = ({ data }) => {
  return (
    <section className="relative pt-[50px] pb-[10px] sm:pt-[70px] sm:pb-[20px] md:pt-[90px] md:pb-[50px] lg:pt-[110px] lg:pb-[80px] xl:pt-[130px] xl:pb-[100px] 2xl:pt-[120px] 2xl:pb-[30px] px-0 mx-0">
      <div className="w-full mx-0 px-0 relative">
        <div className="text-left mt-6 lg:mt-16 mx-0 px-0">
          <div className="space-y-6 relative z-20 mx-0 px-0">
            <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 items-start">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold text-gray-900 pl-4 sm:pl-6 md:pl-8 lg:pl-10 xl:pl-12 2xl:pl-16 3xl:pl-20 leading-tight font-gilroy pr-[10px]">
                  {data.title} <br /> {data.subtitle}
                </h1>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl 3xl:text-3xl text-gray-700 pl-4 sm:pl-6 md:pl-8 lg:pl-10 xl:pl-12 2xl:pl-16 3xl:pl-20 leading-relaxed font-inter mt-2 sm:mt-3 md:mt-4 lg:mt-5 xl:mt-6 2xl:mt-8 3xl:mt-10 pr-[10px]">
                  {data.description}
                </p>

                <button
                  onClick={() => window.open(data.ctaLink, "_blank")}
                  className="bg-black text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-medium cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-sm text-xs sm:text-sm md:text-base ml-4 sm:ml-6 md:ml-8 lg:ml-10 xl:ml-12 2xl:ml-16 3xl:ml-20 mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8 2xl:mt-10 3xl:mt-12"
                >
                  {data.ctaText}
                </button>
              </div>

              <div className="flex-shrink-0 lg:-mt-[150px] mx-auto lg:mx-0">
                <img
                  src={data.iconPath}
                  alt="Service Icon"
                  className="lg:p-8 xl:p-10 2xl:p-12 w-full max-w-md h-[150px] lg:h-auto"
                />
              </div>
            </div>

            <div className="absolute -top-[500px] -left-8 -right-8 -z-10 flex gap-0">
              <img
                src="/resource/gradient.png"
                alt="Gradient"
                className="h-screen w-1/2 object-cover opacity-60"
              />
              <img
                src="/resource/gradient.png"
                alt="Gradient"
                className="h-screen w-1/2 object-cover opacity-60"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
