export type JobOpening = {
  id: string;
  title: string;
  companyName: string;
  /** e.g. ₹28–42 LPA for modal subtitle */
  salaryCompact: string;
  /** e.g. Rs. 28-42 LPA for cards / stat box */
  salaryCard: string;
  tags: string[];
  metaLine: string;
  division: string;
  experienceRange: string;
  location: string;
  posted: string;
  about: string;
  responsibilities: string[];
  skills: string[];
};

const SKILLS_DEFAULT = [
  'BFSI Distribution',
  'Wealth Management',
  'Team Leadership',
  'IFA/MFD Channels',
  'Client Acquisition',
  'CRM/Salesforce',
];

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'zonal-head-sales',
    title: 'Zonal Head - Sales',
    companyName: 'Fydaa Financial',
    salaryCompact: '₹28–42 LPA',
    salaryCard: 'Rs. 28-42 LPA',
    tags: ['Mumbai', 'Full Time', '8-15 yrs', 'BFSI Distribution'],
    metaLine: 'Expansion | 2 days ago',
    division: 'Expansion',
    experienceRange: '8-15 yrs',
    location: 'Mumbai',
    posted: '2 days ago',
    about:
      'We are looking for a dynamic and experienced Zonal Head - Sales to lead and expand our business across the assigned region. The role will be responsible for driving revenue growth, managing regional sales teams, and expanding distribution networks.',
    responsibilities: [
      'Drive regional sales strategy to achieve revenue and business growth targets.',
      "Expand the company's distribution footprint through IFAs, MFDs, and channel partners.",
      'Lead, manage, and mentor Regional Sales Managers and Relationship Managers.',
      'Drive new client onboarding and portfolio growth within the assigned zone.',
    ],
    skills: SKILLS_DEFAULT,
  },
  {
    id: 'deputy-vp-wealth',
    title: 'Deputy VP - Wealth',
    companyName: 'Fydaa Financial',
    salaryCompact: '₹35–50 LPA',
    salaryCard: 'Rs. 35-50 LPA',
    tags: ['Mumbai', 'Full Time', '12-18 yrs', 'Wealth'],
    metaLine: 'Wealth | 5 days ago',
    division: 'Wealth',
    experienceRange: '12-18 yrs',
    location: 'Mumbai',
    posted: '5 days ago',
    about:
      'Lead high-net-worth client relationships and wealth strategy across the region. Partner with product and compliance to deliver a best-in-class advisory experience while growing AUM and client satisfaction.',
    responsibilities: [
      'Own relationship strategy for priority wealth clients and RM teams.',
      'Drive cross-sell of investment and protection solutions in line with regulations.',
      'Collaborate with research and product on portfolio construction and reviews.',
      'Ensure adherence to SEBI norms and internal risk frameworks.',
    ],
    skills: ['Wealth Management', 'Portfolio Advisory', 'Team Leadership', 'HNWI Sales', 'Compliance'],
  },
  {
    id: 'senior-rm-investments',
    title: 'Senior RM - Investments',
    companyName: 'Fydaa Financial',
    salaryCompact: '₹18–28 LPA',
    salaryCard: 'Rs. 18-28 LPA',
    tags: ['Mumbai', 'Full Time', '6-10 yrs', 'Investments'],
    metaLine: 'Retail | 1 week ago',
    division: 'Retail',
    experienceRange: '6-10 yrs',
    location: 'Mumbai',
    posted: '1 week ago',
    about:
      'Grow and service an investment book by advising clients on mutual funds, equities, and goal-based plans. Work closely with internal research and operations to deliver seamless execution.',
    responsibilities: [
      'Acquire and deepen client relationships through structured financial planning.',
      'Meet revenue and activity targets while maintaining quality of advice.',
      'Coordinate with operations for onboarding, KYC, and transaction support.',
      'Maintain CRM hygiene and client communication records.',
    ],
    skills: ['Mutual Funds', 'Financial Planning', 'CRM', 'Client Acquisition', 'NISM XA'],
  },
  {
    id: 'area-sales-manager-mf',
    title: 'Area Sales Manager - MF',
    companyName: 'Fydaa Financial',
    salaryCompact: '₹14–22 LPA',
    salaryCard: 'Rs. 14-22 LPA',
    tags: ['Mumbai', 'Full Time', '5-8 yrs', 'Distribution'],
    metaLine: 'Distribution | 3 days ago',
    division: 'Distribution',
    experienceRange: '5-8 yrs',
    location: 'Mumbai',
    posted: '3 days ago',
    about:
      'Expand mutual fund distribution through IFAs, MFDs, and partners in the assigned area. Coach the sales team on product positioning and help hit channel targets.',
    responsibilities: [
      'Recruit and activate distributors; monitor pipeline and conversions.',
      'Conduct partner trainings and joint sales calls.',
      'Track market intelligence and competitor activity.',
      'Report MIS and forecasts to regional leadership.',
    ],
    skills: ['MFD Channels', 'Sales', 'Training', 'MIS', 'Partner Management'],
  },
];
