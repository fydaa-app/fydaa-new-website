/**
 * TODO(assets): mock people. Replace with real relationship managers and advisers who have agreed to
 * be shown (see TODO.md, section 3). `photo` is a path under /public/people, or null for initials.
 */
export interface Person {
  name: string;
  role: string;
  languages: string[];
  experience: string;
  photo: string | null;
}

export const PEOPLE: Person[] = [
  {
    name: "Ananya S.",
    role: "Relationship manager",
    languages: ["English", "Hindi", "Marathi"],
    experience: "6 years with first-time investors",
    photo: null,
  },
  {
    name: "Rohit K.",
    role: "SEBI-registered investment adviser",
    languages: ["English", "Hindi", "Gujarati"],
    experience: "11 years in financial planning",
    photo: null,
  },
  {
    name: "Meera P.",
    role: "Relationship manager",
    languages: ["English", "Hindi", "Tamil"],
    experience: "4 years helping families plan goals",
    photo: null,
  },
];
