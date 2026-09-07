# azdoc - working notes

## Writing rules

**Use plain ASCII punctuation everywhere. No exceptions.**

This applies to code, comments, commit messages, docs, UI copy, and chat replies.

Banned characters, and what to use instead:

| Do not use | Use |
|---|---|
| em dash | `-` (hyphen) |
| en dash | `-` |
| ellipsis character | `...` |
| curly quotes | `'` and `"` |
| non-breaking space | a normal space |
| bullet characters in prose | `-` |

Azerbaijani letters (`ə ş ğ ı İ ç ö ü`) are content, not punctuation, and are
always kept as-is. This rule is about typographic characters only.

Why: these characters read as machine-written, and Rashad does not want the
product or its source to look that way.

## Deploying

Never edit code on the production server. Changes go: local -> commit -> push ->
`./deploy.sh` (which pulls on prod, builds, restarts, purges the nginx cache and
verifies).

`./deploy.sh` is gitignored local tooling, along with `restart.sh`,
`pull-backups.sh` and `check-azdoc.sh`.

## Where things are

- `docs/progress.md` - build state. Read it first in a new session.
- `docs/implementation-plan.md` - the 12-phase plan.
- `docs/roadmap.md` - the source checklist.

`docs/` is gitignored and local only.

## Conventions

- Flyway owns the schema. `ddl-auto` is `none`. New migrations continue from the
  highest applied version.
- Every clinical record belongs to a `family_member_id`, never a `user_id`.
- Patient data never reaches logs: no message content, allergen, condition
  label, member name, email or filename.
- Admin write endpoints live under `/api/admin/**`. That prefix is the only
  thing the security config gates on `ADMIN`.
- Type and lint checks stay enabled in `next.config.js`. Do not switch them off
  to get a build through.
