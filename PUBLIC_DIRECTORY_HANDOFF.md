# Public doctor directory

Branch: `codex/public-doctor-directory`

## Delivered

- `/hekimler`: server-rendered name, specialty, city and language filters, pagination, individual results, distinct empty-directory / empty-search / API-error states.
- `/hekimler/[slug]`: public profile, localized metadata, canonical URL, explicit public-only Person and MedicalClinic structured data.
- Unclaimed and pending listings have neutral labels and explanations. Only VERIFIED shows a check. Unknown states are conservative. Unclaimed doctors can email the existing `info@azdoc.ai` contact to request ownership; no unsupported claim submission is implied.
- Bookable profiles fetch current slots using the public numeric doctor ID. Slots show Baku times and explicitly do not imply a reservation. No booking POST or fake booking button was added. Other profiles show clinic phone contacts.
- Doctor sitemap shards and robots discovery, plus the directory in the main sitemap. Empty launch works; sitemap data refreshes after 5 minutes.
- AZ, EN and RU. Native interface copy; doctor/clinic names and biographies remain the API's original text.
- Added Doctors to shared navigation. Extended the public catalogue SSR exception in providers to doctor pages, so the body is present without JavaScript. First-time directory visitors see AZ consistently unless they have chosen a language.

## Backend integration and remaining contract gap

Matched `DoctorController` from main, including `id`, Spring Page, slots `{startsAt, endsAt, clinicId}` and the medicine-style sitemap payload. `400` with `message: "Doctor not found"` becomes Next notFound, not a generic service failure.

**Separate clinic URLs in the sitemap are not implemented.** The supplied API and the new controller have no public clinic lookup or clinic sitemap entries, and no public clinic page exists. Clinic details are rendered and included in each doctor's structured data. Do not publish nonexistent `/klinikalar/...` URLs. To finish this specific requirement, supply a public clinic detail lookup and sitemap source, or confirm a different intended clinic URL model.

`GET /api/specialties` currently returns 401 publicly. The directory tries this existing resource and falls back to localized common specialty codes. Publish a safe public specialty list to include admin-added custom codes automatically. No admin API is called or exposed publicly.

Slot `clinicId` cannot be matched to the current public clinic DTO because that DTO has no numeric ID. The UI tells the visitor to confirm the clinic by phone rather than guessing. Optional clinic ID support is already present if added to the DTO.

## Validation

- Production build passes with existing build gates enabled.
- Full frontend suite: 110 passed, 1 existing optional integration test skipped.
- Nine focused directory tests cover empty states, failure, one result, filters, verification semantics in all locales, metadata/schema allowlisting, contact-only profiles, slots and Baku date boundaries.
- Production-build browser fixture checks at desktop and 390px mobile: empty and one-result pages, profile, Russian, slots, crawler 404, sitemap response, real initial HTML and structured data, no horizontal overflow or browser page errors. Fixtures were temporary, never added to public data.
- Live production API returns 200 and zero doctors as expected.
- Protected files untouched: `src/api/apiBase.ts`, `src/api/serverFetch.ts`, `src/utils/analytics.ts`, `next.config.js`.

## Preview and merge

Frontend port stays 3003. The shared development backend at port 8002 was unavailable at handoff, so this directory preview uses the production API for its read-only server fetches. No production writes, merge or deployment performed.

Merge this branch after the public doctor API commit on main. The clinic sitemap requirement remains a separately identified API/route gap as described above.
