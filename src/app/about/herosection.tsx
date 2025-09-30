import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <main className="w-full min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="flex">
          <img
            src="/resource/gradient.png"
            alt="Gradient"
            className="w-1/2 h-screen object-cover opacity-60"
          />
          <img
            src="/resource/gradient.png"
            alt="Gradient"
            className="w-1/2 h-screen object-cover opacity-60"
          />
        </div>
      </div>

      {/* Main Content */}
      <section className="relative z-20 py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Logo and Button Section */}
          <div className="flex flex-col items-center text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            {/* Fydaa Logo */}
            <div className="mb-6 sm:mb-8">
              <img
                src="/about-us/fydaalogo.png"
                alt="Fydaa Logo"
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-contain"
              />
            </div>
            
            {/* Download App Button */}
            <div className="mb-8 sm:mb-12">
              <button className="bg-[#12B76A] hover:bg-[#0F9D58] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium cursor-pointer transition-all duration-200 shadow-sm text-sm sm:text-base md:text-lg font-gilroy">
                Download App
              </button>
            </div>
          </div>

          {/* Blue Circle with Text */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl">
              {/* Blue Circle Background */}
              <div className="relative w-full aspect-[4/3] lg:aspect-[5/3] xl:aspect-[6/3] overflow-hidden">
                <img
                  src="/about-us/oval.png"
                  alt="Blue Circle"
                  className="w-full h-full object-cover rounded-[50%]"
                />
                
                {/* Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
                  <div className="text-center">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-200 leading-relaxed sm:leading-relaxed md:leading-relaxed lg:leading-relaxed font-inter max-w-4xl mx-auto">
                      In India, access to expert financial advice has long been limited to the wealthy. We're here to change that. Fydaa is your transparent, SEBI-registered financial partner that helps you save smarter, invest better, and secure your future – whether you're in Mumbai, Lucknow, or a small town.
                    </p>
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

export default HeroSection;