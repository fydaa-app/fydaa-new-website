'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

const KYC_NAV_EVENT = 'fydaa-onboarding-nav';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [hideOnboardingChrome, setHideOnboardingChrome] = useState(false);

  useEffect(() => {
    const onNav = (event: Event) => {
      const detail = (event as CustomEvent<{ hideNav?: boolean }>).detail;
      setHideOnboardingChrome(Boolean(detail?.hideNav));
    };
    window.addEventListener(KYC_NAV_EVENT, onNav as EventListener);
    return () => {
      window.removeEventListener(KYC_NAV_EVENT, onNav as EventListener);
      setHideOnboardingChrome(false);
    };
  }, [pathname]);

  const hideNavbar =
    hideOnboardingChrome ||
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

