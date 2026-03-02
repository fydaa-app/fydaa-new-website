'use client';

import { useState } from 'react';

// Categorized FAQ data
const faqCategories = {
  program: {
    name: "Program & Admission Related",
    items: [
      {
        question: "What is the eligibility for the programme?",
        answer: "Students who have graduated or are currently in their final year of B.Com, BBA, BMS, BFM, or BAF from a recognized university in India are eligible for the program."
      },
      {
        question: "Who are the Ideal candidates for the programme?",
        answer: "An ideal candidate is someone with a strong interest in finance and a willingness to take on a client-facing role."
      },
      {
        question: "Is the course fee refundable?",
        answer: "If a candidate decides after 1 week of paying the fees, the course fee is refundable. However, once the course has started, the fee is non-refundable."
      },
      {
        question: "What if I don't want to join Fydaa?",
        answer: "Joining Fydaa after completing the program is not mandatory. This course is designed to equip you with the necessary skills and knowledge, making you eligible to apply to other organizations as well."
      },
      {
        question: "You would not be eligible for the programme if.",
        answer: "You would not be eligible for the program if: You are pursuing a career outside of commerce (e.g., doctors, engineers, lawyers). You have completed or are pursuing professional qualifications such as CA, CS, CMA, CFA, etc. You have enrolled in, completed, or plan to pursue postgraduate studies."
      },
      {
        question: "How will the fee be collected?",
        answer: "Candidates will receive a payment link to complete the fee payment. The fee must be paid upfront, but an installment option is available."
      },
      {
        question: "What are the documents required for enrollment for the programme?",
        answer: "Recent Passport size Photos, Pan card & Adhaar card, 10th Certificate, 12th Certificate, Degree documents (Degree Certificate and Grade report – consolidated / Term wise)."
      },
      {
        question: "Which certificate will I receive post completion of the programme?",
        answer: "You will receive NISM certificates XA and XB"
      },
      {
        question: "What happens to the programme if I drop out?",
        answer: "You can choose to opt out of the program if you feel it does not align with your career aspirations. However, please note that the course fee may not be refundable once the program has started."
      }
    ]
  },
  job: {
    name: "Job Role & Compensation Related",
    items: [
      {
        question: "Where will I get a job post completion of the programme?",
        answer: "The candidates will be posted in cities across India based on the company's requirement."
      },
      {
        question: "What will be my starting salary post the programme?",
        answer: "Candidates will receive a starting in-hand salary of 15,000 per month during the 6-month probation period following the completion of the programme. Upon successful completion of probation, the in-hand salary will increase to 4 LPA."
      },
      {
        question: "What will be my job title post completion of the course?",
        answer: "Once you have completed the 6 months training period, you will be absorbed as a junior wealth manager and will be on a probation period of 6 months. On successfully completing the 6 month probation period, you will be promoted to the position of Investment Advisor."
      },
      {
        question: "Does this course guarantee a job with other organizations?",
        answer: "This course is designed and taught by experienced investment advisors, equipping you with the skills and knowledge needed to excel in wealth management. While completing this course will enhance your qualifications and give you an edge over other candidates when applying to other organizations in the industry, it does not guarantee a job with any other organization. The primary goal of this course is to prepare candidates who are passionate about wealth management and are looking to build a successful career at Fydaa."
      },
      {
        question: "What is the job guarantee?",
        answer: "On successful completion of this course and clearing the examinations, the candidates are guaranteed a job at Fydaa."
      },
      {
        question: "What is the probation period?",
        answer: "Post the completion of this course and clearing the examinations, candidates will be on a probationary period of 6 months on the position of junior Investment Advisor. If the candidate's performance is a per company's standard, the candidate will be promoted to the position of Investment Advisor."
      },
      {
        question: "What will be my stipend during the Practical Training?",
        answer: "You will receive a stipend of ₹5,000/month during the 2-month Training period."
      }
    ]
  },
  exam: {
    name: "Exam Related",
    items: [
      {
        question: "How many exams do I need to pass during the course?",
        answer: "To successfully complete the course, you need to pass the NISM XA and XB exams, along with the organization's internal assessment."
      },
      {
        question: "Who will bear the fee for the NISM Exams?",
        answer: "The institute will reimburse NISM Fee upon receiving the receipt of payment/exam."
      },
      {
        question: "What if I don't clear the NISM exams in the first attempt?",
        answer: "You can retake the NISM exam at your convenience if you don't pass on the first attempt. However, to be considered for the job, you must clear the exams before completing the course. Failing to do so may result in a delay in the hiring process."
      },
      {
        question: "What are the other exams apart from the NISM exams which I have to clear?",
        answer: "Apart from the NISM exams, you will need to clear the company's internal assessment exam in the sixth month of the course. Upon successfully passing this exam, you will be eligible to join the organization as a Junior Investment Advisor."
      },
      {
        question: "What if I don't clear the company's internal assessment in the first attempt?",
        answer: "If you don't pass the company's internal assessment on your first attempt, you will need to retake it. This may result in a delay in your joining process."
      }
    ]
  }
};

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("program");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const changeCategory = (category: string) => {
    setActiveCategory(category);
    setActiveIndex(null);
  };

  return (
    <section className="py-12 px-4 md:px-10 bg-white">
      <h2 className="text-3xl font-bold text-center text-[#001E3C] mb-6">
        Frequently Asked Questions
      </h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button 
          onClick={() => changeCategory("program")} 
          className={`px-4 py-2 font-semibold rounded-md ${
            activeCategory === "program" ? "bg-[#19A86E] text-white" : "bg-[#E6F4EF] text-[#001E3C]"
          }`}
        >
          Program & Admission Related
        </button>
        <button 
          onClick={() => changeCategory("job")} 
          className={`px-4 py-2 font-semibold rounded-md ${
            activeCategory === "job" ? "bg-[#19A86E] text-white" : "bg-[#E6F4EF] text-[#001E3C]"
          }`}
        >
          Job Role & Compensation Related
        </button>
        <button 
          onClick={() => changeCategory("exam")} 
          className={`px-4 py-2 font-semibold rounded-md ${
            activeCategory === "exam" ? "bg-[#19A86E] text-white" : "bg-[#E6F4EF] text-[#001E3C]"
          }`}
        >
          Exam Related
        </button>
      </div>

      {/* FAQ Grid */}
      <div className="grid md:grid-cols-2 gap-5 max-w-6xl mx-auto">
        {faqCategories[activeCategory as keyof typeof faqCategories].items.map((faq, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl shadow-md transition-all duration-300 ${
              activeIndex === index ? 'bg-[#F9FBFA]' : 'bg-white'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-start cursor-pointer text-left"
            >
              <h3 className="text-[#001E3C] font-semibold text-base md:text-lg pr-4">
                {faq.question}
              </h3>
              <div className="flex-shrink-0">
                <svg
                  className={`w-6 h-6 text-[#001E3C] transition-transform duration-200 ${
                    activeIndex === index ? 'rotate-180' : ''
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
            {activeIndex === index && (
              <p className="mt-3 text-gray-600 text-sm md:text-base">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}