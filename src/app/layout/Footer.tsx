"use client";
import React, { useState } from "react";

const Footer: React.FC = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <footer className="bg-black text-white py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-50">
      <div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-6 sm:mb-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
              {/* LinkedIn Icon */}
              <a
                href="https://www.linkedin.com/company/fydaaoffical"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              {/* Instagram Icon */}
            <a
              href="https://www.instagram.com/fydaaofficial/"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 7.75 4zm9.5 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
              </svg>
            </a>

            {/* Facebook Icon */}
            <a
              href="https://www.facebook.com/fydaaofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.009 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.082 24 18.092 24 12.073z" />
              </svg>
            </a>
            </div>



            {/* Company Information */}
            <div className="space-y-1 sm:space-y-2">
              <p className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] font-inter font-normal">
                Registered office
              </p>
              <p className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] font-inter font-normal leading-relaxed">
                #903, Ecostar Building, Off Aarey Road, Churi Wadi, Goregaon
                (East), Mumbai, Maharashtra - 400063.
              </p>
              <p className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] font-inter font-normal">
                Phone:{" "}
                <a
                  href="tel:+919136935300"
                  className="underline hover:text-gray-300 transition-colors duration-200"
                >
                  +91 9136935300
                </a>
              </p>
            </div>
          </div>

          {/* Right Column - Quick Links */}
          <div className="lg:col-span-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-inter font-semibold">
                Quick Links
              </h3>

              {/* UPI Handles Button */}
              <button
                onClick={() => setShowEmailModal(true)}
                className="flex items-center justify-center cursor-pointer transition-transform duration-300 ease-in-out w-full sm:w-auto max-w-none sm:max-w-[150px] h-[40px] sm:h-[42px] md:h-[45px] xl:h-[48px] mt-0 bg-black rounded-lg border border-white text-white font-semibold text-[12px] sm:text-[13px] md:text-[14px] xl:text-[16px] shadow-lg hover:scale-105 px-4"
              >
                UPI Handles
              </button>
            </div>
            <div className="space-y-3">
              <a
                href="/quicklinks/Terms&Conditions"
                className="block text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium"
              >
                Terms & Conditions
              </a>
              <a
                href="/quicklinks/PrivacyPolicy"
                className="block text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium"
              >
                Privacy Policy
              </a>
              <a
                href="/quicklinks/RefundPolicy"
                className="block text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium"
              >
                Refund Policy
              </a>
              <a
                href="/quicklinks/InvestorCharter"
                className="block text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium"
              >
                Investor Charter
              </a>
              <a
                href="/quicklinks/Complaints"
                className="block text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium"
              >
                Complaints
              </a>
              <a
                href="/quicklinks/Grievance"
                className="block text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium"
              >
                Grievance Redressal / Escalation Matrix
              </a>
              <a
                href="/quicklinks/InvestorWarning"
                className="block text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium"
              >
                Investor Warning - Fraudulent Misuse of Our Details
              </a>
              <a
                href="/quicklinks/VigilanceAwarenessWeek"
                className="block text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium"
              >
                Vigilance Awareness Week
              </a>
              <a
                href="/quicklinks/Disclosure"
                className="block text-white hover:text-gray-300 transition-colors duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] font-inter font-medium"
              >
                Disclosure
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-white text-sm sm:text-base font-inter font-normal mb-4 text-center">
            Disclaimer
          </h3>
          <div className="space-y-3 text-xs sm:text-sm md:text-base font-inter font-normal text-white leading-relaxed text-left break-words">
            <p>
              By using this website, you understand the information being
              presented is provided for informational purposes only and agree to
              our Terms of Service and Privacy Policy. Fydaa relies on
              information from various sources believed to be reliable, but
              cannot guarantee the accuracy and completeness of that
              information.
            </p>
            <p>
              The information contained in this communication is provided for
              general informational purposes only, and should not be construed
              as investment advice. Any links provided to other sites are
              offered as a matter of convenience and are not intended to imply
              that Fydaa or its affiliates endorses, sponsors, promotes and/or
              is affiliated with the owners of or participants in those sites,
              or endorses any information contained on those sites, unless
              expressly stated otherwise.
            </p>
            <p>
              Multistrato Capital Advisors Private Limited
              <br />
              Type of Registration: Non-Individual. RIA Registration Number:
              INA000015969, Validity: Perpetual
              <br />
              Registered Office Address: 903, Ecostar Building, Off Aarey Road,
              Churi Wadi, Goregaon (East), Mumbai, Maharashtra – 400063.
              <br />
              GST number: 27AAHCM9321Q1ZS
            </p>
            <p>
              Fydaa Analytics Private Limited
              <br />
              AMFI registered ARN: 358522
            </p>
            <p>
              Contact details of Principal Officer
              <br />
              Name: Kuntal Bhansali
              <br />
              Email: support@fydaa.com
            </p>
            <p>
              SEBI regional/local address
              <br />
              SEBI Bhavan BKC, Plot No.C4-A, 'G' Block, Bandra-Kurla Complex,
              Bandra (East), Mumbai - 400051, Maharashtra
              <br />
              E-mail: sebi@sebi.gov.in
            </p>
            <p>
              'Registration granted by SEBI, membership of BASL and
              certification from NISM in no way guarantee performance of the
              intermediary or provide any assurance of returns to investors.'
            </p>
            <p>
              "Investment in securities market are subject to market risks. Read
              all the related documents carefully before investing."
            </p>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="flex justify-center">
          <p className="text-white text-[16px] font-inter font-normal">
            © 2025 - Copyright
          </p>
        </div>
      </div>

      {/* UPI Handles Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] p-4">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[350px] md:w-[380px] lg:w-[380px] xl:w-[420px] max-w-[95vw] max-h-[90vh] border border-white bg-black rounded-lg shadow-2xl p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7 outline-none overflow-auto">
            <h2 className="text-center text-white font-semibold mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-7 text-[20px] sm:text-[22px] md:text-[24px] lg:text-[24px] xl:text-[26px]">
              Verified UPI Handles
            </h2>

            <div className="flex flex-col gap-3 sm:gap-4 md:gap-4 lg:gap-4 xl:gap-5">
              <div className="p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5 bg-[#1a1a1a] rounded border border-[#333]">
                <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] font-medium break-all">
                  multistrato.capitaladvisors.ia@validyes
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5 bg-[#1a1a1a] rounded border border-[#333]">
                <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] font-medium break-all">
                  multistrato.ia@validyes
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5 bg-[#1a1a1a] rounded border border-[#333]">
                <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] font-medium break-all">
                  savestment.ia@validyes
                </p>
              </div>

              <div className="p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5 bg-[#1a1a1a] rounded border border-[#333]">
                <p className="text-white text-[12px] sm:text-[13px] md:text-[14px] lg:text-[14px] xl:text-[15px] font-medium break-all">
                  fydaa.ia@validyes
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-8 xl:mt-9 flex justify-center">
              <button
                onClick={() => setShowEmailModal(false)}
                className="bg-white text-black text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] xl:text-[17px] px-6 sm:px-7 md:px-8 lg:px-8 xl:px-8 py-2 sm:py-2 md:py-2 lg:py-2 xl:py-3 min-w-[80px] sm:min-w-[90px] md:min-w-[100px] lg:min-w-[100px] xl:min-w-[110px] font-medium border border-white rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
