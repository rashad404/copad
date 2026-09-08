# Connected homepage: implementation handoff

Reviewed against main commit `20c0900` on 2026-09-07. Homepage branch: `codex/connected-homepage`.

The homepage deliberately presents the complete product requested by the owner. It assumes the connections below are finished. Its interactive examples use fictional people and local state. They do not read personal records, call the assistant, create appointments or grant access. The main actions lead to existing product routes.

These are release dependencies for the complete experience described on the page, not requests for another homepage redesign. Recheck against newer backend work before implementing.

## What is connected already

- Signed-in chat sends the selected member ID. Health records and chat use the account-scoped `azdoc.member.${account}` selection key.
- `GuestController` adds record context, relevant document passages, specialty availability and local medicine context to answers.
- `RecordContextService` includes demographics, allergies, confirmed current medications, conditions, latest vitals, vital trends and confirmed lab results. Labs are capped at 12, latest per analyte, abnormal first.
- Documents, extraction review, manual lab entry, vitals, timeline, audit history, medicine search, doctor profiles and ordinary appointment requests already have product screens.
- PDF download exists. Consent, data export and deletion controls exist. An appointment request is distinct from a doctor's confirmation.

Do not rebuild these features. Complete their connections.

## 1. Open chat with a particular result or document

**Homepage promise:** A person can ask about the records they have just reviewed.

**Current gap:** Member selection reaches chat, but the record screen does not provide an item-specific chat handoff. Automatic context limits and passage matching do not guarantee that a particular older result will be included.

**Work:** Add an action on a result or document that opens chat with the authorized member and selected item. Show what is attached, allow it to be removed, and retrieve that item explicitly. Do not accept a member/item combination without checking ownership and access on the server.

**Acceptance:** Open an older confirmed result that is outside the latest-results context cap. Ask about it and receive an answer referencing that result, with a link back to its original document. Switching to another member removes incompatible attachments.

Relevant files:

- `next-frontend/src/components/health/HealthRecordPage.tsx`
- `next-frontend/src/components/GuestChat.tsx`
- `next-frontend/src/components/health/useChatMember.ts`
- `backend/src/main/java/com/drcopad/copad/service/RecordContextService.java`
- `backend/src/main/java/com/drcopad/copad/service/DocumentRetrievalService.java`

## 2. Make answer context and review status visible and reliable

**Homepage promise:** The answer identifies the records it uses. Unreviewed extracted values are not confirmed medical facts.

**Current gap:** The chat response is text plus urgency headers. The record context summary is logged rather than returned as structured source metadata. Lab context does not carry its MANUAL/EXTRACTED provenance. Document retrieval reads raw extracted text without an explicit confirmation-status rule, even though the structured lab and medication queries correctly filter for confirmation.

**Work:** Return authorized source metadata alongside the answer: member, attached record/document IDs, dates and provenance. Distinguish context supplied to the model from sources actually cited in an answer. Link citations to the authenticated viewer. If context retrieval fails, say records could not be included instead of displaying a grounded-answer indicator. Carry manual versus extracted provenance through the context. Prevent raw document passages from presenting pending, rejected or superseded extracted numbers and doses as confirmed values.

**Acceptance:** A deliberately wrong pending extraction does not become a confirmed fact through either structured context or a raw document passage. Corrected values supersede extraction errors. Manual entries remain labeled as manual. A context outage produces no false "records used" indicator. Sources always belong to the selected member.

Relevant files:

- `backend/src/main/java/com/drcopad/copad/controller/GuestController.java`
- `backend/src/main/java/com/drcopad/copad/service/RecordContextService.java`
- `backend/src/main/java/com/drcopad/copad/service/DocumentRetrievalService.java`
- `next-frontend/src/context/ChatContext.tsx`
- `next-frontend/src/components/GuestChat.tsx`

## 3. Recommend real doctors and request an appointment from chat

**Homepage promise:** azdoc can propose a doctor and a time, then let the user review and confirm an appointment request in the conversation.

**Current gap:** `SpecialtyReferralService` provides specialty availability and explicitly instructs the model never to name an individual doctor. The Responses tools do not implement doctor lookup, slot selection or booking. Ordinary directory booking works separately.

**Work:** Add server-backed doctor search and slot lookup, followed by a structured appointment proposal in chat. Only bookable listings and current slots can be offered. Before creating a request, show doctor, clinic, member, date/time, fee where known, and sharing choice. Creation requires an explicit user confirmation, with duplicate submission protection and slot revalidation. Keep UNCLAIMED/PENDING separate from VERIFIED. Handle an empty directory or no slots plainly.

