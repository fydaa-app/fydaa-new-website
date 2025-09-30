import React from 'react';

const InvestorWarning: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-red-600 text-white py-16 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-gilroy mb-4">
            Investor Warning - Fraudulent Misuse of Our Details
          </h1>
          <p className="text-lg sm:text-xl text-red-100 font-inter">
            Important security information to protect you from fraud.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-12 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-gray-800 font-inter">
              
              <section className="p-6 bg-red-50 border-l-4 border-red-500">
                <h2 className="text-2xl font-semibold text-red-800 mb-4 font-gilroy">⚠️ IMPORTANT WARNING</h2>
                <p className="text-base leading-relaxed text-red-700">
                  We have been informed that fraudulent entities are misusing our company name, registration details, and SEBI registration number to deceive investors. Please be extremely cautious and verify all communications.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black mb-4 font-gilroy">1. How to Identify Fraudulent Communications</h2>
                <p className="text-base leading-relaxed mb-4">
                  Be suspicious of communications that:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                  <li>Ask for money transfers to personal accounts</li>
                  <li>Promise guaranteed returns or unrealistic profits</li>
                  <li>Request sensitive personal information via email or phone</li>
                  <li>Use unofficial email addresses or phone numbers</li>
                  <li>Create urgency or pressure you to act quickly</li>
                  <li>Ask for upfront payments or processing fees</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black mb-4 font-gilroy">2. Our Official Contact Information</h2>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-base leading-relaxed mb-2"><strong>Official Email:</strong> support@fydaa.com</p>
                  <p className="text-base leading-relaxed mb-2"><strong>Official Phone:</strong> +91 9136935300</p>
                  <p className="text-base leading-relaxed mb-2"><strong>Official Website:</strong> www.fydaa.com</p>
                  <p className="text-base leading-relaxed"><strong>Registered Office:</strong> #903, Ecostar Building, Off Aarey Road, Churi Wadi, Goregaon (East), Mumbai, Maharashtra - 400063</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black mb-4 font-gilroy">3. What to Do If You Suspect Fraud</h2>
                <p className="text-base leading-relaxed mb-4">
                  If you receive suspicious communications:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-base leading-relaxed">
                  <li>Do not respond or provide any personal information</li>
                  <li>Do not transfer any money or make payments</li>
                  <li>Contact us immediately at support@fydaa.com</li>
                  <li>Report to local police and cybercrime authorities</li>
                  <li>Inform SEBI about the fraudulent activity</li>
                  <li>Keep records of all suspicious communications</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black mb-4 font-gilroy">4. Our Legitimate Services</h2>
                <p className="text-base leading-relaxed mb-4">
                  Fydaa provides legitimate investment advisory services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
                  <li>We never ask for money transfers to personal accounts</li>
                  <li>All payments are made through official channels</li>
                  <li>We provide detailed invoices and receipts</li>
                  <li>Our advisors are properly licensed and registered</li>
                  <li>We maintain transparent fee structures</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-black mb-4 font-gilroy">5. Report Fraudulent Activity</h2>
                <p className="text-base leading-relaxed">
                  If you encounter fraudulent misuse of our details, please report it immediately:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-base"><strong>Email:</strong> fraud@fydaa.com</p>
                  <p className="text-base"><strong>Phone:</strong> +91 9136935300</p>
                  <p className="text-base"><strong>SEBI:</strong> sebi@sebi.gov.in</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorWarning;
