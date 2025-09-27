import React from 'react';
import TakeControl from './Takecontrol';
import DebtFreedom from './debtfreedom';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import FinancialSafety from './FinancialSafety';

export default function ResourcesPage() {
  return (
    <div className="relative">

      
      <TakeControl />
      <DebtFreedom />
      <Testimonials />
      <FAQ />
      <FinancialSafety />
    </div>
  );
}
