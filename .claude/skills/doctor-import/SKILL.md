---
name: doctor-import
description: Import a hospital or clinic's published doctors into the azdoc directory and deploy them to production. Use when asked to add doctors, import a new clinic's staff, seed the directory from a hospital website, or grow /hekimler. Covers reading the source, mapping specialties, hosting portraits, writing the Flyway migration, checking it, and deploying.
---

# Adding doctors to the directory

One source at a time, start to finish: a hospital's public staff list becomes
rows in `doctor`, portraits we host ourselves, and a deploy that is verified
before it is called done.

The bar is not "the doctors are in the database". It is: **a patient who has
been told to see a particular doctor finds that doctor on azdoc, and nothing on
the page claims more than the hospital itself published.**

Read `references/specialties.md` before mapping a single department name,
and `references/sources.md` first of all - it has a section per source
already imported, with how that site's list is enumerated, where its data
and photographs really live, and what went wrong last time. If the source
in hand is in there, start from that section. When it is done, add one.

## The rules that do not bend

Every one of these is a decision already made, written into the migrations and
the schema comments. Do not reopen them per source.

- **`verification = 'UNCLAIMED'`, always.** Nobody on these lists asked to be
  listed. UNCLAIMED is what says so, and the UI renders it without a checkmark
  or any endorsement. A seed never writes VERIFIED, not even for a doctor we
  know is real.
- **`accepts_bookings = 0`, always.** There is nobody at the other end of an
  appointment for a doctor who does not know we exist. A booking that cannot be
  honoured is worse than no booking.
- **`source` carries the domain it was read from**, for example
  `'oncology.amu.edu.az'`. Every later query, fix and count keys on it, and
  `V24` exists only because a source was addressable this way.
- **Portraits are ours.** Download, convert, commit under
  `next-frontend/public/doctor-photos/<slug>.webp`, and store the same-origin
  path. Never a remote URL: `photoSrc` in
  `next-frontend/src/components/doctors/model.ts` refuses one anyway, so a
  hotlink shows no photo at all.
- **`languages` is never left empty.** Blank drops the doctor out of the
  language filter entirely. Every clinic in this directory works in
  Azerbaijani, so `'az'` is the honest default, plus any other language the
  source actually states.
- **Nothing is invented.** No specialty guessed from a photograph, no
  experience inferred from a face, no biography written by us. A field the
  source does not publish is NULL.
- **Not everything published belongs here.** Political party membership is the
  clear case: sites list it, and repeating it beside ESMO on a health directory
  is a statement we have no business making. Bibliographies are the other:
  fifteen journal citations are a researcher's CV, not something a patient
  choosing a doctor can use. Leave them out, keep every professional and
  scientific detail, and write down in the migration what was dropped and why.
  Omitting is not inventing; quietly omitting is.
- **Plain ASCII punctuation** in the SQL, the comments and the commit message.
  Azerbaijani letters are content and stay exactly as published - but the
  typography around them is normalised like everything else, so curly quotes
  in a source biography become straight ones.
- **Never edit production.** Local, commit, push, `./deploy.sh`.

## Step 1 - scope the source before reading anything in detail

The single biggest failure in this repo's history: `V22` was built from one
saved copy of a directory page, caught 70 doctors, and missed 42. Somebody
searched for Cavanşir Vahabov, did not find him, and the directory was simply
wrong for months.

So, first, establish the total:

```bash
curl -s "<the staff list URL>" | grep -o -E 'hekim|doctor|staff' | wc -l   # orient
```

Find how the list paginates. Look for a page counter, a "load more" button, an
`?page=` parameter, a department filter that splits the list, or a sitemap:

```bash
curl -s "https://<domain>/sitemap.xml" | grep -i -E "doctor|hekim|staff|pages"
```

Write down the number the hospital itself states, and keep it. Everything
after this is checked against it. If the site gives no total, count the profile
links after paginating to the end, and say in the migration comment how the
count was established.

