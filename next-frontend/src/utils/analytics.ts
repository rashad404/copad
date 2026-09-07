/**
 * Product analytics.
 *
 * Provider-agnostic on purpose. azdoc handles medical questions, so the
 * analytics layer must never receive message content, uploaded filenames,
 * email addresses or anything else a patient typed - only that an event
 * happened. Every payload here is counts and enums.
 *
 * Plausible is the default because it is cookieless and stores no personal
 * data, which avoids a consent banner on a health site. When no provider is
 * configured the calls are no-ops, so nothing breaks in development.
 */

export type AnalyticsEvent =
  // Acquisition
  | 'page_view'
  // Activation funnel: this is the sequence that tells us whether the product
  // is used at all. 354 sessions produced 41 conversations and 5 accounts, and
  // nobody could see where the drop happened.
  | 'guest_session_started'
  | 'chat_opened'
  | 'first_message_sent'
  | 'message_sent'
  | 'ai_response_received'
  | 'file_uploaded'
  // Conversion
  | 'register_started'
  | 'register_completed'
  | 'login_completed'
  // Content
  | 'blog_post_viewed'
  | 'language_changed'
  // Failures worth counting rather than only logging
  | 'rate_limited'
  | 'error_shown';

type AnalyticsProps = Record<string, string | number | boolean | undefined>;

interface AnalyticsWindow extends Window {
  plausible?: (event: string, options?: { props?: AnalyticsProps }) => void;
  gtag?: (command: string, ...args: unknown[]) => void;
  dataLayer?: unknown[];
}

/** Fields that must never leave the browser, regardless of caller mistakes. */
const FORBIDDEN_KEYS = [
  'message', 'content', 'text', 'email', 'name', 'filename',
  'query', 'q', 'symptom', 'title', 'token', 'sessionid',
];

function scrub(props?: AnalyticsProps): AnalyticsProps | undefined {
  if (!props) return undefined;

  const safe: AnalyticsProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (FORBIDDEN_KEYS.includes(key.toLowerCase())) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[analytics] dropped potentially sensitive prop "${key}"`);
      }
      continue;
    }
    safe[key] = value;
  }
  return safe;
}

export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (typeof window === 'undefined') return;

  const safeProps = scrub(props);
  const w = window as AnalyticsWindow;
  let delivered = false;

  // Both providers can run at once; whichever is configured receives the event.
  if (w.plausible) {
    try {
      w.plausible(event, safeProps ? { props: safeProps } : undefined);
      delivered = true;
    } catch {
      // Analytics must never break the page.
    }
  }

  if (w.gtag) {
    try {
      w.gtag('event', event, safeProps ?? {});
      delivered = true;
    } catch {
      /* ignored */
    }
  }

  if (!delivered && process.env.NODE_ENV !== 'production') {
    console.debug('[analytics]', event, safeProps ?? '');
  }
}

export function isPlausibleEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
}

export function isGoogleAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
}

/** True when any provider is configured. */
export function isAnalyticsEnabled(): boolean {
  return isPlausibleEnabled() || isGoogleAnalyticsEnabled();
}
