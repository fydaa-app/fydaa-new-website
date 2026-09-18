import ProductSection from './ProductSection';
import GoalsPanel from './panels/GoalsPanel';
import MoneyVaultPanel from './panels/MoneyVaultPanel';
import WealthScorePanel from './panels/WealthScorePanel';
import DirectPlanPanel from './panels/DirectPlanPanel';
import { DIRECT_PLAN } from '../data/productPanels';

export default function ProductSections() {
  return (
    <div id="products">
      <ProductSection
        label="Goal-Based Investing"
        heading={<>Every rupee has a <span className="serif">purpose</span></>}
        description="Create goals for the things that matter — a home, education, retirement, a trip. Fydaa builds a mutual fund portfolio matched to each goal's timeline and your risk comfort, then tracks it for you."
        points={[
          'SIP from ₹1,000/month or ₹100/day, no lock-in',
          'Portfolio auto-matched to goal timeline',
          'Real-time progress on every goal',
        ]}
        ctaText="Start Investing →"
        ctaHref="/start-investing"
      >
        <GoalsPanel />
      </ProductSection>

      <ProductSection
        label="Money Vault"
        heading={<>All your finances, <span className="serif">one place</span></>}
        description="Money Vault brings all your finances together. Track your net worth, see assets and liabilities side by side, view every investment in a single dashboard, and monitor transactions — a clear picture of your overall financial health."
        points={[
          'Net worth tracking across all accounts',
          'Assets & liabilities in one view',
          'Unified investment dashboard & transaction history',
        ]}
        ctaText="Explore Money Vault →"
        ctaHref="/money-vault"
        reverse
      >
        <MoneyVaultPanel />
      </ProductSection>

      <ProductSection
        label="Wealth Score"
        heading={<>Your financial health, <span className="serif">one number</span></>}
        description="A score out of 100 that measures how well your money life is working — net worth, assets, liquidity, leverage, and goal readiness. With specific tips on what to fix first."
        points={[
          'Holistic financial health check',
          'Actionable tips to improve each area',
          'Track improvements over time',
        ]}
        ctaText="Check your score →"
        ctaHref="/risk-score"
      >
        <WealthScorePanel />
      </ProductSection>

      <ProductSection
        label="Fydaa Direct Plan"
        heading={<>Your goals, your investments — <span className="serif">one roadmap</span></>}
        description="The Fydaa Direct Plan is your complete financial planning and wealth-building solution. It brings your goals, investments, budgeting, debt, and financial protection together into a personalized roadmap. Your portfolio is built using Direct Plan mutual funds — no distributor commissions — so you reduce costs and keep more of your money invested for long-term growth."
        points={[
          'Budgeting, cash flow & expense tracking',
          'Debt management & repayment roadmap',
          'Investments, wealth growth & goal tracking',
          'Insurance & financial protection review',
        ]}
        ctaText="Build my plan →"
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
    </div>
  );
}
