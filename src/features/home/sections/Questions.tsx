import { siteConfig } from "@/config/site";

/** The home page's questions: each answer starts with the answer, under 50 words, open on load. */
export const HOME_QUESTIONS = [
  {
    q: "How much do I need to start a SIP?",
    a: "₹1,000 a month, or ₹100 a day for a daily SIP. There is no account minimum.",
  },
  {
    q: "Where does my SIP money go?",
    a: "Straight to the fund house, never to Fydaa. The units are held in your name, and you can check every holding on MF Central.",
  },
  {
    q: "Can I take money out of a fund at any time?",
    a: "Yes. Only tax-saving ELSS funds lock in, for 3 years. Withdrawals from equity funds usually reach your bank in 1 to 3 business days.",
  },
  {
    q: "Which funds does Fydaa use?",
    a: "Direct plans of SEBI-regulated mutual funds in equity, debt, hybrid and gold, from fund houses such as PPFAS, HDFC, SBI, Tata and Nippon India. Your goal, risk profile and timeline decide which.",
  },
  {
    q: "Can I start investing on the website?",
    a: "Yes. Sign up, finish KYC, set goals and start SIPs on the web. The app does the same on your phone.",
  },
  {
    q: "What is the Fydaa Wealth Score?",
    a: "A score from 0 to 100 for your finances, built from net worth, asset quality, liquidity, debt and goal readiness. The app says what would raise it.",
  },
] as const;

/** Questions (tasteskill faq): the page's split, the heading left, every answer open on the right. */
export function Questions() {
  return (
    <section id="questions" className="section" aria-labelledby="questions-title">
      <div className="wrap split grid">
        <div className="span-5 split__text">
          <h2 id="questions-title">Questions</h2>
          <p className="t-lead">For anything else, call or write to the Fydaa team.</p>
          <a href={siteConfig.contact.phoneHref} className="link questions__call">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path
                d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            Call {siteConfig.contact.phone}
          </a>
        </div>
        <div className="span-6 faq start-7">
          {HOME_QUESTIONS.map((item) => (
            <div key={item.q} className="faq__item">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
