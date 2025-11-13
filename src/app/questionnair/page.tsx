'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

export default function Questionnaire() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [questionList, setQuestionList] = useState<any[]>([])
    const [answer, setAnswer] = useState<Record<string, any>>({})
    const router = useRouter()

    useEffect(() => {
        (async () => {
            const questions = await fetch(`${process.env.NEXT_PUBLIC_ONBOARD_BASE_URL}risk-profile-questionnaire/getRiskProfileQuestionnaire`).then(data => data.json())
            setQuestionList(questions)

            const _answer: Record<string, any> = {}
            for (const question of questions) {
                if (question['questionType'] == 'RANGE') {
                    _answer[question['id']] = {
                        'value': question['range']['start'].toString(),
                        'questionId': question['id'].toString(),
                        'secondaryQuestionId': question['secondaryQuestionId'].toString(),
                    };
                }
            }
            setAnswer(_answer)
        })()
    }, [])

    return (
        questionList.length > 0 ?
            (<div className="flex flex-row w-full min-h-screen">
                <div className="w-1/2 bg-brandblack-100 p-12 lg:flex flex-col justify-between hidden">
                    <div className="w-full mt-12">
                        <Image src="/start-investing/fydaalogo.png" height={68} width={226} alt="Fydaa Investment Adviser Logo" className="mb-12" />
                        <div className="w-full flex flex-row justify-center items-center mb-12">
                            <Image src={questionList[currentQuestionIndex]?.['backgroundImageUrl'] ?? ''} alt="Background Image Url" width={620} height={583} className="object-contain" />
                        </div>
                    </div>
                    <div className="w-full">
                        <h1 className="text-5xl font-medium text-brandblack-900 mb-6">
                            {questionList[currentQuestionIndex]?.['title'] ?? 'Age Profile'}
                        </h1>
                        <p className="text-xl text-brandblack-700">
                            {questionList[currentQuestionIndex]?.['description'] ?? 'Your age is very important factor in determining your ability to take risk and therefore expected returns.'}
                        </p>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center items-center">
                    <h2 className="text-xl font-bold text-brandblack-700 mb-1">
                        {questionList[currentQuestionIndex]?.['questionCategory'] == 'FINANCIAL' ? 'Financial Info' : 'Personal Info'}
                    </h2>
                    <p className="text-xs font-medium text-brandblack-500 mb-12">{`Question ${currentQuestionIndex + 1} of ${questionList.length}`}</p>
                    <div className="w-full max-w-[420px]">
                        <Image src={'/start-investing/questiontop.png'} alt="question bar cards" width={352} height={30} className="w-full" />
                    </div>
                    <div 
                        className="w-full max-w-[420px] -mt-2 pl-6 pr-6 pt-8 pb-8 rounded-xl flex flex-col items-center"
                        style={{
                            backgroundColor: '#007DFB'
                        }}
                    >
                        <p className="text-white font-bold text-center pt-6 mb-8 text-lg break-words px-2">{questionList[currentQuestionIndex]?.['question']}</p>
                        {
                            questionList[currentQuestionIndex]?.['questionType'] == 'RANGE' ? (
                                <div className="pt-4 w-full">
                                    <p className="w-full text-center text-white font-bold text-3xl mb-6">{new Intl.NumberFormat('hi-IN').format(answer[questionList[currentQuestionIndex]['id']]['value'])}</p>
                                    <input
                                        onChange={(e) => {
                                            const value = e.target.value
                                            const _answer = {
                                                ...answer,
                                                [questionList[currentQuestionIndex]['id']]: {
                                                    ...(answer[questionList[currentQuestionIndex]['id']]),
                                                    'value': value.toString(),
                                                }
                                            }
                                            setAnswer(_answer)
                                        }}
                                        className="mb-2 w-full range-input"
                                        type="range"
                                        min={questionList[currentQuestionIndex]['range']['start']}
                                        max={questionList[currentQuestionIndex]['range']['end']}
                                        value={answer[questionList[currentQuestionIndex]['id']]['value']}
                                        step={questionList[currentQuestionIndex]['range']['tickerSize']}
                                        style={{
                                            background: `linear-gradient(to right, #fff ${(answer[questionList[currentQuestionIndex]['id']]['value'] - questionList[currentQuestionIndex]['range']['start']) * 100 / (questionList[currentQuestionIndex]['range']['end'] - questionList[currentQuestionIndex]['range']['start'])}%, #05101828 ${(answer[questionList[currentQuestionIndex]['id']]['value'] - questionList[currentQuestionIndex]['range']['start']) * 100 / (questionList[currentQuestionIndex]['range']['end'] - questionList[currentQuestionIndex]['range']['start'])}%)`
                                        }}
                                    />
                                    <div className="w-full flex flex-row justify-between pl-2 pr-2">
                                        <div className="w-[2px] h-[6px] bg-brandblack-300"></div>
                                        <div className="w-[2px] h-[6px] bg-brandblack-300"></div>
                                        <div className="w-[2px] h-[6px] bg-brandblack-300"></div>
                                        <div className="w-[2px] h-[6px] bg-brandblack-300"></div>
                                        <div className="w-[2px] h-[6px] bg-brandblack-300"></div>
                                    </div>
                                    <div className="w-full flex flex-row justify-between mt-2">
                                        <p className="text-white text-sm font-bold text-left">{new Intl.NumberFormat('hi-IN').format(questionList[currentQuestionIndex]['range']['start'])}</p>
                                        <p className="text-white text-sm font-bold text-right">{new Intl.NumberFormat('hi-IN').format(questionList[currentQuestionIndex]['range']['end'])}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full mt-4">
                                    {
                                        questionList[currentQuestionIndex]['option'].map((option: any, index: number) => (
                                            <div key={option.answer} className={`w-full flex flex-row justify-between items-center pl-4 pr-4 pt-3 pb-3 border rounded-xl mb-2 cursor-pointer transition-all duration-200 ${(answer[questionList[currentQuestionIndex]['id']]?.['answerId'] == index + 1) ? 'bg-white text-black font-semibold text-lg border-2 border-black' : 'bg-white bg-opacity-20 text-white font-medium border-white border-opacity-30'}`} onClick={() => {
                                                const _answer = {
                                                    ...answer,
                                                    [questionList[currentQuestionIndex]['id']]: {
                                                        'answerId': (index + 1).toString(),
                                                        'questionId': questionList[currentQuestionIndex]['id'].toString(),
                                                        'secondaryQuestionId': questionList[currentQuestionIndex]['secondaryQuestionId'].toString(),
                                                    }
                                                }
                                                setAnswer(_answer)
                                            }}>
                                                <p className={`w-full text-center ${(answer[questionList[currentQuestionIndex]['id']]?.['answerId'] == index + 1) ? 'text-black' : 'text-white'}`}>{option.answer}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                    <div className="w-full max-w-[420px] flex flex-row justify-center mt-3 pb-3 gap-2">
                        <button disabled={currentQuestionIndex == 0} className={`w-[45%] border font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${currentQuestionIndex == 0 ? 'border-brandblack-50 bg-brandblack-50 text-brandblack-400 cursor-not-allowed' : 'border-brandblack-700 bg-white text-brandblack-900 hover:bg-gray-50'}`} onClick={() => {
                            setCurrentQuestionIndex(currentQuestionIndex - 1)
                        }}>Back</button>
                        <button disabled={answer[questionList[currentQuestionIndex]['id']] == undefined} className={`w-[45%] px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${answer[questionList[currentQuestionIndex]['id']] == undefined ? 'border-brandblack-50 bg-brandblack-50 text-brandblack-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`} onClick={async () => {
                            if (currentQuestionIndex < questionList.length - 1) {
                                setCurrentQuestionIndex(currentQuestionIndex + 1)
                            } else {
                                console.log(answer)
                                console.log(Object.values(answer))
                                const response = await fetch(`${process.env.NEXT_PUBLIC_ONBOARD_BASE_URL}risk-profile/createGuestUserRiskProfile`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        option: Object.values(answer),
                                        guestUserId: typeof window !== 'undefined' ? localStorage.getItem('id') : '',
                                    }),
                                }).then(res => res.json())
                                router.push('/risk-score')
                            }
                        }}>Next</button>
                    </div>
                </div>
            </div>) : (
                <div className="w-full flex flex-col items-center justify-center min-h-screen">
                    <Image src="/start-investing/Indicator.png" alt="Loading Risk Questionnaire" width={189} height={123} className="lg:w-1/3 aspect-[189/123] mb-12" />
                    <h1 className="font-bold text-center w-full text-3xl text-brandblack-900">Loading risk questionnaire</h1>
                </div>
            )
    )
}

