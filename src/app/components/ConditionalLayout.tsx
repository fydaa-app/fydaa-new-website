'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbarFooter = 
    pathname?.startsWith('/risk-score') ||
    pathname?.startsWith('/SuccesspageDigi') ||
    pathname?.startsWith('/SuccesspageFund') ||
    pathname?.startsWith('/Successpagemandate') ||
    pathname?.startsWith('/SuccesspageNSDL');

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && <Footer />}
    </>
  );
}

