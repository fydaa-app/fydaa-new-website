"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import router from "next/router";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">(
    "desktop"
  );
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Device detection
  useEffect(() => {
    const detectDevice = () => {
      if (typeof window !== "undefined") {
        const userAgent = window.navigator.userAgent.toLowerCase();

        if (/iphone|ipad|ipod/.test(userAgent)) {
          setDeviceType("ios");
        } else if (/android/.test(userAgent)) {
          setDeviceType("android");
        } else {
          setDeviceType("desktop");
        }
      }
    };

    detectDevice();
  }, []);

  // Clear any existing timeout
  const clearDropdownTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Handle mouse enter
  const handleMouseEnter = (dropdownType: string) => {
    clearDropdownTimeout();
    setActiveDropdown(dropdownType);
  };

  // Handle mouse leave with 3-second delay
  const handleMouseLeave = () => {
    clearDropdownTimeout();
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  //function that accepts an element id and offset, then scrolls smoothly with offset
  const scrollToWithOffset = (id: string, offset = 80) => {
    const element = document.getElementById(id);
    if (element) {
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Handler for clicking the item
  const handleClick = (id: string) => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;

      if (currentPath !== "/") {
        // Save target id in sessionStorage before redirect
        sessionStorage.setItem("scrollToId", id);
        window.location.href = `/#${id}`;
      } else {
        window.history.pushState(null, "", `/#${id}`);
        scrollToWithOffset(id, 80);
      }
    }
  };

  // Handler for download app button
  const handleDownloadApp = () => {
    const iosUrl =
      "https://apps.apple.com/in/app/fydaa-your-money-for-tomorrow/id1622175190";
    const androidUrl =
      "https://play.google.com/store/apps/details?id=com.app.fydaa&hl=en";

    if (deviceType === "ios") {
      window.open(iosUrl, "_blank");
    } else if (deviceType === "android") {
      window.open(androidUrl, "_blank");
    } else {
      // For desktop users, show both options or default to iOS
      window.open(iosUrl, "_blank");
    }
  };

  const whatWeOfferItems = {
    Dreams: ["Short Term", "Medium Term", "Long Term"],
    Services: [
      "Tax Consultancy",
      "Portfolio Management",
      "Investment Planning",
      "Expense Management",
      "Debt Management & Refinancing",
      "Emergency Fund Setup & Guidance",
      "Personalized Budgeting Plan",
      "Financial Health Checkup",
    ],
    Packages: [
      "Financial Fresh Start Plan",
      "Financial Foundation Plan",
      "Wealth Growth Plan",
    ],
  };

  const calculatorItems = [
    "SIP Calculator",
    "Lumpsum Calculator",
    "Goal Calculator",
    "EMI Calculator",
    "Tax Calculator",
    "Retirement Calculator",
    "Investment Return Calculator",
    "Compound Interest Calculator",
  ];

  // Portal dropdown rendering
  const renderDropdown = (type: string) => {
    if (typeof window === "undefined") return null;

    if (type === "whatWeOffer" && activeDropdown === "whatWeOffer") {
      return ReactDOM.createPortal(
        <div className="fixed top-[60px] sm:top-[70px] md:top-[80px] left-1/2 -translate-x-1/2 w-[95vw] sm:w-[80vw] md:w-[650px] lg:w-[700px] xl:w-[750px] bg-white/30 backdrop-blur-lg border border-white/20 rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] shadow-xl p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 z-[9999] max-h-[80vh] overflow-y-auto">
          {/* Dreams */}
          <div>
            <h3 className="text-black font-bold text-sm sm:text-base md:text-[16px] mb-2 sm:mb-3 md:mb-4">
              Dreams
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
              {whatWeOfferItems.Dreams.map((item) => (
                <li key={item}>
                  {item === "Short Term" ? (
                    <button
                      onClick={() => handleClick("short-term")}
                      className="text-[#484848] hover:text-black text-[10px] sm:text-[11px] md:text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap bg-transparent border-0 p-0 cursor-pointer"
                    >
                      {item}
                    </button>
                  ) : item === "Medium Term" ? (
                    <button
                      onClick={() => handleClick("medium-term")}
                      className="text-[#484848] hover:text-black text-[10px] sm:text-[11px] md:text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap bg-transparent border-0 p-0 cursor-pointer"
                    >
                      {item}
                    </button>
                  ) : item === "Long Term" ? (
                    <button
                      onClick={() => handleClick("long-term")}
                      className="text-[#484848] hover:text-black text-[10px] sm:text-[11px] md:text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap bg-transparent border-0 p-0 cursor-pointer"
                    >
                      {item}
                    </button>
                  ) : (
                    <span className="text-[#484848] hover:text-black text-[10px] sm:text-[11px] md:text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap">
                      {item}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-black font-bold text-sm sm:text-base md:text-[16px] mb-2 sm:mb-3 md:mb-4">
              Services
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
              {whatWeOfferItems.Services.map((item) => (
                <li key={item}>
                  <a
                    href={
                      item === "Tax Consultancy"
                        ? "/resource/TaxConsultancy"
                        : item === "Portfolio Management"
                        ? "/resource/PortfolioManagement"
                        : item === "Investment Planning"
                        ? "/resource/InvestmentPlanning"
                        : item === "Expense Management"
                        ? "/resource/ExpenseManagement"
                        : item === "Debt Management & Refinancing"
                        ? "/resource/DebtManagement&Refinancing"
                        : item === "Personalized Budgeting Plan"
                        ? "/resource/PersonalizedBudgetingplan"
                        : item === "Financial Health Checkup"
                        ? "/resource/FinancialHealthCheckup"
                        : item === "Emergency Fund Setup & Guidance"
                        ? "/resource/Emergencyfund"
                        : "#"
                    }
                    className="text-[#484848] hover:text-black text-[10px] sm:text-[11px] md:text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Packages */}
          <div>
            <h3 className="text-black font-bold text-sm sm:text-base md:text-[16px] mb-2 sm:mb-3 md:mb-4">
              Packages
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
              {whatWeOfferItems.Packages.map((item) => {
                const targetIdMap: Record<string, string> = {
                  "Financial Fresh Start Plan": "f",
                  "Financial Foundation Plan": "f",
                  "Wealth Growth Plan": "f",
                };

                const targetId = targetIdMap[item] || "";

                return (
                  <li key={item}>
                    {targetId ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick(targetId);
                        }}
                        className="text-[#484848] hover:text-black text-[10px] sm:text-[11px] md:text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap cursor-pointer bg-transparent border-0 p-0"
                      >
                        {item}
                      </button>
                    ) : (
                      <a
                        href="#"
                        className="text-[#484848] hover:text-black text-[10px] sm:text-[11px] md:text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap"
                      >
                        {item}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>,
        document.body
      );
    }

    if (type === "calculators" && activeDropdown === "calculators") {
      return ReactDOM.createPortal(
        <div className="fixed top-[60px] sm:top-[70px] md:top-[80px] right-[5%] sm:right-[10%] md:right-[33%] w-[90vw] sm:w-[240px] md:w-[240px] lg:w-[260px] xl:w-[280px] bg-white/30 backdrop-blur-lg border border-white/20 rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] shadow-lg p-3 sm:p-4 z-[9999]">
          <ul className="space-y-1">
            {calculatorItems.map((item) => (
              <li key={item}>
                <a
                  href="/"
                  className="text-[#484848] hover:text-black hover:bg-gray-100/20 text-[10px] sm:text-[11px] md:text-[12px] font-medium font-inter block py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-all duration-200 whitespace-nowrap"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>,
        document.body
      );
    }

    return null;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main navbar with glass effect */}
      <nav className="bg-[#FFFFFF]/30 backdrop-blur-lg border-b-2 border-b-gray-200/20 rounded-b-[20px] sm:rounded-b-[30px] lg:rounded-b-[40px] shadow-sm">
        <div className="relative flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 w-full max-w-[2400px] mx-auto">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-1 sm:gap-2 flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
          >
            <img
              src="/Fydaalogo.webp"
              alt="Fydaa Logo"
              className="h-6 sm:h-7 md:h-8 lg:h-8 xl:h-9 w-auto object-contain"
            />
            <img
              src="/Fydaalogotext.webp"
              alt="Fydaa"
              className="h-6 sm:h-7 md:h-8 lg:h-8 xl:h-9 object-contain"
            />
          </a>

          {/* Navigation */}
          <div className="hidden sm:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <ul className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7">

              {/* Home */}
              <li>
                <a
                  href="/"
                  className="text-black font-medium hover:text-gray-600 transition-colors duration-200 text-xs sm:text-sm md:text-base"
                >
                  Home
                </a>
              </li>

              {/* What we offer */}
              <li
                className="relative"
                onMouseEnter={() => handleMouseEnter("whatWeOffer")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="text-black font-medium flex items-center gap-1 hover:text-gray-600 transition-colors duration-200 text-xs sm:text-sm md:text-base">
                  What we Offer
                  <span className="text-xs ml-1 transition-transform duration-200">
                    ▼
                  </span>
                </button>
                {renderDropdown("whatWeOffer")}
              </li>

              <li>
                <a
                  href="/about"
                  className="text-black font-medium hover:text-gray-600 transition-colors duration-200 text-xs sm:text-sm md:text-base"
                >
                  About
                </a>
              </li>

              {/* Calculators */}
              {/* <li
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('calculators')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="text-black font-medium flex items-center gap-1 hover:text-gray-600 transition-colors duration-200">
                                    Calculators
                                    <span className="text-xs ml-1 transition-transform duration-200">▼</span>
                                </button>
                                {renderDropdown('calculators')}
                            </li> */}

              {/* <li>
                <a
                  href="https://www.blog.fydaa.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black font-medium hover:text-gray-600 transition-colors duration-200"
                >
                  Blogs
                </a>
              </li> */}
            </ul>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleDownloadApp}
              className="bg-black text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-medium cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-sm text-xs sm:text-sm md:text-base"
            >
              Download App
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-1.5 sm:p-2 text-black hover:text-gray-600 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="sm:hidden fixed top-[60px] left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200/20 shadow-lg z-[9998]">
              <div className="px-4 py-6 space-y-4">
                {/* What we Offer Mobile */}
                <div>
                  <button
                    onClick={() =>
                      setIsMobileDropdownOpen(!isMobileDropdownOpen)
                    }
                    className="flex items-center justify-between w-full text-left text-black font-medium text-base py-2"
                  >
                    What we Offer
                    <span
                      className={`transition-transform duration-200 ${
                        isMobileDropdownOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {isMobileDropdownOpen && (
                    <div className="mt-3 space-y-4 bg-gray-50/50 rounded-lg p-4">
                      {/* Dreams */}
                      <div>
                        <h4 className="text-black font-semibold text-sm mb-2">
                          Dreams
                        </h4>
                        <ul className="space-y-2">
                          {whatWeOfferItems.Dreams.map((item) => (
                            <li key={item}>
                              {item === "Short Term" ? (
                                <button
                                  onClick={() => {
                                    handleClick("short-term");
                                    setIsMenuOpen(false);
                                    setIsMobileDropdownOpen(false);
                                  }}
                                  className="text-gray-700 hover:text-black text-sm font-medium block w-full text-left py-1"
                                >
                                  {item}
                                </button>
                              ) : item === "Medium Term" ? (
                                <button
                                  onClick={() => {
                                    handleClick("medium-term");
                                    setIsMenuOpen(false);
                                    setIsMobileDropdownOpen(false);
                                  }}
                                  className="text-gray-700 hover:text-black text-sm font-medium block w-full text-left py-1"
                                >
                                  {item}
                                </button>
                              ) : item === "Long Term" ? (
                                <button
                                  onClick={() => {
                                    handleClick("long-term");
                                    setIsMenuOpen(false);
                                    setIsMobileDropdownOpen(false);
                                  }}
                                  className="text-gray-700 hover:text-black text-sm font-medium block w-full text-left py-1"
                                >
                                  {item}
                                </button>
                              ) : (
                                <span className="text-gray-700 text-sm font-medium block py-1">
                                  {item}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Services */}
                      <div>
                        <h4 className="text-black font-semibold text-sm mb-2">
                          Services
                        </h4>
                        <ul className="space-y-2">
                          {whatWeOfferItems.Services.map((item) => (
                            <li key={item}>
                              <a
                                href={
                                  item === "Tax Consultancy"
                                    ? "/resource/TaxConsultancy"
                                    : item === "Portfolio Management"
                                    ? "/resource/PortfolioManagement"
                                    : item === "Investment Planning"
                                    ? "/resource/InvestmentPlanning"
                                    : item === "Expense Management"
                                    ? "/resource/ExpenseManagement"
                                    : item === "Debt Management & Refinancing"
                                    ? "/resource/DebtManagement&Refinancing"
                                    : item === "Personalized Budgeting Plan"
                                    ? "/resource/PersonalizedBudgetingplan"
                                    : item === "Financial Health Checkup"
                                    ? "/resource/FinancialHealthCheckup"
                                    : item === "Emergency Fund Setup & Guidance"
                                    ? "/resource/Emergencyfund"
                                    : "#"
                                }
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setIsMobileDropdownOpen(false);
                                }}
                                className="text-gray-700 hover:text-black text-sm font-medium block py-1"
                              >
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Packages */}
                      <div>
                        <h4 className="text-black font-semibold text-sm mb-2">
                          Packages
                        </h4>
                        <ul className="space-y-2">
                          {whatWeOfferItems.Packages.map((item) => {
                            const targetIdMap: Record<string, string> = {
                              "Financial Fresh Start Plan": "f",
                              "Financial Foundation Plan": "f",
                              "Wealth Growth Plan": "f",
                            };

                            const targetId = targetIdMap[item] || "";

                            return (
                              <li key={item}>
                                {targetId ? (
                                  <button
                                    onClick={() => {
                                      handleClick(targetId);
                                      setIsMenuOpen(false);
                                      setIsMobileDropdownOpen(false);
                                    }}
                                    className="text-gray-700 hover:text-black text-sm font-medium block w-full text-left py-1"
                                  >
                                    {item}
                                  </button>
                                ) : (
                                  <a
                                    href="#"
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      setIsMobileDropdownOpen(false);
                                    }}
                                    className="text-gray-700 hover:text-black text-sm font-medium block py-1"
                                  >
                                    {item}
                                  </a>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* About */}
                <a
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-black font-medium text-base py-2 hover:text-gray-600 transition-colors duration-200"
                >
                  About
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
