"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import router from "next/router";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Device detection
  useEffect(() => {
    const detectDevice = () => {
      if (typeof window !== 'undefined') {
        const userAgent = window.navigator.userAgent.toLowerCase();
        
        if (/iphone|ipad|ipod/.test(userAgent)) {
          setDeviceType('ios');
        } else if (/android/.test(userAgent)) {
          setDeviceType('android');
        } else {
          setDeviceType('desktop');
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
    const iosUrl = "https://apps.apple.com/in/app/fydaa-your-money-for-tomorrow/id1622175190";
    const androidUrl = "https://play.google.com/store/apps/details?id=com.app.fydaa&hl=en";
    
    if (deviceType === 'ios') {
      window.open(iosUrl, '_blank');
    } else if (deviceType === 'android') {
      window.open(androidUrl, '_blank');
    } else {
      // For desktop users, show both options or default to iOS
      window.open(iosUrl, '_blank');
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
        <div className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[650px] bg-white/30 backdrop-blur-lg border border-white/20 rounded-[40px] shadow-xl p-8 grid grid-cols-3 gap-10 z-[9999]">
          {/* Dreams */}
          <div>
            <h3 className="text-black font-bold text-[16px] mb-4">Dreams</h3>
            <ul className="space-y-2.5">
              {whatWeOfferItems.Dreams.map((item) => (
                <li key={item}>
                  {item === "Short Term" ? (
                    <button
                      onClick={() => handleClick("short-term")}
                      className="text-[#484848] hover:text-black text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap bg-transparent border-0 p-0 cursor-pointer"
                    >
                      {item}
                    </button>
                  ) : item === "Medium Term" ? (
                    <button
                      onClick={() => handleClick("medium-term")}
                      className="text-[#484848] hover:text-black text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap bg-transparent border-0 p-0 cursor-pointer"
                    >
                      {item}
                    </button>
                  ) : item === "Long Term" ? (
                    <button
                      onClick={() => handleClick("long-term")}
                      className="text-[#484848] hover:text-black text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap bg-transparent border-0 p-0 cursor-pointer"
                    >
                      {item}
                    </button>
                  ) : (
                    <span className="text-[#484848] hover:text-black text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap">
                      {item}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-black font-bold text-[16px] mb-4">Services</h3>
            <ul className="space-y-2.5">
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
                    className="text-[#484848] hover:text-black text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Packages */}
          <div>
            <h3 className="text-black font-bold text-[16px] mb-4">Packages</h3>
            <ul className="space-y-2.5">
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
                        className="text-[#484848] hover:text-black text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap cursor-pointer bg-transparent border-0 p-0"
                      >
                        {item}
                      </button>
                    ) : (
                      <a
                        href="#"
                        className="text-[#484848] hover:text-black text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap"
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
        <div className="fixed top-[80px] right-[33%] w-[240px] bg-white/30 backdrop-blur-lg border border-white/20 rounded-[40px] shadow-lg p-4 z-[9999]">
          <ul className="space-y-1">
            {calculatorItems.map((item) => (
              <li key={item}>
                <a
                  href="/"
                  className="text-[#484848] hover:text-black hover:bg-gray-100/20 text-[12px] font-medium font-inter block py-2 px-3 rounded-lg transition-all duration-200 whitespace-nowrap"
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
      <nav className="bg-[#FFFFFF]/30 backdrop-blur-lg border-b-2 border-b-gray-200/20 rounded-b-[40px] shadow-sm">
        <div className="relative flex items-center justify-between px-6 lg:px-12 py-3 w-full max-w-[2400px] mx-auto">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
          >
            <img
              src="/Fydaalogo.webp"
              alt="Fydaa Logo"
              className="h-8 w-auto object-contain"
            />
            <img
              src="/Fydaalogotext.webp"
              alt="Fydaa"
              className="h-8 object-contain"
            />
          </a>

          {/* Navigation */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <ul className="flex items-center gap-7">
              {/* What we offer */}
              <li
                className="relative"
                onMouseEnter={() => handleMouseEnter("whatWeOffer")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="text-black font-medium flex items-center gap-1 hover:text-gray-600 transition-colors duration-200">
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
                  className="text-black font-medium hover:text-gray-600 transition-colors duration-200"
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
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={handleDownloadApp}
              className="bg-black text-white px-6 py-2 rounded-full font-medium cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-sm"
            >
              Download App
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-black hover:text-gray-600 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
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
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
