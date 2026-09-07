# Health documents and extraction review

Branch: `codex/document-reviews`, based on main `7f2816b`.

Three new tabs on `/health-record`: Documents, Lab results, Prescription review. They reuse the selected member and family role. The fourth addition is the persistent emergency notice on `/chat`.

## Deploy backend and frontend together

Two small backend changes are part of this branch. `ClinicalRecordService.medications()` now excludes unconfirmed prescriptions, which also protects the PDF summary that reads this list. `TimelineService` excludes both lifecycle events for an unconfirmed medication. Previously these endpoints could present extracted proposals as record data, and the ordinary medication DTO did not expose confirmation status for the frontend to distinguish them.

All four protected files are unchanged. No database migration or dependency change. The backend multipart limit is raised from 10 MB to 25 MB (26 MB total request allowance for metadata). This configuration change requires a backend restart.

## Behavior

- Authenticated multipart upload, 25 MB limit, readable server errors, duplicate document IDs deduplicated in the list.
- Extraction polls while pending/processing, stops on terminal status, and cancels on member change/unmount. Uploading another document remains available.
- SKIPPED and FAILED both state that the file remains saved. Manual entry opens existing health-record forms.
- Original documents load through authenticated blob requests. PDFs and browser-supported images display inline. Other formats, including unsupported HEIC/TIFF images, provide a download. Blob URLs and pending requests are cleaned up.
- Proposals have their own section and a persistent unconfirmed label. Missing prescription fields remain visible. Confirm, correct and reject are explicit per proposal; VIEWER sees none of the write actions.
- Only explicitly confirmed lab rows enter tables or charts. Charts separate units and show each result's numeric reference interval when the provided label can be parsed unambiguously. Qualitative or missing ranges remain text, without invented bounds.
- Urgent chat headers create a prominent call action. Ordinary later replies cannot remove it. It persists through reloads in the same browser tab, is scoped to the session/chat, and is absent in a new unrelated chat.
- New UI text is AZ/EN, with plain punctuation.

## Existing API limits surfaced honestly

There is no endpoint for creating a lab result manually. A failed extraction can lead to the existing medication/condition/allergy/immunization forms, but the UI does not pretend to save a manually entered lab result.

Lab corrections support numeric value/unit, not editing `valueText`. Medication confirmation ignores `prescriber` corrections, so that field is shown but not editable here. The confirmation endpoints ignore null corrections; clearing an existing extracted value is therefore blocked with an explanation instead of silently keeping it. The user can correct it or reject the proposal.

Reference bands come from `referenceLabel`; ambiguous or textual ranges are not charted. The UI displays the server's abnormal flags and does not perform a clinical reassessment after corrections.

Production and the port 3003 dev proxy use same-origin requests, so urgent response headers are readable. A client configured to call the backend cross-origin would additionally need those headers exposed by CORS.

## Validation

- Production Next build with type/lint gates enabled. `INTERNAL_API_URL=https://azdoc.ai/api` used only for the build's public sitemap reads.
- Frontend Node suite: 62 passed, 1 optional catalogue integration test skipped.
- Java 21: `ConfirmedMedicationVisibilityTest` and `ImmunizationUpdateTest`, 5 tests passed.
- Isolated headless Chrome with test fixtures: desktop/mobile documents, labs, prescriptions, correction dialog, AZ/EN and emergency banner; no page overflow or browser errors. No patient records created for these checks.
- Preview: `http://100.89.150.50:3003/health-record`, shared backend remains on port 8002.

## Upload proxy follow-up

The local preview was stopped when the upload failure was investigated; it is running again on 3003. Small unauthenticated multipart probes reach the real backend and return the expected 401. An 11 MB probe exposed the backend's 10 MB multipart cap and returned 413, not the reported 502. The original 502 has not yet been reproduced with the user's file.

The development proxy now preserves urgent chat headers, provides a readable message for an empty 413 response, handles bodyless response statuses correctly, and logs transport diagnostics without uploaded data or auth headers. Five proxy regression tests pass, including exact multipart byte/metadata forwarding. The 25 MB backend limit is committed here but is not applied to the shared running backend until restart/deployment by the main agent.
