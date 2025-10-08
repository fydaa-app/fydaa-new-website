"use client";
import React, { useState, useRef, useEffect } from "react";

// Testimonials data array
const testimonialsData = [
   {
    id: 1,
    name: "Abhishek Mishra",
    profileImage: null,
    reviewText:
      "I've been using the Fydaa app since 2022, and it makes investing effortless. I can easily invest across gold, real estate, and equity—all in one place. I'd definitely recommend Fydaa for anyone looking to build a disciplined investment journey.",
    rating: 5,
  },
  
  {
    id: 2,
    name: "Dikshita Jain",
    profileImage: null,
    reviewText:
      "Fydaa has transformed the way I manage my investments. The interface is intuitive and the multi-asset approach helps me diversify my portfolio seamlessly.",
    rating: 5,
  },
  {
    id: 3,
    name: "Rinku Das",
    profileImage: null,
    reviewText:
      "As a busy professional, I appreciate how Fydaa makes investing simple and accessible. The automated features save me time while building wealth systematically.",
    rating: 5,
  }
  ,
  {
    id: 4,
    name: "Sami Garde",
    profileImage: null,
    reviewText:
      "The best investment platform I've used. Fydaa's approach to disciplined investing across multiple asset classes has helped me achieve my financial goals faster.",
    rating: 5,
  }
  //,
  // {
  //   id: 2,
  //   name: "Priya Sharma",
  //   profileImage: null,
  //   reviewText:
  //     "Fyda has transformed the way I manage my investments. The interface is intuitive and the multi-asset approach helps me diversify my portfolio seamlessly.",
  //   rating: 5,
  // },
  // {
  //   id: 3,
  //   name: "Rajesh Kumar",
  //   profileImage: null,
  //   reviewText:
  //     "As a busy professional, I appreciate how Fyda makes investing simple and accessible. The automated features save me time while building wealth systematically.",
  //   rating: 5,
  // },
  // {
  //   id: 4,
  //   name: "Sneha Patel",
  //   profileImage: null,
  //   reviewText:
  //     "The best investment platform I've used. Fyda's approach to disciplined investing across multiple asset classes has helped me achieve my financial goals faster.",
  //   rating: 5,
  // },
  // {
  //   id: 5,
  //   name: "Amit Verma",
  //   profileImage: null,
  //   reviewText:
  //     "Outstanding platform for long-term wealth building. The user-friendly interface and diverse investment options make it perfect for beginners and experienced investors alike.",
  //   rating: 5,
  // },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Create extended array with clones for seamless infinite loop
  const extendedTestimonials = [
    testimonialsData[testimonialsData.length - 1], // Clone of last card
    ...testimonialsData,
    testimonialsData[0], // Clone of first card
  ];

  // Handle transition end to create seamless loop
  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    // If we're at the cloned last card (index 0), jump to real last card
    if (currentIndex === 0) {
      setCurrentIndex(testimonialsData.length);
    }

    // If we're at the cloned first card (last position), jump to real first card
    if (currentIndex === extendedTestimonials.length - 1) {
      setCurrentIndex(1);
    }
  };

  // Navigate to next testimonial
  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // Navigate to previous testimonial
  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return [...Array(rating)].map((_, i) => (
      <svg
        key={i}
        className="w-2 h-2 sm:w-3.5 sm:h-3.5 md:w-[17px] md:h-[17px] lg:w-[22px] lg:h-[22px] xl:w-7 xl:h-7 2xl:w-[42px] 2xl:h-[42px] text-yellow-400 mx-0.5 lg:mx-1 2xl:mx-1.5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Render testimonial card
  const renderTestimonialCard = (
    testimonial: (typeof testimonialsData)[0],
    index: number
  ) => (
    <div
      key={`testimonial-${index}`}
      className="w-full md:w-1/2 flex-shrink-0 px-3"
    >
      <div
        className="bg-[#101828]/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-300/20 flex flex-col relative transition-all duration-500 ease-in-out mx-auto overflow-hidden 
    h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] xl:h-[370px] 2xl:h-[450px]
    max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[450px] 2xl:max-w-[550px]"
      >
        {/* Cut-in Card Image - Positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <img
            src="/resource/cutincard.png"
            alt="Cut-in Card"
            className="w-full object-cover h-[100px] sm:h-[120px] md:h-[140px] lg:h-[160px] xl:h-[175px] 2xl:h-[210px]"
            style={{
              maxHeight: "480px",
              borderRadius: "0 0 16px 16px",
            }}
          />
        </div>

        {/* Content positioned above the cut-in image */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Rating Stars */}
          <div className="flex justify-center mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-9">
            {renderStars(testimonial.rating)}
          </div>

          {/* Quote */}
          <blockquote className="text-center text-[10px] sm:text-xs md:text-sm lg:text-[15px] xl:text-base 2xl:text-xl mb-0 italic leading-relaxed flex-1 overflow-auto px-2 pb-0 sm:pb-20">
            "{testimonial.reviewText}"
          </blockquote>
        </div>

        {/* Author - Positioned in center of cutincard */}
        <div className="absolute bottom-2 sm:bottom-[18px] md:bottom-5 lg:bottom-[23px] xl:bottom-6 2xl:bottom-7 left-0 right-0 z-20 flex flex-col items-center">
          <div className="w-[42px] h-[42px] sm:w-12 sm:h-12 md:w-[54px] md:h-[54px] lg:w-[61px] lg:h-[61px] xl:w-16 xl:h-16 2xl:w-[77px] 2xl:h-[77px] bg-gray-600 rounded-full mb-1 sm:mb-1.5 lg:mb-2 xl:mb-2 2xl:mb-2.5 flex items-center justify-center overflow-hidden shadow-xl">
            {testimonial.profileImage ? (
              <img
                src={testimonial.profileImage}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-[21px] h-[21px] sm:w-6 sm:h-6 md:w-[27px] md:h-[27px] lg:w-[30px] lg:h-[30px] xl:w-8 xl:h-8 2xl:w-[38px] 2xl:h-[38px] text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <p className="font-['Inter'] font-semibold text-[10px] sm:text-xs md:text-sm lg:text-[15px] xl:text-base 2xl:text-lg text-white drop-shadow-lg">
            {testimonial.name}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative bg-[#101828] text-white py-6 pb-10 sm:py-8 sm:pb-12 md:py-10 md:pb-16 lg:py-12 lg:pb-20 xl:py-14 xl:pb-24 2xl:py-16 2xl:pb-28 z-20">
      {/* Green Strip Image */}
      {/* <div className="absolute top-0 left-0 z-10">
        <img
          src="/resource/greenstrip.png"
          alt="Green Strip"
          className="w-auto h-32 sm:h-40 md:h-52 lg:h-72 xl:h-80 2xl:h-96 object-contain"
        />
      </div> */}

      {/* Commas Decorative Image */}
      {/* <div className="absolute z-10" style={{ top: "180px", left: "70px" }}>
        <img
          src="/resource/commas.png"
          alt="Decorative Commas"
          className="w-8 h-8 object-contain opacity-80"
        />
      </div>
      <div className="absolute z-10" style={{ top: "130px", left: "175px" }}>
        <img
          src="/resource/commas.png"
          alt="Decorative Commas"
          className="w-8 h-8 object-contain opacity-80"
        />
      </div> */}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 relative z-20">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-['Gilroy'] font-bold text-center mb-8 sm:mb-10 md:mb-12">
          What Our Clients Say
        </h2>

        {/* Testimonials Container */}
        <div className="relative flex items-center justify-center mt-8 sm:mt-12 md:mt-16 lg:mt-20">
          {/* Left Navigation Arrow */}
          <button
            onClick={handlePrevious}
            disabled={isTransitioning}
            className="absolute left-[-12px] sm:left-[-16px] md:left-[-20px] lg:left-[-28px] xl:left-[-40px] 2xl:left-[-64px] top-1/2 transform -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/50 rounded-full backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer disabled:opacity-50"
            aria-label="Previous testimonials"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Testimonials Slider */}
          <div className="relative overflow-hidden w-full max-w-[95vw] md:max-w-[956px]">
            <div
              ref={sliderRef}
              className={`flex ${
                isTransitioning
                  ? "transition-transform duration-500 ease-in-out"
                  : ""
              }`}
              style={{
                transform: `translateX(-${
                  currentIndex * (isMobile ? 100 : 50)
                }%)`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedTestimonials.map((testimonial, index) =>
                renderTestimonialCard(testimonial, index)
              )}
            </div>
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="absolute right-[-12px] sm:right-[-16px] md:right-[-20px] lg:right-[-28px] xl:right-[-40px] 2xl:right-[-64px] top-1/2 transform -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/50 rounded-full backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer disabled:opacity-50"
            aria-label="Next testimonials"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
