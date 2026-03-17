import { ServiceData } from "./types";

export const taxConsultancyData: ServiceData = {
  id: "tax-consultancy",
  slug: "TaxConsultancy",

  heroSection: {
    title: "Pay the Right Taxes \& ",
    subtitle: "Save More Legally",
    description:
      "Tax planning isn't about avoiding taxes—it's about optimising them. Fydaa helps you understand the rules, claim eligible deductions, and plan your finances to keep more money in your pocket.",
    iconPath: "/resource/TaxConsultancy/icon.png",
    ctaText: "Book a Free Call",
    ctaLink: "https://www.cal.eu/fydaa/30min?overlayCalendar=true",
  },

  videoSection: {
    heading: "Make the Tax System Work for You",
    description:
      "From filing returns to planning investments for tax benefits, Fydaa's tax consultancy ensures you comply with Indian tax laws while maximising your savings. We keep you updated with the latest rules so you never miss an opportunity.",
    videoUrl:
      "https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/7.+Tax+Consultancy.mp4",
  },

  featureSection: {
    mainHeading: "Smart Tax Planning in",
    mainHeadingRegular: "5 Simple Steps",
    steps: [
      {
        number: 1,
        title: "Assess Your Income Sources",
        description: "Salary, business, investments, rentals.",
      },
      {
        number: 2,
        title: "Identify Tax-Saving Opportunities",
        description: "Sections 80C, 80D, 24B, and more.",
      },
      {
        number: 3,
        title: "Optimise Investments",
        description: "Choose tax-efficient instruments like ELSS, PPF, NPS.",
      },
      {
        number: 4,
        title: "Ensure Compliance",
        description: "File returns accurately and on time.",
      },
      {
        number: 5,
        title: "Review Annually",
        description: "Adjust your plan with changes in tax laws or income.",
      },
    ],
    bottomSection: {
      heading: "Because every saved rupee can fuel your dreams",
      benefits: [
        {
          title: "Maximise Returns",
          description: "Make the most of your capital",
          iconPath: "/resource/TaxConsultancy/returns.png",
        },
        {
          title: "Reduce Risk",
          description: "Avoid overexposure to a single asset",
          iconPath: "/resource/TaxConsultancy/risk.png",
        },
        {
          title: "Save Time",
          description: "Let professionals handle the tracking and adjustments",
          iconPath: "/resource/TaxConsultancy/time.png",
        },
        {
          title: "Stay Aligned",
          description: "Keep your portfolio in sync with your changing goals",
          iconPath: "/resource/TaxConsultancy/love.png",
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
      question: "What does tax consultancy include at Fydaa?",
      answer:
        "Fydaa’s tax consultancy helps you plan, optimize, and comply with income tax regulations. We review your income, investments, deductions, and tax-saving opportunities to reduce tax legally and efficiently.",
    },
    {
      id: 2,
      question:
        "Can Fydaa help with tax-saving investments?",
      answer:
        "Yes. We recommend tax-efficient investment options based on your financial goals, risk profile, and eligibility under sections like 80C, 80D, and others.",
    },
    {
      id: 3,
      question: "Is tax consultancy only for salaried individuals?",
      answer:
        "No. Our tax consultancy services are suitable for salaried professionals, freelancers, business owners, and individuals with multiple income sources.",
    },
    {
      id: 4,
      question: "Will Fydaa help with filing income tax returns?",
      answer:
        "Fydaa focuses on tax planning and strategy. Where applicable, we guide you through the filing process or coordinate with tax filing support.",
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
