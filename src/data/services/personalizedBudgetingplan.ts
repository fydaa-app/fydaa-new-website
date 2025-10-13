import { ServiceData } from './types';

export const personalizedBudgetingData: ServiceData = {
  id: 'personalized-budgeting-plan',
  slug: 'PersonalizedBudgetingplan',
  
  heroSection: {
    title: 'A Budget That ',
    subtitle: 'Understands You',
    description: 'Your life, your dreams, your expenses, no two people spend or save the same way. Fydaa creates a personalized budgeting plan just for you, so you can achieve your goals without giving up what you love.',
    iconPath: '/resource/PersonalizedBudgetingplan/icon.png',
    ctaText: 'Book a Free Call',
    ctaLink: 'https://cal.com/fydaa-backend-zr5zm3/30min',
  },
  
  videoSection: {
    heading: 'Budgeting Made for Real Life',
    description: 'Forget the one-size-fits-all approach. Fydaa\'s personalized budgeting uses your income, expenses, and goals to create a plan that\'s realistic, flexible, and actually works in the long run.',
    videoUrl: 'https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/3.+Personalized+Budgeting+plan.mp4',
  },
  
  featureSection: {
    mainHeading: 'How Fydaa Creates Your',
    mainHeadingRegular: 'Perfect Budget',
    steps: [
      {
        number: 1,
        title: 'Understand Your Lifestyle',
        description: 'Income, expenses, habits, and goals.',
      },
      {
        number: 2,
        title: 'Set Realistic Targets',
        description: 'Savings, investments, and spending.',
      },
      {
        number: 3,
        title: 'Allocate Smartly',
        description: 'Essentials, wants, and future funds.',
      },
      {
        number: 4,
        title: 'Automate Savings',
        description: 'Never Miss An EMI And Protect Your Credit Score.',
      },
      {
        number: 5,
        title: 'Monitor & Improve',
        description: 'Adjust as your life and goals change.',
      },
    ],
    bottomSection: {
      heading: 'A budget isn\'t about limits, it\'s about freedom',
      benefits: [
        {
          title: 'Stay on Track',
          description: 'Clear direction for your money',
          iconPath: '/resource/PersonalizedBudgetingplan/track.png',
        },
        {
          title: 'Achieve Goals Faster',
          description: 'From vacations to a new home, get there sooner',
          iconPath: '/resource/PersonalizedBudgetingplan/goals.png',
        },
        {
          title: 'Avoid Debt Traps',
          description: 'Spend within your means',
          iconPath: '/resource/PersonalizedBudgetingplan/moneyproblem.png',
        },
        {
          title: 'Feel in Control',
          description: 'Know where every rupee is going',
          iconPath: '/resource/PersonalizedBudgetingplan/control.png',
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
