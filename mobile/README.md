# azdoc mobile

The patient app uses React Native and Expo SDK 53. It follows the current website's brand, member-scoped health record and API contracts. Azerbaijani is the default; English and Russian are available under Account.

## Build the native iPhone preview

With Xcode, the iOS platform component, CocoaPods and your Apple development team configured:

```sh
npm ci
APPLE_TEAM_ID=YOUR_TEAM_ID npm run build:ios:preview
```

This creates `native-builds/derived/Build/Products/Release-iphoneos/azdocPreview.app`, signed for development. It embeds the app's JavaScript and runs without Metro. Install it on a device covered by your development profile using Xcode or `xcrun devicectl device install app --device DEVICE_ID PATH_TO_APP`.

The preview has its own name and identifier (`azdoc Preview`, `ai.azdoc.app.preview`) and uses the Tailscale backend on port 8002. It does not replace an eventual production app. `app.config.js` enables HTTP only for the preview variant; the production variant uses HTTPS and the identifier `ai.azdoc.app`.

For Android, with JDK 17 or 21 and Android SDK 36 installed, run `npm run build:android:preview`. This creates `android/app/build/outputs/apk/release/app-release.apk` for arm64 phones. It uses the generated project's debug signing key for local testing, has an embedded JavaScript bundle and needs no Metro server. Install with `adb install -r android/app/build/outputs/apk/release/app-release.apk`. It is a preview APK, not a store-signed release. EAS builds remain available with access to the existing Expo project.

The compatibility plugin in `plugins/with-fmt-compat.js` narrowly handles fmt 11.0.2 with newer Apple Clang. Generated Xcode/Gradle projects and local build output are ignored by git and can be regenerated.

## Run the optional browser preview

```sh
npm ci
npm run dev
```

Open http://100.89.150.50:3003 in a browser on Tailscale. This is a responsive preview of the native screens, not the Next.js website. `npm run dev` uses port 3003 and refuses to stop a server belonging to a different checkout. It leaves the main agent's port 3002 alone. It runs Expo without file watching; restart it after changes.

For interactive development with reloads, stop the verified preview from this checkout and use `npm start`. `npm run ios` and `npm run android` compile native debug builds using the local platform tools and port 3003. Do not assume the current store version of Expo Go supports SDK 53.

See [environment setup](ENVIRONMENT_SETUP.md) for backend and device configuration.

## Patient flows

- Home: selected family member, critical allergies, pending review count and direct care actions.
- Chat: guest and authenticated conversations, attachments, history, member grounding, a standing medical notice and a persistent emergency notice when the API signals urgency.
- Records: family member creation/editing, overview, conditions, allergies, medications, immunizations, vitals, clinical timeline and audit history.
- Documents: authenticated file upload/download/sharing, extraction progress, saved-but-unreadable states and manual result entry.
- Review: extracted lab values and prescription proposals remain distinct from confirmed records. Correct, accept or reject proposals. Confirmed lab trends show their source and separate units.
- Services: doctor, medicine and laboratory directories. Doctor appointment requests, medicine alternatives and member-specific allergy warnings, test baskets and home collection requests.
- Account: appointments and lab orders, cancellation, personal information, consent history, record-access history, export, permanent deletion and AZ/EN/RU selection. Appointment sharing explicitly ends on cancellation.
- Connected sources: native read permissions, provider connections, manual and foreground sync, server cursors, uploads of at most 500 readings, and visible counts for added, existing, manual-priority, rejected and locally invalid readings.

VIEWER access hides member record writes. Appointment and lab submissions are requests, not confirmed appointments or payments. Registration permits record storage consent without AI processing consent. Incomplete consent saving survives a restart and blocks chat until resolved.

Files are fetched with the JWT. Native downloads open the operating system's share/open sheet; the browser preview downloads them. There is no embedded PDF/image viewer in this version. Temporary shared files are deleted after a short delay to allow the receiving app to read them.

## Structure

- `App.tsx`: providers and five persistent tabs, each with its own navigation stack and shared azdoc header. Switching tabs preserves the current screen and history. Form sheets remain focused overlays; tabs hide while the keyboard is open.
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

Before store release, confirm the production app identifiers and signing setup, then test the patient flows on actual iOS/Android devices. In particular, verify keyboard/safe areas, native date input, document selection, authenticated file sharing and interruption/resume behavior. Native build and launch checks do not establish full patient-flow validation on a phone.

This rebuild retains the SDK 53 platform line. Compatible dependency security patches are applied, but the inherited Expo/Metro/navigation dependency tree still has audit findings that require a separately validated platform upgrade or upstream fixes. Do not run `npm audit fix --force` blindly.

This version does not add push notifications, automatic AI booking actions, OS background delivery, offline medical-record storage, app links or an embedded document viewer. Legal and contact pages open the existing website. Those are separate native capabilities, not claims made by the controls here.

## Device sync integration and remaining verification

Connected sources is under Records. The connection is bound to the signed-in person's own member profile on this phone; changing the selected family member does not redirect phone data into a child's record. VIEWER has no write actions. Every sync rechecks family access and the server's enabled connection. Disconnect stops local automatic sync immediately, retains imported records and explains where to revoke OS read permission.

Initial sync reads the last 30 days. Subsequent runs resume from `syncedThrough`, interpreted as UTC because device instants are submitted as UTC ISO strings. The backend must use the same UTC convention, including its current-time and manual-reading comparisons. The current shared local backend reports `America/Chicago`, so recent UTC readings can be rejected as future readings; its owner should run it with `TZ=UTC`. All permitted types are combined chronologically within each read window before upload so a partial failure does not advance the common cursor past an unread type. Partial counts are retained locally without storing the underlying measurements.

Apple Health uses the platform UUID unchanged and requests read access only. Read refusal is private on iOS, so an empty read is never presented as proof that access was granted. Oxygen saturation converts the HealthKit fraction to a percentage as documented by [Apple](https://developer.apple.com/documentation/healthkit/hkunit/percent%28%29). Head circumference is not supported by this integration.

Health Connect requests supported read permissions only. Its permission-rationale entry opens a localized native explanation with a privacy-policy link. Waist and head circumference are not supported by the platform.

Health Connect blood-pressure pairs and heart-rate series retain the platform record ID unchanged. The backend now identifies each reading by sourceRef + type + measuredAt within the member/source scope. Both BP values and all timestamped heart-rate samples upload; a resend remains idempotent. Requires backend migration V36 or later. The previous client pause for compound records has been removed.

Run native device acceptance checks for permission refusal, limited access, reconnect, foreground resume, >500 samples, manual-priority counts, interrupted upload, and account/member isolation. Automated native-adapter tests use synthetic readings; they do not establish physical-device validation. Do not test with a real person's health data without their deliberate connection and permission choices.

Navigation regression checks:

```sh
BROWSER_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node tests/navigation-browser.cjs
```

To verify compound Health Connect samples against the running development backend, first confirm port 8002 is using the local profile and `copad_dev`, then run:

```sh
AZDOC_LOCAL_INTEGRATION=1 node tests/health-sync-local.cjs
```

This opt-in check uses only `127.0.0.1:8002`. It creates one synthetic account, uploads a BP pair and three heart-rate samples, verifies the resend is counted as duplicates, reads back the series counts, and deletes the account and its records in cleanup. It does not connect to production or use an existing person's credentials. Synthetic readings are dated one day back, so this identity test does not mask its result with the separate local timezone problem.
