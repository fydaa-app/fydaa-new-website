import { ServiceData } from "./types";

export const financialHealthCheckupData: ServiceData = {
  id: "financial-health-checkup",
  slug: "FinancialHealthCheckup",

  heroSection: {
    title: "Your Financial Health Matters.",
    subtitle: " Let's Check It",
    description:
      "Just like a regular health check keeps your body fit, a financial health check keeps your money in shape. Fydaa helps you understand where you stand financially and guides you towards a stronger, stress-free future.",
    iconPath: "/resource/FinancialHealthCheckup/icon.png",
    ctaText: "Book a Free Call",
    ctaLink: "https://www.cal.eu/fydaa/30min?overlayCalendar=true",
  },

  videoSection: {
    heading: "Know Your Financial Score Before You Plan Your Future",
    description:
      "Our financial health check looks at your income, savings, expenses, debts, and investments — giving you a clear picture of your financial strengths and gaps. With this, you can take action today for a more secure tomorrow.",
    videoUrl:
      "https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/4.+Financial+Health+Checkup.mp4",
  },

  featureSection: {
    mainHeading: "Your Step-by-Step Path to",
    mainHeadingRegular: "Better Financial Health",
    steps: [
      {
        number: 1,
        title: "Assess Your Current Finances",
        description: "Income, expenses, debts, and savings.",
      },
      {
        number: 2,
        title: "Identify Gaps",
        description:
          "Spot areas where you may be overspending or under-saving.",
      },
      {
        number: 3,
        title: "Evaluate Investments",
        description: "See if your money is growing at the right pace.",
      },
      {
        number: 4,
        title: "Check Your Credit Health",
        description: "Ensure your credit score supports your goals.",
      },
      {
        number: 5,
        title: "Review & Adjust",
        description: "Get a clear, personalised roadmap to improve.",
      },
    ],
    bottomSection: {
      heading: "Clarity is the first step to confidence",
      benefits: [
        {
          title: "Spot Weak Areas Early",
          description: "Fix problems before they grow",
          iconPath: "/resource/FinancialHealthCheckup/moneyproblem.png",
        },
        {
          title: "Better Decision-Making",
          description: "Spend, save, and invest with confidence",
          iconPath: "/resource/FinancialHealthCheckup/decision.png",
        },
        {
          title: "Peace of Mind",
          description: "Know exactly where your money stands",
          iconPath: "/resource/FinancialHealthCheckup/peace.png",
        },
        {
          title: "Stronger Future",
          description: "Lay a solid foundation for all your financial goals",
          iconPath: "/resource/FinancialHealthCheckup/goals.png",
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
      question: "What is a financial health checkup?",
      answer:
        "A financial health checkup is a holistic review of your income, expenses, assets, liabilities, insurance, and investments.",
    },
    {
      id: 2,
      question:
        "Who should get a financial health checkup?",
      answer:
        "Anyone earning and managing money, whether you are starting out or already investing, can benefit from a financial health checkup.",
    },
    {
      id: 3,
      question: "How often should I do a financial health checkup?",
      answer:
        "Ideally once a year or after major life events like marriage, job change, or having children.",
    },
    {
      id: 4,
      question: "What do I get after a financial health checkup?",
      answer:
        "You receive insights, gaps, and actionable recommendations to improve your overall financial well-being.",
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
