'use client';

import Image from 'next/image';

const comparisonData = [
  {
    feature: 'Job Guarantee',
    fyiap: { icon: '/carrers/Group33.png', label: 'Yes' },
    other: { icon: '/carrers/CrossSign.png' },
  },
  {
    feature: 'Paid Internship',
    fyiap: { icon: '/carrers/Group33.png', label: 'Yes' },
    other: { icon: '/carrers/CrossSign.png' },
  },
  {
    feature: 'Industry Certs',
    fyiap: { icon: '/carrers/Group33.png', label: 'NISM' },
    other: { icon: '/carrers/Warning2.png' },
  },
  {
    feature: 'Real Client Work',
    fyiap: { icon: '/carrers/Group33.png', label: 'Yes' },
    other: { icon: '/carrers/CrossSign.png' },
  },
  {
    feature: 'Mentorship',
    fyiap: { icon: '/carrers/Group33.png', label: 'Yes' },
    other: { icon: '/carrers/Group31.png' },
  },
];

export default function QuickComparison() {
  return (
    <section className="w-full px-4 py-12 bg-white flex justify-center">
      <div className="max-w-5xl w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-[#001E3C] mb-8">
          Quick Comparison
        </h2>

        <div className="flex">
          {/* Left Features Column - Empty header row */}
          <div className="w-1/3">
            {/* Empty header to align with other headers */}
            <div className="h-16 invisible"></div>

            {/* Feature rows */}
            {comparisonData.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.feature}
                  className={`h-16 flex items-center ${
                    isEven ? 'bg-white' : 'bg-[#EBF0FA]'
                  }`}
                >
                  <div className="flex items-center gap-2 pl-4">
                    <Image src="/carrers/Group33.png" alt="check" width={18} height={18} />
                    <span className="font-medium text-[#001E3C]">{item.feature}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Middle FYIAP Column */}
          <div className="w-1/3 px-1">
            <div className="rounded-t-xl overflow-hidden">
              {/* FYIAP Header */}
              <div className="bg-[#193A6A] text-white text-center h-16 flex items-center justify-center font-semibold">
                FYIAP
              </div>

              {/* FYIAP Rows */}
              {comparisonData.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={index}
                    className={`h-16 flex items-center justify-center gap-2 ${
                      isEven ? 'bg-[#385C95]' : 'bg-[#193A6A]'
                    }`}
                  >
                    <Image src={item.fyiap.icon} alt="tick" width={18} height={18} />
                    <span className="text-white">{item.fyiap.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Other Courses Column */}
          <div className="w-1/3">
            {/* Other Courses Header */}
            <div className="bg-white text-[#001E3C] text-center h-16 flex items-center justify-center font-semibold border-t border-r border-l border-gray-200 rounded-t-lg">
              Other Courses
            </div>

            {/* Other Courses Rows */}
            {comparisonData.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`h-16 flex items-center justify-center gap-2 ${
                    isEven ? 'bg-white' : 'bg-[#EBF0FA]'
                  } border-r border-gray-200`}
                >
                  {item.other.icon.includes('CrossSign') ? (
                    <Image src={item.other.icon} alt="cross" width={40} height={40} className="object-contain" />
                  ) : (
                    <Image src={item.other.icon} alt="icon" width={60} height={60} className="object-contain" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}