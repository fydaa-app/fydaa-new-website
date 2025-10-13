import { ServiceData } from "./types";

export const investmentPlanningData: ServiceData = {
  id: "investment-planning",
  slug: "InvestmentPlanning",

  heroSection: {
    title: "Grow Your Money, ",
    subtitle: "Secure Your Future",
    description:
      "Whether you're saving for your dream home, your child's education, or early retirement, Fydaa's investment planning makes sure your money works as hard as you do.",
    iconPath: "/resource/InvestmentPlanning/icon.png",
    ctaText: "Book a Free Call",
    ctaLink: "https://cal.com/fydaa-backend-zr5zm3/30min",
  },

  videoSection: {
    heading: "Invest Smart, Live Free",
    description:
      "Investment planning isn't just about picking random schemes—it's about matching the right products to your goals, risk level, and time frame. Fydaa's experts and tools help you choose wisely so you can grow your wealth with confidence.",
    videoUrl:
      "https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/5.+Investment+Planning.mp4",
  },

  featureSection: {
    mainHeading: "Smart Steps to Turn",
    mainHeadingRegular: "Your Money into Wealth",
    steps: [
      {
        number: 1,
        title: "Define Your Goals",
        description: "Short, medium, and long-term.",
      },
      {
        number: 2,
        title: "Assess Risk Appetite",
        description: "Understand how much risk you can handle.",
      },
      {
        number: 3,
        title: "Choose the Right Mix",
        description: "Equity, debt, mutual funds, gold, or real estate.",
      },
      {
        number: 4,
        title: "Start Investing",
        description: "Begin with the right amount and increase gradually.",
      },
      {
        number: 5,
        title: "Review Regularly",
        description:
          "Make adjustments as your goals or market conditions change.",
      },
    ],
    bottomSection: {
      heading: "Your dreams deserve a plan, not just hope",
      benefits: [
        {
          title: "Wealth Creation",
          description: "Build assets over time",
          iconPath: "/resource/InvestmentPlanning/wealth.png",
        },
        {
          title: "Goal Achievement",
          description: "Fund big milestones without stress",
          iconPath: "/resource/InvestmentPlanning/goals.png",
        },
        {
          title: "Financial Security",
          description: "Beat inflation and maintain purchasing power",
          iconPath: "/resource/InvestmentPlanning/security.png",
        },
        {
          title: "Freedom of Choice",
          description: "Live life on your terms",
          iconPath: "/resource/InvestmentPlanning/freedom.png",
        },
      ],
    },
  },

  testimonials: [
    {
      id: 1,
      name: "Abhishek Mishra",
      profileImage: null,
      reviewText:
        "I've been using the Fydaa app since 2022, and it makes investing effortless. I can easily invest across gold, real estate, and equity—all in one place. I'd definitely recommend Fydaa for anyone looking to build a disciplined investment journey.",
      rating: 5,
    },
    {
      id: 2,
      name: "Dikshita Jain",
      profileImage: null,
      reviewText:
        "Fydaa has transformed the way I manage my investments. The interface is intuitive and the multi-asset approach helps me diversify my portfolio seamlessly.",
      rating: 5,
    },
    {
      id: 3,
      name: "Rinku Das",
      profileImage: null,
      reviewText:
        "As a busy professional, I appreciate how Fydaa makes investing simple and accessible. The automated features save me time while building wealth systematically.",
      rating: 5,
    },
    {
      id: 4,
      name: "Sami Garde",
      profileImage: null,
      reviewText:
        "The best investment platform I've used. Fydaa's approach to disciplined investing across multiple asset classes has helped me achieve my financial goals faster.",
      rating: 5,
    },
  ],

  faqs: [
    {
      id: 1,
      question: "Is fydaa registered with any financial regulators in India?",
      answer:
        "Yes, fydaa is the Investment Advisory unit of Multistrato Capital Advisors Private Limited – a SEBI Registered Investment Adviser. Click here to verify.",
    },
    {
      id: 2,
      question:
        "How fydaa is different from a broker or mutual fund distributor?",
      answer:
        "Unlike your broker, fydaa do not execute the trades but advice on which securities to buy/sell on periodic basis based on your risk profile. Your broker charges brokerage on every transaction. Mutual fund distributors on the other hand help invest by selling schemes of Asset Management companies for a distributor fee.",
    },
    {
      id: 3,
      question: "How fydaa makes money?",
      answer:
        "Fydaa have no conflict of interest when it advises you. The only income fydaa makes is direct fee charged to you as a client. There are no other revenue or commission from brokers or mutual fund houses.",
    },
    {
      id: 4,
      question: "What is the advisory fee of fydaa?",
      answer:
        "Fydaa charges a nominal fee of 0.4% per year of Asset under management. That mean for every 10000 rupees worth of investment, you are charged just INR 40 as advisory fee. This is fraction of what other advisor charges. (Traditional mutual funds and advisor's charges in excess of 1.5 - 2 %)",
    },
  ],

  financialSafety: {
    topSlogan: "Your money is 100% Safe and Secure..!",
    mainHeading1: "Built for Bharat.",
    mainHeading2: "Backed by Transparency.",
    features: [
      {
        line1: "SEBI-Registered,",
        line2: "Zero Commission",
      },
      {
        line1: "Money stays in your",
        line2: "name, with top AMCs",
      },
      {
        line1: "Data encrypted,",
        line2: "2FA enabled",
      },
    ],
  },
};
