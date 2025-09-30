"use client"
import React, { useState, useEffect } from 'react'

const Fydaaexperience = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 4000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-white w-full pb-20 h-auto flex flex-col items-center pt-28 mb-16">
      <h1 className="text-[56px] font-semibold font-['Gilroy'] text-center">
        The Fydaa Experience
      </h1>
      <p className="text-[18px] font-regular font-['Inter'] text-center mt-6">
        Every user is different. That's why our plans are built just for you.
      </p>
      
      {/* Main Content Section */}
      <div className="flex items-center justify-between w-full max-w-7xl px-20 mt-20">
        {/* Left Side - Mobile Device Placeholder */}
        <div className="w-[266px] h-[502px] bg-black rounded-[39px] ml-52"></div>
        
        {/* Right Side - Features List */}
        <div className="flex flex-col space-y-8 max-w-md mr-64" >
          {/* Feature 1 */}
          <div className="flex items-center space-x-4 relative">
            {activeFeature === 0 && (
              <img 
                src="/experience/highlight.png" 
                alt="highlight" 
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div className={`w-1 h-8 ${activeFeature === 0 ? 'bg-black' : 'bg-gray-400'} z-10`}></div>
            <span className={`font-['Inter'] text-[16px] font-medium ${activeFeature === 0 ? 'text-black' : 'text-gray-500'} z-10`}>
              Understand Your Money Habits
            </span>
          </div>
          
          
          {/* Feature 2 */}
          <div className="flex items-center space-x-4 relative">
            {activeFeature === 1 && (
              <img 
                src="/experience/highlight.png" 
                alt="highlight" 
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div className={`w-1 h-8 ${activeFeature === 1 ? 'bg-black' : 'bg-gray-400'} z-10`}></div>
            <span className={`font-['Inter'] text-[16px] font-medium ${activeFeature === 1 ? 'text-black' : 'text-gray-500'} z-10`}>
              Assess Your Risk Profile
            </span>
          </div>
          
          {/* Feature 3 */}
          <div className="flex items-center space-x-4 relative">
            {activeFeature === 2 && (
              <img 
                src="/experience/highlight.png" 
                alt="highlight" 
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div className={`w-1 h-8 ${activeFeature === 2 ? 'bg-black' : 'bg-gray-400'} z-10`}></div>
            <span className={`font-['Inter'] text-[16px] font-medium ${activeFeature === 2 ? 'text-black' : 'text-gray-500'} z-10`}>
              Set Realistic Goals
            </span>
          </div>
          
          {/* Feature 4 */}
          <div className="flex items-center space-x-4 relative">
            {activeFeature === 3 && (
              <img 
                src="/experience/highlight.png" 
                alt="highlight" 
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div className={`w-1 h-8 ${activeFeature === 3 ? 'bg-black' : 'bg-gray-400'} z-10`}></div>
            <span className={`font-['Inter'] text-[16px] font-medium ${activeFeature === 3 ? 'text-black' : 'text-gray-500'} z-10`}>
              Design Your Personal Portfolio
            </span>
          </div>
          
          {/* Feature 5 */}
          <div className="flex items-center space-x-4 relative">
            {activeFeature === 4 && (
              <img 
                src="/experience/highlight.png" 
                alt="highlight" 
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div className={`w-1 h-8 ${activeFeature === 4 ? 'bg-black' : 'bg-gray-400'} z-10`}></div>
            <span className={`font-['Inter'] text-[16px] font-medium ${activeFeature === 4 ? 'text-black' : 'text-gray-500'} z-10`}>
              Implementation Made Easy
            </span>
          </div>
          
          {/* Feature 6 */}
          <div className="flex items-center space-x-4 relative">
            {activeFeature === 5 && (
              <img 
                src="/experience/highlight.png" 
                alt="highlight" 
                className="absolute left-0 top-0 w-full h-full object-cover z-0"
              />
            )}
            <div className={`w-1 h-8 ${activeFeature === 5 ? 'bg-black' : 'bg-gray-400'} z-10`}></div>
            <span className={`font-['Inter'] text-[16px] font-medium ${activeFeature === 5 ? 'text-black' : 'text-gray-500'} z-10`}>
              Track and Tweak
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-12">
            <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium font-['Inter'] hover:bg-gray-800 transition-colors">
              Download Our App
            </button>
            <div className="flex items-center space-x-2 text-black text-sm font-medium font-['Inter'] cursor-pointer hover:text-gray-700 transition-colors">
              <span>Watch Demo</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      
      

    </div>
  )
}

export default Fydaaexperience