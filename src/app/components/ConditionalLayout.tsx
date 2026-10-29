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
  const hideNavbar =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/upi-faq') ||
    pathname?.startsWith('/SuccesspageDigi') ||
    pathname?.startsWith('/SuccesspageFund') ||
    pathname?.startsWith('/Successpagemandate') ||
    pathname?.startsWith('/SuccesspageNSDL') ||
    pathname?.startsWith('/SuccesspageSetu');

  const hideFooter = hideNavbar;

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}

