'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const HIGHLIGHTS = [
  'NISM Investment Adviser (XA-XB) Training',
  'Hands-on training from experienced industry professionals',
  'Guaranteed role as a Certified Investment Advisor at Fydaa',
  'Starting salary of 4LPA + performance based incentive',
  'Opportunity to start your own Entrepreneurial journey',
];

/**
 * Outer shell: single pill (56px radius) + stroke. Inner highlights panel “docks” on the right:
 * no gap — flush columns; divider is the inner panel’s rounded left edge + vertical border only.
 */
export default function FyiapProgramBoxes() {
  return (
    <div
      className="w-full max-w-7xl mx-auto box-border rounded-[56px] border-2 border-white/20 bg-black overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-0 min-h-[200px] min-w-0">
        <div className="flex flex-col px-8 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 lg:py-14 lg:flex-[1.5] lg:min-w-0 text-left">
          <div>
            <h2 className="font-gilroy font-semibold text-left text-white mb-4 tracking-[-2.24px] text-[17px] leading-[22px] whitespace-normal [-webkit-text-stroke:1px_rgb(0,0,0)] [paint-order:stroke_fill] drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] sm:text-[20px] sm:leading-[26px] md:text-[24px] md:leading-[30px] lg:text-[30px] lg:leading-[37px] lg:whitespace-nowrap">
              <span className="align-middle">
                Fydaa Young Investment Advisor Program (FYIAP)
              </span>
             
            </h2>
            <p className="font-gilroy font-normal text-left text-[#999999] text-[15px] leading-[21px] sm:text-[17.9px] sm:leading-[24.8px] tracking-[-0.36px] mb-5 [-webkit-text-stroke:1px_rgb(0,0,0)] [paint-order:stroke_fill]">
              Empowering young finance enthusiasts to become trusted guides and
              <br />
              mentors for individuals striving for financial independence.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/fydaaFYIP#YoungAdvisorProgram"
              scroll
              className="inline-flex items-center justify-center bg-white text-black font-gilroy font-medium px-8 py-2 rounded-full hover:bg-neutral-200 transition-colors"
            >
              Apply Now
            </Link>
            <Link
              href="/fydaaFYIP"
              scroll
              className="inline-flex items-center gap-2 text-white font-inter font-medium text-[18px] leading-[24.8px] bg-transparent hover:text-neutral-300 transition-colors"
            >
              Learn More
              <ArrowRight className="w-5 h-5 shrink-0" aria-hidden />
            </Link>
          </div>
        </div>

        {/* Joined inset panel: divider + 56px rounding on the inward (left) side only */}
        <div
          className="flex flex-col w-full min-w-0 lg:flex-[1.5] box-border border-t-2 border-white/20 bg-black px-8 py-8 sm:py-10 md:px-10 md:py-11 lg:border-t-0 lg:border-l-2 lg:rounded-tl-[56px] lg:rounded-bl-[56px] overflow-x-auto min-[1100px]:overflow-x-visible"
        >
          <p className="font-gilroy font-semibold text-left uppercase text-[20px] leading-[1.2] tracking-[2px] text-[#999999] mb-2 mt-2 [-webkit-text-stroke:1px_rgb(0,0,0)] [paint-order:stroke_fill] drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] whitespace-nowrap">
            Program Highlights
          </p>
          <ul className="space-y-0 mt-2 ">
            {HIGHLIGHTS.map((line) => (
              <li
                key={line}
                className="flex items-center gap-3 font-gilroy font-normal text-[16px] leading-[24.8px] text-white text-left whitespace-nowrap"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-none bg-[#999999]"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
