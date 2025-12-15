import React from 'react';

export default function InvestorCharter() {
    return (
        <>
           
            <main className="w-full flex flex-col items-center p-16">
                <section className="terms-content">
                    <div className="container">
                        <h2 className="text-center text-3xl font-bold mb-12 mt-8">Investor Charter</h2>

                        {/* A. Vision and Mission */}
                        <h3 className="font-bold text-xl mt-8">A. Vision and Mission Statements for investors</h3>
                        <ul className="list-disc ml-6 mt-2">
                            <li><strong>Vision <br /></strong> Invest with knowledge &amp; safety.</li>
                            <li>
                                <strong>Mission <br /></strong> Every investor should be able to invest in right investment products based on their needs, manage and monitor them to meet their goals, access reports and enjoy financial wellness.
                            </li>
                        </ul>

                        {/* B. Business transacted */}
                        <h2 className="font-bold text-xl mt-8">
                            B. Details of business transacted by the Investment Adviser with respect to the investors
                        </h2>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>To enter into an agreement with the client providing all details including fee details, aspects of Conflict-of-interest disclosure and maintaining confidentiality of information.</li>
                            <li>To do a proper and unbiased risk – profiling and suitability assessment of the client.</li>
                            <li>To conduct audit annually.</li>
                            <li>To disclose the status of complaints on its website.</li>
                            <li>To disclose the name, proprietor name, type of registration, registration number, validity, complete address with telephone numbers and associated SEBI Office details (i.e. Head office/ regional/ local Office) on its website.</li>
                            <li>To employ only qualified and certified employees.</li>
                            <li>To deal with clients only from official number.</li>
                            <li>To maintain records of interactions, with all clients including prospective clients (prior to onboarding), where any conversation related to advice has taken place.</li>
                            <li>To ensure that all advertisements are in adherence to the provisions of the Advertisement Code for Investment Advisers.</li>
                            <li>Not to discriminate in terms of services provided, among clients opting for same/similar products/services offered by investment adviser.</li>
                        </ul>

                        {/* C. Services provided */}
                        <h2 className="font-bold text-xl mt-8">C. Details of services provided to investors (No Indicative Timelines)</h2>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Onboarding of Clients
                                <ul className="list-disc ml-6 mt-2">
                                    <li>Sharing of agreement copy</li>
                                    <li>Completing KYC of clients</li>
                                </ul>
                            </li>
                            <li>Disclosure to Clients:
                                <ul className="list-disc ml-6 mt-2">
                                    <li>To provide full disclosure about its business, affiliations, compensation in the agreement.</li>
                                    <li>To not access client’s accounts or holdings for offering advice.</li>
                                    <li>To disclose the risk profile to the client.</li>
                                    <li>To disclose any conflict of interest of the investment advisory activities with any other activities of the investment adviser.</li>
                                    <li>To disclose the extent of use of Artificial Intelligence tools in providing investment advisory services.</li>
                                </ul>
                            </li>
                            <li>To provide investment advice to the client based on the risk-profiling of the clients and suitability of the client.</li>
                            <li>To treat all advisory clients with honesty and integrity.</li>
                            <li>To make adequate disclosure to the investor of all material facts such as risks, obligations, costs, etc. relating to the products or securities advised by the adviser.</li>
                            <li>To provide clear guidance and adequate caution notice to clients when providing investment advice for dealing in complex and high-risk financial products/services.</li>
                            <li>To ensure confidentiality of information shared by clients unless such information is required to be provided in furtherance of discharging legal obligations or a client has provided specific consent to share such information.</li>
                            <li>To disclose the timelines for the various services provided by the investment adviser to clients and ensure adherence to the said timelines.</li>
                        </ul>


                        {/* D. Grievance Redressal */}
                        <h2 className="font-bold text-xl mt-8">
                            D. Details of grievance redressal mechanism and how to access it
                        </h2>

                        <ol className="list-decimal ml-6 mt-2 space-y-4">
                            {/* Point 1 */}
                            <li>
                                Investor can lodge complaint/grievance against Investment Adviser in the following ways:
                                <div className="ml-6 mt-2 space-y-4">
                                    <div>
                                        <p className="font-semibold underline">Mode of filing the complaint with investment adviser</p>
                                        <p>
                                            In case of any grievance / complaint, an investor may approach the concerned
                                            Investment Adviser who shall strive to redress the grievance immediately, but
                                            not later than 21 days of the receipt of the grievance.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-semibold underline">
                                        Mode of filing the complaint with investment adviser
                                        </p>

                                        <p>
                                        In case of any grievance / complaint, an investor may approach the concerned Investment Adviser who shall strive to redress the grievance immediately, but not later than 21 days of the receipt of the grievance
                                        </p>

                                        <p className="font-semibold underline">
                                        Mode of filing the complaint on SCORES or with Investment Adviser Administration and Supervisory Body (IAASB)
                                        </p>

                                        {/* Roman numerals */}
                                        <ol className="list-[lower-roman] ml-6 space-y-2">
                                            <li>
                                                SCORES 2.0 (a web based centralized grievance redressal system of SEBI
                                                for facilitating effective grievance redressal in time-bound manner){" "}
                                                <a
                                                    href="https://scores.sebi.gov.in"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline hover:text-blue-800"
                                                >
                                                    https://scores.sebi.gov.in
                                                </a>
                                                <div className="ml-0 mt-2">
                                                    <p>Two level review for complaint/grievance against investment adviser:</p>
                                                    <ul className="list-disc ml-6 mt-1">
                                                        <li>First review done by designated body (IAASB)</li>
                                                        <li>Second review done by SEBI</li>
                                                    </ul>
                                                </div>
                                            </li>
                                            <li>Email to designated email ID of IAASB</li>
                                        </ol>
                                    </div>
                                </div>
                            </li>

                            {/* Point 2 */}
                            <li>
                                If the Investor is not satisfied with the resolution provided by the Market Participants,
                                then the Investor has the option to file the complaint/grievance on SMARTODR platform
                                for its resolution through online conciliation or arbitration.
                            </li>

                            {/* Point 3 */}
                            <li>
                                With regard to physical complaints, investors may send their complaints to:
                                <p className="font-semibold mt-2">
                                    Office of Investor Assistance and Education,<br />
                                    Securities and Exchange Board of India,<br />
                                    SEBI Bhavan, Plot No. C4-A, ‘G’ Block,<br />
                                    Bandra-Kurla Complex, Bandra (E), Mumbai - 400 051
                                </p>
                            </li>
                        </ol>


                        {/* E. Rights of investors */}
                        <h2 className="font-bold text-xl mt-8">E. Rights of investors</h2>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li>Right to Privacy and Confidentiality</li>
                            <li>Right to Transparent Practices</li>
                            <li>Right to fair and Equitable Treatment</li>
                            <li>Right to Adequate Information</li>
                            <li>Right to Initial and Continuing Disclosure - Right to receive information about all the statutory and regulatory disclosures.</li>
                            <li>Right to Fair & True Advertisement</li>
                            <li>Right to Awareness about Service Parameters and Turnaround Times</li>
                            <li>Right to be informed of the timelines for each service</li>
                            <li>Right to be Heard and Satisfactory Grievance Redressal</li>
                            <li>Right to have timely redressal</li>
                            <li>Right to Suitability of the Financial Products</li>
                            <li>Right to Exit from Financial product or service in accordance with the terms of agreement with the investment adviser</li>
                            <li>Right to receive clear guidance and caution notice when dealing in Complex and High-Risk Financial Products and Services</li>
                            <li>Additional Rights to vulnerable consumers - Right to get access to services in a suitable manner even if differently abled</li>
                            <li>Right to provide feedback on the financial products and services used</li>
                            <li>Right against coercive, unfair, and one-sided clauses in financial agreements</li>
                        </ul>

                        {/* F. Expectations from investors */}
                        <h2 className="font-bold text-xl mt-8">F. Expectations from the investors (Responsibilities of investors)</h2>

                        {/* Do’s */}
                        <p className="mt-4 font-semibold">Do’s</p>
                        <ul className="list-[upper-roman] ml-6 mt-2 space-y-2">
                            <li className="pl-3 text-justify">Always deal with SEBI registered Investment Advisers.</li>
                            <li className="pl-3 text-justify">Ensure that the Investment Adviser has a valid registration certificate.</li>
                            <li className="pl-3 text-justify">
                                Check for SEBI registration number. <br /> Please refer to the list of all SEBI registered Investment Advisers which is available on SEBI website in the following link: <br />{' '}
                                <a
                                    href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 underline"
                                >
                                    SEBI Registered Investment Advisers
                                </a>
                            </li>
                            <li className="pl-3 text-justify">
                            Pay only advisory fees to your Investment Adviser. Make payments of advisory fees through banking channels only and maintain duly signed receipts mentioning the details of your payments. You may make payment of advisory fees through Centralised Fee Collection Mechanism (CeFCoM) of IAASB if investment adviser has opted for the mechanism.
                            </li>
                            <li className="pl-3 text-justify">Always ask for your risk profiling before accepting investment advice. Insist that Investment Adviser provides advisory strictly on the basis of your risk profiling and take into account available investment alternatives.</li>
                            <li className="pl-3 text-justify">Ask all relevant questions and clear your doubts with your Investment Adviser before acting on advice.</li>
                            <li className="pl-3 text-justify">Assess the risk–return profile of the investment as well as the liquidity and safety aspects before making investments.</li>
                            <li className="pl-3 text-justify">Insist on getting the terms and conditions in writing duly signed and stamped. Read these terms and conditions carefully particularly regarding advisory fees, advisory plans, category of recommendations etc. before dealing with any Investment Adviser.</li>
                            <li className="pl-3 text-justify">Be vigilant in your transactions.</li>
                            <li className="pl-3 text-justify">Approach the appropriate authorities for redressal of your doubts / grievances.</li>
                            <li className="pl-3 text-justify">Inform SEBI about Investment Advisers offering assured or guaranteed returns.</li>
                            <li className="pl-3 text-justify">Always be aware that you have the right to exit the service of an Investment Adviser.</li>
                            <li className="pl-3 text-justify">Always be aware that you have the right to seek clarifications and clear guidance on advice.</li>
                            <li className="pl-3 text-justify">Always be aware that you have the right to provide feedback to the Investment Adviser in respect of services received.</li>
                            <li className="pl-3 text-justify">Always be aware that you will not be bound by any clause, prescribed by the investment adviser, which is contravening any regulatory provisions.</li>
                        </ul>

                        {/* Don’ts */}
                        <p className="mt-4 font-semibold">Don’ts</p>
                        <ul className="list-[upper-roman] ml-6 mt-2 space-y-2">
                            <li className="pl-3 text-justify">Don’t fall for stock tips offered under the pretext of investment advice.</li>
                            <li className="pl-3 text-justify">Do not provide funds for investment to the Investment Adviser.</li>
                            <li className="pl-3 text-justify">Don’t fall for the promise of indicative or exorbitant or assured returns by the Investment Advisers. Don’t let greed overcome rational investment decisions.</li>
                            <li className="pl-3 text-justify">Don’t fall prey to luring advertisements or market rumors.</li>
                            <li className="pl-3 text-justify">Avoid doing transactions only on the basis of phone calls or messages from any Investment adviser or its representatives.</li>
                            <li className="pl-3 text-justify">Don’t take decisions just because of repeated messages and calls by Investment Advisers.</li>
                            <li className="pl-3 text-justify">Do not fall prey to limited period discount or other incentive, gifts, etc. offered by Investment advisers.</li>
                            <li className="pl-3 text-justify">Don’t rush into making investments that do not match your risk-taking appetite and investment goals.</li>
                            <li className="pl-3 text-justify">Do not share login credential and password of your trading, demat or bank accounts with the Investment Adviser.</li>
                        </ul>

                    </div>
                </section>
            </main>
          
        </>
    );
}
