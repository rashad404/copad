# Website to native app parity

Branch: `codex/mobile-website-parity`
Website reference: `origin/main` at `f49e855`, merged into this branch before implementation.

The patient website is the reference for content, actions and states. The app uses React Native screens, persistent navigation, native pickers, sheets and OS sharing. It does not load the website in a WebView.

## Route map

| Website | Native destination | Coverage |
| --- | --- | --- |
| `/` | Home | Current photos and copy, returning-account actions, interactive three-step example, time and sharing choices, family stories, follow-up sections, privacy and FAQ. Examples remain explicitly fictional. |
| `/dashboard` | Account / My overview | Greeting, conversations, profile, family records, reading and privacy links. Existing device-sync outcome, critical-allergy and pending-review shortcuts retained. |
| `/chat` | Chat | Same opening prompts, history, member grounding, categorized multi-file uploads, partial-upload results, file-only messages, sent attachment details, image preview, formatted replies, standing medical notice and persistent emergency notice. |
| `/health-record` | Records | Member management; overview, conditions, allergies, medications, immunizations, documents, lab results, prescription review, vitals, timeline and audit history. Existing corrections, confirmation, rejection, manual entry, source labels, charts, PDF summary and VIEWER restrictions retained. |
| `/profile`, `/profile/privacy` | Account / Personal information, Privacy and consent | Existing editing, grant/withdrawal, member export, permanent deletion and account deletion flows retained. |
| `/dermanlar` | Services / Medicines | Search-first guidance and all 12 examples. No request for fewer than two letters. Search limit 50, exact user spelling, separate empty/error/loading states, packaging counts and missing prices. |
| `/dermanlar/[slug]` | Medicine | Ingredient, manufacturer, prescription status, full alternatives and pack-price difference caveat, all price fields, missing values, member-specific allergy warning and additional information. Native share sends the website URL. |
| `/hekimler` | Services / Doctors | Name, specialty, city and language filters; clear filters, result counts, portraits, experience, clinics, fee and explicit verification state. Empty catalogue and no-match states are distinct. |
| `/hekimler/[slug]` | Doctor | Full profile, qualifications, verification explanation, claim entry, clinics and contact details, available slots and existing member-scoped booking request flow. |
| `/hekim-panel` | Account / Doctor panel | Find and claim a listing, review status, edit profile, weekly availability, time off, confirm/decline appointments. Verification and booking availability are not editable profile fields. |
| `/laboratoriyalar` | Services / Laboratories | Name, city and home-collection filters, clear filters, counts, lab contact details, pagination and distinct empty states. An unchecked home filter is omitted from the request. |
| `/laboratoriyalar/[slug]` | Laboratory | Existing searchable catalogue, preparation before selection and on confirmation, basket, quoted lab prices, member selection, HOME-only address/phone requirements and request confirmation retained. |
| `/randevularim`, `/analizlerim` | Account / My appointments, My lab orders | Existing requests and cancellation, with appointment date grouping, doctor profile link, clinic phone, reason and record-access history entry. Cancelled appointments no longer say the record is shared. |
| `/blog`, `/blog/search`, `/blog/tag/[slug]`, `/blog/[slug]` | Account / Articles | Native list, language-aware search, tags, pagination, article content, author/date/reading time, related articles and sharing. Internal article links navigate within the app. |
| `/about`, `/contact`, `/faq` | Account information links | Native website content, FAQ disclosures, support email and chat links. |
| `/security`, `/privacy-policy`, `/terms-of-service` | Account information links | Native document layouts, table of contents, all website sections and privacy actions in AZ, EN and RU. |
| `/login`, `/register` | Sign in / Create account | Native email/password forms, website copy, password visibility, minimum registration length, terms acceptance, separate optional consents and recovery after interrupted consent saving. Google exception below. |
| `/logout` | Account / Sign out | Existing native sign-out and private-state cleanup. |

Device-only connected sources and record-access history remain available. Admin remains outside this patient-app conversion, consistent with the earlier scope.

## Remaining functional dependency

**Google sign-in needs a native callback/token handoff.** The backend currently redirects successful OAuth to the website's `/login/callback`. There is no native callback contract. The app cannot obtain a secure native session by opening that website link, so no misleading Google button was added. This prevents calling the app completely 1:1 in authentication. Email/password registration and sign-in work.

No backend endpoint or protected frontend file was changed to work around this.

## Keeping copy aligned

Run `cd mobile && npm run sync:website-copy` after reviewing website copy changes. It snapshots the website's general AZ/EN/RU dictionaries and its homepage, medicines, labs, doctor and auth copy into `mobile/src/copy/website`. Snapshots keep native builds independent of Next.js and its runtime.

Native output normalizes decorative punctuation where needed. Drug names and entered medical data are not transliterated. One missing website medicine translation key, the compact catalogue title, has a native EN/RU fallback.

Photos are the website's existing assets with the same credits. Native dates use the existing date helpers. SEO metadata and sitemaps remain the website's responsibility.

## Verification

- `npm run typecheck` and TypeScript unused-symbol checks.
- `npm test`: 23 existing unit tests, including permissions, consent, health-sync identity and unit handling.
- `npm run test:parity`: existing patient regression suite plus persistent navigation, medicine search in all three languages, native public pages, article links, doctor claim/profile/scheduling, authenticated inline document content and partial multi-file chat upload.
- Public API smoke checks against the existing backend on port 8002: medicines, doctors, labs and blog all returned 200.
- Signed iOS Release build and Android Release APK build, including the native PDF viewer.

Browser fixtures use synthetic data and intercept API requests. They do not create real appointments, claims or health records.

Real-device acceptance still includes PDF zoom/rendering, native upload pickers, HealthKit permission/sync on the iPhone and Health Connect on Android. Build success and browser tests do not establish those device results.

## Preview

- Native preview API: `http://100.89.150.50:8002/api`.
- Browser preview: `http://100.89.150.50:3003`.
- Main agent's port 3002 is unchanged.
- iOS app: `mobile/native-builds/derived/Build/Products/Release-iphoneos/azdocPreview.app`.
- Android APK: `mobile/android/app/build/outputs/apk/release/app-release.apk`.
