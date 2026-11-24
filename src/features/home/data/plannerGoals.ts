/**
 * The goals offered in the home planner: a subset of the app's 16 goal types
 * (src/features/dashboard/data/constants.js), with a sensible starting amount (in today's rupees)
 * and horizon for each. Icons are the app's own goal illustrations.
 */
export interface PlannerGoal {
  id: string;
  /** Short label on the chip. */
  label: string;
  /** Name shown on the plan, as the app would title it. */
  name: string;
  icon: string;
  target: number;
  years: number;
}

export const PLANNER_GOALS: PlannerGoal[] = [
  {
    id: "home",
    label: "Home",
    name: "Home down payment",
    icon: "/dreams/goals/10-Home-Purchase.png",
    target: 2000000,
    years: 7,
  },
  {
    id: "education",
    label: "Education",
    name: "Child's education",
    icon: "/dreams/goals/15-Children-Education.png",
    target: 1500000,
    years: 12,
  },
  {
    id: "wedding",
    label: "Wedding",
    name: "Wedding fund",
    icon: "/dreams/goals/12-Marriage-Fund.png",
    target: 1000000,
    years: 5,
  },
  {
    id: "retirement",
    label: "Retirement",
    name: "Retirement",
    icon: "/dreams/goals/14-Retirement.png",
    target: 10000000,
    years: 25,
  },
  {
    id: "travel",
    label: "Travel",
    name: "Dream trip",
    icon: "/dreams/goals/01-Vacation.png",
    target: 300000,
    years: 2,
  },
  {
    id: "car",
    label: "Car",
    name: "New car",
    icon: "/dreams/goals/11-Buying-a-Vehicle.png",
    target: 800000,
    years: 4,
  },
  {
    id: "emergency",
    label: "Safety net",
    name: "Emergency fund",
    icon: "/dreams/goals/05-Emergency-Fund.png",
    target: 300000,
    years: 2,
  },
  {
    id: "gold",
    label: "Gold",
    name: "Gold savings",
    icon: "/dreams/goals/16-Gold-Savings.png",
    target: 500000,
    years: 5,
  },
];

/** Assumed yearly price rise used to turn today's rupees into the amount needed then. */
export const INFLATION_PERCENT = 6;
