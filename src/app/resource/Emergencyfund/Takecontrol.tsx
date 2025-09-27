import React from 'react';

const TakeControl: React.FC = () => {
  return (
    <main className="w-full h-full m-0 p-0 relative">
      {/* Top Section - Light Background */}
      <section className="relative py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto relative">

          <div className="text-left mt-16">
            {/* Left Content */}
            <div className="space-y-6 relative z-20">
              <div className="flex justify-between items-start">
                <div className="flex-1 relative z-30">
                  <h1 className="text-6xl font-bold text-gray-900 leading-tight font-gilroy">
                  Protect What Matters Most, <br />
                   Plan Your Insurance the Smart Way
                  </h1>
                  <p className="text-lg text-gray-700 leading-relaxed font-inter">
                  Life is unpredictable, but your family’s financial security doesn’t have to be. Fydaa helps <br />
                   you choose the right insurance cover for your needs, so you can protect your health, <br />
                    income, and future.
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
            <div className="mt-96 relative z-0 flex justify-center overflow-visible">
              <div className="relative overflow-visible">
                <img
                  src="/resource/oval.png"
                  alt="Blue Circle"
                  className="w-[8000px] h-[1000px] scale-150"
                />
                {/* Text overlay on blue circle */}
                <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-8 -pt-24">
                  <h2 className="text-5xl font-bold text-white mb-6 leading-tight font-gilroy">
                     Insurance Isn’t Just a Policy, It’s Peace of Mind
                  </h2>
                  <p className="text-lg text-gray-200 max-w-6xl leading-loose mb-12 font-inter">
                  Whether it’s life, health, term, or asset insurance, Fydaa ensures you get the right cover, the right premium, and the right claim process. We analyse your needs, compare the best options in the market, and guide you towards the most cost-effective, comprehensive protection.
                  </p>
                  
                  {/* Video Placeholder */}
                  <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden w-[776px]">
                    {/* Video Screen */}
                    <div className="bg-gray-700 rounded-xl h-[400px] flex items-center justify-center relative mb-6">
                      {/* Play Button */}
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                        <div className="w-0 h-0 border-l-[24px] border-l-blue-600 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent ml-1"></div>
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