Most of these sites state no total at all. Two things establish one anyway, and
agreeing with each other is what makes it trustworthy:

- **Probe the id sequence.** Profile URLs are usually `/doctor/<id>`. If the
  ids run 2 to 15 and the list shows twelve, fetch the three missing ids before
  concluding anything. Beware that many of these sites answer 200 for a page
  that does not exist, so compare the body against a profile you know is real
  rather than trusting the status code.
- **Sum the site's own filters.** A page with a department or specialty
  dropdown will answer each one separately. If every department added together
  returns the same set as the unfiltered list, the list is complete. If it
  returns more, the unfiltered view was lying.

Watch for a second kind of list. A hospital often has both profile pages and
plain department staff rosters, and the rosters carry people the profiles do
not - along with head nurses, laboratory assistants and coordinators, who do
not belong in a doctor directory. Do not silently merge the two. Import the
one that was asked for, and say plainly what the other holds.

Azerbaijani pages only, when a site has several languages. The directory's own
copy is Azerbaijani, and the AZ profile is the one the hospital keeps current.

## Step 2 - read every profile

One profile at a time, into a working file. Do not summarise, do not translate,
do not tidy the Azerbaijani. Take the text as published.

Collect per doctor:

| Field | From | Missing means |
|---|---|---|
| `full_name` | the profile heading, titles included (`Uzm.Dr.`, `Prof.Dr.`, `Dos.Dr.`) | skip the row, a listing needs a name |
| `specialty_code` | the department, mapped via `references/specialties.md` | NULL, and say so in the comment |
| `qualifications` | education, joined with ` \| ` | NULL |
| `years_experience` | 2026 minus the year the first medical degree ended | NULL |
| `bio` | areas of work and work history, as headed sections | NULL, and that is normal |
| `photo_url` | the portrait, hosted by us in step 4 | NULL, the card falls back cleanly |
| `languages` | stated languages, else `az` | never empty |

`years_experience` is **years since the first medical degree ended**, which is
how all 112 existing rows were computed: a doctor who finished in 2006 has 20.
Not since specialisation, not since the current job. If the source publishes no
year at all, NULL.

**A biography is structured text, not a paragraph.** Head each section and put
every entry on its own line, with a blank line between sections:

```
Şöbə: Fizioterapiya və Tibbi Reabilitasiya

İş təcrübəsi:
1998-2001 Dövlət tibb müəssisələrində fizioterapevt
2015- indiyədək Mərkəzi Gömrük Hospitalı

Lisenziya və sertifikatlar:
2010 Tibbi sığorta üzrə təlim
```

**Escape the text with `scripts/sqltext.py`, never by hand.** Eight imports each
wrote their own escaping and every one of them collapsed the newlines, because
`re.sub(r"\s+", " ", text)` treats a line break like a double space. Every
career became one run of semicolons, and V53 had to rewrite 851 biographies to
put the breaks back. The display was never at fault: `.prose` has rendered bio
with `white-space: pre-line` since the directory was built.

```python
import sys; sys.path.insert(0, ".claude/skills/doctor-import/scripts")
from sqltext import biography, section, sql
bio = biography("Şöbə: " + dept, section("İş təcrübəsi", experience_lines))
row = f"({sql(name)}, '{slug}', '{code}', {sql(education, 512)}, {years}, {sql(bio)}, ...)"
```

Keep a working file per source under `/tmp` while you read. It is intermediate
data, not a deliverable, and does not belong in the repo.

Who is not a doctor does not go in: administrators, coordinators, nurses,
laboratory technicians and marketing staff appear on plenty of these pages.

## Step 3 - map the departments to specialty codes

`references/specialties.md` holds all 53 live codes and the mapping rules.

The important part: **a code that does not exist yet is added in the same
migration, before the doctors**, with Azerbaijani, English and Russian names.
A `specialty_code` with no matching `specialty` row renders untranslated, which
is how it will be noticed - by a patient rather than by us.

## Step 4 - the portraits

