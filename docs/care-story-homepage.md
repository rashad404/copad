# Homepage direction: making room for life

Branch: `codex/care-story-homepage`. Based on `codex/connected-homepage` at `a4961c9`. The previous branch remains intact as the product-led alternative.

## Direction

Lead with the human benefit of less effort arranging care and more time with loved ones. The hero uses real illustrative photography and one small appointment example. The existing palette, typography, brand slogan, shared header and footer remain.

The page follows recognition of the problem, a connected question-to-visit example, helping relatives from a distance, continuing after the visit, privacy and a direct invitation to ask a question. AZ copy was composed first; EN and RU carry the same intent. The title and footer keep the approved brand slogan.

Personality: warm through photography and language, capable through a concrete connected journey, calm through restrained composition and unhurried reading.

## Demonstration behavior

- The hero's appointment note opens the final stage of the example.
- The three stages show an answer using family records, time selection, and a doctor-confirmed visit with a summary.
- The selected time carries through the example. Changing it clears the illustrative sharing choice.
- The final stage is an example of the state after a doctor confirms. Advancing the example is not an appointment submission or a doctor's actual confirmation.
- Family choices explain different uses. They do not select a real patient or change the account's persisted member.
- Sample controls make no API writes. The actual actions open chat, the directory, records, registration and the medicine catalogue.
- Signed-in visitors have direct links back to chat, records and appointments.

Photos are credited inline and in `next-frontend/public/images/home/credits.md`. The people shown are not patients or endorsers and are not assigned the fictional record details. No generated photography, fabricated testimonials or customer statistics are used.

## Backend and product handoff

The six connections in [the integration handoff](connected-homepage-integration-gaps.md) remain relevant. This direction assumes the completed experience the owner requested. It does not implement those integrations.

The follow-up section also describes appointment reminders. Notification delivery and preference work was visible in the main workspace during review, but was not part of this branch's base commit. Claude should finish and verify scheduling, delivery, language, preferences, cancellation handling and retries before treating the reminder promise as delivered.

The broader roadmap's live clinician consultations, lab ordering and device imports can extend the existing story. This page does not promise round-the-clock access to a human doctor, guaranteed outcomes, or instant doctor confirmation.

## Preview authentication recovery

The reported `/user/me` 502 came from an unavailable preview backend. The backend was reachable again during this work. The auth handler now preserves stored credentials on transport/server failures, removes stale verification, and retries on window focus or reconnection. Explicit 401/403 rejection still removes credentials. This is a separate corrective change from the homepage presentation.

## Verification

Type checking, production build, homepage interactions, auth recovery, existing Russian dictionaries and mobile navigation tests. Browser checks cover AZ/EN/RU, 1440/390/320 px, every journey stage, family choices, sharing reset, photo loading, FAQ, menu dismissal and initial HTML without JavaScript.
