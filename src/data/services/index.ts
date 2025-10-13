import { ServiceData } from './types';
import { debtManagementData } from './debtManagement';
import { emergencyFundData } from './emergencyFund';
import { expenseManagementData } from './expenseManagement';
import { financialHealthCheckupData } from './financialHealthCheckup';
import { investmentPlanningData } from './investmentPlanning';
import { personalizedBudgetingData } from './personalizedBudgetingplan';
import { portfolioManagementData } from './portfolioManagement';
import { taxConsultancyData } from './taxConsultancy';

export const servicesData: Record<string, ServiceData> = {
  'DebtManagement': debtManagementData,
  'Emergencyfund': emergencyFundData,
  'ExpenseManagement': expenseManagementData,
  'FinancialHealthCheckup': financialHealthCheckupData,
  'InvestmentPlanning': investmentPlanningData,
  'PersonalizedBudgetingplan': personalizedBudgetingData,
  'PortfolioManagement': portfolioManagementData,
  'TaxConsultancy': taxConsultancyData
};

export * from './types';
