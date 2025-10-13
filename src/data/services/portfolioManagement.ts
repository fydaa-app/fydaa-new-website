import { ServiceData } from "./types";

export const portfolioManagementData: ServiceData = {
  id: "portfolio-management",
  slug: "PortfolioManagement",

  heroSection: {
    title: "Your Money, ",
    subtitle: "Managed Professionally",
    description:
      "From tracking to growing, we handle it all. We monitor your investments, rebalance your portfolio, and suggest changes based on market trends and your evolving needs. All you need to do is watch your wealth grow.",
    iconPath: "/resource/PortfolioManagement/icon.png",
    ctaText: "Book a Free Call",
    ctaLink: "https://cal.com/fydaa-backend-zr5zm3/30min",
  },

  videoSection: {
    heading: "From Tracking to Growing, We Handle It All",
    description:
      "We monitor your investments, rebalance your portfolio, and suggest changes based on market trends and your evolving needs. All you need to do is watch your wealth grow.",
    videoUrl:
      "https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/6.+Portfolio+Management.mp4",
  },

  featureSection: {
    mainHeading: "Your Roadmap to a",
    mainHeadingRegular: "Stronger, Safer Portfolio",
    steps: [
      {
        number: 1,
        title: "Review Current Investments",
        description: "Understand your portfolio's strengths and weaknesses.",
      },
      {
        number: 2,
        title: "Diversify Smartly",
        description: "Spread risk across multiple asset classes",
      },
      {
        number: 3,
        title: "Rebalance Regularly",
        description: "Adjust your portfolio to market conditions.",
      },
      {
        number: 4,
        title: "Track Performance",
        description: "Monitor results and make data-backed changes.",
      },
      {
        number: 5,
        title: "Stay Informed",
        description: "Get regular updates and insights from our experts.",
      },
    ],
    bottomSection: {
      heading: "Because your investments deserve expert care",
      benefits: [
        {
          title: "Maximise Returns",
          description: "Make the most of your capital",
          iconPath: "/resource/PortfolioManagement/returns.png",
        },
        {
          title: "Reduce Risk",
          description: "Avoid overexposure to a single asset",
          iconPath: "/resource/PortfolioManagement/risk.png",
        },
        {
          title: "Save Time",
          description: "Let professionals handle the tracking and adjustments",
          iconPath: "/resource/PortfolioManagement/time.png",
        },
        {
          title: "Stay Aligned",
          description: "Keep your portfolio in sync with your changing goals",
          iconPath: "/resource/PortfolioManagement/love.png",
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
