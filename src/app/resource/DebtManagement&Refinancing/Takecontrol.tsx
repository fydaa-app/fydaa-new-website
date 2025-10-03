import React from 'react';

const TakeControl: React.FC = () => {
  return (
    <main className="w-full h-full m-0 p-0 relative">
      {/* Top Section - Light Background */}
      <section className="relative py-32 px-0 mx-0">
        <div className="w-full mx-0 px-0 relative">

           <div className="text-left mt-16 mx-0 px-0">
            {/* Left Content */}
            <div className="space-y-6 relative z-20 mx-0 px-0">
              <div className="flex justify-between items-start mx-0 px-0">
                <div className="flex-1 relative z-30 mx-0 px-0">
                  <h1 className="text-6xl font-bold text-gray-900 pl-[50px] leading-tight font-gilroy">
                    Take Control of Your Debt, <br /> Regain Your Peace of Mind
                  </h1>
                  <p className="text-lg text-gray-700 pl-[50px] leading-relaxed font-inter">
                    Struggling with EMIs, credit card dues, or multiple loans?
                    You're not alone. Fydaa helps you <br />
                    simplify your repayments, lower your interest rates, and get
                    your finances back on track, <br />
                    so you can breathe easy again.
                  </p>
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
            
            {/* Blue circle image - positioned below content */}
            {/* Width options: w-full, w-screen, w-[800px], w-[1000px], w-[1200px], w-[1400px], w-[1600px] */}
            {/* Height options: h-auto, h-[200px], h-[300px], h-[400px], h-[500px], h-[600px], h-[800px], h-[1000px] */}
            <div className="mt-[200px] relative z-0 flex justify-center overflow-visible mx-0 px-0 w-full">
              <div className="relative overflow-visible w-full mx-0 px-0">
                <img
                  src="/resource/blue.png"
                  alt="Blue Circle"
                  className="w-full h-auto object-contain mx-0 px-0"
                />
                {/* Text overlay on blue circle */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-[100px] pb-[60px]">
                  <h2 className="text-[44px] font-bold text-white mb-[16px] leading-tight font-gilroy">
                    Make Your Debt Work for You, Not Against You
                  </h2>
                  <p className="text-[16px] text-gray-200 max-w-[1100px] leading-relaxed mb-[40px] font-inter">
                    Debt management and refinancing are not just about paying
                    off what you owe, they're about creating a repayment plan
                    that works for your lifestyle and future goals. At Fydaa, we
                    guide you through smart repayment strategies, consolidation
                    options, and refinancing deals so you save more and stress
                    less.
                  </p>
                  
                  {/* Video Placeholder */}
                  <div className="bg-gray-800 rounded-2xl p-[24px] shadow-2xl relative overflow-hidden w-[700px] mb-[30px]">
                    {/* Video Screen */}
                    <div className="bg-gray-700 rounded-xl h-[350px] flex items-center justify-center relative mb-[16px]">
                      {/* Play Button */}
                      <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                        <div className="w-0 h-0 border-l-[20px] border-l-blue-600 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                      </div>
                      
                      {/* Subtle Glow Effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-50"></div>
                    </div>
                    
                    {/* Video Controls */}
                    <div className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <button className="text-white hover:text-blue-400 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="text-white hover:text-blue-400 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button className="text-white hover:text-blue-400 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.533 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.372-.836 2.942-2.106 2.106-1.372a1.533 1.533 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="text-white hover:text-blue-400 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </main>
  );
};

export default TakeControl;
