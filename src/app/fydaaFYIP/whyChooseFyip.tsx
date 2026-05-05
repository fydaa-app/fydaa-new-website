'use client';

import Image from 'next/image';

export default function WhyChooseFyiap() {
  const tickIcon = '/af0f2c91-e4fd-4198-a5d4-263089ca2afb.png'; // Make sure it's in /public
  const sideImage = '/effcb771-191e-44aa-984b-6e192227751f.png'; // Make sure it's in /public

  return (
    <section className="w-full px-4 py-16 bg-white flex justify-center">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#001E3C]">
            Why Choose FYIAP?
          </h2>
          <ul className="space-y-6">
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} className="mt-1" />
              <div>
                <p className="font-semibold text-[#001E3C]">Master Investment Strategies</p>
                <p className="text-gray-700">Design personalized wealth plans and gain the confidence to advise real clients.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} className="mt-1" />
              <div>
                <p className="font-semibold text-[#001E3C]">Develop Client-Centric Thinking</p>
                <p className="text-gray-700">Build people skills, decode client needs, and earn lasting trust.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} className="mt-1" />
              <div>
                <p className="font-semibold text-[#001E3C]">Real Work, Not Just Homework</p>
                <p className="text-gray-700">Get hands-on experience with real investment advisory scenarios.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group33.png" alt="tick" width={30} height={30} className="mt-1" />
              <div>
                <p className="font-semibold text-[#001E3C]">Secure Your Future</p>
                <p className="text-gray-700">Complete the program and walk into a guaranteed role. Enjoy ongoing mentorship and long-term career growth.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Side Image */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <Image
            src="/carrers/Group5.png"
            alt="FYIAP NISM Partnership"
            width={500}
            height={350}
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}
