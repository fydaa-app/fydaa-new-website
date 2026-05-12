'use client';

import Image from "next/image";

export default function ProgrammeStructure() {
    return (
        <section className="w-full bg-white py-20 px-6 flex justify-center">
            <div className="max-w-7xl w-full text-center">
                {/* Green Label */}
                <div className="inline-block bg-[#EFF9F6] px-4 py-1 rounded-full mb-3">
                    <span className="text-sm font-semibold text-[#1BAF75]">What You Invest, Learn & Earn</span>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-[#001E3C] mb-4">
                    Programme Structure
                </h2>

                {/* Subtitle */}
                <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
                    Our comprehensive program is designed to transform finance graduates into skilled investment advisors through a structured learning journey.
                </p>

                {/* Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="rounded-xl shadow-md p-6 border-t-[8px] border-[#F2B319] text-left relative transition-transform duration-300 hover:shadow-lg hover:-translate-y-2">
                        <div className="mb-4">
                            <Image src="/carrers/Group20.png" alt="Invest Icon" width={40} height={40} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#001E3C] mb-4">Invest in Your Future</h3>
                        <ul className="space-y-2 text-gray-700 text-sm">
                            <li>✅ NISM investment adviser certification XA and XB</li>
                            
                            <li>✅ High-impact classroom sessions</li>
                        </ul>

                        {/* Program Fee Bar */}
                        <div className="mt-4 bg-[#EFF9F6] text-[#1BAF75] text-sm font-semibold px-4 py-2 rounded-full">
                        Program Fee: ₹10,000 (Inclusive of GST)
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="rounded-xl shadow-md p-6 border-t-[8px] border-[#001E3C] text-left relative transition-transform duration-300 hover:shadow-lg hover:-translate-y-2">
                        <div className="mb-4">
                            <Image src="/carrers/Group19.png" alt="Skills Icon" width={40} height={40} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#001E3C] mb-4">Gain Real-World Skills In</h3>
                        <ul className="space-y-2 text-gray-700 text-sm">
                            <li>✅ Wealth Management</li>
                            <li>✅ Financial Analysis</li>
                            <li>✅ Client Relationship Building</li>
                            <li>✅ Leadership</li>
                        </ul>
                    </div>

                    {/* Card 3 */}
                    <div className="rounded-xl shadow-md p-6 border-t-[8px] border-[#001E3C] text-left relative transition-transform duration-300 hover:shadow-lg hover:-translate-y-2">
                        <div className="mb-4">
                            <Image src="/carrers/Group52.svg" alt="Earn Icon" width={40} height={40} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#001E3C] mb-4">
                            Earn While You Grow
                        </h3>
                        <div className="space-y-3 text-left">
                            <div>
                                <p className="font-gilroy font-semibold text-[#333333] text-[15px] leading-snug">
                                    ✅ Comprehensive 3-Months Training Program
                                </p>
                                <ul className="mt-0.5 space-y-0 pl-4 text-[#555555] text-[13px] leading-tight">
                                    <li>• Includes lectures from industry leaders</li>
                                    <li>• Field Training</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-gilroy font-semibold text-[#333333] text-[15px] leading-snug">
                                    ✅ Post-Training Opportunity
                                </p>
                                <ul className="mt-0.5 space-y-0 pl-4 text-[#555555] text-[13px] leading-tight">
                                    <li>• Join Fydaa as a Certified Investment Advisor and begin your journey in financial advisory</li>
                                </ul>
                            </div>
                            <div>
                                <p className="font-gilroy font-semibold text-[#333333] text-[15px] leading-snug">
                                    ✅ Earning Potential &amp; Entrepreneurial journey
                                </p>
                                <ul className="mt-0.5 space-y-0 pl-4 text-[#555555] text-[13px] leading-tight">
                                    <li>• Start with a scope to grow, as you build your advisory entrepreneurial journey</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}