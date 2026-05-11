'use client';

import Image from 'next/image';

export default function CourseStructure() {
  return (
    <section id="course-structure" className="w-full px-4 py-16 bg-white flex justify-center">
      <div className="max-w-6xl w-full space-y-12">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#001E3C] to-[#19A86E] text-transparent bg-clip-text mb-2">
            Course Structure
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
          Our program is divided into two focused phases,
          each designed to build practical skills and prepare
          you for a successful career in investment advisory and
          kick start your entrepreneurial journey.
          </p>
        </div>

        {/* Box 1 - Finance Foundations */}
        <div className="rounded-xl p-6 md:flex md:items-stretch gap-8">
          <div className="bg-[#EBF0FA] p-4 rounded-lg flex items-center gap-4 md:w-1/3 relative">
            <div className="relative">
              <Image src="/carrers/Group26.png" alt="circle icon" width={40} height={40} />
              <Image
                src="/carrers/Group56.png"
                alt="overlay icon"
                width={20}
                height={20}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div>
              <p className="text-lg bg-gradient-to-r from-[#03003C] to-[#1E19A8] text-transparent bg-clip-text">
                Days 1–60
              </p>
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#03003C] to-[#1E19A8] text-transparent bg-clip-text">
              FINANCE FOUNDATIONS
              & CERTIFICATION
              </h3>
            </div>
          </div>
          <ul className="space-y-4 md:w-2/3">
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group1.png" alt="tick" width={30} height={30} className="mt-1" />
              <p><strong>Master Financial Concepts:</strong>  Learn essential financial principles
              through expert-led sessions and interactive learning, building a
               strong foundation for your investment journey.</p>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group1.png" alt="tick" width={30} height={30} className="mt-1" />
              <p><strong>Certification & Exam Preparation:</strong> Get ready for certification
              exams with focused preparation and practical assignments that
              reinforce key investment advisory topics.</p>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group1.png" alt="tick" width={30} height={30} className="mt-1" />
              <p><strong>Industry Insights & Practical Knowledge:</strong> Gain valuable insights
              into the investment advisory industry, understanding key trends and
              strategies from real-world perspectives</p>
            </li>
          </ul>
        </div>

        {/* Box 2 - From Knowledge to Clients */}
        <div className="rounded-xl p-6 md:flex md:items-stretch gap-8">
          <div className="bg-[#EAF5F0] p-4 rounded-lg flex items-center gap-4 md:w-1/3 relative">
            <div className="relative">
              <Image src="/carrers/Group22.png" alt="circle icon" width={40} height={40} />
              <Image
                src="/carrers/Group23.png"
                alt="overlay icon"
                width={20}
                height={20}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div>
              <p className="text-lg bg-gradient-to-r from-[#001E3C] to-[#19A86E] text-transparent bg-clip-text">
              Days 61–90
              </p>
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#001E3C] to-[#19A86E] text-transparent bg-clip-text">
              FROM KNOWLEDGE
              TO ADVISORY PRACTICE
              </h3>
            </div>
          </div>
          <ul className="space-y-4 md:w-2/3">
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group2.png" alt="tick" width={30} height={30} className="mt-1" />
              <p><strong>Client Acquisition & Relationship Building:</strong> Learn how to attract
              clients, build trust, and build long-term advisory relationships.</p>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group2.png" alt="tick" width={30} height={30} className="mt-1" />
              <p><strong>Effective Communication & Trust Building:</strong> Develop professional
              communication skills to understand client needs and establish credibility.</p>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group2.png" alt="tick" width={30} height={30} className="mt-1" />
              <p><strong>Entrepreneurial Advisory Approach:</strong> Learn how to build your own
              advisory journey and grow your client base over time.</p>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group2.png" alt="tick" width={30} height={30} className="mt-1" />
              <p><strong>Practical Experience & Expert Mentorship:</strong> Work on real advisory
              scenarios under the guidance of experienced industry professionals.</p>
            </li>
          </ul>
        </div>

        {/* Box 3 - Junior Wealth Advisor Internship */}
        <div className="rounded-xl p-6 md:flex md:items-stretch gap-8">
          <div className="bg-[#F7F2EA] p-4 rounded-lg flex items-center gap-4 md:w-1/3 relative">
            <div className="relative">
              <Image src="/carrers/Group24.png" alt="circle icon" width={40} height={40} />
              <Image
                src="/carrers/Group57.png"
                alt="overlay icon"
                width={20}
                height={20}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div>
              {/* <p className="text-lg bg-gradient-to-r from-[#3B3C00] to-[#A8A619] text-transparent bg-clip-text">
                Months 6–12
              </p> */}
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#3B3C00] to-[#A8A619] text-transparent bg-clip-text">
              PROGRAM OUTCOME
              </h3>
            </div>
          </div>
          <ul className="space-y-4 md:w-2/3">
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group3.png" alt="tick" width={30} height={30} className="mt-1" />
              <p><strong>Guaranteed Job at Fydaa:</strong> Start your journey as a Certified
              Investment Advisor</p>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group3.png" alt="tick" width={30} height={30} className="mt-1" />
              <p><strong>Earning Potential:</strong> Starting salary of ₹4 LPA + performance-based
              incentives with high growth Potential.</p>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group3.png" alt="tick" width={30} height={30} className="mt-1" />
              <p><strong>Entrepreneurial Growth:</strong> Build the foundation to grow into an
              independent financial advisor and create your own client base.</p>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group3.png" alt="tick" width={30} height={30} className="mt-1" />
              <p><strong>Real-World Readiness:</strong> Not just theory—step into the industry with
              confidence, practical exposure, and mentorship..</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}