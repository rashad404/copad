# How each source is read

One section per hospital already imported: how its list is enumerated, where
the profile data and the photographs actually live, and what bit it before.
Read the section for a source before re-reading it, and add one when a new
source is done. Sites get rebuilt, so treat every command here as a starting
point rather than a promise, and re-establish the total every time.

The recurring shape: a listing page gives names, specialties and photographs;
a profile page gives education and experience; and the two disagree with each
other or with the sitemap often enough that both must be read.

---

## livhospital.az - Liv Bona Dea Hospital (V22, V39, 112 doctors)

Imported before this skill existed, and the reason step 1 of it is what it is.
V22 was built from a single saved copy of the directory page, caught 70, and
missed 42; a patient searched for a doctor who was there all along and did not
find him. V39 read the rest from the same profiles.

- Photographs were originally hotlinked to the hospital's CDN. V24 moved them
  to `/doctor-photos/<slug>.webp`, derived from the slug because that is how
  they had been named. Never link them again.
- Names are published with their titles attached - `Uzm.Dr.`, `Doç.Dr.` - and
  the slugs carry them, which is why these are the only slugs with a prefix.
- `languages` was left NULL for all 70 and matched nothing until V24 set it.

## oncology.amu.edu.az - ATU Oncology Clinic (V43, 12 doctors)

A small, old site. Azerbaijani only, and the only source so far that publishes
nothing in another language.

```bash
curl -s "https://oncology.amu.edu.az/az/pages/66"                  # the list
curl -s "https://oncology.amu.edu.az/az/pages/66/doctor/<id>"      # one profile
curl -s "https://oncology.amu.edu.az/az/pages/66?shobe=<1-5>&ixtisas=0&adsoyad="
```

- **Establishing the total took both tricks.** Ids run 2 to 15 with 1, 4 and 8
  missing, and every department and specialty filter summed back to exactly the
  twelve on the unfiltered page.
- **It answers 200 for pages that do not exist.** `/doctor/1` returns the empty
  list page, not a 404. Compare the body length against a profile known to be
  real - 33 lines against 132 - rather than trusting the status code.
- Profiles are HTML tables headed `Təhsil`, `Təcrübə`, `Təlimlər`,
  `Elmi iş və məqalələr`, `Üzvlük`. The first row of each is a header row.
- Portraits are at `/doctor-img/...`, some with spaces in the filename, so the
  path needs escaping. Three profiles carry `no_photo_doctor_big.jpg`, which is
  a placeholder and must become NULL rather than a downloaded file.
- **Landscape photographs of a doctor at a desk.** Two of nine needed a
  `focus_x`. This is the source that taught the contact-sheet step.
- Publishes party membership and long bibliographies. Neither was imported.
- The department pages under `/az/pages/<n>/<m>` are a second, different list -
  staff rosters naming about 25 more people, including head nurses and
  laboratory assistants. Not imported, and not to be merged in without a
  decision.

## merkeziklinika.az - Merkezi Klinika (V44, 154 doctors)

A modern Next.js site, and the easiest of the four to read.

```bash
curl -s "https://merkeziklinika.az/doctors"                  # all 154, one page
curl -s "https://merkeziklinika.az/doctors/<name>-<id>"      # one profile
curl -s "https://merkeziklinika.az/sitemap.xml"              # 154 az + 154 en + 154 ru
```

- **The two counts agreed immediately**: 154 cards on the listing page, 154
  Azerbaijani URLs in the sitemap, and the sets are identical. Ids are sparse
  between 229 and 622, so probing them proves nothing - do not bother.
- Every profile embeds JSON-LD `Physician` with the name and the real image
  URL. Parse that rather than the markup where you can.
- Fields sit in `<span>Label<!-- -->:</span><div><p>value</p>`, with React
  comment markers inside the text that have to be stripped. Sections are
  `<h3>Təhsili</h3>`, `<h3>İş təcrübəsi</h3>`, `<h3>İxtisaslaşma sahəsi</h3>`.
- **It states length of service itself**, as `30+ il`. Use the hospital's own
  figure instead of deriving one from a graduation year.
- **The image host does not resolve.** The markup points at
  `admin.merkeziklinika.az`, which returns SERVFAIL from outside. Fetch through
  the site's own optimiser instead:
  `https://merkeziklinika.az/_next/image?url=<urlencoded>&w=1080&q=75`.
  Sources are 450x600, almost exactly our aspect ratio, so no crop trouble.
- **Three of its own profile links 404**, from the listing and from the bare id
  alike. Their listing cards still carry name, specialty, role and photograph,
  and that is what was imported. Do not drop a doctor because their hospital's
  link is broken.

## saglamaile.az - Saglam Aile (V45, 52 doctors)

Five branches in three cities, and already in this database as a *laboratory*
from V31 with its price list. Different table; that row stays untouched.

```bash
curl -s "https://saglamaile.az/doctors/"          # all 52, grouped by specialty
curl -s "https://saglamaile.az/doctors/<slug>/"   # one profile, trailing slash
curl -s "https://saglamaile.az/branches/"         # the five branches
curl -s "https://saglamaile.az/sitemap.xml"       # 53, one of them dead
```

