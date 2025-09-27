'use client';
import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    const whatWeOfferItems = {
        Dreams: ['Short Term', 'Medium Term', 'Long Term'],
        Services: [
            'Tax Consultancy',
            'Portfolio Management',
            'Investment Planning',
            'Expense Management',
            'Debt Management & Refinancing',
            'Emergency Fund Setup & Guidance',
            'Personalized Budgeting Plan',
            'Financial Health Checkup'
        ],
        Packages: [
            'Financial Fresh Start Plan',
            'Financial Foundation Plan',
            'Wealth Growth Plan'
        ]
    };

    const calculatorItems = [
        'SIP Calculator',
        'Lumpsum Calculator',
        'Goal Calculator',
        'EMI Calculator',
        'Tax Calculator',
        'Retirement Calculator',
        'Investment Return Calculator',
        'Compound Interest Calculator'
    ];

    // Portal dropdown rendering
    const renderDropdown = (type: string) => {
        if (typeof window === 'undefined') return null;

        if (type === 'whatWeOffer' && activeDropdown === 'whatWeOffer') {
            return ReactDOM.createPortal(
                <div className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[650px] bg-white/30 backdrop-blur-lg border border-white/20 rounded-[40px] shadow-xl p-8 grid grid-cols-3 gap-10 z-[9999]">
                    {/* Dreams */}
                    <div>
                        <h3 className="text-black font-bold text-[16px] mb-4">Dreams</h3>
                        <ul className="space-y-2.5">
                            {whatWeOfferItems.Dreams.map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[#484848] hover:text-black text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap"
                                    >
                                        {item}
                                    </a>
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
                                        href={item === 'Tax Consultancy' ? '/resource/TaxConsultancy' : item === 'Portfolio Management' ? '/resource/PortfolioManagement' : item === 'Investment Planning' ? '/resource/InvestmentPlanning' : item === 'Expense Management' ? '/resource/ExpenseManagement' : item === 'Debt Management & Refinancing' ? '/resource/DebtManagement&Refinancing' : item === 'Personalized Budgeting Plan' ? '/resource/PersonalizedBudgetingplan' : item === 'Financial Health Checkup' ? '/resource/FinancialHealthCheckup' : item === 'Emergency Fund Setup & Guidance' ? '/resource/Emergencyfund' : '#'}
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
                            {whatWeOfferItems.Packages.map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[#484848] hover:text-black text-[12px] font-medium font-inter block transition-colors duration-200 whitespace-nowrap"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>,
                document.body
            );
        }

        if (type === 'calculators' && activeDropdown === 'calculators') {
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
                    <a href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity duration-200">
                        <img src="/Fydaalogo.webp" alt="Fydaa Logo" className="h-8 w-auto object-contain" />
                        <img src="/Fydaalogotext.webp" alt="Fydaa" className="h-8 object-contain" />
                    </a>

                    {/* Navigation */}
                    <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                        <ul className="flex items-center gap-7">
                            {/* What we offer */}
                            <li
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('whatWeOffer')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="text-black font-medium flex items-center gap-1 hover:text-gray-600 transition-colors duration-200">
                                    What we Offer
                                    <span className="text-xs ml-1 transition-transform duration-200">▼</span>
                                </button>
                                {renderDropdown('whatWeOffer')}
                            </li>

                            <li>
                                <a href="/about" className="text-black font-medium hover:text-gray-600 transition-colors duration-200">
                                    About
                                </a>
                            </li>

                            {/* Calculators */}
                            <li
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('calculators')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="text-black font-medium flex items-center gap-1 hover:text-gray-600 transition-colors duration-200">
                                    Calculators
                                    <span className="text-xs ml-1 transition-transform duration-200">▼</span>
                                </button>
                                {renderDropdown('calculators')}
                            </li>

                            <li>
                                <a href="#" className="text-black font-medium hover:text-gray-600 transition-colors duration-200">
                                    Blogs
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button className="bg-black text-white px-6 py-2 rounded-full font-medium cursor-pointer hover:bg-gray-800 transition-all duration-200 shadow-sm">
                            Download App
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-black hover:text-gray-600 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
