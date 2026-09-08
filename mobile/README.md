# azdoc mobile

The patient app uses React Native and Expo SDK 53. It follows the current website's brand, member-scoped health record and API contracts. Azerbaijani is the default; English and Russian are available under Account.

## Run the preview

```sh
npm ci
npm run dev
```

Open http://100.89.150.50:3003 in a browser on Tailscale. This is a responsive preview of the native screens, not the Next.js website. `npm run dev` uses port 3003 and refuses to stop a server belonging to a different checkout. It leaves the main agent's port 3002 alone. It runs Expo without file watching; restart it after changes.

For interactive development with reloads, stop the verified preview from this checkout and use `npm start`. Native devices need a development client compatible with SDK 53. Do not assume the current store version of Expo Go supports an older SDK.

See [environment setup](ENVIRONMENT_SETUP.md) for backend and device configuration.

## Patient flows

- Home: selected family member, critical allergies, pending review count and direct care actions.
- Chat: guest and authenticated conversations, attachments, history, member grounding, a standing medical notice and a persistent emergency notice when the API signals urgency.
- Records: family member creation/editing, overview, conditions, allergies, medications, immunizations, vitals, clinical timeline and audit history.
- Documents: authenticated file upload/download/sharing, extraction progress, saved-but-unreadable states and manual result entry.
- Review: extracted lab values and prescription proposals remain distinct from confirmed records. Correct, accept or reject proposals. Confirmed lab trends show their source and separate units.
- Services: doctor, medicine and laboratory directories. Doctor appointment requests, medicine alternatives and member-specific allergy warnings, test baskets and home collection requests.
- Account: appointments and lab orders, cancellation, personal information, consent history, export, permanent deletion and AZ/EN/RU selection.

VIEWER access hides member record writes. Appointment and lab submissions are requests, not confirmed appointments or payments. Registration permits record storage consent without AI processing consent. Incomplete consent saving survives a restart and blocks chat until resolved.

Files are fetched with the JWT. Native downloads open the operating system's share/open sheet; the browser preview downloads them. There is no embedded PDF/image viewer in this version. Temporary shared files are deleted after a short delay to allow the receiving app to read them.

## Structure

- `App.tsx`: providers, native stack and five primary tabs.
- `src/core`: API configuration, secure session storage, family selection, localization, validation and file handling.
- `src/api`: typed contracts and request helpers aligned with the website/backend.
- `src/screens`: patient screens.
- `src/ui`: shared controls, sheets, native date input and measurement charts.
- `src/copy`: AZ/EN/RU product wording; `src/utils/dates.ts` handles Azerbaijani date names.
- `tests`: contract/validation tests and synthetic browser fixtures.

The app does not import Next.js modules. Backend contract changes need corresponding updates in the native request helpers. Native JWTs and conversation identifiers use SecureStore. The browser preview uses tab-scoped session storage for credentials. Medical response bodies and credentials are not logged.

## Checks

```sh
npm run typecheck
npm test
CI=1 EXPO_OFFLINE=1 npm run export
```

With a preview running on 3003 and Playwright Chromium installed:

```sh
npm run test:browser
```

An existing Chrome installation can be used instead:

```sh
BROWSER_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:browser
```

The browser suite intercepts API requests and uses synthetic people, records and orders. It must not create real patient data. It checks corrected and manual results, grounded chat, emergency persistence, home collection, registration refusals, appointment requests, medicine warnings, VIEWER access, privacy withdrawal/deletion and Russian profile editing.

## Native release work

JavaScript/Hermes exports are not signed device builds. Before release, configure the existing EAS project's approved iOS bundle identifier and Android application ID, build a development client, and test on actual iOS/Android devices. In particular, verify keyboard/safe areas, native date input, document selection, authenticated file sharing and interruption/resume behavior. No available simulator device was installed on the development Mac during this rebuild.

This rebuild retains the SDK 53 platform line. Compatible dependency security patches are applied, but the inherited Expo/Metro/navigation dependency tree still has audit findings that require a separately validated platform upgrade or upstream fixes. Do not run `npm audit fix --force` blindly.

This version does not add push notifications, HealthKit/Health Connect import, automatic AI booking actions, background sync, offline medical-record storage, app links or an embedded document viewer. Legal and contact pages open the existing website. Those are separate native capabilities, not claims made by the controls here.
