'use client'
import React, { useState, useEffect, useRef } from 'react';

const TestimonialPage: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [hasTyped, setHasTyped] = useState(false);
  const inflationTextRef = useRef<HTMLDivElement>(null);
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = [
    {
      name: "Harshit Vardhan",
      image: "/testimonials/harshit.jpg", // You'll need to add this image
      text: "I always wanted a Royal Enfield. But between rent, weekend plans, and zero savings habits, it felt out of reach. Then I found Fydaa. My advisor helped me set a realistic goal - ₹2.2 lakhs in 12 months. We broke it down: just ₹6,000/month in a SIP, and a bit less on Zomato. They tracked my spending, suggested smart cuts, and sent monthly nudges that kept me going. Exactly a year later, I rode my Bullet home. No loans, no EMIs, no guilt. Just me, my dream, and a plan that actually worked."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };



  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTyped) {
            typeWriter();
          } else if (!entry.isIntersecting) {
            // Reset when out of view to trigger animation again
            setHasTyped(false);
            setTypedText('');
          }
        });
      },
      { threshold: 0.5 }
    );

    if (inflationTextRef.current) {
      observer.observe(inflationTextRef.current);
    }

    return () => observer.disconnect();
  }, [hasTyped]);

  const typeWriter = () => {
    // Clear any existing text and reset state
    setTypedText('');
    setHasTyped(true);
    
    const fullText = "Inflation makes your dreams\nmore expensive daily.|";
    let currentIndex = 0;
    
    // Clear any existing intervals
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
    }
    
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        const currentChar = fullText[currentIndex];
        if (currentChar) {
          setTypedText(prev => prev + currentChar);
        }
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        typewriterIntervalRef.current = null;
      }
    }, 100);
    
    // Store interval reference to prevent multiple instances
    typewriterIntervalRef.current = typeInterval;
  };

  return (
    <div className="bg-[#000000] pb-20 rounded-[56px] overflow-hidden">
      {/* Top Section: Real People, Real Progress */}
      <div className="bg-black pt-20 pb-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-semibold text-white mb-8 sm:mb-12 md:mb-16 font-gilroy">
            Real People, Real Progress
          </h1>
          
          {/* Navigation Arrows and Testimonial Content */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 gap-8 lg:gap-0">
            {/* Left Arrow */}
            <button 
              onClick={prevTestimonial}
              className="text-white hover:text-gray-300 transition-colors duration-200 order-2 lg:order-1"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Testimonial Content - Image and Card side by side, Name above card */}
            <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8 order-1 lg:order-2">
              {/* Left Side - Profile Image */}
              <div className="w-full max-w-[280px] sm:max-w-[320px] lg:w-[359px] h-[280px] sm:h-[350px] lg:h-[519px] bg-gray-600 rounded-2xl flex-shrink-0 flex items-center justify-center">
                <div className="text-white text-sm text-center">
                  <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-gray-400">Profile Image</p>
                </div>
              </div>
              
              {/* Right Side - Name above Card */}
              <div className="flex flex-col gap-4">
                {/* Name above the card */}
                <div className="text-center lg:text-left">
                  <h3 
                    className="text-xl sm:text-2xl lg:text-[30px] font-semibold font-['Gilroy']"
                    style={{
                      background: 'linear-gradient(135deg, #A8A8A8 20%, #FFFFFF 81%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent'
                    }}
                  >
                    {testimonials[currentTestimonial].name}
                  </h3>
                </div>
                
                {/* Testimonial Card below the name */}
                <div className="w-full max-w-[500px] sm:max-w-[550px] lg:w-[600px] h-[280px] sm:h-[320px] lg:h-[350px] relative">
                  <div 
                    className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[56px] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)'
                    }}
                  >
                    {/* Stroke/Border Effect */}
                    <div 
                      className="absolute inset-0 rounded-[56px] pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)',
                        padding: '2px',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'xor',
                        WebkitMaskComposite: 'xor'
                      }}
                    />
                    
                    <div className="flex flex-col items-start space-y-4 sm:space-y-6 lg:space-y-8 relative z-10">
                      <div className="relative w-full">
                        <span className="text-white text-2xl sm:text-3xl lg:text-4xl absolute -top-1 sm:-top-2 left-0">"</span>
                        <p className="text-white text-sm sm:text-base lg:text-[18px] font-normal leading-relaxed font-['Gilroy'] pl-6 sm:pl-8 pr-2 sm:pr-4">
                          {testimonials[currentTestimonial].text}
                        </p>
                        <span className="text-white text-2xl sm:text-3xl lg:text-4xl absolute bottom-0 right-0">"</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button 
              onClick={nextTestimonial}
              className="text-white hover:text-gray-300 transition-colors duration-200 order-3 lg:order-3"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Middle Section - Inflation Message */}
      <div className="bg-black py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-0 mt-4 sm:mt-6 md:mt-8 relative overflow-hidden">
        {/* Background Image - Full width */}
        <img 
          src="/testimonial/silver.png" 
          alt="Silver decorative element" 
          className="w-full h-auto object-cover absolute inset-0 z-0"
        />
        
        {/* Text Overlay - Centered within the grey strip only */}
        <div ref={inflationTextRef} className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6 md:px-8">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-[100px] text-white font-inter font-normal leading-tight break-words whitespace-pre-line text-center">
            {typedText}
          </p>
        </div>
      </div>

      {/* Bottom Section: Call to Action */}
      <div className="bg-black pb-20 px-4 sm:px-6 md:px-8 mt-16 sm:mt-20 md:mt-24 lg:mt-28">
        <div className="max-w-4xl mx-auto text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-semibold mb-3 sm:mb-4 font-gilroy">
            Start Early, Start Small
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-light mb-4 sm:mb-6 font-gilroy">
            JUST START
          </h3>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-[24px] text-white font-inter font-normal mb-8 sm:mb-10 md:mb-12">
            Every day you delay costs you money.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
            <button className="bg-white text-black px-4 sm:px-6 py-2 sm:py-2 rounded-full text-xs sm:text-sm font-medium font-['Inter'] hover:bg-gray-100 transition-colors">
              Download Our App
            </button>
            <div className="flex items-center space-x-2 text-white text-xs sm:text-sm font-medium font-['Inter'] cursor-pointer hover:text-gray-300 transition-colors">
              <span>Watch Demo</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default TestimonialPage;
