import HeroCard from "../components/HeroCard";
import ProductShowcase from "../components/ProductShowcase";
import { AllocationBar, AMCStrip, RMCard, RecommendedGoals } from "../components/DashboardWidgets";

export default function HomePage({ setActivePage }) {
  return (
    <div className="px-10 py-8 max-w-[1200px]">
      <HeroCard />
      <ProductShowcase />
      <AllocationBar />
      <AMCStrip />

      {/* Goals + RM Row */}
      <div className="grid grid-cols-[1fr_380px] gap-5 items-stretch mb-8">
        <RecommendedGoals
          onExplore={() => setActivePage("dreams")}
          onGoalClick={(name, yrs, cagr) => {
            setActivePage("dreams");
            // TODO: trigger startGoalFlow(name, yrs, cagr) via context/state
          }}
        />
        <RMCard />
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-border text-xs text-muted leading-relaxed">
        Fydaa Analytics is a unit of Multistrato Capital Advisors Pvt. Ltd. · SEBI Registered Investment Adviser · INA000015969 · ARN: 358522
        <br />
        <a href="#" className="text-secondary hover:text-jade">Terms</a> ·{" "}
        <a href="#" className="text-secondary hover:text-jade">Privacy</a> ·{" "}
        <a href="#" className="text-secondary hover:text-jade">Disclosures</a>
      </div>
    </div>
  );
}
