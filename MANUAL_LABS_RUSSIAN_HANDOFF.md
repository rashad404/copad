# Manual lab entry and Russian UI

Branch: `codex/manual-labs-russian`

## Manual lab entry

- POSTs to `/api/members/{memberId}/documents/lab-results` with JWT through the existing API client.
- Available from the labs screen and from SKIPPED/FAILED documents. VIEWER controls remain read-only.
- Numeric and qualitative results are supported. Blank reference bounds, units and collection dates remain null. No abnormal flag is computed client-side.
- Entries go directly into confirmed results after the server saves them. There is no confirmation/review request. Backend 400 messages remain visible without clearing the form.
- Saves are cancelled on unmount/member change; obsolete responses cannot update the next member's screen.
- MANUAL and EXTRACTED sources are shown in confirmed lists, history, proposal views and chart tooltips/markers. Source labels are in the first table column so they remain visible on mobile. Missing source metadata is explicitly unknown.
- Chart reference bands use supplied numeric bounds when available. No range or only one bound does not produce an invented band.
- The manual-entry API has no document-link field. Opening the form from a document does not fabricate a document association.

## Russian and language selection

- Every key in `az.json` has a Russian translation, with interpolation placeholders preserved. The one English-only attachment placeholder is also translated.
- The switcher offers AZ, EN and RU only. Russian resources are registered. Retired saved language choices are normalized so the switcher, localStorage and cookie do not disagree.
- Current homepage, navigation, auth, chat and health pages also use separate dictionaries/inline copy. Those paths now include Russian, rather than continuing to display English after selecting RU.
- Catalogue controls, notices and metadata use the saved language on the server and still deliver indexable HTML, canonical URLs and Drug JSON-LD. Recognized prescription labels are localized; medicine names, clinical values, article content and free-text source data are preserved.
- Cyrillic font support is included. Account/language-dependent navigation stays stable during catalogue hydration.
- Existing English admin screens remain English.

## Default language decision

`lng: 'en'` and the English fallback are unchanged. Azerbaijani would be a more consistent product default, but that decision was raised rather than silently implemented. The blog still defaults to Azerbaijani.

## Validation and preview

- Production build with lint/type gates enabled.
- 94 tests passed; the optional live-catalogue SSR check also passed separately.
- Browser checks: Russian homepage, language switching and persistence, login/register, manual entry, readable 400 recovery, SKIPPED entry, source labels, VIEWER restrictions, catalogue and drug detail. Desktop/mobile layouts inspected. No runtime errors after the hydration fix.
- API writes in browser verification were intercepted fixtures. Production patient data was not changed.
- Protected files are unchanged. No backend changes or dependencies added.

Preview: `http://100.89.150.50:3003/health-record` (sign in).
Frontend port remains 3003, shared backend remains 8002.

Merge this branch and deploy the frontend. The required backend endpoint is already live.
