import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-50">
            <div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto">
                {/* Top Section - Navigation Links */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap items-start md:items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-6 sm:mb-8">
                    <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium">
                        Use cases
                    </a>
                    <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium">
                        Pricing
                    </a>
                    <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium">
                        Blog
                    </a>
                    <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium">
                        About
                    </a>
                    <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium">
                        Career
                    </a>
                    <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium">
                        Imprint
                    </a>
                    <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium">
                        Cookie Policy
                    </a>
                    <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium">
                        Contact Us
                    </a>
                </div>

                {/* Middle Section - Social Media Icons */}
                <div className="flex items-center gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
                    {/* LinkedIn Icon */}
                    <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                    
                    {/* GitHub Icon */}
                    <a href="#" className="text-white hover:text-gray-300 transition-colors duration-200">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                </div>

                {/* Lower Section - Company Information */}
                <div className="space-y-1 sm:space-y-2 mb-6 sm:mb-8">
                    <p className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] font-inter font-normal">
                        Unit of Multistrato Capital Advisors Private Limited
                    </p>
                    <p className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] font-inter font-normal">
                        Registered office
                    </p>
                    <p className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] font-inter font-normal leading-relaxed">
                        #903, Ecostar Building, Off Aarey Road, Churi Wadi, Goregaon (East), Mumbai, Maharashtra - 400063.
                    </p>
                    <p className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] font-inter font-normal">
                        Phone: <a href="tel:+919136935300" className="underline hover:text-gray-300 transition-colors duration-200">+91 9136935300</a>
                    </p>
                </div>

                {/* Bottom Section - Copyright */}
                <div className="flex justify-center md:justify-end">
                    <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-normal">
                        © 2025 - Copyright
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;