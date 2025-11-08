'use client'
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";


export default function StartInvesting() {
    const router = useRouter()
    const searchParams = useSearchParams()
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-start pt-5 bg-[#F7F7F7]">
            <section className="flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-8 lg:ml-8 lg:mr-8 lg:p-20 p-8 bg-[#F7F7F7] lg:w-[calc(100%-64px)] lg:rounded-xl">
                <div className="w-full lg:w-1/2 flex flex-col lg:pr-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brandblack-900 font-bold font-gilroy leading-tight mb-6">
                        Check your financial health & measure your risk appetite <span className="italic">FREE!</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-brandblack-700 font-inter mb-10 lg:mb-14 leading-relaxed">
                        Answer few questions about you to provide a customised Investment Plan as per your risk profile.
                    </p>
                    <button 
                        className="bg-white text-brandblack-900 font-bold font-gilroy max-w-[280px] mb-10 px-8 py-4 rounded-full border-2 border-brandblack-900 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group" 
                        onClick={async () => {
                            try {
                                const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}auth/createGuestUser`, {
                                    method: 'POST'
                                })
                                const data = await response.json()
                                const { id, uuid } = data

                                const referralCode = searchParams.get('referralCode') ?? ''

                                if (typeof window !== 'undefined') {
                                    localStorage.setItem('uuid', uuid)
                                    localStorage.setItem('id', id)
                                    localStorage.setItem('referralCode', referralCode)
                                }
                                router.push(`/questionnair`);
                            } catch (error) {
                                console.error('Error creating guest user:', error)
                            }
                        }}
                    >
                        <span className="group-hover:text-lg transition-all duration-200">Let&apos;s Get Started</span>
                        <svg 
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <div className="w-full flex flex-row items-center">
                        <span className="mr-3">
                            <Image src={'/start-investing/security-check.png'} alt="trusted" height={24} width={24} className="object-contain" />
                        </span>
                        <span className="text-branddeepgreen font-semibold italic font-gilroy text-sm sm:text-base">
                            Please rest assured that your data is safe and secure.
                        </span>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 flex flex-row justify-center items-center mt-0 lg:mt-0">
                    <div className="relative w-full max-w-md flex flex-col items-center">
                        <Image 
                            src="/start-investing/risk.png" 
                            alt="Risk Profile" 
                            height={447} 
                            width={439} 
                            className="w-full max-w-[500px] aspect-[447/439] object-contain" 
                        />
                        <p className="text-brandblack-900 font-medium font-inter mt-4 text-center">Risk Profile</p>
                    </div>
                </div>
            </section>
            
        </main>
    )
}

