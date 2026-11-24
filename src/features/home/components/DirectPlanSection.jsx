import ProductSection from './ProductSection';
import DirectPlanPanel from './panels/DirectPlanPanel';

export default function DirectPlanSection() {
  return (
    <ProductSection
      className="prod-section--merge"
      label="Fydaa Direct Plan"
      heading={<>Your goals, your investments — <span className="serif">one roadmap</span></>}
      description="The Fydaa Direct Plan is your complete financial planning and wealth-building solution. It brings your goals, investments, budgeting, debt, and financial protection together into a personalized roadmap. Your portfolio is built using Direct Plan mutual funds — no distributor commissions — so you reduce costs and keep more of your money invested for long-term growth."
      mobileDescription="Your goals, investments, budgeting, debt and protection in one personalized roadmap, built on Direct Plan mutual funds with no distributor commissions."
      points={[
        'Budgeting, cash flow & expense tracking',
        'Debt management & repayment roadmap',
        'Investments, wealth growth & goal tracking',
        'Insurance & financial protection review',
      ]}
      reverse
    >
      <DirectPlanPanel />
    </ProductSection>
  );
}
