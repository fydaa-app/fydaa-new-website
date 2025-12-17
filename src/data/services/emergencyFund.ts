import { ServiceData } from "./types";

export const emergencyFundData: ServiceData = {
  id: "emergency-fund",
  slug: "EmergencyFund",

  heroSection: {
    title: "Protect What Matters Most, Plan Your Insurance the Smart Way",
    subtitle: "",
    description:
      "Life is unpredictable, but your family's financial security doesn't have to be. Fydaa helps you choose the right insurance cover for your needs, so you can protect your health, income, and future.",
    iconPath: "/resource/Emergencyfund/icon.png",
    ctaText: "Book a Free Call",
    ctaLink: "https://cal.com/fydaa-backend-zr5zm3/30min",
  },

  videoSection: {
    heading: "Insurance Isn't Just a Policy, It's Peace of Mind",
    description:
      "Whether it's life, health, term, or asset insurance, Fydaa ensures you get the right cover, the right premium, and the right claim process. We analyse your needs, compare the best options in the market, and guide you towards the most cost-effective, comprehensive protection.",
    videoUrl:
      "https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/8.+Emergency+Fund+Setup.mp4",
  },

  featureSection: {
    mainHeading: "Your 5-Step Path to the Right",
    mainHeadingRegular: "Insurance Plan",
    steps: [
      {
        number: 1,
        title: "Understand Your Needs",
        description:
          "Identify risks based on your family, lifestyle, and goals.",
      },
      {
        number: 2,
        title: "Choose the Right Cover",
        description: "Select between term, health, life, or asset insurance.",
      },
      {
        number: 3,
        title: "Decide the Coverage Amount",
        description: "Ensure it's enough to handle emergencies.",
      },
      {
        number: 4,
        title: "Compare & Select",
        description:
          "We shortlist the best policies with competitive premiums.",
      },
      {
        number: 5,
        title: "Review Annually",
        description: "Update coverage as your life and income change",
      },
    ],
    bottomSection: {
      heading: "Because your family's future deserves more than luck",
      benefits: [
        {
          title: "Financial Protection",
          description: "Ensure your loved ones are secure even in your absence",
          iconPath: "/resource/Emergencyfund/familysupport.png",
        },
        {
          title: "Peace of Mind",
          description: "Live life knowing you're covered for emergencies",
          iconPath: "/resource/Emergencyfund/peace.png",
        },
        {
          title: "Smart Premiums",
          description: "Get maximum cover without overpaying",
          iconPath: "/resource/Emergencyfund/smart.png",
        },
        {
          title: "Claim Assistance",
          description: "We help you navigate claims smoothly",
          iconPath: "/resource/Emergencyfund/claim.png",
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
      question: "What is an emergency fund and why do I need one?",
      answer:
        "An emergency fund is money set aside for unexpected expenses like medical emergencies or job loss, helping you avoid debt.",
    },
    {
      id: 2,
      question:
        "How much emergency fund should I have?",
      answer:
        "Typically, 3–6 months of living expenses is recommended, but Fydaa customises this based on your income stability and lifestyle.",
    },
    {
      id: 3,
      question: "Where should I keep my emergency fund?",
      answer:
        "Fydaa guides you on safe, liquid options where funds are easily accessible but not impulsively spent.",
    },
    {
      id: 4,
      question: "Can I build an emergency fund gradually?",
      answer:
        "Yes. Fydaa encourages starting small and building consistently through monthly contributions.",
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
