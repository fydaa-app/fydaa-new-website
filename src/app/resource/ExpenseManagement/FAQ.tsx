'use client'
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([0, 1, 2]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "How can I track my daily expenses effectively?",
      answer: "Use an expense tracking tool like Fydaa that categorizes your spends and sends you alerts before you overshoot your budget."
    },
    {
      question: "Why is expense management important?",
      answer: "It helps you avoid overspending, save for bigger goals, and feel in control of your finances."
    },
    {
      question: "Can expense management really help me save more?",
      answer: "Yes! By identifying unnecessary spends and setting limits, you’ll be surprised how much you can save every month."
    },
    {
      question: "volutpat libero, id varius ultrices Nunc males",
      answer: "This is a placeholder answer for the fourth FAQ item. The actual content would be provided based on your specific requirements."
    }
  ];

  return (
    <div className="w-full relative">
      {/* Top Gradient Border */}
      <div className="w-screen -mt-8 -mx-[50vw] left-1/2 relative z-0">
        <img 
          src="/resource/gradientborder.png" 
          alt="Gradient Border" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <section className="bg-white py-24 px-12 relative z-10">
        <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column - Title, Description & Graphic */}
          <div className="space-y-8">
            <div>
              <h2 className="text-[48px] font-['Gilroy'] font-bold text-gray-800 mb-6">
                Still Have Questions?
              </h2>
              <p className="font-['Inter'] font-normal text-[18px] text-gray-700 leading-relaxed">
              Take control of your spending with Fydaa’s expense management tools. Track, categorize,
               and optimize your expenses to save more and meet your financial goals without giving up
                what you love.
              </p>
            </div>
            
            {/* FAQ Graphic */}
            <div className="w-[500px] h-[500px] mx-auto lg:mx-0">
              <img 
                src="/resource/faq.png" 
                alt="FAQ Graphic" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Right Column - Search & FAQ List */}
          <div className="space-y-8">
            {/* Search Bar */}
            <div className="flex gap-4 mb-36">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search Positions"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                Search
              </button>
            </div>
            
            {/* FAQ Accordion */}
            <div className="space-y-0">
              {faqData.map((item, index) => (
                <div key={index}>
                  <div className="rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <span className="font-['Inter'] font-medium text-[20px] text-[#21272A]">{item.question}</span>
                      <svg 
                        className={`w-5 h-5 text-gray-600 transition-transform ${openItems.includes(index) ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {openItems.includes(index) && (
                      <div className="px-6 py-4 bg-white">
                        <p className="font-['Inter'] font-normal text-[16px] text-[#757575] leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Line Divider */}
                  <div className="h-px bg-gray-200 my-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Bottom Gradient Border - Full viewport width */}
      <div className="w-screen -mb-8 -mx-[50vw] left-1/2 relative z-0">
        <img 
          src="/resource/gradientborder.png" 
          alt="Gradient Border" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default FAQ;
