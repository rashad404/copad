/**
 * The language the blog falls back to when the visitor has not chosen one.
 * Every post is written in Azerbaijani, so defaulting to anything else renders
 * an empty list for first-time visitors.
 */
export const DEFAULT_BLOG_LANGUAGE = 'az';

/**
 * Resolves the language the blog should be rendered in.
 *
 * Priority: an explicit `?lang=` override, then the visitor's saved choice from
 * the i18nextLng cookie, then the site default.
 *
 * The `accept-language` header is deliberately NOT consulted. Posts exist only
 * in Azerbaijani, so honouring the `en` that most browsers send filters every
 * post out and shows an empty blog to people who never picked a language.
 *
 * The cookie is what the language switcher writes; localStorage alone is not
 * enough, because it is never sent to the server.
 */
export function resolveBlogLanguage(
  langParam: string | undefined,
  cookieHeader: string
): string {
  const cookieLang = cookieHeader.match(/(?:^|;\s*)i18nextLng=([^;]+)/)?.[1];

  return langParam || cookieLang || DEFAULT_BLOG_LANGUAGE;
}
