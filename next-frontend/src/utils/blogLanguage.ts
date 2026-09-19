import "server-only";
import { supportedLanguage } from "./languages";
import { siteLanguage } from "./geo/visitorLanguage";

/**
 * The language the blog falls back to when the visitor has not chosen one.
 * Every post is written in Azerbaijani, so defaulting to anything else renders
 * an empty list for first-time visitors.
 */
export const DEFAULT_BLOG_LANGUAGE = "az";

/**
 * Resolves the language the blog should be rendered in.
 *
 * Priority: an explicit `?lang=` override, then whatever the rest of the site
 * resolved for this visitor - their saved choice, or their country.
 *
 * That last part is deliberate and it does hide posts. Somebody reading the
 * site in English is shown English posts, of which there are none yet, rather
 * than a page of Azerbaijani they cannot read. The `accept-language` header is
 * still not consulted: a phone set to English in Baku is not a request for an
 * English site.
 */
export async function resolveBlogLanguage(
  langParam: string | undefined,
): Promise<string> {
  return supportedLanguage(langParam) || (await siteLanguage());
}
