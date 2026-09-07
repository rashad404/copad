# Drug catalogue UI

Branch: `codex/drug-catalogue-ui`, based on main `bcca4b7`.

Public search at `/dermanlar` and server-rendered detail pages at `/dermanlar/[slug]`. Search preserves Azerbaijani text and backend relevance ordering. Prices and alternatives sort cheapest first, null prices last; equal-price alternatives use an Azerbaijani collator. Content is Azerbaijani; shared navigation retains its language selector.

Details include absolute titles, descriptions, canonical URLs, escaped Drug JSON-LD and real 404 responses. Backend failures have retry states. Search results are noindex/follow. The landing page is in the sitemap and shared navigation. Public fetches use the existing API base resolver, a five-minute cache and a timeout.

A scoped change in `providers.tsx` allows catalogue content through before client language initialization. Previously its null server output hid even server-component children from initial HTML. Other routes retain their behavior.

Allergy checks use the JWT Axios interceptor. The health record's account-specific stored member is verified against accessible families. Without a stored selection, visitors choose a member. VIEWER users can read checks. Member/account changes cancel old requests and remove old results. Critical warnings and class/ingredient explanations are advisory; no-match does not imply safety. Private health information is never server-rendered or cached.

## Backend limitations reflected in the UI

- `priceCount` is packaging variants. Tablet/unit counts are not exposed per price row; the UI asks visitors to verify these.
- Alternatives share at least one ingredient, potentially with different strengths, forms or additional ingredients. Highlighted savings are explicitly listed packaging-price differences, not dose-equivalent savings or substitution advice.
- No slug-enumeration endpoint exists. The landing page is in the sitemap; a complete medicine sitemap needs backend support.

Comparison wording considers the distinction between shared ingredients and equivalent strength/form described in [FDA generic drug guidance](https://www.fda.gov/drugs/generic-drugs/generic-drugs-questions-answers), without making Azerbaijani regulatory claims. Structured data follows [Schema.org Drug](https://schema.org/Drug).

## Validation

- `npm run build`: production build, TypeScript and lint gates.
- `node --test tests/medicines.test.cjs`: seven focused model, DOM and JWT contract tests.
- `CATALOGUE_TEST_ORIGIN=http://localhost:3007 node --test tests/medicines-ssr.test.cjs`: real public API, visible HTML without scripts, metadata, prices, links, Azerbaijani query and 404 status.
- No browser screenshot review or live authenticated patient-session test; private flows use DOM/API mocks.

The four protected files are unchanged. No dependency or backend changes. Main agent merges and deploys.
