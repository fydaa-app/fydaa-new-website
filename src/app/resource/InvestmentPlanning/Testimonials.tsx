'use client'
import React from 'react';

const Testimonials = () => {
  return (
    <section className="relative bg-[#101828] text-white py-12 pb-20 z-20">

      
      {/* Green Strip Image */}
      <div className="absolute top-0 left-0 z-10">
        <img 
          src="/resource/greenstrip.png" 
          alt="Green Strip" 
          className="w-auto h-72 object-contain"
        />
      </div>
      
      {/* Commas Decorative Image */}
      <div className="absolute z-10" style={{ top: '180px', left: '70px' }}>
        <img 
          src="/resource/commas.png" 
          alt="Decorative Commas" 
          className="w-8 h-8 object-contain opacity-80"
        />
      </div>
      <div className="absolute z-10" style={{ top: '130px', left: '175px' }}>
        <img 
          src="/resource/commas.png" 
          alt="Decorative Commas" 
          className="w-8 h-8 object-contain opacity-80"
        />
      </div>
      
      
      <div className="max-w-[1400px] mx-auto px-12 relative z-20">
        {/* Title */}
        <h2 className="text-[48px] font-['Gilroy'] font-bold text-center mb-12">
          What Our Clients Says
        </h2>
        
        {/* Testimonials Container */}
        <div className="relative flex items-center justify-center mt-8 sm:mt-12 md:mt-16 lg:mt-20">
          {/* Left Navigation Arrow */}
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
            {/* Testimonial Card 1 */}
            <div className="bg-[#101828]/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-300/20 flex flex-col relative" style={{ width: '450px', height: '400px' }}>
              {/* Cut-in Card Image - Positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center -mx-8">
                <img 
                  src="/resource/cutincard.png" 
                  alt="Cut-in Card" 
                  style={{ width: '448px', height: '180px', maxWidth: '100%', borderRadius: '0 0 16px 16px' }}
                  className="object-cover"
                />
              </div>
              
              {/* Content positioned above the cut-in image */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Rating Stars */}
                <div className="flex justify-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-7 h-7 text-yellow-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-center text-base mb-6 italic leading-relaxed flex-grow">
                “I’ve been using the Fyda app since 2022, and it makes investing effortless. I can easily invest across gold, real estate, and equity—all in one place. I’d definitely recommend Fyda for anyone looking to build a disciplined investment journey.”
                </blockquote>
                
                {/* Author */}
                <div className="flex flex-col items-center mb-4" style={{ marginTop: '40px' }}>
                  <div className="w-10 h-10 bg-gray-600 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-['Inter'] font-medium text-[14px]">Abhishek Mishra</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial Card 2 */}
            <div className="bg-[#101828]/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-300/20 flex flex-col relative" style={{ width: '450px', height: '400px' }}>
              {/* Cut-in Card Image - Positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center -mx-8">
                <img 
                  src="/resource/cutincard.png" 
                  alt="Cut-in Card" 
                  style={{ width: '448px', height: '180px', maxWidth: '100%', borderRadius: '0 0 16px 16px' }}
                  className="object-cover"
                />
              </div>
              
              {/* Content positioned above the cut-in image */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Rating Stars */}
                <div className="flex justify-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-7 h-7 text-yellow-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-center text-base mb-6 italic leading-relaxed flex-grow">
                “I’ve been using the Fyda app since 2022, and it makes investing effortless. I can easily invest across gold, real estate, and equity—all in one place. I’d definitely recommend Fyda for anyone looking to build a disciplined investment journey.”
                </blockquote>
                
                {/* Author */}
                <div className="flex flex-col items-center mb-4" style={{ marginTop: '40px' }}>
                  <div className="w-10 h-10 bg-gray-600 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-['Inter'] font-medium text-[14px]">Abhishek Mishra</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Navigation Arrow */}
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;