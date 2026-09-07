/**
 * Resolves the URL of a chat attachment.
 *
 * The backend returns a relative path (`/api/attachments/{id}?s={session}`)
 * because the file it points at is no longer public: it is served by an
 * endpoint that checks the session, and a relative path keeps that endpoint on
 * whichever origin the API is reached through.
 *
 * In production the browser talks to `/api` on this same origin, so the path is
 * already correct. In development the API lives on another host and the path
 * has to be prefixed with it.
 */
export function attachmentUrl(url: string | undefined | null): string {
  if (!url) return '';
  // Older messages may still carry an absolute URL.
  if (/^https?:\/\//i.test(url)) return url;
  if (!url.startsWith('/api/')) return url;

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development' || !base) {
    return url;
  }

  // NEXT_PUBLIC_API_URL already ends in /api, which the path repeats.
  return base.replace(/\/+$/, '').replace(/\/api$/, '') + url;
}
