import Image from "next/image";

const APP_STORE =
  "https://apps.apple.com/in/app/fydaa-your-money-for-tomorrow/id1622175190";

export default function StartInvesting() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start bg-[#F7F7F7] pt-24">
      <section className="mt-8 flex flex-col items-center justify-center bg-[#F7F7F7] p-8 lg:ml-8 lg:mr-8 lg:mt-8 lg:w-[calc(100%-64px)] lg:flex-row lg:rounded-xl lg:p-20">
        <div className="flex w-full flex-col lg:w-1/2 lg:pr-12">
          <h2 className="mb-6 font-gilroy text-3xl font-bold leading-tight text-brandblack-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Start investing with a plan built for your goals
          </h2>
          <p className="mb-10 font-inter text-base leading-relaxed text-brandblack-700 sm:text-lg md:text-xl lg:mb-14">
            Create goals, start a SIP from ₹1,000 a month, and get SEBI-registered guidance in the Fydaa app.
          </p>
          <a
            href={APP_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-10 flex max-w-[280px] items-center justify-center gap-2 rounded-full border-2 border-brandblack-900 bg-white px-8 py-4 font-gilroy font-bold text-brandblack-900 transition-all duration-200 hover:scale-105"
          >
            <span className="transition-all duration-200 group-hover:text-lg">Let&apos;s Get Started</span>
            <svg
              className="h-5 w-5 transform transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <div className="flex w-full flex-row items-center">
            <span className="mr-3">
              <Image
                src="/start-investing/security-check.png"
                alt="trusted"
                height={24}
                width={24}
                className="object-contain"
              />
            </span>
            <span className="font-gilroy text-sm font-semibold italic text-branddeepgreen sm:text-base">
              Please rest assured that your data is safe and secure.
            </span>
          </div>
        </div>
        <div className="mt-0 flex w-full flex-row items-center justify-center lg:mt-0 lg:w-1/2">
          <div className="relative flex w-full max-w-md flex-col items-center">
            <Image
              src="/start-investing/risk.png"
              alt="Start investing with Fydaa"
              height={447}
              width={439}
              className="aspect-[447/439] w-full max-w-[500px] object-contain"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
