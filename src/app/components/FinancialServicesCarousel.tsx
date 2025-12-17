"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ServiceFeature {
  title: string;
  description: string;
  icon: string;
  features: string[];
  path: string;
}

const FinancialServicesCarousel = () => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const router = useRouter();

  const services: ServiceFeature[] = [
    {
      title: "Investment Planning",
      description:
        "Align your investment with your time horizon and risk appetite.",
      icon: "/FinancialPlan/investmentstrategies.png",
      features: [
        "Risk assessment test",
        "Asset allocation strategy",
        "Suggested mutual funds/ETFs",
        "Periodic rebalancing reminders",
      ],
      path: "/resource/InvestmentPlanning",
    },
    {
      title: "Emergency Fund Setup & Guidance",
      description:
        "Build a reliable financial cushion for emergencies, job loss, or medical needs.",
      icon: "/FinancialPlan/emergency.png",
      features: [
        "Personalized emergency fund target",
        "Savings options for liquidity",
        "Monthly reminders to build the corpus",
        "Guidance on fund placement (FDs, liquid funds)",
      ],
      path: "/resource/Emergencyfund",
    },
    {
      title: "Debt Management & Refinancing",
      description:
        "Pay off your liabilities smarter with expert-backed strategies tailored for your financial health.",
      icon: "/FinancialPlan/debtmanagement.png",
      features: [
        "Personalized debt repayment roadmap",
        "Refinance suggestions to reduce EMI burden",
        "Consolidation options for multiple loans",
        "Monthly progress tracking",
      ],
      path: "/resource/DebtManagement",
    },
    {
      title: "Expense Management",
      description: "Gain clarity on where your money goes every month.",
      icon: "/FinancialPlan/expensemanagement.png",
      features: [
        "Smart categorization of expenses",
        "Expense-saving tips",
        "Monthly budget deviation alerts",
        "Spending summary dashboard",
      ],
      path: "/resource/ExpenseManagement",
    },
    {
      title: "Financial Health Checkup",
      description: "A complete diagnostic of your current financial condition.",
      icon: "/FinancialPlan/Financialhealth.png",
      features: [
        "Net worth snapshot",
        "Savings-to-expense ratio",
        "Risk exposure analysis",
        "Report with expert suggestions",
      ],
      path: "/resource/FinancialHealthCheckup",
    },
    {
      title: "Personalized Budgeting Plan",
      description:
        "A custom budget, created around your income, lifestyle, and future goals.",
      icon: "/FinancialPlan/personalbudget.png",
      features: [
        "Income-expense allocation plan",
        "Dynamic budgeting tracker",
        "Realistic savings goals",
        "Monthly report card",
      ],
      path: "/resource/PersonalizedBudgetingplan",
    },
    {
      title: "Tax Consultancy",
      description:
        "Expert help in planning your taxes and maximizing exemptions.",
      icon: "/FinancialPlan/Tax1Consultancy.png",
      features: [
        "Personalized tax-saving report",
        "Investment-linked deductions",
        "Capital gains advice",
        "Year-end tax planning session",
      ],
      path: "/resource/TaxConsultancy",
    },
    {
      title: "Portfolio Management",
      description:
        "Track, Optimize, and enhance your overall investment performance.",
      icon: "/FinancialPlan/portfoliomanage.png",
      features: [
        "Investment tracking dashboard",
        "Health score of your portfolio",
        "Rebalancing tips",
        "Alerts on overexposure or underperformance",
      ],
      path: "/resource/PortfolioManagement",
    },
  ];

  const handleClick = (index: number, event: React.MouseEvent) => {
    // Get the actual service index (accounting for duplicates)
    const actualIndex = index % services.length;
    const service = services[actualIndex];

    // Navigate to the service's path
    if (service.path) {
      router.push(service.path);
    }
  };

  const renderCard = (service: ServiceFeature, index: number) => (
    <div
      key={index}
      className="w-[250px] h-[290px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[400px] lg:w-80 lg:h-[425px] relative flex-shrink-0 cursor-pointer"
    >
      <div
        className={`card-flip-container ${
          flippedCards.has(index) ? "flipped" : ""
        }`}
        onClick={(e) => handleClick(index, e)}
      >
        <div className="card-flip-inner">
          {/* Front of Card */}
          <div className="card-front">
            <div
              className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)",
              }}
            >
              <div
                className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)",
                  padding: "2px",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "xor",
                  WebkitMaskComposite: "xor",
                }}
              />

              <div className="flex flex-col items-start space-y-10 sm:space-y-12 md:space-y-14 lg:space-y-16 relative z-10">
                <div className="w-[65px] h-[75px] sm:w-[70px] sm:h-[85px] md:w-[75px] md:h-[90px] lg:w-[80px] lg:h-[100px] relative mt-2 sm:mt-3 md:mt-4">
                  <img
                    src={service.icon}
                    alt={`${service.title} icon`}
                    width={80}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] font-semibold leading-tight font-['Gilroy']">
                    {service.title}
                  </h2>
                  <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium leading-relaxed text-gray-300 font-['Gilroy']">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card */}
          <div className="card-back">
            <div
              className="w-full h-full bg-gradient-to-br from-gray-800/30 via-gray-900/20 to-black/40 backdrop-blur-xl rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(181, 164, 249, 0.4) 3%, rgba(0, 0, 0, 1) 24%, rgba(0, 0, 0, 1) 51%)",
              }}
            >
              <div
                className="absolute inset-0 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] xl:rounded-[56px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #0E0E0E 65%)",
                  padding: "2px",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "xor",
                  WebkitMaskComposite: "xor",
                }}
              />

              <div className="flex flex-col items-start space-y-4 sm:space-y-5 md:space-y-6 relative z-10 mt-4 sm:mt-6 md:mt-8">
                <h2 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-center font-['Gilroy'] w-full">
                  HERE'S WHAT YOU GET
                </h2>
                <div className="space-y-3 w-full">
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-2 h-2 bg-white rounded-sm mt-1.5"></div>
                      <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-gray-200 font-['Gilroy'] text-left">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="relative mt-16 overflow-hidden"
      style={{ paddingTop: "30px", paddingBottom: "30px" }}
    >
      <div className="animate-scroll-seamless-cards gap-12">
        {/* First set */}
        {services.map((service, index) => renderCard(service, index))}

        {/* Second set - duplicate */}
        {services.map((service, index) =>
          renderCard(service, index + services.length)
        )}

        {/* Third set - duplicate */}
        {services.map((service, index) =>
          renderCard(service, index + services.length * 2)
        )}
      </div>
    </div>
  );
};

export default FinancialServicesCarousel;
