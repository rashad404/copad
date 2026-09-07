# Privacy and consent

Branch: codex/privacy-consent

## Delivered

- Separate, unchecked RECORD_STORAGE and CROSS_BORDER_AI choices at registration. Declining AI does not block registration. A failed consent save can be retried without registering again or inventing consent.
- /profile/privacy, linked from the account menu and profile. Current choices, grant/withdraw dates, policy versions and complete consent history. Guardian withdrawals are scoped to the named member.
- Authenticated ZIP export, read-only member restrictions, permanent member/account deletion confirmations and server-returned removal counts. Account deletion requires the password, preserves readable 403 errors and signs out locally after success.
- AZ, EN and RU copy and privacy policy. Names OpenAI and transfer to the United States, health data categories, purposes, recipients, anonymous conversation retention of 90 inactive days, rights and contact.
- Chat surfaces the readable backend refusal message.

## Backend must deploy before frontend

The existing DELETE consent endpoint did nothing before an initial grant. V19 makes granted_at nullable so an initial refusal can be stored without falsely recording agreement. Existing users with no recorded decision retain existing behavior. The frontend verifies that a refusal actually persisted.

Guardian withdrawal accepts optional familyMemberId in the query and requires it for GUARDIAN, avoiding withdrawal of an arbitrary member's declaration.

The document extraction job checks the uploader's refusal before processing. Local PDF/Office/text extraction remains available. External OCR is skipped after refusal, and the UI explains that the file is saved and manual lab entry is available. This does not cancel a provider request already in flight.

## Validation

- Frontend suite: 101 passed, 1 optional live-catalogue check skipped.
- Backend: 11 consent tests and 2 document-consent tests passed.
- Browser fixtures: withdrawal cancellation, withdrawal/re-grant, authenticated ZIP download, VIEWER, member deletion, wrong-password 403, account deletion/sign-out/receipt, registration partial failure and retry, AZ/EN/RU policy and mobile layouts. All writes intercepted, no production patient data changed.
- Production build passes with build gates enabled. Protected files unchanged.
- Preview port 3003, shared backend 8002 unchanged.

## Policy detail awaiting Rashad

The legal operator name and published address have not been supplied. The policy currently identifies the service as azdoc and uses the existing published info@azdoc.ai contact. Confirm and add the legal identity before treating this as a finalized legal notice. No entity or address was invented. The policy does not claim instant backup/provider deletion or legal certification.

Provider background used while drafting: https://openai.com/business-data/

This branch does not implement new-member guardian attestation collection, universal enforcement of RECORD_STORAGE refusal across clinical writes, or a redesign of legacy alternate AI endpoints.
