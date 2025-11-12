"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'
import PrimaryButton from '../components/PrimaryButton'
import { Accordion, AccordionPanel, AccordionTitle, AccordionContent, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastToggle } from 'flowbite-react';
import Link from 'next/link'
import dynamic from 'next/dynamic';

const OtpInput = dynamic(() => import('react-otp-input'), { ssr: false });
import BalanceSheet from '../components/BalanceSheet'
import AssetAllocation from '../components/AssetAllocation'
import { useRouter } from 'next/navigation';
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import riskAnimation from './risk.json'


const ArrowIcon = () => (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.15234 7.375C5.46875 7.69141 5.99609 7.69141 6.34766 7.375L11.1289 2.59375C11.4453 2.24219 11.4453 1.71484 11.1289 1.39844L10.3203 0.589844C9.96875 0.273438 9.44141 0.273438 9.125 0.589844L5.71484 4L2.33984 0.589844C2.02344 0.273438 1.49609 0.273438 1.14453 0.589844L0.371094 1.39844C0.0195312 1.71484 0.0195312 2.24219 0.371094 2.59375L5.15234 7.375Z" fill="white" />
    </svg>

)

enum Stage {
    Loading,
    RiskScore,
    WealthJourney,
    BalanceSheet,
    MoneyManagementPlan,
}

enum ModalType {
    AssetComparison,
    EnterPhone,
    VerifyOtp,
    KnowMore,
}

const wealthStages = {
    'Saving': {
        'desc':
            'You are down but not out! All good things start with small beginning. Start now to reach to next stage to belong to 7% club!',
        'top': 'Majority 89% people are in this stage',
    },
    'Investments': {
        'desc':
            'A journey well begun ! You are just one step away from being part of top 3% club of wealthy people.',
        'top': 'Only 7% people are in this stage',
    },
    'Wealth Generation': {
        'desc':
            'You are almost there and just need a little bit of more sound advice to reach the 1% club.',
        'top': 'Only 3% people are in this stage',
    },
    'Wealth Management': {
        'desc':
            'You are there and just need to be disciplined with a sound adviser on your side to help you not lose your 1% status.',
        'top': 'Top 1% people are in this stage',
    }
}

function format(x: any): string {
    x = x.toString()
    var afterPoint = ''
    if (x.indexOf('.') > 0)
        afterPoint = x.substring(x.indexOf('.'), x.length)
    x = Math.floor(x)
    x = x.toString()
    var lastThree = x.substring(x.length - 3)
    var otherNumbers = x.substring(0, x.length - 3)
    if (otherNumbers != '')
        lastThree = ',' + lastThree
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree //+ afterPoint
    return res
}

function calculateSIPReturn(R: number, Y: number, I: number): string {
    const i = R / (100 * 12);
    const n = Y * 12;
    const P = I;

    // P [ (1+i)^n-1 ] * (1+i)/i
    return format((P * (Math.pow((1 + i), n) - 1) * ((1 + i) / i)));
}

