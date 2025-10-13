import React from "react";

const FounderSection: React.FC = () => {
  return (
    <section
      className="
    relative z-30 -mt-40 sm:-mt-60 md:-mt-96 lg:-mt-96 xl:-mt-[400px]
    flex justify-center overflow-visible pointer-events-none
    pb-[60px] sm:pb-[102px] md:pb-[123px] lg:pb-[164px] xl:pb-[205px]
  "
    >
      <div className="relative w-full max-w-screen-4xl mx-auto">
        <div className="relative w-full">

          {/* Oval image - top layer */}
          <img
            src="/about-us/oval.png"
            alt="Blue Circle"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[70vw] h-[220px] sm:h-[440px] md:h-[660px] lg:h-[880px] xl:h-[880px] 2xl:h-[880px] scale-[1.5] sm:scale-150 z-10"
          />
          
          {/* Square image - background layer */}
          <img
            src="/about-us/square.png"
            alt="Square Background"
            className="absolute inset-x-0 top-0 w-full h-[1200px] object-cover pointer-events-none -z-10"
          />

          {/* Content container (grows naturally with content height) */}
          <div className="relative z-20 flex flex-col items-center text-center px-2 sm:px-4 md:px-6 lg:px-8">
            {/* Centered "How it Started" Section */}
            <div className="flex flex-col items-center max-w-full sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] mx-auto px-4">
              <h2 className="text-white font-gilroy font-semibold text-[28px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-[32px] sm:leading-[44px] md:leading-[56px] tracking-[0px] mb-4">
                How it Started
              </h2>
              <p className="text-[#E6E6E6] font-inter font-normal text-[14px] sm:text-[16px] md:text-[18px] leading-[20px] sm:leading-[22px] md:leading-[25px] tracking-[-0.36px] max-w-[300px] sm:max-w-[500px] md:max-w-full mx-auto">
                To democratize wealth inclusion and financial freedom, ensuring
                everyone, regardless of their social strata, can participate in
                and contribute to the country's growth.
              </p>
            </div>

            {/* Split section beginning below the above text */}
            <div className="mt-12 sm:mt-16 flex flex-col lg:flex-row justify-center max-w-full lg:max-w-[1170px] w-full gap-8 sm:gap-12 mx-auto px-4 sm:px-0">
              {/* Left side */}
              <div className="flex-1 flex justify-center items-center relative z-50">
                <img
                  src="/about-us/founder.png"
                  alt="Founder"
                  className="object-contain w-[180px] sm:w-[250px] md:w-[300px] lg:w-[348px] h-auto relative z-50"
                />
              </div>

              {/* Right side content */}
              <div className="flex-1 text-center lg:text-left px-4 sm:px-0">
                <h3 className="font-gilroy font-semibold mb-6 text-[22px] sm:text-[26px] md:text-[30px] leading-[27px] sm:leading-[31px] md:leading-[37px] tracking-[-2.24px] text-transparent bg-clip-text bg-[linear-gradient(360deg,_#A8A8A8_20%,_#FFFFFF_81%)]">
                  Meet The Founder
                </h3>

                {/* Paragraphs */}
                <p className="font-gilroy font-normal mb-6 text-[#999999] text-[14px] sm:text-[16px] md:text-[18px] leading-[20px] sm:leading-[22px] md:leading-[24.8px] tracking-[-0.36px] max-w-full sm:max-w-[450px] md:max-w-[500px] mx-auto lg:mx-0">
                  Kuntal Bhansali started his journey more than 20 years back as
                  an Equity Research Analyst and went on to become a fund
                  manager with Reliance Capital PMS very early on in his career
                  where he got hands-on experience managing money for
                  high-networth individuals.
                </p>

                <p className="font-gilroy font-normal mb-6 text-[#999999] text-[14px] sm:text-[16px] md:text-[18px] leading-[20px] sm:leading-[22px] md:leading-[24.8px] tracking-[-0.36px] max-w-full sm:max-w-[450px] md:max-w-[500px] mx-auto lg:mx-0">
                  He started his entrepreneurial journey almost 10 years back
                  delving into the field of Investment Banking and Fund
                  management. This journey took him to unchartered territories
                  of Tech startups where he learned the ropes of technologies
                  and how they can empower people at a mass level.
                </p>

                <p className="font-gilroy font-normal mb-6 text-[#999999] text-[14px] sm:text-[16px] md:text-[18px] leading-[20px] sm:leading-[22px] md:leading-[24.8px] tracking-[-0.36px] max-w-full sm:max-w-[450px] md:max-w-[500px] mx-auto lg:mx-0">
                  Fydaa was born out of this combination of domain knowledge of
                  managing money and an understanding of tech learned while
                  advising Tech startups.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient overlays */}
        <img
          src="/about-us/gradient2.png"
          alt="Gradient Decoration 2"
          className="absolute pointer-events-none w-[150px] h-[500px] sm:w-[350px] sm:h-[900px] md:w-[450px] md:h-[1100px] lg:w-[600px] lg:h-[1200px] xl:w-[750px] xl:h-[1400px] z-40 left-[-180px] sm:left-[-500px] top-[-60px] sm:top-[-100px] rotate-[38.2deg]"
        />
        <img
          src="/about-us/gradient2.png"
          alt="Gradient Decoration 2"
          className="absolute pointer-events-none w-[150px] h-[500px] sm:w-[350px] sm:h-[900px] md:w-[450px] md:h-[1100px] lg:w-[600px] lg:h-[1200px] xl:w-[750px] xl:h-[1400px] z-40 left-[300px] sm:left-[798px] top-[20px] sm:top-[50px] rotate-[-38.2deg]"
        />
        <img
          src="/about-us/gradient3.png"
          alt="Gradient Decoration 3"
          className="absolute pointer-events-none w-[150px] h-[500px] sm:w-[350px] sm:h-[900px] md:w-[450px] md:h-[1100px] lg:w-[600px] lg:h-[1200px] xl:w-[750px] xl:h-[1400px] z-40 left-[900px] sm:left-[1430px] top-[-200px] sm:top-[-360px] rotate-[-38.2deg]"
        />
      </div>
    </section>
  );
};

export default FounderSection;
