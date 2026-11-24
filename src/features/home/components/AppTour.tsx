"use client";

import { useState } from "react";
import { GetAppButton } from "@/components/app/get-app-button";
import { PhoneFrame } from "@/components/app/phone-frame";
import { Container } from "@/components/layout/container";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { GoalsScreen, MoneyVaultScreen, WealthScoreScreen } from "./app-screens/TourScreens";

const STOPS = [
  {
    id: "goals",
    label: "Goals",
    title: "Every goal, and how close it is",
    body: "Each goal has its own SIP and its own progress bar. Add money, change the SIP or withdraw from the goal itself.",
    points: [
      "Daily SIPs from ₹100, monthly from ₹1,000",
      "Funds matched to when you need the money",
      "Withdraw any time; ELSS has a 3-year lock-in",
    ],
    screen: <GoalsScreen />,
  },
  {
    id: "score",
    label: "Wealth Score",
    title: "One number for how healthy your money is",
    body: "A score out of 100 across five areas of your finances, with the first thing to fix.",
    points: [
      "Net worth, asset quality, liquidity, leverage, goal readiness",
      "See which area pulls your score down",
      "Talk it through with your relationship manager",
    ],
    screen: <WealthScoreScreen />,
  },
  {
    id: "vault",
    label: "Money Vault",
    title: "Everything you own and owe, in one place",
    body: "Bank accounts, investments, loans and assets side by side, with your net worth kept up to date.",
    points: [
      "Assets and liabilities in one view",
      "Every investment in a single list",
      "Every transaction, filtered by status",
    ],
    screen: <MoneyVaultScreen />,
  },
] as const;

type StopId = (typeof STOPS)[number]["id"];

/**
 * "Inside the app": three stops, chosen with a sliding segmented control. The text and the phone
 * screen swap together with a soft cross-blur (transitions.dev panel reveal).
 */
export default function AppTour() {
  const [id, setId] = useState<StopId>("goals");
  const stop = STOPS.find((s) => s.id === id) ?? STOPS[0];

  return (
    <section aria-labelledby="tour-title" className="section">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-24">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 id="tour-title" className="max-w-[16ch] text-heading text-ink">
              Everything else lives in the app
            </h2>
            <SegmentedControl
              label="App feature"
              options={STOPS.map((s) => ({ value: s.id, label: s.label }))}
              value={id}
              onChange={setId}
              className="w-fit max-w-full"
            />
          </div>
          <div key={stop.id} className="t-swap flex max-w-[52ch] flex-col gap-4" aria-live="polite">
            <h3 className="text-title text-ink">{stop.title}</h3>
            <p className="text-lead text-grey-600">{stop.body}</p>
            <ul className="flex flex-col gap-2.5">
              {stop.points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-base text-grey-600">
                  <i
                    aria-hidden="true"
                    className="block h-3.5 w-1.5 shrink-0 -rotate-[38deg] rounded-full bg-sprout"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <GetAppButton data={{ source: `web_tour_${stop.id}` }}>Get the app</GetAppButton>
          </div>
        </div>
        <div className="flex justify-center">
          <PhoneFrame className="w-[248px] sm:w-[280px]">
            <div key={stop.id} className="t-swap h-full">
              {stop.screen}
            </div>
          </PhoneFrame>
        </div>
      </Container>
    </section>
  );
}
