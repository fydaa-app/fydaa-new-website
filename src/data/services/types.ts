export interface ServiceData {
  id: string;
  slug: string;
  heroSection: {
    title: string;
    subtitle: string;
    description: string;
    iconPath: string;
    ctaText: string;
    ctaLink: string;
  };
  videoSection: {
    heading: string;
    description: string;
    videoUrl: string;
  };
  featureSection: {
    mainHeading: string;
    mainHeadingItalic: string;
    steps: Array<{
      number: number;
      title: string;
      description: string;
    }>;
    bottomSection: {
      heading: string;
      benefits: Array<{
        title: string;
        description: string;
        iconPath: string;
      }>;
    };
  };
  testimonials: Array<{
    id: number;
    name: string;
    profileImage: string | null;
    reviewText: string;
    rating: number;
  }>;
  faqs: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
  financialSafety: {
    topSlogan: string;
    mainHeading1: string;
    mainHeading2: string;
    features: Array<{
      line1: string;
      line2: string;
    }>;
  };
}
