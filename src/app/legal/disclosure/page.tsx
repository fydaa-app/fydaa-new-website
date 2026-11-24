import React from "react"

export default function Disclosure() {
    return (
        <>
        
            <main className="w-full flex flex-col items-center p-16">
                <section className="terms-content">
                    <div className="container">
                        <h2 className="text-center text-3xl font-bold mb-12 mt-8">Disclosure to Clients</h2>

                        <p className="text-center text-brandblack-700 leading-relaxed mb-8">
                            Multistrato Capital Advisers Private Limited <br />
                            SEBI Registered Investment Adviser <br />
                            Registration No.: INA000015969
                        </p>

                        <p className="text-brandblack-700 leading-relaxed mb-8">
                            As per Regulation 18 of SEBI (Investment Advisers) Regulations, 2013,
                            we hereby make the following disclosures to all prospective and existing clients:
                        </p>

                        {/* 1. Corporate Information */}
                        <h2 className="font-bold text-xl mt-8">1. Corporate Information</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4">
                        Multistrato Capital Advisers Private Limited is registered with the Securities and Exchange Board of India (SEBI) as an Investment Adviser under Registration No. INA000015969.
                        </p>

                        {/* 2. Business & Terms of Services */}
                        <h2 className="font-bold text-xl mt-8">2. Business & Terms of Services</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4">
                        Our investment advisory services are provided in accordance with the terms and conditions mentioned in the client agreement executed with us prior to commencement of services
                        </p>

                        {/* 3. Disciplinary History */}
                        <h2 className="font-bold text-xl mt-8">3. Disciplinary History</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4">
                        As on date, there has been no disciplinary action taken by SEBI or any other regulatory authority against Multistrato Capital Advisers Private Limited, its directors, or key management personnel.
                        </p>

                        {/* 4. Affiliations */}
                        <h2 className="font-bold text-xl mt-8">4. Affiliations with Other Intermediaries</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4">
                        We have no affiliations or arrangements with any other SEBI registered intermediary or issuer of products/securities that may compromise the objectivity of our advice.
                        </p>

                        {/* 5. Disclosure of Holdings */}
                        <h2 className="font-bold text-xl mt-8">5. Disclosure of Holdings/Positions</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4">
                        We and our representatives may have holding or positions in securities/financial products that are the subject matter of advice. In such cases, the same shall be disclosed to the client at the time of advice.
                        </p>

                        {/* 6. Conflicts of Interest */}
                        <h2 className="font-bold text-xl mt-8">6. Conflicts of Interest</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4">
                        We disclose that there are no actual or potential conflicts of interest arising from any connection or association with any issuer of products/securities which may compromise our independence in providing investment  services. Any such potential conflict, if it arises, shall be promptly disclosed to the client.
                        </p>

                        {/* 7. Material Facts */}
                        <h2 className="font-bold text-xl mt-8">7. Material Facts & Product Features</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4">
                        While providing investment advice, adequate disclosure will be made regarding all material facts of the products or securities, including their key features, performance track record, risks, disclaimers, and other relevant information
                        </p>

                        {/* 8. Risk Disclosure */}
                        <h2 className="font-bold text-xl mt-8">8. Risk Disclosure & Disclaimers</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4">
                        Clients are cautioned to carefully read the warnings, risk disclosures, and disclaimers mentioned in our research reports, communications, and related documents before acting on any advice.
                        </p>

                        {/* 9. Outside SEBI */}
                        <h2 className="font-bold text-xl mt-8">9.  Outside SEBI Purview</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4">
                        If any product or service offered is outside the regulatory purview of SEBI, we will clearly inform clients that no recourse will be available from SEBI for grievances relating to such products or services.
                        </p>

                        {/* 10. AI Use */}
                        <h2 className="font-bold text-xl mt-8">10. Use of Artificial Intelligence</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4">
                        To the extent applicable, the extent of use of Artificial Intelligence tools (if any) in providing investment advice shall be disclosed to clients at the time of rendering such advice.
                        </p>

                        {/* 11. Standard Warning */}
                        <h2 className="font-bold text-xl mt-8">11. Standard Warning</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4 italic">
                        “Investment in securities market are subject to market risks. Read all the related documents carefully before investing.”
                        </p>

                        {/* 12. Disclaimer */}
                        <h2 className="font-bold text-xl mt-8">12. Disclaimer</h2>
                        <p className="text-brandblack-700 leading-relaxed mt-4 italic">
                        “Registration granted by SEBI, and certification from NISM in no way guarantee performance of the Research Analyst or provide any assurance of returns to investors.
                        </p>
                    </div>
                </section>
            </main>
           
        </>
    );
}