Build a JSON map of slug to the image URL the profile uses, then:

```bash
python3 .claude/skills/doctor-import/scripts/photos.py /tmp/<source>-photos.json
```

It downloads each one, flattens transparency onto white, crops to 561x750 with
a bias towards the top so heads are not cut, writes webp, and refuses to
overwrite a portrait that already exists. Output goes to
`next-frontend/public/doctor-photos/<slug>.webp`, about 16 KB each.

**Look at every result before continuing, as an image, not as a file size.** A
portrait cropped through the chin is worse than no portrait, and nothing in the
pipeline can tell the difference. Build a contact sheet and read it:

```python
from PIL import Image; import pathlib
d = pathlib.Path('next-frontend/public/doctor-photos')
slugs = [...]                      # the ones just written
sheet = Image.new('RGB', (187*5, 250*((len(slugs)+4)//5)), (255,255,255))
for n, s in enumerate(slugs):
    with Image.open(d/f'{s}.webp') as im:
        sheet.paste(im.resize((187,250), Image.LANCZOS), ((n%5)*187, (n//5)*250))
sheet.save('/tmp/sheet.png')
```

Expect trouble. These sites publish landscape photographs of a doctor at a
desk, and scaled to fill a portrait frame most of the width is thrown away. If
the doctor is not in the middle, the centre crop keeps the desk and loses them.
Find the person's position in the source as a fraction across, and re-run just
those:

```bash
# {"dr-nigar-mehdiyeva": {"url": "...", "focus_x": 0.74}}
python3 .claude/skills/doctor-import/scripts/photos.py /tmp/recrop.json --overwrite
```

Then look again. Of nine portraits in the first AMU import, two needed this.

## Step 5 - write the migration

Next free version number. Check both the directory and what production has
actually applied:

```bash
ls backend/src/main/resources/db/migration/ | sort -V | tail -3
ssh -p 21098 root@203.161.35.63 "mysql -uroot copad_db -N -B -e \
  'SELECT MAX(version) FROM flyway_schema_history'"
```

Name it for what it does: `V43__seed_amu_oncology_doctors.sql`.

The file has four parts, in this order. `references/migration-template.sql` is
the whole thing ready to fill in.

1. **A comment explaining the source and the decisions.** Where the list came
   from, what date it was read, how the total was established, and anything
   that was left NULL on purpose. The existing seeds are the standard to match.
2. **`INSERT IGNORE INTO specialty`** for any code the taxonomy lacks.
3. **`INSERT INTO clinic ... SELECT ... WHERE NOT EXISTS`** on the slug, then
   `SET @clinic_id = (SELECT id FROM clinic WHERE slug = '<slug>');`
4. **`INSERT IGNORE INTO doctor`**, then attach every row of this source to the
   clinic through `doctor_clinic`.

Two things that look like details and are not:

- **`INSERT IGNORE`, never `ON DUPLICATE KEY UPDATE`.** Production MariaDB
  rejects the row-alias form, and a slug that somehow exists already should be
  left alone rather than overwritten by a scrape.
- **`uq_doctor_slug` is global, not per clinic.** Two hospitals employing an
  Elnur Qasimov produce the same slug, and `INSERT IGNORE` will silently drop
  the second one. The checker catches this; when it fires, disambiguate the new
  slug rather than losing the doctor.

Escaping: an apostrophe inside Azerbaijani text is doubled (`''`). A single
unescaped one ends the string and the whole migration fails on deploy.

## Step 6 - check it

```bash
python3 .claude/skills/doctor-import/scripts/check_seed.py \
  backend/src/main/resources/db/migration/V43__seed_amu_oncology_doctors.sql
```

Static checks plus read-only queries against production. It refuses:

- a version number already applied or already taken
- `ON DUPLICATE KEY`, long dashes, ellipsis characters, curly quotes
- any row that is not UNCLAIMED with bookings off and a source set
- an empty `languages`
- a `photo_url` whose file is not committed, or is not 561x750 webp
- a slug that collides with one already in production, or with another row in
  the same file
