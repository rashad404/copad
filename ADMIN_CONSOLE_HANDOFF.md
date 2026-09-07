# Admin console handoff

Branch: `codex/admin-resources-usage`

## Changes

- Tags use ResourceTable and ResourceForm: list/search name and slug, display the exact supplied postCount, create, rename via PUT, and delete with an attached-post count confirmation. All writes use `/api/admin/blog/tags`. No production tags were changed during verification.
- `/admin/usage` consumes the live usage contract. Today's spend and ceiling come first, with an explicit ceiling-reached state. Includes 7/30/90-day selection, refresh, daily chart and table, model breakdown, and precise per-call averages. Aggregate money uses two USD decimals; per-call amounts use six, with `< $0.000001` for smaller positive amounts. Errors hide stale totals and allow retry.
- Settings is removed from both admin menus. Old `/admin/settings` links redirect to `/admin`.
- Posts and users now use the shared resource layer, including actual server pagination and shared mutation errors. Search and filters are explicitly scoped to the loaded page because the APIs have no search/filter parameters.
- Post create/edit share one ResourceForm-based editor with rich text, sanitized content preview, image upload, tag creation/selection, content language, and draft/published state. Saving is blocked while an image or tag is being created. Bulk deletion now calls its existing API.
- Admin navigation, dashboard and editor labels are English without changing the site's language preference. The existing specialty form still uses the shared components.

## Contract mismatches corrected during migration

- Backend post DTOs accept `tagNames`, not `tags` IDs. The new editor sends names so assignments are persisted.
- The backend derives and updates slugs from titles. The editor shows the current URL and explains this behavior instead of exposing an ignored slug input.
- AdminUserController supports list/detail, role updates and deletion. It has no activate/deactivate endpoints; UserProfileDTO also omits active/createdAt. The old unsupported activation controls and fabricated status are not carried forward. No backend changes are included.

## Validation

- Production build passed with lint/type gates enabled. Existing unrelated warnings remain.
- Full suite: 81 passed, one optional SSR test skipped (14 admin tests total).
- Admin tests cover tag counts and confirmation cancellation, authenticated writes, validation and retry, pagination, role updates, real bulk deletion, post payloads, draft/published state, pending uploads, sub-cent money, ceiling/exceeded/empty/error states, and stale-request handling.
- Isolated browser checks with intercepted API fixtures: usage, tags, posts, post editor, users, specialties, and settings redirect. Desktop/mobile and light/dark screenshots inspected. No runtime errors or production mutations.
- All four protected files are unchanged.

## Preview and merge

Preview: `http://100.89.150.50:3003/admin/usage` (admin login required).
Frontend port stays 3003. Development proxy uses the shared backend on 8002.

Merge this branch, then build/deploy the frontend. There are no new dependencies, environment variables, migrations, or backend changes in this branch.
