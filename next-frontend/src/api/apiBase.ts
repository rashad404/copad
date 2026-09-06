/**
 * Resolves the API base URL used for server-side calls.
 *
 * Two rules are enforced here, and both exist because breaking either one takes
 * production down:
 *
 * 1. Server-side rendering must not call the site's own public origin. Such a
 *    request travels back through nginx and Apache into this same Next.js
 *    process, which renders the page again and re-issues the same fetch. The
 *    recursion only stops when the proxy runs out of workers, which takes the
 *    whole server down with it. INTERNAL_API_URL points straight at the backend
 *    and cannot loop, so it wins when it is set.
 *
 * 2. The endpoints in serverFetch.ts are written without an /api prefix
 *    (e.g. `/blog/${slug}`), so the base must end in /api. A base missing that
 *    suffix resolves to the public *page* routes instead of the API, which is
 *    what triggers rule 1's recursion in the first place. We append it rather
 *    than trust the environment to get it right.
 */
export function resolveApiBaseUrl(): string {
  const raw =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://100.89.150.50:8002/api';

  const trimmed = raw.replace(/\/+$/, '');

  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}
