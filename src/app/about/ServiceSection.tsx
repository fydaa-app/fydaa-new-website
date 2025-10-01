import React from "react";

const ServiceSection: React.FC = () => {
  const services = [
    {
      id: "investment-planning",
      title: "Investment Planning",
      icon: "/about-us/investment-planning.png",
    },
    {
      id: "financial-health",
      title: "Financial Health Monitoring",
      icon: "/about-us/financial-health-monitoring.png",
    },
    {
      id: "debt-management",
      title: "Debt Management",
      icon: "/about-us/debt-management.png",
    },
    {
      id: "smart-budgeting",
      title: "Smart Budgeting",
      icon: "/about-us/smart-budgeting.png",
    },
    {
      id: "expense-management",
      title: "Expense-Management",
      icon: "/about-us/expense-management.png",
    },
    {
      id: "emergency-fund",
      title: "Emergency Fund Setup & Guidance",
      icon: "/about-us/emergency-fund-setup.png",
    },
    {
      id: "tax-consulting",
      title: "Tax Consulting",
      icon: "/about-us/tax-consulting.png",
    },
    { id: "insurance", title: "Insurance", icon: "/about-us/insurance.png" },
    {
      id: "portfolio-management",
      title: "Portfolio Management",
      icon: "/about-us/portfolio-management.png",
    },
  ];

  return (
    <div className="bg-[#F7F7F7] min-h-screen rounded-[56px] overflow-visible relative -mt-[650px] sm:-mt-[750px] md:-mt-[800px] lg:-mt-[900px] xl:-mt-[1000px] pb-52 z-40 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48">
      <div className="max-w-4xl mx-auto text-center pt-16 px-4 sm:px-0">
        {/* Main Heading - Gilroy SemiBold */}
        <h1 className="font-gilroy-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[56px] leading-tight sm:leading-snug md:leading-normal lg:leading-[68px] tracking-normal text-[#000000] mb-8">
          Why Choose Fydaa?
        </h1>
        {/* Description Text - Inter Regular */}
        <p className="font-inter text-sm sm:text-base md:text-lg lg:text-[18px] leading-relaxed sm:leading-relaxed md:leading-[24.8px] tracking-tight sm:tracking-normal md:tracking-[-0.36px] text-[#000000] max-w-2xl mx-auto mb-16">
          We're not just about investing, we're your 360° personal finance
          partner.
          <br />
          Our services include
        </p>
      </div>

      {/* Services Grid - MOVED OUTSIDE the max-w-4xl container */}
      <div className="w-full flex justify-center mb-16 px-4 md:px-0">
        <div className="grid grid-cols-3 gap-0 w-full max-w-[1320px]">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`
              bg-[#F7F7F7] 
              flex 
              flex-col 
              items-start 
              justify-start 
              px-8 
              pt-16
              pb-12 
              ${(index + 1) % 3 !== 0 ? "border-r border-[#217AA7]/20" : ""} 
              ${index < 6 ? "border-b border-[#217AA7]/20" : ""}
            `}
            >
              {/* Service Icon */}
              <div className="h-[96px] flex items-center mb-6">
                <img
                  src={service.icon}
                  alt={service.title}
                  className="max-w-[40px] max-h-[40px] sm:max-w-[50px] sm:max-h-[50px] md:max-w-[60px] md:max-h-[60px] object-contain"
                />
              </div>

              {/* Service Title */}
              <div
                className="flex flex-col"
                style={{ minHeight: "3.5rem" /* approx 2 lines of text */ }}
              >
                <h3 className="font-inter font-normal text-lg sm:text-xl md:text-2xl leading-7 sm:leading-8 md:leading-[31.68px] tracking-wide text-[#1D2939] text-left">
                  {service.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Section Below Grid */}
      <div className="w-full flex justify-center mt-16 px-4">
        <div className="w-full max-w-[1200px] grid grid-rows-2 gap-12">
          {/* Top Row */}
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Top Left Card - SEBI-Registered & Regulated - 780x280 */}
            <div className="flex-1 bg-[#101828] rounded-[16px] p-6 sm:p-8 text-white min-h-[220px] sm:min-h-[280px]">
              <h3 className="font-gilroy-semibold text-xl sm:text-2xl md:text-3xl leading-snug sm:leading-normal md:leading-[54px] text-white mb-4">
                SEBI-Registered &<br />
                Regulated
              </h3>
              <p className="font-inter font-normal text-sm sm:text-base md:text-lg leading-relaxed sm:leading-relaxed md:leading-[27px] text-[#E7E7E7] opacity-100">
                Advice you can trust, from certified experts.
              </p>
            </div>
            {/* Top Right Card - No Hidden Commissions - 360x280 */}
            <div className="flex-1 sm:flex-none sm:w-[360px] bg-[#101828] rounded-[16px] p-6 sm:p-8 text-white min-h-[220px] sm:min-h-[280px]">
              <h3 className="font-gilroy-semibold text-lg sm:text-xl md:text-2xl leading-snug sm:leading-normal md:leading-[38px] text-white mb-4">
                No
                <br />
                Hidden
                <br />
                Commissions
              </h3>
              <p className="font-inter font-normal text-sm sm:text-base md:text-lg leading-relaxed sm:leading-relaxed md:leading-[27px] text-[#E7E7E7] opacity-100">
                We work for you, not for
                <br />
                banks or fund houses.
              </p>
            </div>
          </div>
          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Bottom Left Card - Affordable for Everyone - 360x280 */}
            <div className="flex-1 sm:flex-none sm:w-[360px] bg-[#101828] rounded-[16px] p-6 sm:p-8 text-white min-h-[220px] sm:min-h-[280px]">
              <h3 className="font-gilroy-semibold text-lg sm:text-xl md:text-2xl leading-snug sm:leading-normal md:leading-[38px] text-white mb-4">
                Affordable for
                <br />
                Everyone
              </h3>
              <p className="font-inter font-normal text-sm sm:text-base md:text-lg leading-relaxed sm:leading-relaxed md:leading-[27px] text-[#E7E7E7] opacity-100">
                Start with as little as
                <br />
                ₹2,500.
              </p>
            </div>
            {/* Bottom Right Card - Tech-Powered & Human-Backed - 780x280 */}
            <div className="flex-1 bg-[#101828] rounded-[16px] p-6 sm:p-8 text-white min-h-[220px] sm:min-h-[280px]">
              <h3 className="font-gilroy-semibold text-xl sm:text-2xl md:text-3xl leading-snug sm:leading-normal md:leading-[54px] text-white mb-4">
                Tech-Powered & Human-
                <br />
                Backed
              </h3>
              <p className="font-inter font-normal text-sm sm:text-base md:text-lg leading-relaxed sm:leading-relaxed md:leading-[27px] text-[#E7E7E7] opacity-100">
                Easy-to-use app plus dedicated advisors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
