'use client';

import Image from 'next/image';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function CareerPath() {
    const handleScrollToApplyForm = () => {
        const applyFormSection = document.getElementById("apply-form");
        if (applyFormSection) {
            applyFormSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="w-full bg-white py-0 px-6 flex justify-center">
            <div className="max-w-7xl w-full bg-white rounded-2xl shadow-md p-8 md:flex items-center">
                {/* Left Text Section */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#001E3C] mb-4">
                        Your Career Path
                    </h2>
                    <div className="h-1 w-28 bg-[#1AAA70] mb-6 rounded"></div>

                    <ul className="space-y-6 text-left mb-8">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-[#1AAA70] mt-1" />
                            <div>
                                <span className="font-semibold text-[#001E3C]">Enrollment</span><br />
                                <span className="text-gray-600 text-sm">Join the program with a one-time investment</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-[#1AAA70] mt-1" />
                            <div>
                                <span className="font-semibold text-[#001E3C]">Training</span><br />
                                <span className="text-gray-600 text-sm">4 months of intensive learning</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-[#1AAA70] mt-1" />
                            <div>
                                <span className="font-semibold text-[#001E3C]">Practical Experience</span><br />
                                <span className="text-gray-600 text-sm">2 months of hands-on application</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-[#1AAA70] mt-1" />
                            <div>
                                <span className="font-semibold text-[#001E3C]">Career Start</span><br />
                                <span className="text-gray-600 text-sm">Begin your journey as an Investment Advisor</span>
                            </div>
                        </li>
                    </ul>

                    {/* Button */}
                    <button
                        onClick={handleScrollToApplyForm}
                        className="bg-[#1AAA70] text-white font-semibold px-5 py-2 rounded-md flex items-center gap-2 hover:bg-[#178e5f] transition"
                    >
                        Kickstart your career now <ArrowRight size={16} />
                    </button>
                </div>

                {/* Right Image Section */}
                <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-end">
                    <Image
                        src="/carrers/Group28.svg" // Adjust path if needed
                        alt="Career Path"
                        width={600}
                        height={600}
                        className="rounded-md"
                    />
                </div>
            </div>
        </section>
    );
}