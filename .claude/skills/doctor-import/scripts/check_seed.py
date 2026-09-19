#!/usr/bin/env python3
"""Check a doctor seed migration before it is committed.

Everything here is a mistake that has actually been made, or one the schema
will not catch. There is no foreign key on specialty_code, uq_doctor_slug is
global rather than per clinic, and INSERT IGNORE swallows its own failures - so
a migration can apply cleanly on production and still be wrong.

  python3 check_seed.py <migration.sql> [--offline]

--offline skips the checks that read production, which are the slug collisions,
the specialty codes and the applied version numbers. Use it only when there is
no SSH, and run without it before deploying.

Exits non-zero if anything is wrong. Warnings do not fail the run.
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
PHOTO_DIR = ROOT / "next-frontend" / "public" / "doctor-photos"
MIGRATIONS = ROOT / "backend" / "src" / "main" / "resources" / "db" / "migration"
SSH = ["ssh", "-p", "21098", "-o", "BatchMode=yes", "root@203.161.35.63"]

PHOTO_SIZE = (561, 750)

BANNED = {
    # Escaped rather than written literally: this file is subject to the same
    # rule it enforces, and a checker that contains what it forbids cannot be
    # grepped for.
    "\u2014": "long dash",
    "\u2013": "en dash",
    "\u2026": "ellipsis character",
    "\u201c": "curly quote",
    "\u201d": "curly quote",
    "\u2018": "curly apostrophe",
    "\u2019": "curly apostrophe",
    "\u00a0": "non-breaking space",
}

errors: list[str] = []
warnings: list[str] = []


def fail(message: str) -> None:
    errors.append(message)


def warn(message: str) -> None:
    warnings.append(message)


def prod_sql(statement: str) -> list[str]:
    done = subprocess.run(
        SSH + ["mysql --default-character-set=utf8mb4 -uroot copad_db -N -B"],
        input=statement if statement.rstrip().endswith(";") else statement + ";",
        capture_output=True, text=True, encoding="utf-8", timeout=60,
    )
    if done.returncode != 0:
        raise RuntimeError(done.stderr.strip()[:300])
    return [line for line in done.stdout.splitlines() if line]


def split_values(text: str, start: int) -> tuple[list[list[str]], int]:
    """Read the tuple list of an INSERT, from just after VALUES.

    Written by hand rather than with a regex because these files carry
    Azerbaijani biographies full of brackets, commas, semicolons and doubled
    apostrophes, and every one of those breaks a pattern-matched parser.
    """
    rows: list[list[str]] = []
    current: list[str] = []
    value = ""
    depth = 0
    in_string = False
    index = start

    while index < len(text):
        character = text[index]

        if in_string:
            if character == "'":
                if index + 1 < len(text) and text[index + 1] == "'":
                    value += "''"
                    index += 2
                    continue
                in_string = False
            value += character
            index += 1
            continue

        if character == "'":
            in_string = True
            value += character
            index += 1
            continue

        if character == "(":
            depth += 1
            if depth == 1:
                current, value = [], ""
                index += 1
                continue
        elif character == ")":
            depth -= 1
            if depth == 0:
                current.append(value.strip())
                rows.append(current)
                value = ""
                index += 1
                continue
        elif character == "," and depth == 1:
            current.append(value.strip())
            value = ""
            index += 1
            continue
        elif character == ";" and depth == 0:
            return rows, index
        elif depth == 0 and character not in " \t\r\n,":
            # Anything else at depth zero ends the VALUES list.
            return rows, index

        value += character
        index += 1

    return rows, index


def strip_comments(text: str) -> str:
    """The SQL with its comments blanked out, for the structural checks.

    These files explain themselves at length, and the explanations quote the
    very things being looked for - "INSERT IGNORE, not ON DUPLICATE KEY" is in
    the template. Scanning raw text fails a migration for its own comment.
    Quotes are tracked so that a doubled hyphen inside an Azerbaijani biography
    is not mistaken for the start of one.
    """
    out = []
    index = 0
    in_string = False
    while index < len(text):
        character = text[index]
        if in_string:
            if character == "'":
                if text[index:index + 2] == "''":
                    out.append("''")
                    index += 2
                    continue
                in_string = False
            out.append(character)
            index += 1
            continue
        if character == "'":
            in_string = True
            out.append(character)
            index += 1
            continue
        if text[index:index + 2] == "--":
            end = text.find("\n", index)
            end = len(text) if end < 0 else end
            out.append(" " * (end - index))
            index = end
            continue
        if text[index:index + 2] == "/*":
            end = text.find("*/", index)
            end = len(text) if end < 0 else end + 2
            out.append(" " * (end - index))
            index = end
            continue
        out.append(character)
        index += 1
    return "".join(out)


def unquote(value: str):
    if value.upper() == "NULL":
        return None
    if value.startswith("'") and value.endswith("'"):
        return value[1:-1].replace("''", "'")
    return value


def rows_of(text: str, table: str) -> list[dict]:
    """Every row of every INSERT into the named table, keyed by column."""
    found = []
    for match in re.finditer(
        rf"INSERT\s+(?:IGNORE\s+)?INTO\s+{table}\s*\(([^)]*)\)\s*VALUES",
        text, re.IGNORECASE,
    ):
        columns = [c.strip().lower() for c in match.group(1).split(",")]
        tuples, _ = split_values(text, match.end())
        for values in tuples:
            if len(values) != len(columns):
                fail(f"a row of INSERT INTO {table} has {len(values)} values "
                     f"for {len(columns)} columns: {values[:2]}")
                continue
            found.append({c: unquote(v) for c, v in zip(columns, values)})
    return found


def check_text(text: str, path: Path) -> None:
    # Punctuation is checked on the whole file, comments included: a long dash
    # in an explanation is as much a breach of the house rule as one in data.
    for character, name in BANNED.items():
        if character in text:
            line = text[: text.index(character)].count("\n") + 1
            fail(f"{name} on line {line}; use plain ASCII punctuation")

    # Everything below is about what the file does, so it reads the statements
    # rather than the prose around them.
    text = strip_comments(text)

    if re.search(r"ON\s+DUPLICATE\s+KEY", text, re.IGNORECASE):
        fail("ON DUPLICATE KEY: production MariaDB rejects the row-alias form, "
             "use INSERT IGNORE")

    if re.search(r"INSERT\s+INTO\s+doctor\s*\(", text, re.IGNORECASE):
        fail("INSERT INTO doctor without IGNORE: a slug that already exists "
             "would fail the whole migration on deploy")

    if not re.search(r"INSERT\s+INTO\s+doctor_clinic", text, re.IGNORECASE):
        fail("nothing attaches these doctors to a clinic; the profiles will "
             "show no clinic and no phone number")

    if "@clinic_id" not in text:
        warn("no @clinic_id is set; check the doctors are attached to the "
             "right clinic")


def check_clinic(text: str, live_clinics: set[str] | None) -> str | None:
    """The clinic the doctors are attached to, however it is written.

    The seeds create the clinic with INSERT ... SELECT ... WHERE NOT EXISTS
    rather than VALUES, so this reads the slug rather than the row. It matters
    more than it looks: the attach step carries AND @clinic_id IS NOT NULL, so
    a slug that resolves to nothing does not fail the migration - it quietly
    attaches nobody, and every profile ships without a clinic or a phone number.
    """
    creates = re.search(r"INSERT\s+INTO\s+clinic\b", text, re.IGNORECASE)
    reference = re.search(
        r"@clinic_id\s*=\s*\(\s*SELECT\s+id\s+FROM\s+clinic\s+WHERE\s+slug\s*=\s*'([^']+)'",
        text, re.IGNORECASE)

    if not reference:
        if creates:
            warn("a clinic is created but @clinic_id is never read from it")
        else:
            fail("no clinic: the doctors would have no clinic, no address and "
                 "no phone number on their profiles")
        return None

    slug = reference.group(1)

    if creates:
        guard = re.search(
            r"WHERE\s+NOT\s+EXISTS\s*\(\s*SELECT\s+1\s+FROM\s+clinic\s+WHERE\s+slug\s*=\s*'([^']+)'",
            text, re.IGNORECASE)
        if not guard:
            fail("the clinic insert is not guarded by WHERE NOT EXISTS on the "
                 "slug; re-running would duplicate the clinic")
        elif guard.group(1) != slug:
            fail(f"the clinic is guarded on {guard.group(1)!r} but @clinic_id "
                 f"reads {slug!r}; one of them is a typo")
        if live_clinics is not None and slug in live_clinics:
            warn(f"clinic {slug!r} already exists in production; the guard will "
                 "keep the existing row and its details, not these")
    elif live_clinics is not None and slug not in live_clinics:
        fail(f"@clinic_id reads clinic {slug!r}, which does not exist in "
             "production and is not created here; the attach step would "
             "silently attach nobody")

    return slug


def check_version(path: Path, applied: set[str] | None) -> None:
    match = re.fullmatch(r"V(\d+)__[a-z0-9_]+\.sql", path.name)
    if not match:
        fail(f"{path.name} is not a Flyway name of the form V43__seed_x.sql")
        return
    version = match.group(1)

    same = [p.name for p in MIGRATIONS.glob(f"V{version}__*.sql") if p.name != path.name]
    if same:
        fail(f"version {version} is already taken by {same[0]}")

    highest = max(
        (int(re.match(r"V(\d+)__", p.name).group(1))
         for p in MIGRATIONS.glob("V*__*.sql")
         if re.match(r"V(\d+)__", p.name)),
        default=0,
    )
    if int(version) < highest:
        warn(f"V{version} is below the highest local migration V{highest}; "
             "new migrations continue from the highest applied version")

    if applied is not None and version in applied:
        fail(f"version {version} has already been applied on production; "
             "Flyway will refuse to start with a changed file")


def check_doctors(doctors: list[dict], added_specialties: set[str],
                  live_slugs: set[str] | None, live_specialties: set[str] | None) -> None:
    if not doctors:
        fail("no doctor rows found in the file")
        return

    seen: set[str] = set()

    for doctor in doctors:
        name = doctor.get("full_name") or "<no name>"
        slug = doctor.get("slug")

        if not slug or not re.fullmatch(r"[a-z0-9-]+", slug):
            fail(f"{name}: slug {slug!r} must be lowercase ASCII, digits and hyphens")
            continue

        if slug in seen:
            fail(f"{slug}: appears twice in this file; INSERT IGNORE would "
                 "silently keep only the first")
        seen.add(slug)

        # uq_doctor_slug is global, not per clinic. Two hospitals with an
        # Elnur Qasimov produce one slug, and the second row is dropped with
        # no error at all.
        if live_slugs is not None and slug in live_slugs:
            fail(f"{slug}: already exists in production; INSERT IGNORE would "
                 "drop this doctor without a word - disambiguate the slug")

        if (doctor.get("verification") or "").upper() != "UNCLAIMED":
            fail(f"{slug}: verification is {doctor.get('verification')!r}; a "
                 "seeded listing is always UNCLAIMED, nobody here asked to be listed")

        if str(doctor.get("accepts_bookings", "")).strip() != "0":
            fail(f"{slug}: accepts_bookings is {doctor.get('accepts_bookings')!r}; "
                 "there is nobody at the other end of that appointment")

        if not doctor.get("source"):
            fail(f"{slug}: no source; every later fix and count keys on it")

        languages = (doctor.get("languages") or "").strip()
        if not languages:
            fail(f"{slug}: languages is empty, which drops the doctor out of "
                 "the language filter entirely; use 'az'")

        code = doctor.get("specialty_code")
        if code:
            known = (live_specialties is None) or (code in live_specialties)
            if not known and code not in added_specialties:
                fail(f"{slug}: specialty_code {code!r} does not exist and is "
                     "not added by this migration; it would render untranslated")
        else:
            warn(f"{slug}: no specialty, so it answers no specialty filter")

        photo = doctor.get("photo_url")
        if photo:
            if not photo.startswith("/doctor-photos/"):
                fail(f"{slug}: photo_url {photo!r} is not a same-origin path; "
                     "photoSrc refuses anything else and the card shows nothing")
            else:
                if photo != f"/doctor-photos/{slug}.webp":
                    warn(f"{slug}: photo_url is {photo}, not /doctor-photos/{slug}.webp")
                local = PHOTO_DIR / Path(photo).name
                if not local.exists():
                    fail(f"{slug}: {local.relative_to(ROOT)} is not committed; "
                         "run photos.py")
                else:
                    try:
                        with Image.open(local) as image:
                            if image.format != "WEBP":
                                fail(f"{slug}: portrait is {image.format}, not WEBP")
                            if image.size != PHOTO_SIZE:
                                warn(f"{slug}: portrait is {image.size[0]}x{image.size[1]}, "
                                     f"the others are {PHOTO_SIZE[0]}x{PHOTO_SIZE[1]}")
                    except OSError as error:
                        fail(f"{slug}: portrait will not open ({error})")
        else:
            warn(f"{slug}: no portrait")

        # Two of the Liv rows have a graduation year sitting in the
        # qualifications and years_experience NULL, because it was read past.
        qualifications = doctor.get("qualifications") or ""
        if doctor.get("years_experience") is None and re.search(r"\b(19|20)\d{2}\b", qualifications):
            fail_year = re.findall(r"\b(19|20)\d{2}\b", qualifications)
            warn(f"{slug}: years_experience is NULL but the qualifications "
                 f"carry a year ({len(fail_year)} found); check it was not missed")

        if not doctor.get("bio"):
            warn(f"{slug}: no biography")


def main() -> None:
    arguments = [a for a in sys.argv[1:] if not a.startswith("--")]
    offline = "--offline" in sys.argv[1:]
    if len(arguments) != 1:
        raise SystemExit(__doc__)

    path = Path(arguments[0]).resolve()
    if not path.exists():
        raise SystemExit(f"{path} does not exist")
    text = path.read_text(encoding="utf-8")

    live_slugs = live_specialties = live_clinics = applied = None
    if offline:
        warn("production checks skipped (--offline): slug collisions, "
             "specialty codes, the clinic and applied versions are unverified")
    else:
        try:
            live_slugs = set(prod_sql("SELECT slug FROM doctor"))
            live_specialties = set(prod_sql("SELECT code FROM specialty"))
            live_clinics = set(prod_sql("SELECT slug FROM clinic"))
            applied = set(prod_sql("SELECT version FROM flyway_schema_history"))
        except Exception as error:
            raise SystemExit(f"could not read production ({error}).\n"
                             "Fix the connection, or pass --offline and run "
                             "this again before deploying.")

    statements = strip_comments(text)
    doctors = rows_of(statements, "doctor")
    specialties = rows_of(statements, "specialty")
    added = {row.get("code") for row in specialties if row.get("code")}

    check_text(text, path)
    check_version(path, applied)
    clinic = check_clinic(statements, live_clinics)
    check_doctors(doctors, added, live_slugs, live_specialties)

    print(f"{path.name}")
    print(f"  {len(doctors)} doctors into clinic {clinic or '<none>'}, "
          f"{len(specialties)} new specialties")
    sources = {d.get("source") for d in doctors if d.get("source")}
    if sources:
        print(f"  source: {', '.join(sorted(s for s in sources if s))}")
    if len(sources) > 1:
        warn("more than one source in a single migration; that makes the rows "
             "hard to count and to fix later")

    if warnings:
        print(f"\n{len(warnings)} warning(s):")
        for message in warnings:
            print(f"  - {message}")

    if errors:
        print(f"\n{len(errors)} error(s):")
        for message in errors:
            print(f"  - {message}")
        raise SystemExit(1)

    print("\nchecks passed. Dry-run it next: dryrun.py " + path.name)


if __name__ == "__main__":
    main()
