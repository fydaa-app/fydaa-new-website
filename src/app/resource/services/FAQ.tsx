"use client";
import React, { useState } from "react";
import { ServiceData } from "@/data/services/types";

interface FAQProps {
  faqs: ServiceData["faqs"];
}

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-[#ffffff] py-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-16">
          <h2 className="text-[56px] font-semibold text-black mb-6 font-gilroy">
            FAQs
          </h2>
          <p className="text-[18px] text-black font-normal max-w-2xl mx-auto font-inter">
            Feel free to contact us if you have any questions after reviewing
            our FAQs.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-0 mt-24">
          {faqs.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-200 last:border-b-0"
            >
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
                      openItems.includes(item.id) ? "rotate-180" : ""
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
