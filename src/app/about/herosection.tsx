import React from 'react';

const HeroSection: React.FC = () => {
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
                  {/* Fydaa Logo */}
                  <div className="flex justify-center mb-6">
                    <img
                      src="/about-us/fydaalogo.png"
                      alt="Fydaa Logo"
                      className="w-[200px] h-[200px] object-contain"
                    />
                  </div>
                  
                  <h1 className="text-6xl text-center font-bold text-gray-900 leading-tight font-gilroy">
                  Bharosa Humara, Fydaa Aapka
                  </h1>
                  <p className="text-lg text-gray-700 text-center leading-relaxed font-inter mb-8">
                  Our trust, your gain – helping everyday Indians build wealth with confidence.
                  </p>
                  
                  {/* Download App Button */}
                  <div className="flex justify-center">
                    <button className="bg-[#12B76A] hover:bg-[#0F9D58] text-white w-[197px] h-[50px] rounded-full font-medium cursor-pointer transition-all duration-200 shadow-sm text-[14px] font-gilroy flex items-center justify-center">
                      Download App
                    </button>
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
            
            {/* Blue circle image - positioned below content */}
            {/* Width options: w-full, w-screen, w-[800px], w-[1000px], w-[1200px], w-[1400px], w-[1600px] */}
            {/* Height options: h-auto, h-[200px], h-[300px], h-[400px], h-[500px], h-[600px], h-[800px], h-[1000px] */}
            <div className="mt-[350px] relative z-0 flex justify-center overflow-visible">
              <div className="relative overflow-visible">
                <img
                  src="/about-us/oval.png"
                  alt="Blue Circle"
                  className="w-[8000px] h-[880px] scale-150 rounded-[45%_45%_50%_50%]"
                />
                
                
                {/* Text overlay on blue circle */}
                <div className="absolute inset-0 flex flex-col items-center justify-start text-center z-10">
                  
                  <p className="text-[16px] -mt-10 text-gray-200 max-w-[1100px] leading-relaxed font-inter">
                  In India, access to expert financial advice has long been limited to the wealthy. We're here to change that. Fydaa is your transparent, SEBI-registered financial partner that helps you save smarter, invest better, and secure your future – whether you're in Mumbai, Lucknow, or a small town.
                  </p>
                    </div>
                      </div>
                      </div>
                    </div>
                  </div>
      </section>
    </main>
  );
};

export default HeroSection;