'use client';

import Image from "next/image";
import { motion } from "framer-motion";

export default function YoungAdvisorProgram() {
    const handleScrollToApplyForm = () => {
        const applyFormSection = document.getElementById("apply-form");
        if (applyFormSection) {
            applyFormSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleScrollToCourseStructure = () => {
        const courseStructureSection = document.getElementById("course-structure");
        if (courseStructureSection) {
            courseStructureSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="w-full bg-[#EFF9F6]  pb-20 px-6 flex flex-col items-center">
            {/* New Job Assurance Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl mb-12"
            >
            <div className="rounded-full bg-white p-1 shadow-[6px_6px_0px_0px_black]">
                <div className="rounded-full py-3 px-6 text-center font-medium">
             <span 
                className="bg-clip-text text-transparent"
            style={{
                background: "linear-gradient(90deg, #1D634C 0%, #20C489 100%)",
                WebkitBackgroundClip: "text"
            }}
        >
            Join the Team Fydaa - Get an Assured Job upon successful completion of the program
        </span>
        </div>
       </div>


            </motion.div>

            <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Left Side */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col max-w-xl"
                >
                    <h2 className="text-4xl font-bold text-[#002A3A] mb-4">
                        Fydaa Young <span className="text-[#1AAA70]">Investment</span><br />
                        Advisor Program(FYIAP)
                    </h2>
                    <p className="text-gray-600 text-lg mb-6">
                        Empowering young finance enthusiasts to become trusted guides and mentors for individuals striving for financial independence.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleScrollToApplyForm}
                            className="bg-[#1AAA70] text-white px-6 py-3 rounded-md border border-[#1AAA70] hover:opacity-90 transition"
                        >
                            Apply Now
                        </button>
                        <button
                            onClick={handleScrollToCourseStructure}
                            className="bg-white text-[#1AAA70] px-6 py-3 rounded-md border border-[#1AAA70] hover:bg-[#e3f6ef] transition"
                        >
                            Learn More
                        </button>
                    </div>
                </motion.div>

                {/* Right Side */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl"
                >
                    <h3 className="text-lg font-bold mb-4">Program Highlights</h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} />
                            NISM Investment Adviser (XA-XB) Certification
                        </li>
                        <li className="flex items-start gap-2">
                            <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} />
                            Hands-on training with industry experts
                        </li>
                        <li className="flex items-start gap-2">
                            <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} />
                            ₹5,000 per month during practical training
                        </li>
                        <li className="flex items-start gap-2">
                            <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} />
                            Job guarantee as Junior Investment Advisor at Fydaa
                        </li>
                        <li className="flex items-start gap-2">
                            <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} />
                            Earn ₹4 LPA including incentives upon completion
                        </li>
                    </ul>
                    <div className="flex items-center gap-2 mt-6 border-t pt-4">
                        <span className="text-[#1AAA70] text-xl">🤝</span>
                        <p className="text-sm text-gray-700">
                            In partnership with <span className="text-[#1AAA70] font-semibold">NISM</span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}