export default function RiskScore() {
    const [stage, setStage] = useState<Stage>(Stage.Loading)
    const [score, setScore] = useState(0)
    const [riskProfile, setRiskProfile] = useState<any>({})
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalType, setModalType] = useState<ModalType>(ModalType.EnterPhone)
    const [investment, setInvestment] = useState(10000)
    const [years, setYears] = useState(5)
    const [mobileNumber, setMobileNumber] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [otp, setOtp] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const router = useRouter()

    useEffect(() => {
        (async () => {
            // Check if we're on the client side before accessing localStorage
            if (typeof window !== 'undefined') {
                const response = await fetch(`https://onboarding.fydaa.com/risk-profile/getGuestIndicators?guestUserId=${localStorage.getItem('id')}`).then(res => res.json())
                console.log('Risk Profile API Response:', response)
                console.log('totalBalanceSheetDamage:', response?.totalBalanceSheetDamage)
                console.log('balanceSheetDamage:', response?.balanceSheetDamage)
                setRiskProfile(response)

                setTimeout(() => {
                    setStage(Stage.RiskScore)
                }, 1800)

                setTimeout(() => {
                    setScore(response?.riskProfile?.totalPoints ?? 0)
                }, 2000)
            }
        })()
    }, [])

    function getBody(_stage: Stage) {
        switch (_stage) {
            case Stage.Loading:
                return (<div className="w-full p-4 min-h-screen bg-brandblack-900 relative lg:overflow-hidden">
                    <Image src='/riskscore/background-2.png' width={2540} height={2243} className='absolute z-0 w-full top-0 left-0 opacity-60 blur-3xl' objectFit='cover' alt='background' />
                    <div className='flex flex-row items-center gap-2 lg:gap-3 lg:mb-12 mb-10'>
                        <Image src="/Fydaalogo.webp" width={40} height={40} alt="Fydaa Logo" className='w-8 h-8 lg:w-10 lg:h-10 object-contain' />
                        <Image src="/Fydaalogotext.webp" width={120} height={40} alt="Fydaa Investment Adviser" className='h-8 lg:h-10 w-auto object-contain' />
                    </div>

                    <div className='w-full flex flex-col items-center h-full origin-center'>
                        <div className='max-w-4xl p-8 lg:p-12 bg-white w-full rounded-2xl z-10 flex flex-col items-center justify-center'>
                            <Lottie width={258} height={202} animationData={riskAnimation} loop={true} className='max-w-xs w-full aspect-[258/202] mb-10' />
                            <p className='font-bold text-3xl text-brandblack-900 mb-12'>Hold Tight, We are Analysing the details</p>
                            <p className='font-bold text-sm text-brandblack-400'>You&apos;re good to go for next steps</p>
                        </div>
                    </div>
                </div>)
            case Stage.RiskScore:
                return (
                    <div className="w-full p-4 min-h-screen bg-brandblack-900 relative lg:overflow-hidden">
                        <Image src='/riskscore/background-2.png' width={2540} height={2243} className='absolute z-0 w-full top-0 left-0 opacity-60 blur-3xl' objectFit='cover' alt='background' />
                        <div className='flex flex-row items-center gap-2 lg:gap-3 lg:mb-12 mb-10'>
                        <Image src="/Fydaalogo.webp" width={40} height={40} alt="Fydaa Logo" className='w-8 h-8 lg:w-10 lg:h-10 object-contain' />
                        <Image src="/Fydaalogotext.webp" width={120} height={40} alt="Fydaa Investment Adviser" className='h-8 lg:h-10 w-auto object-contain' />
                    </div>
                        <div className='w-full flex flex-col items-center h-full origin-center'>
                            <div className='max-w-4xl p-8 lg:p-12 bg-white w-full rounded-2xl z-10'>
                                <h1 className='font-bold text-3xl text-brandblack-900 mb-12'>Your Risk Score</h1>
                                <div className='w-full relative flex flex-col lg:flex-row justify-between items-center'>
                                    <div className="w-full lg:w-1/2 lg:border-r lg:border-brandblack-300">
                                        <div className="relative w-full min-h-[180px]">
                                            <Image src='/riskscore/angularchartbase.png' alt='angular chart' height={154} width={327} className='aspect-[981/462] absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]' />
                                            <Image src='/riskscore/angularchartbar.png' alt='angular chart meter' height={112} width={22} className='aspect-[22/112] absolute -mt-8 top-[50%] left-[calc(50%-11px)] -translate-x-[calc(50%+11px)] -translate-y-[50%] -rotate-90 transition-transform duration-1000' style={{
                                                transform: `rotate(${-90 + 1.3846153846 * score}deg)`,
                                                transformOrigin: '11px 105px'
                                            }} />
                                        </div>
                                        <p className='w-full text-center font-bold text-brandblack-900 text-sm mt-4 mb-2'>Your risk score is</p>
                                        <p className='w-full text-center font-bold text-brandblack-900 text-xl mb-3'>{Math.ceil((riskProfile?.riskProfile?.totalPoints ?? 0) * 100 / (riskProfile?.riskProfileBasePoints ?? 130))}</p>
                                        <p className='w-full text-center font-bold text-brandblack-900 text-sm mb-2'>Your risk appetite is</p>
                                        <div className='w-full flex flex-col items-center justify-center'>
                                            <p className='text-white text-sm font-bold p-1 bg-brandsucessgreen rounded'>{riskProfile?.assetAllocation?.smallCasePortfolioName ?? 'Loading'}</p>
                                        </div>
                                    </div>
                                    <div className="w-full mt-8 lg:mt-0 lg:w-1/2 lg:pl-12 flex flex-col h-full items-center justify-center">
                                        <div className='w-full rounded-2xl bg-brandblack-700 p-8 relative mb-5'>
                                            <Image src='/riskscore/pattern-1.png' alt='pattern' width={144} height={150} className='z-0 absolute right-0 top-0' />
                                            <p className='relative z-10 text-black font-bold text-xl mb-6'>Next Step,<br />Are you eager to view<br />your financial health<br />report!!!</p>
                                            <PrimaryButton className="!bg-white font-bold !text-black" onClick={() => { setStage(Stage.WealthJourney) }}>View Wealth Journey</PrimaryButton>
                                        </div>
                                        <p className='w-full pl-8 text-left text-xs font-bold text-brandblack-500'>Not happy? <Link href={'/questionnaire'}><span className='text-brandblue'>{'Retake Quiz ->'}</span></Link></p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className='w-full flex flex-col lg:p-8 justify-center items-center relative z-10 mt-10'>
                            <h2 className='!font-bold !text-xl !text-black text-center mb-8'>Frequently Asked Question</h2>
                            <div className='w-full max-w-4xl'>
                                <Accordion collapseAll className='!border-white !border-opacity-40' arrowIcon={ArrowIcon}>
                                    <AccordionPanel>
                                        <AccordionTitle><p className='!font-semibold !text-sm !lg:font-bold !lg:text-xl !text-black'>What is Risk Profile?</p></AccordionTitle>
                                        <AccordionContent>
                                            <div className='!text-black !font-medium !text-sm !lg:text-base'>
                                                <ul className='list-disc pl-5'>
                                                    <li>Definition: A risk profile assesses an individual&apos;s willingness and ability to tolerate financial risk in investment decisions.</li>
                                                    <li>
                                                        Willingness to Take Risk:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Measures an individual&apos;s comfort level with fluctuations in investment returns.</li>
                                                            <li>Reflects personal preferences, goals, and psychological factors influencing risk tolerance.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Ability to Take Risk:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Evaluates the financial capacity to withstand potential losses.</li>
                                                            <li>Factors include income, expenses, time horizon, and overall financial situation.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Risk Categories:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Conservative: Prefers low-risk investments with stable returns.</li>
                                                            <li>Moderate: Seeks a balance between risk and return, willing to accept some fluctuations.</li>
                                                            <li>Aggressive: Comfortable with higher risk for the potential of greater returns.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Factors Influencing Risk Profile:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Age: Younger individuals may have a longer time horizon and greater risk tolerance.</li>
                                                            <li>Financial Goals: Short-term goals may lead to a more conservative approach.</li>
                                                            <li>Market Conditions: Economic and market conditions can impact risk perceptions.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Portfolio Allocation:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Asset allocation is tailored to match the risk profile, balancing risk and return.</li>
                                                            <li>Diversification strategies are employed to spread risk across different investments.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Review and Adjust:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Risk profiles may change over time due to life events or shifts in financial circumstances.</li>
                                                            <li>Periodic reviews ensure that investment strategies align with the current risk profile.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Communication and Education:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Financial professionals communicate the implications of risk to clients.</li>
                                                            <li>Education on investment risks empowers individuals to make informed decisions.</li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                            <p className='!text-black !font-medium !text-sm !lg:text-base'>Understanding and defining a risk profile is crucial in developing a financial plan that aligns with an individual&apos;s goals, preferences, and financial capacity. It serves as a foundation for constructing an investment portfolio that strikes an appropriate balance between risk and potential returns.</p>
                                        </AccordionContent>
                                    </AccordionPanel>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                )
            case Stage.WealthJourney:
                return (
                    <div className="w-full p-4 min-h-screen bg-brandblack-900 relative lg:overflow-hidden">
                        <Image src='/riskscore/background-2.png' width={2540} height={2243} className='absolute z-0 w-full top-0 left-0 opacity-60 blur-3xl' objectFit='cover' alt='background' />
                        <div className='flex flex-row items-center gap-2 lg:gap-3 lg:mb-12 mb-10'>
                        <Image src="/Fydaalogo.webp" width={40} height={40} alt="Fydaa Logo" className='w-8 h-8 lg:w-10 lg:h-10 object-contain' />
                        <Image src="/Fydaalogotext.webp" width={120} height={40} alt="Fydaa Investment Adviser" className='h-8 lg:h-10 w-auto object-contain' />
                    </div>
                        <div className='w-full flex flex-col items-center h-full origin-center'>
                            <div className='max-w-4xl p-8 lg:p-12 bg-white w-full rounded-2xl z-10'>
                                <h1 className='font-bold text-3xl text-brandblack-900 mb-12'>Wealth Management Journey</h1>
                                <div className='w-full relative flex flex-col lg:flex-row justify-between items-center'>
                                    <div className="w-full lg:w-1/2 lg:border-r lg:border-brandblack-300">
                                        <div className='relative w-full min-h-[350px] flex flex-col justify-center items-center'>
                                            <div className={`rounded-full w-[310px] h-[310px]  border border-brandblack-700 absolute bottom-0 ${riskProfile?.balanceSheetDamage?.wealthStage.name == 'Wealth Management' ? 'bg-brandblue' : 'bg-brandblack-50'}`}>
                                                <p className={`w-full text-center font-bold text-xs pt-6 ${riskProfile?.balanceSheetDamage?.wealthStage.name == 'Wealth Management' ? 'text-white' : 'text-brandblack-900'}`}>Wealth Management</p>
                                            </div>
                                            <div className={`rounded-full w-[260px] h-[260px]  border border-brandblack-700 absolute bottom-0 ${riskProfile?.balanceSheetDamage?.wealthStage.name == 'Wealth Generation' ? 'bg-brandblue' : 'bg-brandblack-50'}`}>
                                                <p className={`w-full text-center font-bold text-xs pt-6 ${riskProfile?.balanceSheetDamage?.wealthStage.name == 'Wealth Generation' ? 'text-white' : 'text-brandblack-900'}`}>Wealth Generation</p>
                                            </div>

                                            <div className={`rounded-full w-[200px] h-[200px]  border border-brandblack-700 absolute bottom-0 ${riskProfile?.balanceSheetDamage?.wealthStage.name == 'Investments' ? 'bg-brandblue' : 'bg-brandblack-50'}`}>
                                                <p className={`w-full text-center font-bold text-xs pt-6 ${riskProfile?.balanceSheetDamage?.wealthStage.name == 'Investments' ? 'text-white' : 'text-brandblack-900'}`}>Investments</p>
                                            </div>
                                            <div className={`rounded-full w-[140px] h-[140px]  border border-brandblack-700 absolute bottom-0 ${riskProfile?.balanceSheetDamage?.wealthStage.name == 'Saving' ? 'bg-brandblue' : 'bg-brandblack-50'}`}>
                                                <p className={`w-full text-center font-bold text-xs pt-12 ${riskProfile?.balanceSheetDamage?.wealthStage.name == 'Saving' ? 'text-white' : 'text-brandblack-900'}`}>Saving</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2 lg:pl-12 flex flex-col h-full items-center justify-center mt-8 lg:mt-0">
                                        <div className='w-full rounded-2xl bg-brandblack-700 p-8 relative mb-5'>
                                            <Image src='/riskscore/pattern-2.png' alt='pattern' width={144} height={150} className='z-0 absolute right-0 top-0' />
                                            <p className='text-black font-bold text-xs mb-2'>You current stage is</p>
                                            <p className='relative z-10 text-black font-bold text-xl mb-4'>{(riskProfile?.balanceSheetDamage?.wealthStage.name ?? '').toUpperCase()}</p>
                                            <p className='font-regular text-xs text-brandblack-100 opacity-70 mb-4'>{wealthStages[riskProfile?.balanceSheetDamage?.wealthStage.name as keyof typeof wealthStages]?.desc ?? ''}</p>
                                            <p className='font-bold italic text-xs text-branddeepgreen mb-6'>{wealthStages[riskProfile?.balanceSheetDamage?.wealthStage.name as keyof typeof wealthStages]?.top ?? ''}</p>
                                            <PrimaryButton className="!bg-white font-bold !text-black" onClick={() => setStage(Stage.BalanceSheet)}>View Balance Sheet</PrimaryButton>
                                        </div>
                                        {/* <p className='w-full pl-8 text-left text-xs font-bold text-brandblack-500'>Not happy? <Link href={'/questionnaire?guestid=2'}><span className='text-brandblue'>{'Retake Quiz ->'}</span></Link></p> */}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='w-full flex flex-col lg:p-8 justify-center items-center relative z-10 mt-10'>
                            <h2 className='!font-bold !text-xl !text-black text-center mb-8'>Frequently Asked Question</h2>
                            <div className='w-full max-w-4xl'>
                                <Accordion collapseAll className='!border-white !border-opacity-40' arrowIcon={ArrowIcon}>
                                    <AccordionPanel>
                                        <AccordionTitle><p className='!font-semibold !text-sm !lg:font-bold !lg:text-xl !text-black'>What is Wealth Management journey?</p></AccordionTitle>
                                        <AccordionContent>
                                            <p className='!text-black !font-medium !text-sm !lg:text-base'>A wealth management journey, progressing through the stages of saving, investment, wealth generation, and wealth management helps individuals to plan with their adviser and move up in the value chain:</p>
                                            <div className='!text-black !font-medium !text-sm !lg:text-base'>
                                                <ul className='list-disc pl-5'>
                                                    <li>
                                                        Saving:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Establishing a savings plan to set aside a portion of income regularly.</li>
                                                            <li>Building an emergency fund for unforeseen expenses.</li>
                                                            <li>Utilizing budgeting tools to track and control expenses.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Investment:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Conducting research on different investment options, such as stocks, bonds, and real estate.</li>
                                                            <li>Diversifying investments to spread risk and enhance potential returns.</li>
                                                            <li>Seeking guidance from financial advisors to align investment strategies with financial goals.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Wealth Generation<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Continuously identifying opportunities for income growth and wealth accumulation.</li>
                                                            <li>Exploring avenues for additional income streams, such as side businesses or passive investments.</li>
                                                            <li>Monitoring market trends and adapting investment strategies to capitalize on wealth-building opportunities.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Wealth Management<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Creating a comprehensive wealth management plan to optimize financial resources.</li>
                                                            <li>Implementing tax-efficient strategies to minimize liabilities.</li>
                                                            <li>Reviewing and adjusting the investment portfolio in response to changing market conditions.</li>
                                                            <li>Planning for retirement, including pension funds, or other retirement accounts.</li>
                                                            <li>Integrating estate planning to ensure the efficient transfer of wealth to future generations.</li>
                                                            <li>Engaging with professional wealth managers for ongoing financial advice and guidance.</li>
                                                        </ul>
                                                    </li>

                                                </ul>
                                            </div>
                                            <p className='!text-black !font-medium !text-sm !lg:text-base'>Each stage in this wealth management journey is interconnected, with individuals progressing from saving to investment, strategically generating wealth, and then implementing effective wealth management practices to preserve and grow their financial assets over the long term.</p>
                                        </AccordionContent>
                                    </AccordionPanel>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                )
            case Stage.BalanceSheet:
                return (
                    <div className="w-full p-4 min-h-screen bg-brandblack-900 relative lg:overflow-hidden">
                        <Image src='/riskscore/background-2.png' width={2540} height={2243} className='absolute z-0 w-full top-0 left-0 opacity-60 blur-3xl' objectFit='cover' alt='background' />
                        <div className='flex flex-row items-center gap-2 lg:gap-3 lg:mb-12 mb-10'>
                        <Image src="/Fydaalogo.webp" width={40} height={40} alt="Fydaa Logo" className='w-8 h-8 lg:w-10 lg:h-10 object-contain' />
                        <Image src="/Fydaalogotext.webp" width={120} height={40} alt="Fydaa Investment Adviser" className='h-8 lg:h-10 w-auto object-contain' />
                    </div>
                        <div className='w-full flex flex-col items-center h-full origin-center'>
                            <div className='max-w-4xl p-8 lg:p-12 bg-white w-full rounded-2xl z-10'>
                                <h1 className='font-bold text-3xl text-brandblack-900 mb-12'>Your Balance Sheet</h1>
                                <div className='w-full relative flex flex-col lg:flex-row justify-between items-center'>
                                    <div className="w-full lg:w-1/2 lg:border-r lg:border-brandblack-300 flex flex-col justify-center items-start lg:pl-5 lg:pr-5">
                                        {(() => {
                                            const netWorth = riskProfile?.balanceSheetDamage?.netWorth ?? 0;
                                            const damage = netWorth === 0 ? 0 : (riskProfile?.totalBalanceSheetDamage ?? riskProfile?.balanceSheetDamage?.totalBalanceSheetDamage ?? 0);
                                            return damage > 0 ? (
                                                <div className='w-full p-2 bg-brandredcindrella rounded-lg inline mb-7'>
                                                    <p className='text-xs font-bold text-brandred text-center'> <span><Image src='/riskscore/warning.png' alt='warning' height={16} width={16} className='inline mr-2' /></span> <span>Damaged by {Math.round(damage)}%!!</span> </p>
                                                </div>
                                            ) : null;
                                        })()}
                                        <div className='flex flex-row justify-center w-full'>
                                            <BalanceSheet height={300} width={300} indicators={[
                                                {
                                                    label: 'Income Statement',
                                                    value: 0.20,
                                                    color: '#007DFB',
                                                },
                                                {
                                                    label: 'Investment',
                                                    value: 0.20,
                                                    color: '#EC5B7A',
                                                },
                                                {
                                                    label: 'Assets',
                                                    value: 0.20,
                                                    color: '#EE7A3F',
                                                },
                                                {
                                                    label: 'Insurance',
                                                    value: 0.20,
                                                    color: '#FBC70A',
                                                },
                                                {
                                                    label: 'Liabilities',
                                                    value: 0.20,
                                                    color: '#344054',
                                                },
                                            ]} networth={Intl.NumberFormat('hi-IN').format(riskProfile?.balanceSheetDamage?.netWorth ?? 0)} damage={(() => {
                                                const netWorth = riskProfile?.balanceSheetDamage?.netWorth ?? 0;
                                                return netWorth === 0 ? 0 : (riskProfile?.totalBalanceSheetDamage ?? riskProfile?.balanceSheetDamage?.totalBalanceSheetDamage ?? 0);
                                            })()} />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2 lg:pl-12 flex flex-col h-full items-center justify-center mt-8 lg:mt-0">
                                        <div className='w-full rounded-2xl bg-brandblack-700 p-8 relative mb-5'>
                                            <Image src='/riskscore/pattern-3.png' alt='pattern' width={144} height={150} className='z-0 absolute right-0 top-0' />
                                            <p className='relative z-10 text-black font-bold text-xl mb-4'>Next Step,<br />Check your personalised<br />money management plan</p>
                                            <p className='font-regular text-xs text-brandblack-100 opacity-70 mb-4'>A portfolio for your balance sheet improvement </p>
                                            <PrimaryButton className="!bg-white font-bold !text-black" onClick={() => setStage(Stage.MoneyManagementPlan)}>Check & Confirm</PrimaryButton>
                                        </div>
                                        {/* <p className='w-full pl-8 text-left text-xs font-bold text-brandblack-500'>Not happy? <Link href={'/questionnaire?guestid=2'}><span className='text-brandblue'>{'Retake Quiz ->'}</span></Link></p> */}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='w-full flex flex-col lg:p-8 justify-center items-center relative z-10 mt-10'>
                            <h2 className='!font-bold !text-xl !text-black text-center mb-8'>Frequently Asked Question</h2>
                            <div className='w-full max-w-4xl'>
                                <Accordion collapseAll className='!border-white !border-opacity-40' arrowIcon={ArrowIcon}>
                                    <AccordionPanel>
                                        <AccordionTitle><p className='!font-semibold !text-sm !lg:font-bold !lg:text-xl !text-black'>What is Balance Sheet?</p></AccordionTitle>
                                        <AccordionContent>
                                            <div className='!text-black !font-medium !text-sm !lg:text-base'>
                                                <ul className='list-disc pl-5'>
                                                    <li>Definition:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>A balance sheet for individuals, also known as a personal financial statement, is a snapshot of an individual&apos;s financial position at a specific point in time.</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Components:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Assets:<br />
                                                                <ul className='list-disc pl-5'>
                                                                    <li>Represents what the individual owns.</li>
                                                                    <li>Includes cash, savings, investments, real estate, vehicles, and personal belongings of significant value.</li>
                                                                </ul>
                                                            </li>
                                                            <li>Liabilities:<br />
                                                                <ul className='list-disc pl-5'>
                                                                    <li>Represents what the individual owes.</li>
                                                                    <li>Includes mortgages, loans, credit card balances, and other outstanding debts.</li>
                                                                </ul>
                                                            </li>
                                                            <li>Net Worth:<br />
                                                                <ul className='list-disc pl-5'>
                                                                    <li>Calculated as the difference between total assets and total liabilities.</li>
                                                                    <li>Reflects an individual&apos;s overall financial health and wealth.</li>
                                                                </ul>
                                                            </li>
                                                            <li>Purpose:<br />
                                                                <ul className='list-disc pl-5'>
                                                                    <li>Provides a comprehensive view of one&apos;s financial situation.</li>
                                                                    <li>Helps individuals track their wealth accumulation or debt reduction over time.</li>
                                                                    <li>A tool for setting financial goals and making informed financial decisions.</li>
                                                                </ul>
                                                            </li>

                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Categorization of Assets and Liabilities:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Liquid Assets:<br />
                                                                <ul className='list-disc pl-5'>
                                                                    <li>Cash and assets that can be easily converted to cash.</li>
                                                                    <li>Provides a measure of financial liquidity.</li>
                                                                </ul>
                                                            </li>
                                                            <li>Investments:<br />
                                                                <ul className='list-disc pl-5'>
                                                                    <li>Stocks, bonds, retirement accounts, and other long-term assets.</li>
                                                                    <li>Contributes to long-term financial growth.</li>
                                                                </ul>
                                                            </li>
                                                            <li>Real Estate:<br />
                                                                <ul className='list-disc pl-5'>
                                                                    <li>The value of owned property, including primary residence and additional real estate.</li>
                                                                    <li>Represents a significant portion of an individual&apos;s net worth.</li>
                                                                </ul>
                                                            </li>
                                                            <li>Short-term and Long-term Liabilities:<br />
                                                                <ul className='list-disc pl-5'>
                                                                    <li>Credit card debt, personal loans (short-term).</li>
                                                                    <li>Mortgages, student loans (long-term).</li>
                                                                </ul>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        Importance in Financial Planning:<br />
                                                        <ul className='list-disc pl-5'>
                                                            <li>Assists in setting financial goals and allocating resources effectively.</li>
                                                            <li>Guides decisions regarding debt management, investment strategies, and overall financial well-being.</li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                            <p className='!text-black !font-medium !text-sm !lg:text-base'>A personal balance sheet serves as a valuable tool for individuals to gain insight into their financial standing, make informed decisions, and work towards achieving their financial objectives.</p>
                                        </AccordionContent>
                                    </AccordionPanel>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                )
            case Stage.MoneyManagementPlan:
                return (
                    <div className="w-full p-4 min-h-screen bg-brandblack-900 relative lg:overflow-hidden">
                        <Image src='/riskscore/background-2.png' width={2540} height={2243} className='absolute z-0 w-full top-0 left-0 opacity-60 blur-3xl' objectFit='cover' alt='background' />
                        <div className='flex flex-row items-center gap-2 lg:gap-3 lg:mb-12 mb-10'>
                        <Image src="/Fydaalogo.webp" width={40} height={40} alt="Fydaa Logo" className='w-8 h-8 lg:w-10 lg:h-10 object-contain' />
                        <Image src="/Fydaalogotext.webp" width={120} height={40} alt="Fydaa Investment Adviser" className='h-8 lg:h-10 w-auto object-contain' />
                    </div>
                        <div className='w-full flex flex-col items-center h-full origin-center'>
                            <div className='max-w-4xl p-8 lg:p-12 bg-white w-full rounded-2xl z-10'>
                                <h1 className='font-bold text-3xl text-brandblack-900 mb-12'>Your Money Management Plan</h1>
                                <div className='w-full relative flex flex-col lg:flex-row justify-between items-center'>
                                    <div className="w-full lg:w-1/2 lg:border-r lg:border-brandblack-300">
                                        <AssetAllocation width={300} height={300} assetAllocation={riskProfile?.assetAllocation?.data ?? []} />
                                    </div>
                                    <div className="w-full lg:w-1/2 lg:pl-12 flex flex-col h-full items-center justify-center mt-8 lg:mt-0">
                                        <div className='w-full rounded-2xl bg-brandblack-700 p-8 relative mb-5'>
                                            <Image src='/riskscore/whymultiasset.png' alt="Why Multi asset portfolio?" width={292} height={79} className='w-full aspect-[292/79] cursor-pointer mb-4' onClick={() => {
                                                setModalType(ModalType.AssetComparison)
                                                setModalOpen(true)
                                            }} />
                                            <p className='font-regular text-xs text-brandblack-100 opacity-70 mb-4'>Based on you risk profile assessment, here is your personalised money management plan</p>
                                            <PrimaryButton className="bg-black font-bold text-black mb-4" onClick={() => {
                                                setModalType(ModalType.EnterPhone)
                                                setOtpSent(false)
                                                setModalOpen(true)
                                            }}>Setup My Account</PrimaryButton>
                                            <p className='w-full text-left text-xs font-bold text-black'>Not happy? <Link href={'/questionnaire'}><span className='text-brandblue'>{'Retake Quiz ->'}</span></Link></p>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div></div>
                    </div>
                )
        }
    }

    return (
        <>
            {getBody(stage)}
            {
                modalOpen && (
                    <div className='w-full min-h-screen bg-brandblack-900 fixed top-0 left-0 bg-opacity-70 flex flex-col justify-center items-center z-50'>
                        {showToast && (
                            <Toast>
                                <div className="ml-3 text-sm font-normal">Otp Sent Successfully!</div>
                                <ToastToggle onDismiss={() => setShowToast(false)} />
                            </Toast>
                        )}
                        {modalType == ModalType.KnowMore && (
                            <div id="defaultModal" tabIndex={-1} className="fixed flex flex-col justify-center items-center top-0 left-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-80">
                                <div className="relative w-full max-w-7xl max-h-full">
                                    <div className="relative bg-white rounded-lg shadow">
                                        {/* <!-- Modal header --> */}
                                        <div className="flex items-start justify-between p-4 border-b rounded-t">
                                            <h3 className="text-xl font-semibold text-gray-900 ">
                                                Assumptions & Disclaimers
                                            </h3>
                                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="defaultModal" onClick={() => setModalOpen(false)}>
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                        </div>
                                        {/* <!-- Modal body --> */}
                                        <div className="p-6 space-y-6 w-full">
                                            <p className="text-sm mb-2">Fixed Deposit Account returns are assumed at 6% (based on current and historical averages). fydaa does not claim to have accurate numbers and you should do your own due-diligence.</p>
                                            <p className="text-sm mb-4">Fydaa Investment account returns are assumed at 10%, based on historic returns of multiple assets, as per the following compilation of historical returns:</p>
                                            <h3 className="text-xl font-bold mb-2 text-center w-full">Historical Returns Calculation</h3>

                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                <table className="w-full text-sm text-left text-gray-500">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3">
                                                                S.No.
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                                Product name
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                                10 years return since 2012
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                                20 years return since 2002
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                                30 years return rince 1992
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="bg-white border-b ">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                1
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                Gold
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                5%
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                13%
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                9%
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b bg-gray-50 ">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                2
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                Nifty*
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                13%
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                15%
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                11%
                                                            </td>
                                                        </tr>
                                                        <tr className="bg-white border-b">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                3
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                NASDAQ
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                14%
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                12%
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                10%
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <p className="text-sm mb-4">Real Estate Investment Trusts(REITs) being a relatively new asset class and does not have a long historical records. However, on an average, Mindspace REIT has generated a return of 13% (Capital Appreciation of 7% CAGR and dividend yield of 5%) as on 31st March 2022.</p>

                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                <table className="w-full text-sm text-left text-gray-500">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3">
                                                                Price Return
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="bg-white border-b ">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                Issue Price
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                300
                                                            </td>
                                                            <td className="px-6 py-4">

                                                            </td>
                                                        </tr>
                                                        <tr className="border-b bg-gray-50 ">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                Price as on 31st March 2022
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                371
                                                            </td>
                                                            <td className="px-6 py-4">

                                                            </td>
                                                        </tr>
                                                        <tr className="bg-white border-b">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                3 years CAGR
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                7.34%
                                                            </td>
                                                            <td className="px-6 py-4">

                                                            </td>
                                                        </tr>
                                                        <tr className="border-b bg-gray-50 ">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                Dividend Yield On Issue Price
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                7.16%
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                FY 21
                                                            </td>
                                                        </tr>
                                                        <tr className="bg-white border-b">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                Dividend Yield On 31st March 2022
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                5.87%
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                FY 22
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <p className="text-sm mb-4">Fixed Income returns in India are benchmarked to following Government yields:</p>
                                            <h3 className="text-xl font-bold mb-2 text-center w-full">Government Bond Yields</h3>

                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                <table className="w-full text-sm text-left text-gray-500">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3">
                                                                Tenure
                                                            </th>
                                                            <th scope="col" className="px-6 py-3">
                                                                Yield
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="bg-white border-b ">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                India 5 years bond yield
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                7.182
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b bg-gray-50 ">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                India 10 years bond yield
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                7.251
                                                            </td>
                                                        </tr>
                                                        <tr className="bg-white border-b">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                India 24 years bond yield
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                7.335
                                                            </td>
                                                        </tr>
                                                        <tr className="border-b bg-gray-50 ">
                                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                                India 30 years bond yield
                                                            </th>
                                                            <td className="px-6 py-4">
                                                                7.379
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <p className="text-sm">“Performance-related information herein is not verified by SEBI or BASL.”</p>
                                            <p className="text-sm mb-8">“The performance data disclosed herein is not based on back-testing, projections or estimates.”</p>
                                            <p className="text-sm w-full text-right">Sources - <Link href='https://moneycontrol.com' className="underline text-brandlightblue">moneycontrol</Link></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Modal position={'center'} className="!flex !items-center !justify-center" size={'xl'} show={modalOpen && modalType == ModalType.AssetComparison} onClose={() => setModalOpen(false)} popup dismissible={false}>
                            <ModalHeader />
                            <ModalBody>
                                <div className="w-full flex flex-col items-center">
                                    <div className="rounded-lg w-full lg:max-w-md flex flex-col items-center px-4 sm:px-16 lg:px-4 mb-4">
                                        <h3 className="text-lg font-bold text-brandblack-900 mb-4">Why Multi-Asset Investment</h3>
                                        <p className="mb-4 opacity-60">Vaue of your Monthly Investments</p>
                                        <h3 className="text-xl font-bold text-brandblack-900 mb-4">₹{format(investment)}</h3>
                                        <input min={1000} max={200000} step={500} id="small-range" value={investment} type="range" className="border-brandblack-200 w-full h-1 mb-6 bg-brandblack-200 rounded-lg cursor-pointer ![&::-webkit-slider-thumb]:bg-brandblue ![&::-moz-range-thumb]:bg-brandblue ![&::-moz-focus-outer]:border-none appearance-none" onChange={(e) => setInvestment(parseFloat(e.target.value))}
                                            style={{
                                                background: `linear-gradient(to right, #007DFB ${(investment - 1000) * 100 / (200000 - 1000)}%, #05101828 ${(investment - 1000) * 100 / (200000 - 1000)}%)`
                                            }}
                                        />
                                        <p className="mb-4 opacity-60">after following years</p>
                                        <h3 className="text-xl font-bold text-brandblack-900 mb-4">{years}</h3>
                                        <input id="small" min={1} max={30} step={1} value={years} type="range" className="border-brandblack-200 w-full h-1 mb-8 bg-brandblack-200 rounded-lg cursor-pointer [&::-webkit-slider-thumb]:bg-brandblue [&::-moz-range-thumb]:bg-brandblue [&::-moz-focus-outer]:border-none appearance-none" onChange={(e) => setYears(parseInt(e.target.value))}
                                            style={{
                                                background: `linear-gradient(to right, #007DFB ${(years - 1) * 100 / (30 - 1)}%, #05101828 ${(years - 1) * 100 / (30 - 1)}%)`
                                            }}
                                        />
                                        <div className="w-full grid grid-cols-2 grid-rows-1 mb-8">
                                            <div className="w-full opacity-80">
                                                <p className="text-sm mb-1">Bank Fixed Deposit Account *</p>
                                                <p className="text-brandblack-900 font-bold text-lg">₹{calculateSIPReturn(6, years, investment)}</p>
                                            </div>
                                            <div className="w-full">
                                                <p className="text-sm mb-1">Multi-Asset Investment account *</p>
                                                <p className="text-brandblack-900 font-bold text-lg">₹{calculateSIPReturn(12, years, investment)}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs mb-2">{'*For illustration purpose only and not recommendatory. "Past performance is not a guarantee of future performance.”'}</p>
                                        <p className="w-full text-xs mb-8 underline text-left cursor-pointer" onClick={() => {
                                            setModalType(ModalType.KnowMore)
                                            setModalOpen(true)
                                        }}>Know More</p>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <PrimaryButton className="w-full" onClick={() => setModalOpen(false)}>I Understood</PrimaryButton>
                            </ModalFooter>
                        </Modal>
                        <Modal position={'center'} className="!flex !items-center !justify-center" size={'md'} show={modalOpen && modalType == ModalType.EnterPhone} onClose={() => setModalOpen(false)} popup dismissible={false}>
                            <ModalHeader />
                            <ModalBody>
                                <div className="w-full flex flex-col items-center">
                                    <div className="rounded-lg w-full flex flex-col items-start justify-start">
                                        <Image src="/riskscore/login.png" alt="mobile number login" width={72} height={69} className='mb-4' />
                                        <h3 className="text-xl font-bold text-brandblack-900 mb-1">Enter your mobile no</h3>
                                        <p className="text-brandblack-500 text-sm mb-6">We need to verify your number</p>
                                        <label className='text-sm font-bold text-brandblack-900 mb-1'>Mobile Number <span className='text-brandred'>*</span></label>
                                        <input type="tel" value={mobileNumber} size={5} onChange={e => { 
                                            setMobileNumber(e.target.value.slice(0, 10))
                                            setOtpSent(false)
                                        }} className='w-full border rounded-lg border-brandblack-300 text-base p-3 placeholder:tracking-normal' pattern="\d*" placeholder='Enter mobile no' style={{
                                            'letterSpacing': '12px',
                                        }} />
                                        {otpSent && (
                                            <p className="text-sm text-brandsucessgreen mt-2 mb-2">OTP sent successfully!</p>
                                        )}
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <div className="w-full flex flex-col gap-2">
                                    <PrimaryButton className="w-full" onClick={async () => {
                                        if (mobileNumber.length == 10) {
                                            await fetch('https://auth.fydaa.com/auth/requestOtp', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-type': 'application/json',
                                                    'Accept': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    "callingCode": "+91",
                                                    "mobileNumber": mobileNumber,
                                                    "deviceId": "web",
                                                    "isWhatsappOptin": 1,
                                                    "fromApp": "fydaa"
                                                })
                                            })
                                                .then(data => data.json())
                                                .then(data => {
                                                    if (data.data.otpDelivered == true) {
                                                        setOtpSent(true)
                                                        setShowToast(true)
                                                        setTimeout(() => setShowToast(false), 3000)
                                                    } else {
                                                        alert('Couldn\'t send Otp, try again after sometime')
                                                    }
                                                })
                                                .catch(e => alert('Couldn\'t send Otp, try again after sometime'))
                                        } else {
                                            alert("Please enter a valid mobile number")
                                        }
                                    }}>Send OTP</PrimaryButton>
                                    <PrimaryButton className="w-full" disabled={!otpSent} onClick={() => {
                                        if (otpSent) {
                                            setModalType(ModalType.VerifyOtp)
                                        }
                                    }}>Continue</PrimaryButton>
                                </div>
                            </ModalFooter>
                        </Modal>
                        <Modal position={'center'} className="!flex !items-center !justify-center" size={'md'} show={modalOpen && modalType == ModalType.VerifyOtp} onClose={() => setModalOpen(false)} popup dismissible={false}>
                            <ModalHeader />
                            <ModalBody>
                                <div className="w-full flex flex-col items-center">
                                    <div className="rounded-lg w-full flex flex-col items-start justify-start">
                                        <Image src="/riskscore/verify.png" alt="mobile number login" width={72} height={69} className='mb-4' />
                                        <h3 className="text-xl font-bold text-brandblack-900 mb-1">{"Verify it's you"}</h3>
                                        <p className="text-brandblack-500 text-sm mb-6">{`We send a code to ( ${mobileNumber} ). Enter it here to verify your identity`}</p>
                                        <OtpInput
                                            containerStyle="w-full justify-between gap-1 mb-6"
                                            value={otp}
                                            onChange={setOtp}
                                            numInputs={6}
                                            // renderSeparator={<span className='m-1' />}
                                            renderInput={(props) => {
                                                const { type, ...restProps } = props;
                                                return <input {...restProps} type='number' className={`${props.className} pt-3 pb-3 !w-12 bg-brandblack-200 !text-brandblack-900 font-bold text-xl rounded-lg`} />;
                                            }}
                                        />
                                        <p onClick={async () => {
                                            if (mobileNumber.length == 10) {
                                                await fetch('https://auth.fydaa.com/auth/requestOtp', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-type': 'application/json',
                                                        'Accept': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        "callingCode": "+91",
                                                        "mobileNumber": mobileNumber,
                                                        "deviceId": "web",
                                                        "isWhatsappOptin": 1,
                                                        "fromApp": "fydaa"
                                                    })
                                                })
                                                    .then(data => data.json())
                                                    .then(data => {
                                                        if (data.data.otpDelivered == true) {
                                                            setOtp("")
                                                            setModalType(ModalType.VerifyOtp)
                                                        } else {
                                                            alert('Couldn\'t send Otp, try again after sometime')
                                                        }
                                                    })
                                                    .catch(e => alert('Couldn\'t send Otp, try again after sometime'))
                                            } else {
                                                alert("Please enter a valid mobile number")
                                            }
                                        }} className='w-full text-center text-brandblue font-bold'>Resend Code</p>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <PrimaryButton className="w-full" onClick={async () => {
                                    if (otp.length == 6) {
                                        await fetch('https://auth.fydaa.com/auth/verifyOtp', {
                                            method: 'POST',
                                            headers: {
                                                'Content-type': 'application/json',
                                                'Accept': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                "mobileNumber": mobileNumber,
                                                "otp": otp,
                                                "guestUserId": typeof window !== 'undefined' ? localStorage.getItem('uuid') : '',
                                                "referralCode": typeof window !== 'undefined' ? localStorage.getItem('referralCode') ?? '' : '',
                                            })
                                        })
                                            .then(data => data.json())
                                            .then(data => {
                                                if (data.statusCode == 401) {
                                                    alert('Please enter valid otp')
                                                    return
                                                }
                                                router.push('/download')
                                            })
                                            .catch(e => alert('Please enter valid otp'))
                                    } else {
                                        alert("Please enter valid otp")
                                    }
                                }}>Continue</PrimaryButton>
                            </ModalFooter>
                        </Modal>
                    </div>
                )
            }

        </>
    )


}