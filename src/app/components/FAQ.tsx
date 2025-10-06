'use client'
import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "Is fydaa registered with any financial regulators in India?",
      answer: "Yes, fydaa is the Investment Advisory unit of Multistrato Capital Advisors Private Limited – a SEBI Registered Investment Adviser. Click here to verify."
    },
    {
      id: 2,
      question: "How fydaa is different from a broker or mutual fund distributor?",
      answer: "Unlike your broker, fydaa do not execute the trades but advice on which securities to buy/sell on periodic basis based on your risk profile. Your broker charges brokerage on every transaction. Mutual fund distributors on the other hand help invest by selling schemes of Asset Management companies for a distributor fee."
    },
    {
      id: 3,
      question: "How fydaa makes money?",
      answer: "Fydaa have no conflict of interest when it advises you. The only income fydaa makes is direct fee charged to you as a client. There are no other revenue or commission from brokers or mutual fund houses."
    },
    {
      id: 4,
      question: "What is the advisory fee of fydaa?",
      answer: "Fydaa charges a nominal fixed fee per month starting from Rs. 20 only."
    },
    {
      id: 5,
      question: "Can I get my fee refund?",
      answer: "No. However, you can discontinue your fydaa subscription anytime with just a click."
    },
    {
      id: 6,
      question: "Is there any account minimum to avail services from fydaa?",
      answer: "There are no account minimums but since fydaa creates a portfolio of securities, the minimum amount can vary anywhere from INR 100 to 10000."
    },
    {
      id: 7,
      question: "What if I don't have any broker/demat account?",
      answer: "No worries, our platform provides you a seamless account opening with any broker of your choice in just few clicks."
    },
    {
      id: 8,
      question: "How do I add or withdraw my investments from my fydaa account?",
      answer: "Fydaa tech platform provides a seamless few click to add or withdraw money from your broker/ demat account. Please note, fydaa never keeps money nor securities of any investors. All your money and securities are always with your respective bank and broker account."
    },
 
 
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
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
          {faqData.map((item, index) => (
            <div key={item.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full py-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 px-4"
              >
                <span className="text-lg sm:text-xl text-black font-medium pr-8">
                  {item.question}
                </span>
                <div className="flex-shrink-0">
                  <svg 
                    className={`w-6 h-6 text-black transition-transform duration-200 ${
                      openItems.includes(item.id) ? 'rotate-180' : ''
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
              {openItems.includes(item.id) && (
                <div className="px-4 pb-8">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    {item.answer}
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

export default FAQ;
