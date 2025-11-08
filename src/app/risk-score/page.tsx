"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

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

const wealthStages: Record<string, { desc: string; top: string }> = {
    'Saving': {
        'desc': 'You are down but not out! All good things start with small beginning. Start now to reach to next stage to belong to 7% club!',
        'top': 'Majority 89% people are in this stage',
    },
    'Investments': {
        'desc': 'A journey well begun ! You are just one step away from being part of top 3% club of wealthy people.',
        'top': 'Only 7% people are in this stage',
    },
    'Wealth Generation': {
        'desc': 'You are almost there and just need a little bit of more sound advice to reach the 1% club.',
        'top': 'Only 3% people are in this stage',
    },
    'Wealth Management': {
        'desc': 'You are there and just need to be disciplined with a sound adviser on your side to help you not lose your 1% status.',
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
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree
    return res
}

function calculateSIPReturn(R: number, Y: number, I: number): string {
    const i = R / (100 * 12);
    const n = Y * 12;
    const P = I;
    return format((P * (Math.pow((1 + i), n) - 1) * ((1 + i) / i)));
}

// Simple Accordion Component
const Accordion = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={className}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left">
                {children}
            </button>
        </div>
    );
};

const AccordionPanel = ({ title, children }: { title: React.ReactNode; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-black rounded-lg mb-2 bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex justify-between items-center text-brandblack-900 font-semibold text-sm lg:font-bold lg:text-xl"
            >
                {title}
                <svg
                    className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 text-brandblack-900 font-medium text-sm lg:text-base">
                    {children}
                </div>
            )}
        </div>
    );
};

// Simple Modal Component
const Modal = ({ show, onClose, children, size = 'md' }: { show: boolean; onClose: () => void; children: React.ReactNode; size?: string }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className={`bg-white rounded-lg shadow-lg max-w-${size === 'xl' ? '4xl' : '2xl'} w-full max-h-[90vh] overflow-y-auto relative`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
};

const ModalHeader = ({ children }: { children?: React.ReactNode }) => (
    <div className="p-4 border-b">{children}</div>
);

const ModalBody = ({ children }: { children: React.ReactNode }) => (
    <div className="p-6">{children}</div>
);

const ModalFooter = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 border-t">{children}</div>
);

// Simple OTP Input Component
const OtpInput = ({ value, onChange, numInputs = 6 }: { value: string; onChange: (value: string) => void; numInputs?: number }) => {
    const handleChange = (index: number, val: string) => {
        if (val.length > 1) return;
        const newValue = value.split('');
        newValue[index] = val;
        onChange(newValue.join('').slice(0, numInputs));
    };
    
    return (
        <div className="flex gap-2 justify-between">
            {Array.from({ length: numInputs }).map((_, index) => (
                <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-bold rounded-lg bg-brandblack-200 text-brandblack-900"
                />
            ))}
        </div>
    );
};

// Placeholder components - you'll need to implement these
const BalanceSheet = ({ height, width, indicators, networth, damage }: any) => (
    <div className="flex items-center justify-center" style={{ height, width }}>
        <div className="text-center">
            <p className="text-2xl font-bold">Net Worth: ₹{networth}</p>
            <p className="text-red-600">Damage: {damage}%</p>
        </div>
    </div>
);

const AssetAllocation = ({ width, height, assetAllocation }: any) => (
    <div className="flex items-center justify-center" style={{ height, width }}>
        <div className="text-center">
            <p className="text-xl font-bold mb-4">Asset Allocation</p>
            {assetAllocation?.map((asset: any, index: number) => (
                <div key={index} className="mb-2">
                    <p>{asset.name}: {asset.percentage}%</p>
                </div>
            ))}
        </div>
    </div>
);

