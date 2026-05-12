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
            Why FYIAEP?
          </h2>
          <ul className="space-y-6">
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} className="mt-1" />
              <div>
                <p className="font-semibold text-[#001E3C]">Investment Mastery:</p>
                <p className="text-gray-700">Build and advise on wealth plans.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} className="mt-1" />
              <div>
                <p className="font-semibold text-[#001E3C]">Client Focus:</p>
                <p className="text-gray-700">Understand needs and build trust.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} className="mt-1" />
              <div>
                <p className="font-semibold text-[#001E3C]">Real World Experience:</p>
                <p className="text-gray-700">Work on real advisory cases.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} className="mt-1" />
              <div>
                <p className="font-semibold text-[#001E3C]">Career Security:</p>
                <p className="text-gray-700">Guaranteed role with mentorship</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Image src="/carrers/Group33.png" alt="tick" width={20} height={20} className="mt-1" />
              <div>
                <p className="font-semibold text-[#001E3C]">Entrepreneurial journey:</p>
                <p className="text-gray-700">Freedom to create your own Entrepreneurial journey.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Side Image */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <Image
            src="/carrers/Group5.png"
            alt="FYIAEP NISM Partnership"
            width={500}
            height={350}
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}
