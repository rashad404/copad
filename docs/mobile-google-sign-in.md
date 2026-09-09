# Native Google sign-in

The native login screen offers Google in builds connected to `https://azdoc.ai/api`. It uses the supplied start, callback and exchange contract. The browser preview retains email/password sign-in.

## Flow

- Expo Crypto generates 32 cryptographically random bytes using `getRandomBytesAsync`. A base64url verifier and its SHA-256 challenge have no padding. The verifier exists only inside the running attempt in memory.
- `WebBrowser.openAuthSessionAsync` opens the HTTPS start endpoint. The build config supplies `preview` or `release` independently of JavaScript development mode.
- The allowed return is exactly `azdoc-preview://login/callback` or `azdoc://login/callback`. Unexpected schemes, hosts, paths, duplicate codes and any error parameter never reach exchange.
- The unauthenticated exchange client posts the original verifier and the returned code once. It has no retry interceptor and never attaches an existing JWT.
- Successful exchange is followed by `/user/me` to resolve the account ID. The token uses the same OS keychain storage as email sign-in, then the usual account and family screens mount. Google sign-in grants no new storage or AI consent. Previously interrupted registration choices remain pending.
- Busy, expiry, malformed responses, network failures and rejected exchanges have the same inline retry message. Retrying generates a new verifier and start request. Browser cancellation is quiet.
- Leaving the screen aborts the attempt. A five minute deadline aborts exchange or closes a pending browser. Late responses cannot sign in. A process restart loses the verifier and requires a new attempt.

Reference: [Expo system auth browser](https://docs.expo.dev/versions/latest/sdk/webbrowser/). The installed modules were selected with `expo install` for SDK 53; native package types were checked against that installed version.

## API environment and saved state

Do not obtain a production token and send it to the HTTP dev backend. Google is available only when the app's configured API is the production HTTPS API. A native dev build explains that email sign-in remains available instead.

Native tokens, pending consent choices, member selection, chat session IDs, emergency chat state, health-source binding and last sync report use keys scoped to the full API URL. Old unscoped state is not imported because its backend cannot be established safely. After updating, sign in again, select a member and reconnect device sync if desired. Switching the API does not authorize uploading phone readings to a different backend.

This change does not delete records or modify backend identity. Browser preview storage and API remain unchanged.

## Build and install

From `mobile/`, build the production-connected preview used for Google testing:

```sh
APPLE_TEAM_ID=8DM7XMY7UD EXPO_PUBLIC_API_URL=https://azdoc.ai/api npm run build:ios:preview
EXPO_PUBLIC_API_URL=https://azdoc.ai/api npm run build:android:preview
```

These are preview bundle IDs and schemes with production data. Email/password also uses production in these builds. Normal preview build commands still default to the existing dev backend on port 8002. The browser preview still uses port 3003. No backend instances or Google Cloud settings change.

New Expo Crypto and WebBrowser native modules require a native rebuild and install, not just a Metro reload.

Artifacts:

- iOS: `mobile/native-builds/derived/Build/Products/Release-iphoneos/azdocPreview.app`
- Android: `mobile/android/app/build/outputs/apk/release/app-release.apk`

## Verification

Automated protocol tests cover the RFC 7636 challenge vector, random-byte encoding, both variants, exact callbacks, busy, cancellation, expiry, simultaneous taps, late responses and fresh attempts after failed exchanges. Native adapter tests check the configured callback, HTTPS exchange without an existing JWT and environment-isolated storage. The existing patient/browser regression suite checks email sign-in and registration alongside records and navigation.

Live production smoke checks on 2026-09-08: start returned 302 with a Secure cookie and HTTPS redirect for both variants; a synthetic invalid exchange returned 401. These checks did not sign into Google or create a user.

Validation completed for this branch:

- Typecheck and unused-symbol checks passed.
- 33 unit tests passed.
- Full `test:parity` browser suite passed, including email registration, consent refusal and account/session flows.
- Signed iOS preview and Android APK builds passed with the production API.
- iOS preview installed on the paired Rashad-16 iPhone. Its embedded scheme and auth variant both resolve to preview.

Device acceptance remains:

1. Open azdoc Preview, choose Account, Sign in, Continue with Google. Approve the OS browser prompt and choose your own Google account.
2. Confirm return to the app, correct account and correct family records. Close and reopen to check persistence.
3. Sign out. Start Google again and cancel; the login screen should remain usable. Try again to complete a fresh attempt.
4. Check the same flow on Android and a release-scheme build. Desktop/browser tests cannot establish system auth-session behavior on those devices.

Do not include callback codes, verifiers, JWTs, Google account details or clinical data in logs or screenshots used for testing.
