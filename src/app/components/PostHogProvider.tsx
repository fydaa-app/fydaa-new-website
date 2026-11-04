'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { installGlobalButtonTracking, posthog } from '../../lib/posthog';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

let posthogInitialized = false;

function PostHogPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!POSTHOG_KEY) return;

    if (!posthogInitialized) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
        // Named button_click events handle labels; skip noisy input autocapture
        autocapture: false,
      });
      installGlobalButtonTracking();
      posthogInitialized = true;
    }

    const url =
      window.origin + pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    if (url !== lastUrl.current) {
      lastUrl.current = url;
      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageViews />
      </Suspense>
      {children}
    </>
  );
}
