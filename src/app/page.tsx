import Hero from './components/Herosection';
import PageDivider from './components/PageDivider';
import Dreams from './components/Dreams';
import Financialhelp from './components/Financialhelp';
import Fydaaexperience from './components/Fydaaexperience';
import PageDivider2 from './components/PageDivider2';
import AdvisoryFydaa from './components/AdvisoryFydaa';
import TestimonialPage from './components/TestimonialPage';
import FAQ from './components/FAQ';
import React from 'react';

export default function HomePage() {
  return (
    <main className="w-full h-full m-0 p-0 relative">
      <Hero />
      <PageDivider />
      <Dreams />
      <Financialhelp />
      <Fydaaexperience />
      <PageDivider2 />
      <AdvisoryFydaa />
      <TestimonialPage />
      <FAQ />
    </main>
  );
}
