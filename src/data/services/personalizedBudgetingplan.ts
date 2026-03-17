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
    ctaLink: 'https://www.cal.eu/fydaa/30min?overlayCalendar=true',
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
      question: "What is a personalised budgeting plan?",
      answer:
        "A personalised budgeting plan aligns your income, expenses, and savings with your financial goals instead of generic budgeting rules.",
    },
    {
      id: 2,
      question:
        "Does Fydaa consider lifestyle expenses while budgeting?",
      answer:
        "Yes. Fydaa designs budgets that are realistic and sustainable, not restrictive.",
    },
    {
      id: 3,
      question: "Will my budget change over time?",
      answer:
        "Yes. Budgets evolve with life changes, and Fydaa updates them as your income or priorities change.",
    },
    {
      id: 4,
      question: "Can budgeting help with long-term investments?",
      answer:
        "Absolutely. A strong budgeting plan creates surplus cash flow for investments and wealth creation.",
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