const ArrowIcon = () => (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.15234 7.375C5.46875 7.69141 5.99609 7.69141 6.34766 7.375L11.1289 2.59375C11.4453 2.24219 11.4453 1.71484 11.1289 1.39844L10.3203 0.589844C9.96875 0.273438 9.44141 0.273438 9.125 0.589844L5.71484 4L2.33984 0.589844C2.02344 0.273438 1.49609 0.273438 1.14453 0.589844L0.371094 1.39844C0.0195312 1.71484 0.0195312 2.24219 0.371094 2.59375L5.15234 7.375Z" fill="white" />
</svg>
);

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
    const router = useRouter()

    useEffect(() => {
        (async () => {
            if (typeof window !== 'undefined') {
                const response = await fetch(`${process.env.NEXT_PUBLIC_ONBOARD_BASE_URL}risk-profile/getGuestIndicators?guestUserId=${localStorage.getItem('id')}`).then(res => res.json())
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
                return (
                    <div className="w-full p-4 pt-8 lg:pt-12 h-screen bg-brandblack-900 relative overflow-y-auto">
                        <Image src='/riskscore/background-2.png' width={2540} height={2243} className='absolute z-0 w-full top-0 left-0 opacity-60 blur-3xl object-cover' alt='background' />
                        <div className='w-full flex flex-col items-center h-full origin-center min-h-[60vh] justify-center'>
                            <div className='max-w-4xl p-8 lg:p-12 bg-white w-full rounded-2xl z-10 flex flex-col items-center justify-center'>
                                {/* Loading Spinner */}
                                <div className='mb-10 flex items-center justify-center'>
                                    <div className="relative">
                                        <div className="animate-spin rounded-full h-24 w-24 border-4 border-brandblack-100 border-t-brandblack-900"></div>
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <div className="h-16 w-16 rounded-full bg-brandblack-900 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h2 className='font-bold text-3xl lg:text-4xl text-brandblack-900 mb-4 text-center'>Hold Tight, We are Analysing the details</h2>
                                <p className='font-medium text-base lg:text-lg text-brandblack-500 text-center'>You&apos;re good to go for next steps</p>
                            </div>
                        </div>
                    </div>
                )

            case Stage.RiskScore:
                return (
                    <div className="w-full p-4 pt-8 lg:pt-12 h-screen bg-brandblack-900 relative overflow-y-auto">
                        <Image src='/riskscore/background-2.png' width={2540} height={2243} className='absolute z-0 w-full top-0 left-0 opacity-60 blur-3xl object-cover' alt='background' />
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
                                            <p className='relative z-10 text-white font-bold text-xl mb-6'>Next Step,<br />Are you eager to view<br />your financial health<br />report!!!</p>
                                            <button className="bg-white font-bold text-brandblack-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => { setStage(Stage.WealthJourney) }}>View Wealth Journey</button>
                                        </div>
                                        <p className='w-full pl-8 text-left text-xs font-bold text-brandblack-500'>Not happy? <Link href={'/questionnair'}><span className='text-brandblue'>{'Retake Quiz ->'}</span></Link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex flex-col lg:p-8 justify-center items-center relative z-10 mt-10'>
                            <h2 className='!font-bold !text-xl !text-brandblack-900 text-center mb-8'>Frequently Asked Question</h2>
                            <div className='w-full max-w-4xl'>
                                <AccordionPanel title={<p className='!font-semibold !text-sm !lg:font-bold !lg:text-xl !text-brandblack-900'>What is Risk Profile?</p>}>
                                    <div className='!text-brandblack-900 !font-medium !text-sm !lg:text-base'>
                                        <ul className='list-disc pl-5'>
                                            <li>Definition: A risk profile assesses an individual&apos;s willingness and ability to tolerate financial risk in investment decisions.</li>
                                            <li>Willingness to Take Risk: Measures an individual&apos;s comfort level with fluctuations in investment returns.</li>
                                            <li>Ability to Take Risk: Evaluates the financial capacity to withstand potential losses.</li>
                                        </ul>
                                    </div>
                                </AccordionPanel>
                            </div>
                        </div>
                    </div>
                )

            case Stage.WealthJourney:
                return (
                    <div className="w-full p-4 pt-8 lg:pt-12 h-screen bg-brandblack-900 relative overflow-y-auto">
                        <Image src='/riskscore/background-2.png' width={2540} height={2243} className='absolute z-0 w-full top-0 left-0 opacity-60 blur-3xl object-cover' alt='background' />
                        <div className='w-full flex flex-col items-center h-full origin-center'>
                            <div className='max-w-4xl p-8 lg:p-12 bg-white w-full rounded-2xl z-10'>
                                <h1 className='font-bold text-3xl text-brandblack-900 mb-12'>Wealth Management Journey</h1>
                                <div className='w-full relative flex flex-col lg:flex-row justify-between items-center'>
                                    <div className="w-full lg:w-1/2 lg:border-r lg:border-brandblack-300">
                                        <div className='relative w-full min-h-[350px] flex flex-col justify-center items-center'>
                                            <div className={`rounded-full w-[310px] h-[310px] border border-brandblack-700 absolute bottom-0 ${riskProfile?.balanceSheetDamage?.wealthStage?.name == 'Wealth Management' ? 'bg-brandblue' : 'bg-brandblack-50'}`}>
                                                <p className={`w-full text-center font-bold text-xs pt-6 ${riskProfile?.balanceSheetDamage?.wealthStage?.name == 'Wealth Management' ? 'text-white' : 'text-brandblack-900'}`}>Wealth Management</p>
                                            </div>
                                            <div className={`rounded-full w-[260px] h-[260px] border border-brandblack-700 absolute bottom-0 ${riskProfile?.balanceSheetDamage?.wealthStage?.name == 'Wealth Generation' ? 'bg-brandblue' : 'bg-brandblack-50'}`}>
                                                <p className={`w-full text-center font-bold text-xs pt-6 ${riskProfile?.balanceSheetDamage?.wealthStage?.name == 'Wealth Generation' ? 'text-white' : 'text-brandblack-900'}`}>Wealth Generation</p>
                                            </div>
                                            <div className={`rounded-full w-[200px] h-[200px] border border-brandblack-700 absolute bottom-0 ${riskProfile?.balanceSheetDamage?.wealthStage?.name == 'Investments' ? 'bg-brandblue' : 'bg-brandblack-50'}`}>
                                                <p className={`w-full text-center font-bold text-xs pt-6 ${riskProfile?.balanceSheetDamage?.wealthStage?.name == 'Investments' ? 'text-white' : 'text-brandblack-900'}`}>Investments</p>
                                            </div>
                                            <div className={`rounded-full w-[140px] h-[140px] border border-brandblack-700 absolute bottom-0 ${riskProfile?.balanceSheetDamage?.wealthStage?.name == 'Saving' ? 'bg-brandblue' : 'bg-brandblack-50'}`}>
                                                <p className={`w-full text-center font-bold text-xs pt-12 ${riskProfile?.balanceSheetDamage?.wealthStage?.name == 'Saving' ? 'text-white' : 'text-brandblack-900'}`}>Saving</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2 lg:pl-12 flex flex-col h-full items-center justify-center mt-8 lg:mt-0">
                                        <div className='w-full rounded-2xl bg-brandblack-700 p-8 relative mb-5'>
                                            <Image src='/riskscore/pattern-2.png' alt='pattern' width={144} height={150} className='z-0 absolute right-0 top-0' />
                                            <p className='text-white font-bold text-xs mb-2'>You current stage is</p>
                                            <p className='relative z-10 text-white font-bold text-xl mb-4'>{(riskProfile?.balanceSheetDamage?.wealthStage?.name ?? '').toUpperCase()}</p>
                                            <p className='font-regular text-xs text-brandblack-100 opacity-70 mb-4'>{wealthStages[riskProfile?.balanceSheetDamage?.wealthStage?.name ?? '']?.desc}</p>
                                            <p className='font-bold italic text-xs text-branddeepgreen mb-6'>{wealthStages[riskProfile?.balanceSheetDamage?.wealthStage?.name ?? '']?.top}</p>
                                            <button className="bg-white font-bold text-brandblack-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setStage(Stage.BalanceSheet)}>View Balance Sheet</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case Stage.BalanceSheet:
                return (
                    <div className="w-full p-4 pt-8 lg:pt-12 h-screen bg-brandblack-900 relative overflow-y-auto">
                        <Image src='/riskscore/background-2.png' width={2540} height={2243} className='absolute z-0 w-full top-0 left-0 opacity-60 blur-3xl object-cover' alt='background' />
                        <div className='w-full flex flex-col items-center h-full origin-center'>
                            <div className='max-w-4xl p-8 lg:p-12 bg-white w-full rounded-2xl z-10'>
                                <h1 className='font-bold text-3xl text-brandblack-900 mb-12'>Your Balance Sheet</h1>
                                <div className='w-full relative flex flex-col lg:flex-row justify-between items-center'>
                                    <div className="w-full lg:w-1/2 lg:border-r lg:border-brandblack-300 flex flex-col justify-center items-start lg:pl-5 lg:pr-5">
                                        <div className='w-full p-2 bg-brandredcindrella rounded-lg inline mb-7'>
                                            <p className='text-xs font-bold text-brandred text-center'> <span><Image src='/riskscore/warning.png' alt='warning' height={16} width={16} className='inline mr-2' /></span> <span>Damaged by {Math.round(riskProfile?.totalBalanceSheetDamage ?? 0)}%!!</span> </p>
                                        </div>
                                        <div className='flex flex-row justify-center w-full'>
                                            <BalanceSheet height={300} width={300} indicators={[]} networth={Intl.NumberFormat('hi-IN').format(riskProfile?.balanceSheetDamage?.netWorth ?? 0)} damage={riskProfile?.totalBalanceSheetDamage} />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2 lg:pl-12 flex flex-col h-full items-center justify-center mt-8 lg:mt-0">
                                        <div className='w-full rounded-2xl bg-brandblack-700 p-8 relative mb-5'>
                                            <Image src='/riskscore/pattern-3.png' alt='pattern' width={144} height={150} className='z-0 absolute right-0 top-0' />
                                            <p className='relative z-10 text-white font-bold text-xl mb-4'>Next Step,<br />Check your personalised<br />money management plan</p>
                                            <p className='font-regular text-xs text-brandblack-100 opacity-70 mb-4'>A multi-asset portfolio for your balance sheet improvement </p>
                                            <button className="bg-white font-bold text-brandblack-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setStage(Stage.MoneyManagementPlan)}>Check & Confirm</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case Stage.MoneyManagementPlan:
                return (
                    <div className="w-full p-4 pt-8 lg:pt-12 h-screen bg-brandblack-900 relative overflow-y-auto">
                        <Image src='/riskscore/background-2.png' width={2540} height={2243} className='absolute z-0 w-full top-0 left-0 opacity-60 blur-3xl object-cover' alt='background' />
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
                                            <button className="bg-white font-bold text-brandblack-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors mb-4" onClick={() => {
                                                setModalType(ModalType.EnterPhone)
                                                setModalOpen(true)
                                            }}>Setup My Account</button>
                                            <p className='w-full text-left text-xs font-bold text-white'>Not happy? <Link href={'/questionnair'}><span className='text-brandblue'>{'Retake Quiz ->'}</span></Link></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return (
        <>
            {getBody(stage)}
            {modalOpen && (
                <div className='fixed w-full min-h-screen bg-brandblack-900 top-0 left-0 bg-opacity-70 flex flex-col justify-center items-center z-50'>
                    {showToast && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg">
                            Otp Sent Successfully!
                            <button onClick={() => setShowToast(false)} className="ml-4">×</button>
                        </div>
                    )}
                    {modalType == ModalType.KnowMore && (
                        <Modal show={true} onClose={() => setModalOpen(false)} size="xl">
                            <ModalHeader>
                                <h3 className="text-xl font-semibold text-gray-900">Assumptions & Disclaimers</h3>
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-sm mb-2">Fixed Deposit Account returns are assumed at 6% (based on current and historical averages). fydaa does not claim to have accurate numbers and you should do your own due-diligence.</p>
                                <p className="text-sm mb-4">Fydaa Investment account returns are assumed at 10%, based on historic returns of multiple assets.</p>
                            </ModalBody>
                        </Modal>
                    )}
                    {modalType == ModalType.AssetComparison && (
                        <Modal show={true} onClose={() => setModalOpen(false)} size="xl">
                            <ModalBody>
                                <div className="w-full flex flex-col items-center">
                                    <div className="rounded-lg w-full lg:max-w-md flex flex-col items-center px-4 sm:px-16 lg:px-4 mb-4">
                                        <h3 className="text-lg font-bold text-brandblack-900 mb-4">Why Multi-Asset Investment</h3>
                                        <p className="mb-4 opacity-60">Value of your Monthly Investments</p>
                                        <h3 className="text-xl font-bold text-brandblack-900 mb-4">₹{format(investment)}</h3>
                                        <input min={1000} max={200000} step={500} value={investment} type="range" className="w-full h-1 mb-6 bg-brandblack-200 rounded-lg cursor-pointer" onChange={(e) => setInvestment(parseFloat(e.target.value))} style={{
                                            background: `linear-gradient(to right, #007DFB ${(investment - 1000) * 100 / (200000 - 1000)}%, #05101828 ${(investment - 1000) * 100 / (200000 - 1000)}%)`
                                        }} />
                                        <p className="mb-4 opacity-60">after following years</p>
                                        <h3 className="text-xl font-bold text-brandblack-900 mb-4">{years}</h3>
                                        <input min={1} max={30} step={1} value={years} type="range" className="w-full h-1 mb-8 bg-brandblack-200 rounded-lg cursor-pointer" onChange={(e) => setYears(parseInt(e.target.value))} style={{
                                            background: `linear-gradient(to right, #007DFB ${(years - 1) * 100 / (30 - 1)}%, #05101828 ${(years - 1) * 100 / (30 - 1)}%)`
                                        }} />
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
                                        <p className="text-xs mb-2">{'*For illustration purpose only and not recommendatory. "Past performance is not a guarantee of future performance."'}</p>
                                        <p className="w-full text-xs mb-8 underline text-left cursor-pointer" onClick={() => {
                                            setModalType(ModalType.KnowMore)
                                            setModalOpen(true)
                                        }}>Know More</p>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <button className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors" onClick={() => setModalOpen(false)}>I Understood</button>
                            </ModalFooter>
                        </Modal>
                    )}
                    {modalType == ModalType.EnterPhone && (
                        <Modal show={true} onClose={() => setModalOpen(false)} size="xl">
                            <ModalBody>
                                <div className="w-full flex flex-col items-center">
                                    <div className="rounded-lg w-full flex flex-col items-start justify-start">
                                        <Image src="/riskscore/login.png" alt="mobile number login" width={108} height={103} className='mb-8' />
                                        <h3 className="text-3xl font-bold text-brandblack-900 mb-2">Enter your mobile no</h3>
                                        <p className="text-brandblack-500 mb-8">We need to verify your number</p>
                                        <label className='text-sm font-bold text-brandblack-900 mb-1'>Mobile Number <span className='text-brandred'>*</span></label>
                                        <input type="tel" value={mobileNumber} onChange={e => { setMobileNumber(e.target.value.slice(0, 10)) }} className='w-full border rounded-lg border-brandblack-300 text-base p-3' pattern="\d*" placeholder='Enter mobile no' style={{ letterSpacing: '12px' }} />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <button className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors" onClick={async () => {
                                    if (mobileNumber.length == 10) {
                                        try {
                                            const data = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}auth/requestOtp`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-type': 'application/json',
                                                    'Accept': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    "callingCode": "+91",
                                                    "mobileNumber": mobileNumber,
                                                    "deviceId": "web",
                                                    "isWhatsappOptin": true
                                                })
                                            }).then(data => data.json())
                                            if (data.data.otpDelivered == true) {
                                                setModalType(ModalType.VerifyOtp)
                                            } else {
                                                alert('Couldn\'t send Otp, try again after sometime')
                                            }
                                        } catch (e) {
                                            alert('Couldn\'t send Otp, try again after sometime')
                                        }
                                    } else {
                                        alert("Please enter a valid mobile number")
                                    }
                                }}>Continue</button>
                            </ModalFooter>
                        </Modal>
                    )}
                    {modalType == ModalType.VerifyOtp && (
                        <Modal show={true} onClose={() => setModalOpen(false)} size="xl">
                            <ModalBody>
                                <div className="w-full flex flex-col items-center">
                                    <div className="rounded-lg w-full flex flex-col items-start justify-start">
                                        <Image src="/riskscore/verify.png" alt="mobile number login" width={108} height={103} className='mb-8' />
                                        <h3 className="text-3xl font-bold text-brandblack-900 mb-2">{"Verify it's you"}</h3>
                                        <p className="text-brandblack-500 mb-8">{`We send a code to ( ${mobileNumber} ). Enter it here to verify your identity`}</p>
                                        <OtpInput value={otp} onChange={setOtp} numInputs={6} />
                                        <p onClick={async () => {
                                            if (mobileNumber.length == 10) {
                                                try {
                                                    const data = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}auth/requestOtp`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-type': 'application/json',
                                                            'Accept': 'application/json'
                                                        },
                                                        body: JSON.stringify({
                                                            "callingCode": "+91",
                                                            "mobileNumber": mobileNumber,
                                                            "deviceId": "web",
                                                            "isWhatsappOptin": true
                                                        })
                                                    }).then(data => data.json())
                                                    if (data.data.otpDelivered == true) {
                                                        setOtp("")
                                                        setModalType(ModalType.VerifyOtp)
                                                    } else {
                                                        alert('Couldn\'t send Otp, try again after sometime')
                                                    }
                                                } catch (e) {
                                                    alert('Couldn\'t send Otp, try again after sometime')
                                                }
                                            } else {
                                                alert("Please enter a valid mobile number")
                                            }
                                        }} className='w-full text-center text-brandblue font-bold mt-4 cursor-pointer'>Resend Code</p>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <button className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors" onClick={async () => {
                                    if (otp.length == 6) {
                                        try {
                                            const data = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}auth/verifyOtp`, {
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
                                            }).then(data => data.json())
                                            if (data.statusCode == 401) {
                                                alert('Please enter valid otp')
                                                return
                                            }
                                            router.push('/download')
                                        } catch (e) {
                                            alert('Please enter valid otp')
                                        }
                                    } else {
                                        alert("Please enter valid otp")
                                    }
                                }}>Continue</button>
                            </ModalFooter>
                        </Modal>
                    )}
                </div>
            )}
        </>
    )
}

