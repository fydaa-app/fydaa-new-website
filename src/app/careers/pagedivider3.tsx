"use client";

import { useState } from "react";
import RegisterCvModal from "./RegisterCvModal";

export default function PageDivider() {
  const [registerCvOpen, setRegisterCvOpen] = useState(false);

  return (
    <>
      <RegisterCvModal open={registerCvOpen} onClose={() => setRegisterCvOpen(false)} />
      <section className="px-6 py-16 font-inter">
        <div
          className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-8 rounded-[20px] bg-jade p-12"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 120% 80% at 20% 110%, #0C4A3E 0%, transparent 60%), radial-gradient(ellipse 80% 100% at 90% 0%, #047857 0%, transparent 50%)",
          }}
        >
          <div>
            <h2 className="max-w-[22ch] text-[clamp(22px,2.8vw,28px)] font-extrabold tracking-tight text-white">
              Don&apos;t see the right role yet?
            </h2>
            <p className="mt-2.5 max-w-[42ch] text-[15px] text-white/70">
              Register your profile and we&apos;ll match you with opportunities as they come up.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRegisterCvOpen(true)}
            className="rounded-[10px] bg-white px-6 py-3 text-sm font-bold text-jade-deep hover:bg-grey-100"
          >
            Register your CV
          </button>
        </div>
      </section>
    </>
  );
}
