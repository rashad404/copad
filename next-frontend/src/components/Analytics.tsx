'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { track, isAnalyticsEnabled } from '@/utils/analytics';

/**
 * Loads the analytics provider and reports client-side navigations.
 *
 * Renders nothing when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is unset, so development
 * and self-hosted deployments send no traffic anywhere.
 */
export default function Analytics() {
  const pathname = usePathname();
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const scriptSrc =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js';

  useEffect(() => {
    if (!pathname) return;
    // The App Router does not trigger a full page load between routes, so
    // without this only the first page of a visit would ever be counted.
    track('page_view', { path: pathname });
  }, [pathname]);

  if (!isAnalyticsEnabled()) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src={scriptSrc}
      strategy="afterInteractive"
    />
  );
}
