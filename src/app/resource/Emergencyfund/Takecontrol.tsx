
"use client";
import React from "react";

const TakeControl: React.FC = () => {
  return (
    <section className="relative py-12 lg:py-32 px-0 mx-0">
      <div className="w-full mx-0 px-0 relative">
        <div className="text-left mt-6 lg:mt-16 mx-0 px-0">
          {/* Left Content */}
          <div className="space-y-6 relative z-20 mx-0 px-0">
            {/* Remove the justify-between wrapper */}
            <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 items-start">
              {/* Text Content */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold text-gray-900 pl-4 sm:pl-6 md:pl-8 lg:pl-10 xl:pl-12 2xl:pl-16 3xl:pl-20 leading-tight font-gilroy pr-[10px]">
                                      Protect What Matters Most, <br />
                    Plan Your Insurance the Smart Way

                </h1>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl 3xl:text-3xl text-gray-700 pl-4 sm:pl-6 md:pl-8 lg:pl-10 xl:pl-12 2xl:pl-16 3xl:pl-20 leading-relaxed font-inter mt-2 sm:mt-3 md:mt-4 lg:mt-5 xl:mt-6 2xl:mt-8 3xl:mt-10 pr-[10px]">
                  Life is unpredictable, but your family's financial security
                    doesn't have to be. Fydaa helps <br />
                    you choose the right insurance cover for your needs, so you
                    can protect your health, <br />
                    income, and future.
                </p>

                <button
                  onClick={() => window.open("https://cal.com/fydaa-backend-zr5zm3/30min", "_blank")}
                  className="bg-black text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-medium cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-sm text-xs sm:text-sm md:text-base ml-4 sm:ml-6 md:ml-8 lg:ml-10 xl:ml-12 2xl:ml-16 3xl:ml-20 mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8 2xl:mt-10 3xl:mt-12"
                >
                  Book a Free Call
                </button>
              </div>

              {/* Image - Now properly aligned to right and top */}
              <div className="flex-shrink-0 lg:-mt-[150px] mx-auto lg:mx-0">
                <img
                  src="/resource/Emergencyfund/icon.png"
                  alt="DebtManagement"
                  className="lg:p-8 xl:p-10 2xl:p-12 w-full max-w-md h-[150px] lg:h-auto"
                />
              </div>
            </div>

            {/* Gradient - Keep absolute positioning */}
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

export default TakeControl;



