import { ServiceData } from './types';

export const expenseManagementData: ServiceData = {
  id: 'expense-management',
  slug: 'ExpenseManagement',
  
  heroSection: {
    title: 'Track, Control, and Master',
    subtitle: 'Your Spending',
    description: 'From monthly groceries to weekend splurges, small expenses can add up quickly. Fydaa helps you stay in control of your money—so you spend smart, save more, and still enjoy life\'s little pleasures.',
    iconPath: '/resource/ExpenseManagement/icon.png',
    ctaText: 'Book a Free Call',
    ctaLink: 'https://www.cal.eu/fydaa/30min?overlayCalendar=true',
  },
  
  videoSection: {
    heading: 'Your Money, Your Rules',
    description: 'Expense management isn\'t about restricting yourself—it\'s about making your money work for what truly matters. Fydaa\'s smart tools help you track every rupee, identify wasteful spends, and set budgets you can actually stick to.',
    videoUrl: 'https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/2.+Expense+Management.mp4',
  },
  
  featureSection: {
    mainHeading: 'How We Help You Master',
    mainHeadingRegular: "Your Monthly Budget",
    steps: [
      {
        number: 1,
        title: 'Track Your Spending',
        description: 'See where your money goes in real time.',
      },
      {
        number: 2,
        title: 'Categorise Expenses',
        description: 'Essentials vs. luxuries made clear.',
      },
      {
        number: 3,
        title: 'Set Spend Limits',
        description: 'Stay within budget without feeling restricted.',
      },
      {
        number: 4,
        title: 'Get Alerts',
        description: 'Friendly nudges when you\'re close to overspending.',
      },
      {
        number: 5,
        title: 'Review & Adjust',
        description: 'Tweak your plan based on your lifestyle changes.',
      },
    ],
    bottomSection: {
      heading: 'Every rupee saved is a step towards your bigger goals',
      benefits: [
        {
          title: 'Avoid End-of-Month Stress',
          description: 'No more scrambling for cash.',
          iconPath: '/resource/ExpenseManagement/stress.png',
        },
        {
          title: 'More Savings',
          description: 'Extra funds for investments or emergencies.',
          iconPath: '/resource/ExpenseManagement/moresaving.png',
        },
        {
          title: 'Better Spending Habits',
          description: 'Mindful Choices Lead to Long-Term Wealth.',
          iconPath: '/resource/ExpenseManagement/spending.png',
        },
        {
          title: 'Financial Confidence',
          description: 'Know exactly where you stand, always',
          iconPath: '/resource/ExpenseManagement/financialconfi.png',
        },
      ],
    },
  },
  
 testimonials: [
    {
      id: 1,
      name: 'Abhishek Mishra',
      profileImage: null,
      reviewText: 'I\'ve been using the Fydaa app since 2022, and it makes investing effortless. I can easily invest across gold, real estate, and equity—all in one place. I\'d definitely recommend Fydaa for anyone looking to build a disciplined investment journey.',
      rating: 5
    },
    {
      id: 2,
      name: 'Dikshita Jain',
      profileImage: null,
      reviewText: 'Fydaa has transformed the way I manage my investments. The interface is intuitive and the multi-asset approach helps me diversify my portfolio seamlessly.',
      rating: 5
    },
    {
      id: 3,
      name: 'Rinku Das',
      profileImage: null,
      reviewText: 'As a busy professional, I appreciate how Fydaa makes investing simple and accessible. The automated features save me time while building wealth systematically.',
      rating: 5
    },
    {
      id: 4,
      name: 'Sami Garde',
      profileImage: null,
      reviewText: 'The best investment platform I\'ve used. Fydaa\'s approach to disciplined investing across multiple asset classes has helped me achieve my financial goals faster.',
      rating: 5
    }
  ],
  
  faqs: [
    {
      id: 1,
      question: 'What is expense management in financial planning?',
      answer: 'Expense management helps you track, categorise, and optimise your spending so you can save and invest more efficiently.'
    },
    {
      id: 2,
      question: 'Will Fydaa help identify unnecessary expenses?',
      answer: 'Yes. Fydaa analyses your spending patterns to highlight areas where you can optimise without compromising your lifestyle.'
    },
    {
      id: 3,
      question: 'Is expense management different from budgeting?',
      answer: 'Expense management focuses on understanding and improving spending behaviour, while budgeting helps allocate money toward goals. Fydaa combines both.'
    },
    {
      id: 4,
      question: 'Can expense management improve savings?',
      answer: 'Yes. Better expense control directly improves savings, emergency fund creation, and long-term wealth building.'
    }
  ],
  
  financialSafety: {
    topSlogan: 'Your money is 100% Safe and Secure..!',
    mainHeading1: 'Built for Bharat.',
    mainHeading2: 'Backed by Transparency.',
    features: [
      {
        line1: 'SEBI-Registered,',
        line2: 'Zero Commission'
      },
      {
        line1: 'Money stays in your',
        line2: 'name, with top AMCs'
      },
      {
        line1: 'Data encrypted,',
        line2: '2FA enabled'
      }
    ]
  }
};
