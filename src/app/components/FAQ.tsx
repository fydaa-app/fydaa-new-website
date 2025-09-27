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
      question: "What is GlassFlow?",
      answer: "GlassFlow is a modern data streaming platform that enables real-time data processing and analytics with seamless integration capabilities."
    },
    {
      id: 2,
      question: "What is the difference to Kafka/Lambda/Beam/Flink, etc.?",
      answer: "GlassFlow provides a unified approach that combines the best features of traditional streaming platforms while offering enhanced performance and easier management."
    },
    {
      id: 3,
      question: "How much does GlassFlow cost?",
      answer: "GlassFlow offers flexible pricing plans starting from $99/month for basic usage, with enterprise plans available for larger deployments."
    },
    {
      id: 4,
      question: "Where does GlassFlow fit in my data architecture?",
      answer: "GlassFlow can be integrated as a middleware layer between your data sources and analytics platforms, providing real-time streaming capabilities."
    },
    {
      id: 5,
      question: "What if I don't find the connector that I am looking for?",
      answer: "We offer custom connector development services and can work with you to build connectors for your specific data sources and requirements."
    },
    {
      id: 6,
      question: "How good does GlassFlow perform compared to other solutions?",
      answer: "GlassFlow consistently outperforms traditional solutions with up to 3x faster processing speeds and 50% lower latency in real-world benchmarks."
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="bg-[#ffffff] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
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
