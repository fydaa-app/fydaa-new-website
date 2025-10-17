"use client";
import React from "react";
import { useRouter } from "next/navigation";

const ServiceSection: React.FC = () => {
  const router = useRouter();
  const serviceList = [
    {
      serviceId: "investment-planning",
      serviceTitle: "Investment Planning",
      serviceIconPath: "/about-us/investment-planning.png",
      path: "/resource/InvestmentPlanning",
    },
    {
      serviceId: "emergency-fund",
      serviceTitle: "Emergency Fund Setup & Guidance",
      serviceIconPath: "/about-us/emergency-fund-setup.png",
      path: "/resource/Emergencyfund",
    },
    {
      serviceId: "debt-management",
      serviceTitle: "Debt Management",
      serviceIconPath: "/about-us/debt-management.png",
      path: "/resource/DebtManagement",
    },
    {
      serviceId: "expense-management",
      serviceTitle: "Expense-Management",
      serviceIconPath: "/about-us/expense-management.png",
      path: "/resource/ExpenseManagement",
    },
    {
      serviceId: "financial-health",
      serviceTitle: "Financial Health Monitoring",
      serviceIconPath: "/about-us/financial-health-monitoring.png",
      path: "/resource/FinancialHealthCheckup",
    },
    {
      serviceId: "smart-budgeting",
      serviceTitle: "Smart Budgeting",
      serviceIconPath: "/about-us/smart-budgeting.png",
      path: "/resource/PersonalizedBudgetingplan",
    },
    {
      serviceId: "tax-consulting",
      serviceTitle: "Tax Consulting",
      serviceIconPath: "/about-us/tax-consulting.png",
      path: "/resource/TaxConsultancy",
    },
    {
      serviceId: "portfolio-management",
      serviceTitle: "Portfolio Management",
      serviceIconPath: "/about-us/portfolio-management.png",
      path: "/resource/PortfolioManagement",
    },
    {
      serviceId: "insurance",
      serviceTitle: "Insurance",
      serviceIconPath: "/about-us/insurance.png",
      path: "/resource/Insurance",
    },
  ];

  return (
    <div className="bg-[#F7F7F7] min-h-screen rounded-t-[24px] sm:rounded-t-[32px] md:rounded-t-[40px] lg:rounded-t-[56px] xl:rounded-t-[64px] 2xl:rounded-t-[72px] overflow-visible relative -mt-[56px] pb-52 z-40 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48">
      <div className="max-w-4xl mx-auto text-center pt-8 sm:pt-10 md:pt-12 lg:pt-14 xl:pt-16 2xl:pt-20 3xl:pt-24 px-4 sm:px-0">
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

      {/* Services Grid */}
      <div className="w-full flex justify-center mb-16 px-4 md:px-0">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-0 w-full max-w-[1320px]">
          {serviceList.map((serviceItem, index) => (
            <div
              key={serviceItem.serviceId}
              className={`
    cursor-default
    bg-[#F7F7F7] 
    flex 
    flex-col 
    items-start 
    justify-start 
    px-4
    sm:px-6
    md:px-8 
    pt-12
    sm:pt-14
    md:pt-16
    pb-12 
    min-h-[240px]
    sm:min-h-[260px]
    md:min-h-[280px]
    ${(index + 1) % 2 !== 0 ? "border-r border-[#217AA7]/20" : ""} 
    ${
      (index + 1) % 3 !== 0
        ? "md:border-r md:border-[#217AA7]/20"
        : "md:border-r-0"
    } 
    ${index < 6 ? "border-b border-[#217AA7]/20" : ""}
  `}
            >
              {/* Service Icon */}
              <div
                onClick={() => router.push(serviceItem.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    router.push(serviceItem.path);
                  }
                }}
                className="h-[80px] sm:h-[88px] md:h-[96px] flex items-center mb-4 sm:mb-5 md:mb-6 transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
              >
                <img
                  src={serviceItem.serviceIconPath}
                  alt={serviceItem.serviceTitle}
                  className="max-w-[40px] max-h-[40px] sm:max-w-[50px] sm:max-h-[50px] md:max-w-[60px] md:max-h-[60px] object-contain"
                />
              </div>

              {/* Service Title */}
              <div className="flex flex-col flex-grow">
                <h3
                  onClick={() => router.push(serviceItem.path)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(serviceItem.path);
                    }
                  }}
                  className="font-inter font-normal text-base sm:text-lg md:text-xl lg:text-2xl leading-6 sm:leading-7 md:leading-8 lg:leading-[31.68px] tracking-normal sm:tracking-wide text-[#1D2939] text-left transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
                >
                  {serviceItem.serviceTitle}
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
            {/* Top Left Card - SEBI-Registered & Regulated */}
            <div className="flex-1 bg-[#101828] rounded-[16px] p-6 sm:p-8 text-white min-h-[220px] sm:min-h-[280px]">
              <h3 className="font-gilroy-semibold text-xl sm:text-2xl md:text-3xl leading-snug sm:leading-normal md:leading-[54px] text-white mb-4">
                SEBI-Registered &<br />
                Regulated
              </h3>
              <p className="font-inter font-normal text-sm sm:text-base md:text-lg leading-relaxed sm:leading-relaxed md:leading-[27px] text-[#E7E7E7] opacity-100">
                Advice you can trust, from certified experts.
              </p>
            </div>
            {/* Top Right Card - No Hidden Commissions */}
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
            {/* Bottom Left Card - Affordable for Everyone */}
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
            {/* Bottom Right Card - Tech-Powered & Human-Backed */}
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
