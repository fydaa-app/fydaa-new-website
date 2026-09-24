import ProductSection from './ProductSection';
import DirectPlanPanel from './panels/DirectPlanPanel';
import { DIRECT_PLAN } from '../data/productPanels';

export default function DirectPlanSection() {
  return (
    <ProductSection
      className="prod-section--merge"
      label="Fydaa Direct Plan"
      heading={<>Your goals, your investments — <span className="serif">one roadmap</span></>}
      description="The Fydaa Direct Plan is your complete financial planning and wealth-building solution. It brings your goals, investments, budgeting, debt, and financial protection together into a personalized roadmap. Your portfolio is built using Direct Plan mutual funds — no distributor commissions — so you reduce costs and keep more of your money invested for long-term growth."
      points={[
        'Budgeting, cash flow & expense tracking',
        'Debt management & repayment roadmap',
        'Investments, wealth growth & goal tracking',
        'Insurance & financial protection review',
      ]}
      // ctaText="Build my plan →"
      ctaHref="/direct-plan"
      reverse
      extraCta={
        <span style={{ fontSize: '.85rem', color: 'var(--ink3)', borderLeft: '1px solid var(--border)', paddingLeft: 16 }}>
          {DIRECT_PLAN.priceLabel}
        </span>
      }
    >
      <DirectPlanPanel />
    </ProductSection>
  );
}