- a `specialty_code` that neither exists nor is added by this file
- a `@clinic_id` that reads a clinic which does not exist and is not created
  here. The attach step carries `AND @clinic_id IS NOT NULL`, so this does not
  fail the migration - it silently attaches nobody, and every profile ships
  with no clinic, address or phone number

And warns about qualifications that carry a year while `years_experience` is
NULL, which is how two of the Liv rows ended up blank when the data was there.

## Step 7 - dry run against a copy of production

The checker reads the file. This proves what the database will actually do
with it, which is not the same thing - `INSERT IGNORE` hides its own failures.

```bash
python3 .claude/skills/doctor-import/scripts/dryrun.py \
  backend/src/main/resources/db/migration/V43__seed_amu_oncology_doctors.sql
```

It copies the `clinic`, `doctor`, `doctor_clinic` and `specialty` tables from
production into a local scratch schema, applies the migration there, and
reports rows in the file against rows that actually landed, any slug silently
skipped, any specialty that did not resolve, and the final total for the
source. Nothing is written to production and nothing touches `copad_dev`.

The numbers to compare: rows inserted equals rows in the file, and the source
total equals the number the hospital publishes, from step 1.

Note that Flyway is disabled locally (`docs/local-development.md`), which is
why the dry run applies the SQL directly instead of running the migration.

## Step 8 - commit and deploy

The portraits live in the frontend and the migration in the backend, so this
needs **both** halves. `./deploy.sh backend` alone ships listings whose photos
404.

```bash
git add backend/src/main/resources/db/migration/V43__seed_amu_oncology_doctors.sql \
        next-frontend/public/doctor-photos
git commit
git push
./deploy.sh
```

The commit message says what was added, from where, and what was deliberately
left out. `git log` on this repo is the standard to write to.

`deploy.sh` refuses to run with uncommitted changes or with HEAD ahead of
`origin/main`, backs up the production database, pulls, rebuilds the backend -
which is where Flyway applies the migration - rebuilds and restarts the
frontend, purges the nginx cache, and verifies that pages load with their
chunks. A failed verification exits non-zero; do not call a deploy done
without reading its last line.

**The listings go live minutes before their portraits, and that is not a
fault.** Flyway runs during the backend restart, so every new doctor is in the
database and on the site while the frontend is still being rebuilt - and the
portraits are frontend files. A profile opened in that window renders with a
broken image, and the nginx purge is the last step of all. Do not check the
site, or let anybody else check it, until the script prints its final line.
If a portrait 404s after that, it is real; before that, it means nothing.

## Step 9 - verify the listings are really there

A green deploy proves the site is up, not that the doctors arrived.

```bash
python3 .claude/skills/doctor-import/scripts/verify_live.py <domain> <expected count>
```

It counts what production holds for that source, opens every profile URL,
fetches every portrait, and reports anything that does not answer 200. A
listing that is no longer UNCLAIMED because its own doctor claimed it is
reported and not treated as a fault; one that is not UNCLAIMED with nobody
attached to it is a fault, because a seed asserts nothing. Then
search the directory by hand for one doctor whose name you read on the source
site, the way a patient would:

```bash
curl -s "https://azdoc.ai/api/doctors?q=<surname>&size=5" | python3 -m json.tool | head -20
```

## Step 10 - write down what happened

Add the source to `docs/progress.md` under Phase 6, in the same form as the
Liv entries: how many doctors, from where, what is missing and why. That
section is what the next session reads before touching this again.

If the source needed a judgment that is not obvious from the SQL - a department
that mapped to an imperfect code, a doctor deliberately left out, a count that
does not match the hospital's own - it goes in the migration comment too. The
migration outlives the working notes.

Then add the source to `references/sources.md`: how its list is enumerated and
how the total was established, where the profile fields and the photographs
actually live, and every trick it took. The next person to read that site will
be you, a year from now, with none of this in mind.