**Acceptance:** A chat recommendation links to a real matching listing. A fabricated or unavailable slot cannot be booked. A created request appears in My appointments as REQUESTED until the doctor confirms it. No appointment is created merely by generating an answer.

Relevant files:

- `backend/src/main/java/com/drcopad/copad/service/SpecialtyReferralService.java`
- `backend/src/main/java/com/drcopad/copad/service/OpenAIResponsesService.java`
- `backend/src/main/java/com/drcopad/copad/service/BookingService.java`
- `next-frontend/src/components/booking/BookingPanel.tsx`
- `next-frontend/src/components/GuestChat.tsx`

## 4. Preserve the selected member through the whole visit flow

**Homepage promise:** The records, answer, summary and appointment refer to the same person.

**Current gap:** `BookingPanel` selects the self member, or the first member, when families load. It does not inherit the member selected in records/chat. Chat and health records already share a persisted selection; booking needs to join that flow.

**Work:** Reuse a common authorized selection through records, chat, booking and summary actions. Keep the person's identity visible. Do not silently substitute another person when access or membership changes. Reset the pending appointment proposal and sharing choice when the member changes.

**Acceptance:** Select Ayan in records, ask a question, open a suggested doctor and request a visit. Every step still names Ayan. Changing to Rauf requires reviewing the new appointment and sharing choice. An inaccessible saved member produces a new selection request, not a fallback booking for the account owner.

Relevant files:

- `next-frontend/src/components/health/useChatMember.ts`
- `next-frontend/src/components/health/HealthRecordPage.tsx`
- `next-frontend/src/components/booking/BookingPanel.tsx`

## 5. Turn the record-sharing choice into actual doctor access

**Homepage promise:** A patient can review what they share and make it available to their chosen doctor for a visit.

**Current gap:** Booking stores `sharedRecord` and the doctor booking response exposes `recordShared`. In the reviewed code, this is a flag, not an implemented doctor record-access endpoint or reader in the doctor portal. The current checkbox also does not select which information to share.

**Work:** Implement the patient preview/selection and a booking-scoped sharing grant or snapshot. Authorize the linked doctor before every read or file fetch. Add the reader to the doctor portal. Define expiry and withdrawal behavior, and audit access. Keep unrelated family members and unselected records outside the grant. A sharing checkbox must correspond to access that actually exists.

**Acceptance:** The chosen doctor can open only the authorized material. Another doctor cannot open it by guessing an ID. Unshared bookings expose no record data. Withdrawal or expiry removes access according to the stated policy. Pending proposals remain distinct from confirmed results wherever shown.

Relevant files:

- `backend/src/main/java/com/drcopad/copad/service/BookingService.java`
- `backend/src/main/java/com/drcopad/copad/controller/BookingController.java`
- `backend/src/main/java/com/drcopad/copad/controller/DoctorSelfController.java`
- `next-frontend/src/app/hekim-panel/page.tsx`
- `next-frontend/src/components/booking/BookingPanel.tsx`

## 6. Bring the downloadable PDF up to the example shown

**Homepage promise:** The doctor summary includes allergies, medications and recent lab results, with readable localized headings and a source reference.

**Current gap:** `RecordExportService.summaryPdf` includes allergies, current medications, conditions, vitals and immunizations, but no lab results. Its headings are English and vitals use canonical units. The bundled Unicode font supports Azerbaijani characters; that does not localize the headings.

**Work:** Add recent confirmed lab results with dates, supplied reference ranges and MANUAL/EXTRACTED provenance. Include document references without exposing unauthenticated file URLs. Localize the handout into AZ, EN and RU. Preserve entered units for vitals. Keep critical allergies prominent and missing data labeled as not recorded. Provide a direct summary intent from the homepage action if useful; the current homepage action opens Health records, where download already exists.

**Acceptance:** The selected member's reviewed hemoglobin result appears in the downloaded PDF, alongside the correct allergy and medication. Pending results do not. A manually typed result is labeled manual. AZ and RU headings render correctly. Entered units match the record screen.

Relevant files:

- `backend/src/main/java/com/drcopad/copad/service/RecordExportService.java`
- `backend/src/main/java/com/drcopad/copad/service/ClinicalRecordService.java`
- `next-frontend/src/components/health/HealthRecordPage.tsx`

## Final integrated check

Use a test family with three different records. Upload and correct one result, leave another pending, and add one manual result. Ask about an older document, follow a real doctor proposal, review a booking and sharing choice, then open the record as the chosen doctor and download the localized PDF. Confirm identity, provenance, review state and consent survive every step. Verify the signed-out and VIEWER paths separately.

The homepage examples use fixed fictional dates and prices, clearly labeled. Their appointment times are not live availability and their price comparison is not a quotation from the medicine catalogue.
