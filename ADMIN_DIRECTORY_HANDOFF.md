# Doctor and clinic admin

Branch: codex/admin-doctors-clinics

## Screens

- /admin/clinics: paginated CRUD, generated slug displayed read-only, Baku default, optional coordinates with range validation.
- /admin/doctors: paginated CRUD with server-side specialty and verification filters. Specialty options come from /api/admin/specialties; clinic options include every page of /api/admin/clinics. Languages and clinics use shared multi-select fields.
- Both screens use ResourceTable, ResourceForm and config objects, with a shared DirectoryResource wrapper for CRUD orchestration. Shared forms gained read-only fields and multi-selects; optional numeric nulls are valid.
- Added both routes to the admin navigation. All interface copy is English.

## Meaning of listing states

- UNCLAIMED is neutral gray, without a checkmark or endorsement. PENDING, VERIFIED and REJECTED have explicit labels. The verification state and timestamp are read-only in the doctor edit form.
- Review verification is a separate form requiring a selected new state and an explicit review acknowledgment. It sends only verification and optional note to POST /api/admin/doctors/{id}/verification. Ordinary CRUD payloads exclude verification and verifiedAt.
- Active listing and Accepts bookings are separate fields and table columns. New doctors default to UNCLAIMED with bookings off. Enabling bookings asks whether appointments can actually be fulfilled; cancelling prevents the save.
- Unknown consultation fees stay null. Zero is treated as a free consultation.

## API assumptions

The paginated list endpoints return the existing Spring page shape: content, totalElements, totalPages, number and size. Each list row contains the full editable DTO because the supplied contract has no GET-by-id endpoint. Doctor slug is an ordinary optional edit field; clinic slug is server-generated and excluded from writes.

## Validation

- Production build passed with existing lint/type gates enabled.
- 107 frontend tests passed; 1 optional live-catalogue SSR test skipped. Six new tests cover payload isolation, neutral unclaimed status, deliberate verification, booking confirmation, full clinic option loading, filters and readable errors.
- Browser checks passed on desktop and mobile: clinic creation, doctor editing, separate verification, payload isolation and responsive forms. No runtime errors. All API writes used intercepted fixtures because the endpoints are being built separately. No real listings were created or verified.
- Protected files unchanged. No backend changes or dependency additions.

Preview uses port 3003 and the existing backend proxy on 8002. Merge and deploy when the backend endpoints are ready.
