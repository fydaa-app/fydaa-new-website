import { ServiceData } from './types';

export const debtManagementData: ServiceData = {
  id: 'debt-management',
  slug: 'DebtManagement',
  
  heroSection: {
    title: 'Take Control of Your Debt,',
    subtitle: 'Regain Your Peace of Mind',
    description: 'Struggling with EMIs, credit card dues, or multiple loans? You\'re not alone. Fydaa helps you simplify your repayments, lower your interest rates, and get your finances back on track, so you can breathe easy again.',
    iconPath: '/resource/DebtManagement&Refinancing/icon.png',
    ctaText: 'Book a Free Call',
    ctaLink: 'https://cal.com/fydaa-backend-zr5zm3/30min'
  },
  
  videoSection: {
    heading: 'Make Your Debt Work for You, Not Against You',
    description: 'Debt management and refinancing are not just about paying off what you owe, they\'re about creating a repayment plan that works for your lifestyle and future goals. At Fydaa, we guide you through smart repayment strategies, consolidation options, and refinancing deals so you save more and stress less.',
    videoUrl: 'https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/1.+Debt+Management.mp4'
  },
  
  featureSection: {
    mainHeading: 'How We Help You Get',
    mainHeadingItalic: 'Debt-Free Smarter & Faster',
    steps: [
      {
        number: 1,
        title: 'Assess Your Debt Profile',
        description: 'Understand Your Loans, Interest Rates, And Repayment Terms.'
      },
      {
        number: 2,
        title: 'Choose The Right Strategy',
        description: 'Snowball, Avalanche, Or Consolidation. We\'ll Guide You On The Best Fit.'
      },
      {
        number: 3,
        title: 'Refinance For Savings',
        description: 'Lower Interest Rates And Better Terms Mean Less Burden.'
      },
      {
        number: 4,
        title: 'Automate Payments',
        description: 'Never Miss An EMI And Protect Your Credit Score.'
      },
      {
        number: 5,
        title: 'Stay On Track',
        description: 'Regular Reviews And Tweaks To Your Repayment Plan.'
      }
    ],
    bottomSection: {
      heading: 'Debt Freedom Isn\'t Just A Number, It\'s A New Beginning',
      benefits: [
        {
          title: 'Lower Interest Costs',
          description: 'Save Thousands Over Your Loan Tenure',
          iconPath: '/resource/DebtManagement&Refinancing/lowcost.png'
        },
        {
          title: 'Simplified Finances',
          description: 'One Manageable Payment Instead Of Juggling Multiple',
          iconPath: '/resource/DebtManagement&Refinancing/payment.png'
        },
        {
          title: 'Better Credit Score',
          description: 'Opens The Door For Future Opportunities',
          iconPath: '/resource/DebtManagement&Refinancing/creditscore.png'
        },
        {
          title: 'Less Stress',
          description: 'Sleep Better Knowing Your Finances Are In Control',
          iconPath: '/resource/DebtManagement&Refinancing/stress.png'
        }
      ]
    }
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
      question: 'Is fydaa registered with any financial regulators in India?',
      answer: 'Yes, fydaa is the Investment Advisory unit of Multistrato Capital Advisors Private Limited – a SEBI Registered Investment Adviser. Click here to verify.'
    },
    {
      id: 2,
      question: 'How fydaa is different from a broker or mutual fund distributor?',
      answer: 'Unlike your broker, fydaa do not execute the trades but advice on which securities to buy/sell on periodic basis based on your risk profile. Your broker charges brokerage on every transaction. Mutual fund distributors on the other hand help invest by selling schemes of Asset Management companies for a distributor fee.'
    },
    {
      id: 3,
      question: 'How fydaa makes money?',
      answer: 'Fydaa have no conflict of interest when it advises you. The only income fydaa makes is direct fee charged to you as a client. There are no other revenue or commission from brokers or mutual fund houses.'
    },
    {
      id: 4,
      question: 'What is the advisory fee of fydaa?',
      answer: 'Fydaa charges a nominal fee of 0.4% per year of Asset under management. That mean for every 10000 rupees worth of investment, you are charged just INR 40 as advisory fee. This is fraction of what other advisor charges. (Traditional mutual funds and advisor\'s charges in excess of 1.5 - 2 %)'
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
