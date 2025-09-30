import React from "react";

const FounderSection: React.FC = () => {
  return (
    <section className="relative z-30 -mt-[400px] flex justify-center overflow-visible pointer-events-none">
      <div className="relative overflow-visible">
        <img
          src="/about-us/oval.png"
          alt="Blue Circle"
          className="w-[8000px] h-[880px] scale-150 rounded-[45%_45%_50%_50%]"
        />

        {/* Gradient overlays */}

        <img
          src="/about-us/gradient2.png"
          alt="Gradient Decoration 2"
          className="absolute pointer-events-none w-[400px] h-[1400px] md:w-[750px] md:h-[1400px] z-40 left-[-500px] top-[-100px] rotate-[38.2deg]"
        />
      

        <img
          src="/about-us/gradient2.png"
          alt="Gradient Decoration 2"
          className="absolute pointer-events-none w-[400px] h-[1400px] md:w-[750px] md:h-[1400px] z-40 left-[800px] top-[50px] rotate-[-38.2deg]"
        />

        {/* Text Overlay inside the circle */}
        <div className="absolute inset-0 flex flex-col items-center text-center px-4">
          {/* Centered "How it Started" Section */}
          <div className="flex flex-col items-center max-w-full sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] mx-auto">
            <h2 className="text-white font-gilroy font-semibold text-[56px] leading-[68px] tracking-[0px] mb-4">
              How it Started
            </h2>
            <p className="text-[#E6E6E6] font-inter font-normal text-[18px] leading-[24.8px] tracking-[-0.36px]">
              To democratize wealth inclusion and financial freedom, ensuring
              everyone, regardless of their social strata, can participate in
              and contribute to the country's growth.
            </p>
          </div>

          {/* Split section beginning below the above text */}
          <div className="mt-16 flex flex-col lg:flex-row justify-center max-w-full lg:max-w-[1170px] w-full gap-12 mx-auto">
            {/* Left side */}
            <div className="flex-1 flex justify-center items-center relative z-50">
              <img
                src="/about-us/founder.png"
                alt="Founder"
                width={348}
                height={427}
                className="object-contain relative z-50"
              />
            </div>

            {/* Right side content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Meet The Founder heading with linear gradient text */}
              <h3 className="font-gilroy font-semibold mb-6 text-[30px] leading-[37px] tracking-[-2.24px] text-transparent bg-clip-text bg-[linear-gradient(360deg,_#A8A8A8_20%,_#FFFFFF_81%)]">
                Meet The Founder
              </h3>

              {/* Paragraphs */}
              <p className="font-gilroy font-normal mb-6 text-[#999999] text-[18px] leading-[24.8px] tracking-[-0.36px]">
                Kuntal Bhansali started his journey more than 20 years back as
                an Equity Research Analyst and went on to become a fund manager
                with Reliance Capital PMS very early on in his career where he
                got hands-on experience managing money for high-networth
                individuals.
              </p>

              <p className="font-gilroy font-normal mb-6 text-[#999999] text-[18px] leading-[24.8px] tracking-[-0.36px]">
                He started his entrepreneurial journey almost 10 years back
                delving into the field of Investment Banking and Fund
                management. This journey took him to unchartered territories of
                Tech startups where he learned the ropes of technologies and how
                they can empower people at a mass level.
              </p>

              <p className="font-gilroy font-normal text-[#999999] text-[18px] leading-[24.8px] tracking-[-0.36px]">
                Fydaa was born out of this combination of domain knowledge of
                managing money and an understanding of tech learned while
                advising Tech startups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
