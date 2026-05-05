'use client';

import Image from 'next/image';

const steps = [
  {
    title: 'Submit Your Application',
    description:
      'Candidates must register on our website and submit their application to join the program.',
    icon: '/carrers/Group6.png',
  },
  {
    title: 'Interview Process',
    description:
      'Shortlisted candidates will be invited for an interview to assess their skills, knowledge, and suitability for the program.',
    icon: '/carrers/Group7.png',
  },
  {
    title: 'Shortlisting',
    description:
      'Candidates who clear the interview round will be notified of their selection via email.',
    icon: '/carrers/Group8.png',
  },
  {
    title: 'Enrollment',
    description:
      'Shortlisted candidates must pay the course fee to complete their enrollment in the program.',
    icon: '/carrers/Group9.png',
  },
  {
    title: 'Admission',
    description:
      'Once enrollment is completed, candidates will be officially admitted to the Fydaa Young Investment Advisor Program.',
    icon: '/carrers/Group10.png',
  },
];

export default function SelectionProcess() {
  return (
    <section className="py-10 px-4 md:px-10 bg-white">
      {/* Gradient Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#001E3C] to-[#19A86E]">
          Selection Process
        </h2>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          A simple 5-step process to join our program and kickstart your career as an investment advisor.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-4 bg-white shadow-md rounded-xl p-5"
          >
            {/* Icon + Box */}
            <div className="min-w-[60px]">
              <div className="bg-[#20C489] w-[60px] h-[60px] rounded-lg flex items-center justify-center relative">
                <Image
                  src={step.icon}
                  alt={`${step.title} icon`}
                  width={30}
                  height={30}
                />
              </div>
            </div>

            {/* Text */}
            <div>
              <h3 className="text-lg font-bold text-[#001E3C]">
                {index + 1}. {step.title} :
              </h3>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
