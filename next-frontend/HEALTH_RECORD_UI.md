# Health record UI handoff

Route: `/health-record` (authenticated). Accessible from the shared account menu and dashboard.

## Timeline and PDF summary

- Timeline fetches `/members/{id}/timeline?limit=100` and preserves the backend's clinical-date ordering. Medication starts and stops are separate rows, even for the same record ID. Notable entries have both a text label and a contrasting treatment. The tab explains why only abnormal vitals appear and links to the full Vitals view.
- The member header's summary action is available to VIEWER accounts too. It uses the existing JWT-bearing Axios client, `responseType: blob`, and `/members/{id}/summary.pdf`. The PDF is downloaded without decoding or changing its bytes or language.
- Summary and timeline reads are cancelled on member changes. Duplicate summary requests are prevented; object URLs are released. JSON/text blob errors are displayed with a retry action.
- These two endpoints are already deployed; this addition changes no backend code.


- The member switcher stays above all record tabs. Selection persists by account; only the selected member ID is stored locally. Changing members unmounts the previous record and aborts reads so a late response cannot populate another member's screen.
- Overview shows backend-derived age, corrected age for preterm children, blood type, latest measurements, and counts of recorded entries. Empty records mean no data entered, not absence of a condition.
- Conditions, allergies, medications, and immunizations support add/edit/remove. Critical allergies stay visible across tabs. Clinical history shows the backend audit trail.
- Vitals preserve `valueEntered` and `unitEntered` in summaries, the chart and history table. Different entered units are charted separately. Trend direction and percentage come from the backend, without assigning a good/bad interpretation. Abnormal flags have explicit text labels.
- OWNER/ADULT have write controls; VIEWER and unknown roles do not. Backend authorization remains authoritative. Forms keep inputs and show readable API error messages.
- New copy is AZ/EN. The full language selector remains available.

## Backend dependency

The existing backend had no immunization update endpoint. This branch adds:

`PUT /api/members/{memberId}/immunizations/{id}`

It checks write access, checks that the record belongs to the requested member, updates the existing row, and appends an UPDATED audit revision. Deploy the backend addition with the UI. The current running backend will reject immunization edits until this addition is deployed.

No changes to `src/api/apiBase.ts`, `src/api/serverFetch.ts`, `src/utils/analytics.ts`, or `next.config.js`.

## Validation

- Frontend production build and TypeScript validation pass (existing repository warnings remain).
- `node --test tests/health-record.test.mjs tests/health-record-dom.test.cjs`: 22 passing tests, including DOM interactions with mocked authenticated APIs, cross-member response isolation, read-only controls, original units, critical flags, failed saves, clinical timeline events, JWT summary requests, cancellation, and unchanged PDF bytes.
- `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home ./mvnw -Dtest=ImmunizationUpdateTest test`: 3 passing tests, covering persistence/audit, denied write access, and cross-member rejection.
- No real patient records were created or edited during validation. Authenticated browser interactions and visual screenshots were not tested.

## Local preview

Run the isolated worktree frontend on port 3006. Its ignored `.env.local` uses:

```
NEXT_PUBLIC_API_URL=/dev-api
DEV_API_PROXY_TARGET=http://100.89.150.50:8002/api
INTERNAL_API_URL=http://100.89.150.50:8002/api
```

Preview: `http://100.89.150.50:3006/health-record` (sign in required).