- **The sitemap is stale.** It lists 53 doctors; `hacer-simsek` 404s on the
  site itself, a doctor who left whose entry was never removed. The page's 52
  is right. Check a sitemap-only name before believing it.
- Cards are `<figure><a href><div class="image"><img src>` plus
  `<figcaption><h4>name</h4><p>specialty</p>`. Photo paths are relative to the
  site root and the images are 500x500 squares.
- Profiles give the branch in `<dt>Filial</dt><dd>`, and the career history
  under `<h2>Haqqında</h2>` as `<li>` items wrapped in Word-exported `<span>`
  noise - strip tags rather than matching them.
- **Read the branch and use it.** Ten of these doctors are in Ganja and one in
  Sumqayit. This is the source that made per-branch clinic rows necessary; the
  addresses come from the five pages under `/branches/`, where `ÜNVAN:` is the
  address and `ƏLAQƏ:` the phone.
- **Education and employment are one combined list**, so `qualifications` is
  NULL for all 52 and the list is kept whole in the biography. Do not split it
  by guessing which lines are which.
- Profiles publish a weekly timetable and warn beneath it that it can change.
  Not imported.
- Two portraits are the stock icon `doctor_2875035.png` under two different
  asset ids. A contact sheet catches them; so does noticing that two doctors
  share a photograph filename.

## referansclc.com - Referans (V46, 319 doctors)

The largest and the most tangled. A Bitrix site, 23 centres, and the source
that forced one doctor to hold several locations.

```bash
curl -sL "https://referansclc.com/company/staff/"               # centre index, 301 without the slash
curl -sL "https://referansclc.com/company/staff/<centre>/"      # one centre, all its doctors
curl -sL "https://referansclc.com/company/staff/<centre>/<doctor>/"
curl -sL "https://referansclc.com/az/contacts/"                 # every branch address
```

- **The index is a preview, not the list.** It shows a handful of doctors per
  centre - 67 in total. Each centre page carries its full roster; walking all
  23 gives 367. Never count from the index.
- Second count: the 59 `?SPECIALIZATION=` filters union to 354. The 13-doctor
  difference is doctors with no specialty set, who appear under no filter, and
  every filtered doctor is also on a centre page. That reconciles; do not stop
  at the mismatch.
- **363 pages are 319 people.** A doctor who works at several centres has a
  page at each, with the same photograph re-uploaded under a different asset
  id. Group by name, and split a name only when the photograph *and* the
  specialty both disagree - two women named Leyla Eliyeva work at the same
  laboratory and are not the same person.
- Profiles: `staff-detail__ex-property-label` / `-value` pairs give `İxtisas`,
  `Fəaliyyət istiqaməti`, `Təhsil`, `Konfranslar`. The portrait is the
  `og:image` meta tag; the markup around it has no usable img tag.
- Eight doctors state their specialty only in `staff-detail__post` (Vəzifə).
- The sitemap is useless: it points at referans.io and was last built in 2023.
- The Tashkent branch was excluded by decision, not by accident.

## mediclub.az - MediClub (V48, 95 doctors)

The easiest count of any source, and the least data behind it.

```bash
curl -sL "https://www.mediclub.az/az/doctors"                   # all 95, one page
curl -sL "https://www.mediclub.az/az/clinics/mediclub-hospital" # one clinic's roster
curl -sL "https://www.mediclub.az/az/doctors/<slug>"            # one profile
```

- **The listing page is the whole dataset.** Every card carries
  `class="doctors__item spec-NN clinic-N"`, so specialty and clinic come from
  the class without fetching anything. Filtering is client-side.
- Second count, free: the four clinic pages list 53, 26, 12 and 9, matching the
  class tallies exactly. Five doctors carry two clinic classes.
- **MediClub Ganja is in the filter with no doctors at all**, on any page. Its
  own clinic page lists none. That is their state, not a gap.
- The profile adds only two facts: `Ümumi iş stajı` (years, stated plainly for
  every doctor) and `MediClub-da fəaliyyətə başladığı il`. There is no
  education, no biography, no certificates - the page title says so.
- `?clinic=clinic-5` is not a filter; the site answers it with a COVID-19 page.
- `/az/sitemap` is an HTML page, not XML, and lists no doctors.
- **Portraits:** the card links `/storage/<id>/conversions/<name>-list.jpg` at
  224x322. Dropping `conversions/` and the `-list` suffix gives 269x382, the
  largest stored. Five of those 404 as `.jpg` and exist as `.png` - and those
  five are the site's red silhouette placeholder, which downloads like a real
  photograph. Detect them by the flat dominant colour, not by the fetch
  failing.
- Three doctors carry `spec-17`, which the site's own dropdown does not define.
  All are at MediClub Dental and their profile reads Hekim-stomatoloq.

---

## What to check on any new source

1. Two independent counts, and explain any difference before continuing.
2. Whether a missing page really 404s, or answers 200 with an empty body.
3. Whether the photographs are on a host that resolves from outside.
4. Whether the source says which building, and whether they are all one city.
5. Whether any photograph is a placeholder, shared between doctors.
6. Whether the site publishes anything that does not belong on a health
   directory - party membership so far, and timetables that go stale.
