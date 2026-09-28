import { useState } from "react";
import { User, Activity, Building, Shield, Info, ChevronRight, LogOut } from "lucide-react";

const sections = [
  { id: "personal", label: "Personal Details", icon: User },
  { id: "risk",     label: "Risk Assessment",  icon: Activity },
  { id: "bank",     label: "Bank & Auto-pay",  icon: Building },
  { id: "plan",     label: "Your Plan",        icon: Shield },
  { id: "about",    label: "About Fydaa",      icon: Info },
];

const sectionContent = {
  personal: {
    title: "Personal Details",
    groups: [
      { label: "Basic Information", rows: [
        ["Full Name", "Rahul Kapoor"],
        ["Email", "rahul.kapoor@email.com"],
        ["Phone", "+91 98765 43210"],
        ["Date of Birth", "15 Mar 1992"],
      ]},
      { label: "KYC", rows: [
        ["PAN", "ABCPK1234E"],
        ["KYC Status", { value: "Verified", green: true }],
        ["Aadhaar Linked", { value: "Yes", green: true }],
      ]},
      { label: "Address", rows: [
        ["Address", "42, Lakeview Apartments\nPowai, Mumbai 400076"],
      ]},
    ],
  },
  risk: {
    title: "Risk Assessment",
    groups: [
      { label: "Your Risk Profile", rows: [
        ["Risk Tolerance", "Moderate"],
        ["Investment Horizon", "7–10 years"],
        ["Annual Income", "₹12–18 LPA"],
        ["Assessed On", "12 Jun 2026"],
      ]},
      { label: "Recommended Allocation", rows: [
        ["Equity", "60%"],
        ["Debt", "25%"],
        ["Gold", "15%"],
      ]},
    ],
  },
  bank: {
    title: "Bank & Auto-pay",
    groups: [
      { label: "Linked Bank Account", rows: [
        ["Bank", "State Bank of India"],
        ["Account", "xxxxxxx 4867"],
        ["Branch", "Bhopa Road"],
        ["Status", { value: "Verified", green: true }],
      ]},
      { label: "Auto-pay", rows: [
        ["Method", "UPI AutoPay"],
        ["Limit per order", "₹1,000"],
        ["Status", { value: "Active", green: true }],
      ]},
    ],
  },
  plan: {
    title: "Your Plan",
    groups: [
      { label: "What's included", rows: [
        ["Emergency Fund Setup", { value: "Included", green: true }],
        ["Disciplined SIP Strategy", { value: "Included", green: true }],
        ["Financial Health Checkup", { value: "Included", green: true }],
        ["Educational Content", { value: "Included", green: true }],
      ]},
    ],
    planCard: { name: "Comprehensive Financial Plan", price: "₹999/year · Investment Planning" },
  },
  about: {
    title: "About Fydaa",
    description: "Fydaa is an automated personalised money management platform. We use low-cost, efficient investment vehicles — mainly ETFs and index funds — to help you grow wealth steadily. As a SEBI-registered entity (INA000015969), we adhere to strict guidelines to safeguard your interests.",
    groups: [
      { label: "Details", rows: [
        ["Entity", "Multistrato Capital Advisors Pvt. Ltd."],
        ["SEBI Registration", "INA000015969"],
        ["ARN", "358522"],
        ["Version", "2.4.1"],
      ]},
    ],
  },
};

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("personal");
  const content = sectionContent[activeSection];

  return (
    <div className="px-10 py-8 max-w-[1200px]">
      <h2 className="text-lg font-semibold text-ink mb-5">Profile</h2>

      <div className="grid grid-cols-[280px_1fr] gap-5">
        {/* Menu */}
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
          <div className="px-6 py-6 text-center border-b border-border">
            <div className="w-[72px] h-[72px] rounded-full bg-jade text-white text-2xl font-bold flex items-center justify-center mx-auto mb-3">
              RK
            </div>
            <div className="text-lg font-bold text-ink">Rahul Kapoor</div>
            <div className="text-xs text-muted mt-0.5">rahul.kapoor@email.com</div>
          </div>
          <div className="py-1.5">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-3 w-full px-5 py-2.5 text-sm font-medium transition-all text-left ${
                  activeSection === id
                    ? "bg-tint text-jade"
                    : "text-secondary hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                {label}
                <ChevronRight size={14} className="ml-auto opacity-30" />
              </button>
            ))}
          </div>
          <div className="px-3 pb-3">
            <button className="w-full py-3 rounded-btn border border-red-100 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white border border-border rounded-card shadow-card">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-[17px] font-bold text-ink">{content.title}</h3>
          </div>
          <div className="px-6 py-5">
            {content.description && (
              <p className="text-sm text-secondary leading-relaxed mb-5">
                {content.description}
              </p>
            )}

            {content.planCard && (
              <div className="bg-jade rounded-btn p-4 text-white mb-3">
                <div className="text-[15px] font-bold">{content.planCard.name}</div>
                <div className="text-xs opacity-70 mt-0.5">{content.planCard.price}</div>
              </div>
            )}

            {content.groups.map((group, gi) => (
              <div key={gi}>
                <div className={`text-[10px] font-bold text-muted uppercase tracking-wider ${gi === 0 ? "" : "mt-5"} mb-2`}>
                  {group.label}
                </div>
                {group.rows.map(([label, val], ri) => {
                  const isObj = typeof val === "object";
                  const display = isObj ? val.value : val;
                  const isGreen = isObj && val.green;
                  return (
                    <div
                      key={ri}
                      className="flex justify-between items-center py-3 border-b border-bg last:border-b-0"
                    >
                      <span className="text-[13px] text-muted font-medium">{label}</span>
                      <span
                        className={`text-[13px] font-semibold text-right whitespace-pre-line ${
                          isGreen ? "text-emerald" : "text-ink"
                        }`}
                      >
                        {display}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
