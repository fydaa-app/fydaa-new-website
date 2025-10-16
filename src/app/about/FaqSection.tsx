'use client';
import React, { useState } from 'react';

interface FAQEntry {
  id: number;
  questionText: string;
  answerText: string;
}

const FaqSection: React.FC = () => {
  const [expandedFaqIds, setExpandedFaqIds] = useState<number[]>([]);

  const faqEntries: FAQEntry[] = [
    {
      id: 1,
      questionText: "Is fydaa registered with any financial regulators in India?",
      answerText: "Yes, fydaa is the Investment Advisory unit of Multistrato Capital Advisors Private Limited – a SEBI Registered Investment Adviser. Click here to verify."
    },
    {
      id: 2,
      questionText: "How fydaa is different from a broker or mutual fund distributor?",
      answerText: "Unlike your broker, fydaa do not execute the trades but advice on which securities to buy/sell on periodic basis based on your risk profile. Your broker charges brokerage on every transaction. Mutual fund distributors on the other hand help invest by selling schemes of Asset Management companies for a distributor fee."
    },
    {
      id: 3,
      questionText: "How fydaa makes money?",
      answerText: "Fydaa have no conflict of interest when it advises you. The only income fydaa makes is direct fee charged to you as a client. There are no other revenue or commission from brokers or mutual fund houses."
    },
    {
      id: 4,
      questionText: "What is the advisory fee of fydaa?",
      answerText: "Fydaa charges a nominal fee of 0.4% per year of Asset under management. That mean for every 10000 rupees worth of investment, you are charged just INR 40 as advisory fee. This is fraction of what other advisor charges. (Traditional mutual funds and advisor's charges in excess of 1.5 - 2 %)"
    }
  ];

  const toggleFaqItem = (id: number) => {
    setExpandedFaqIds(previousExpandedIds =>
      previousExpandedIds.includes(id)
        ? previousExpandedIds.filter(expandedId => expandedId !== id)
        : [...previousExpandedIds, id]
    );
  };

  return (
    <div className="bg-[#ffffff] py-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h1 className="text-[56px] font-semibold text-black mb-6 font-gilroy">
            FAQs
          </h1>
          <p className="text-[18px] text-black font-normal max-w-2xl mx-auto font-inter">
            Feel free to contact us if you have any questions after reviewing our FAQs.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-0 mt-24">
          {faqEntries.map((faqItem) => (
            <div key={faqItem.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleFaqItem(faqItem.id)}
                className="w-full py-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 px-4"
              >
                <span className="text-lg sm:text-xl text-black font-medium pr-8">
                  {faqItem.questionText}
                </span>
                <div className="flex-shrink-0">
                  <svg 
                    className={`w-6 h-6 text-black transition-transform duration-200 ${
                      expandedFaqIds.includes(faqItem.id) ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </div>
              </button>

              {/* Answer */}
              {expandedFaqIds.includes(faqItem.id) && (
                <div className="px-4 pb-8">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    {faqItem.answerText}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
