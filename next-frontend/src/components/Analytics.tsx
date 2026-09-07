'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
  track,
  isAnalyticsEnabled,
  isPlausibleEnabled,
  isGoogleAnalyticsEnabled,
} from '@/utils/analytics';

/**
 * Loads the configured analytics providers and reports client-side navigations.
 *
 * Both GA4 and Plausible are supported and can run together. Neither loads
 * unless its environment variable is set, so development sends nothing.
 *
 * GA4's automatic page_view is disabled: the App Router does not do a full page
 * load between routes, so gtag's own tracking would record only the first page
 * of a visit. Navigations are reported explicitly below instead.
 */
export default function Analytics() {
  const pathname = usePathname();

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleSrc =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js';

  useEffect(() => {
    if (!pathname || !isAnalyticsEnabled()) return;
    track('page_view', { path: pathname });
  }, [pathname]);

  if (!isAnalyticsEnabled()) return null;

  return (
    <>
      {isGoogleAnalyticsEnabled() && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                send_page_view: false,
                anonymize_ip: true
              });
            `}
          </Script>
        </>
      )}

      {isPlausibleEnabled() && (
        <Script
          defer
          data-domain={plausibleDomain}
          src={plausibleSrc}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
