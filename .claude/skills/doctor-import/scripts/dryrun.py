#!/usr/bin/env python3
"""Apply a doctor seed to a scratch copy of the production tables.

check_seed.py reads the file. This proves what the database does with it, which
is a different question: INSERT IGNORE reports success for a row it threw away,
so the only way to know a doctor arrived is to count them afterwards.

  python3 dryrun.py <migration.sql> [--keep]

Copies specialty, clinic, doctor and doctor_clinic out of production into a
local scratch schema, applies the migration there, and reports what landed.
Production is only read. copad_dev is untouched. The scratch schema is dropped
at the end unless --keep is passed.

Flyway is disabled locally (docs/local-development.md), so this applies the SQL
directly rather than running a migration.
"""
from __future__ import annotations

import re
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_seed import rows_of  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
SSH = ["ssh", "-p", "21098", "-o", "BatchMode=yes", "root@203.161.35.63"]
TABLES = ["specialty", "clinic", "doctor", "doctor_clinic"]
SCRATCH = "copad_seed_check"


def local_credentials() -> list[str]:
    """The same database the project's own local setup uses."""
    env = ROOT / "backend" / ".env.local"
    user, password = "root", ""
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            match = re.match(r"\s*(DATABASE_USERNAME|DATABASE_PASSWORD)\s*=\s*(.*)", line)
            if match:
                value = match.group(2).strip().strip('"').strip("'")
                if match.group(1).endswith("USERNAME"):
                    user = value or user
                else:
                    password = value
    flags = [f"-u{user}"]
    if password:
        flags.append(f"-p{password}")
    return flags


def local(statement: str, database: str = "") -> str:
    command = ["mysql", "--default-character-set=utf8mb4", *local_credentials(), "-N", "-B"]
    if database:
        command.append(database)
    done = subprocess.run(command, input=statement, capture_output=True,
                          text=True, encoding="utf-8")
    if done.returncode != 0:
        raise SystemExit(f"local MySQL failed: {done.stderr.strip()[:400]}")
    return done.stdout.strip()


def load_file(path: Path, database: str) -> None:
    command = ["mysql", "--default-character-set=utf8mb4", *local_credentials(), database]
    with path.open("rb") as handle:
        done = subprocess.run(command, stdin=handle, capture_output=True, text=True)
    if done.returncode != 0:
        raise SystemExit(f"applying {path.name} failed:\n{done.stderr.strip()[:800]}")


def main() -> None:
    arguments = [a for a in sys.argv[1:] if not a.startswith("--")]
    keep = "--keep" in sys.argv[1:]
    if len(arguments) != 1:
        raise SystemExit(__doc__)

    path = Path(arguments[0]).resolve()
    if not path.exists():
        raise SystemExit(f"{path} does not exist")

    doctors = rows_of(path.read_text(encoding="utf-8"), "doctor")
    if not doctors:
        raise SystemExit("no doctor rows in that file")
    slugs = [d["slug"] for d in doctors if d.get("slug")]
    sources = {d.get("source") for d in doctors if d.get("source")}
    source = sorted(sources)[0] if sources else None

    print(f"copying {', '.join(TABLES)} from production")
    dump = Path(tempfile.mkdtemp(prefix="azdoc-dryrun-")) / "prod.sql"
    with dump.open("wb") as handle:
        done = subprocess.run(
            SSH + [f"mysqldump --default-character-set=utf8mb4 --no-tablespaces "
                   f"-uroot copad_db {' '.join(TABLES)}"],
            stdout=handle, stderr=subprocess.PIPE,
        )
    if done.returncode != 0:
        raise SystemExit(f"mysqldump failed: {done.stderr.decode()[:300]}")

    local(f"DROP DATABASE IF EXISTS {SCRATCH}; "
          f"CREATE DATABASE {SCRATCH} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    load_file(dump, SCRATCH)

    quoted = ", ".join("'" + s.replace("'", "''") + "'" for s in slugs)

    before = int(local("SELECT COUNT(*) FROM doctor", SCRATCH) or 0)
    # A slug that was already taken is dropped by INSERT IGNORE without an
    # error. Knowing which ones existed beforehand is what separates "the
    # migration did nothing" from "this doctor collided with somebody else".
    taken = set(local(f"SELECT slug FROM doctor WHERE slug IN ({quoted})", SCRATCH).split())
    print(f"  {before} doctors already there\n")

    print(f"applying {path.name}")
    load_file(path, SCRATCH)

    after = int(local("SELECT COUNT(*) FROM doctor", SCRATCH) or 0)
    inserted = after - before
    present = set(local(f"SELECT slug FROM doctor WHERE slug IN ({quoted})", SCRATCH).split())
    missing = [s for s in slugs if s not in present]

    print(f"\n  rows in the file:      {len(doctors)}")
    print(f"  rows actually added:   {inserted}")

    if inserted != len(doctors):
        print(f"  MISSING:               {len(doctors) - inserted}")
    if taken:
        print("    slug already used before this ran: " + ", ".join(sorted(taken)))
    if missing:
        print("    never arrived at all: " + ", ".join(missing))

    if source:
        total = local(f"SELECT COUNT(*) FROM doctor WHERE source = "
                      f"'{source.replace(chr(39), chr(39) * 2)}'", SCRATCH)
        print(f"\n  total for {source}: {total}")

    unresolved = local(
        "SELECT d.slug, d.specialty_code FROM doctor d "
        "LEFT JOIN specialty s ON s.code = d.specialty_code "
        "WHERE d.specialty_code IS NOT NULL AND s.code IS NULL", SCRATCH)
    print(f"  specialties unresolved: {len(unresolved.splitlines()) if unresolved else 0}")
    for line in unresolved.splitlines():
        print(f"    {line}")

    if source:
        unattached = local(
            "SELECT d.slug FROM doctor d LEFT JOIN doctor_clinic dc ON dc.doctor_id = d.id "
            f"WHERE d.source = '{source.replace(chr(39), chr(39) * 2)}' AND dc.doctor_id IS NULL",
            SCRATCH)
        print(f"  not attached to a clinic: {len(unattached.splitlines()) if unattached else 0}")
        for line in unattached.splitlines()[:10]:
            print(f"    {line}")

    no_photo = local(
        "SELECT COUNT(*) FROM doctor WHERE photo_url IS NULL" +
        (f" AND source = '{source.replace(chr(39), chr(39) * 2)}'" if source else ""), SCRATCH)
    print(f"  without a portrait: {no_photo}")

    if keep:
        print(f"\nscratch schema {SCRATCH} kept")
    else:
        local(f"DROP DATABASE {SCRATCH};")
    dump.unlink(missing_ok=True)

    if inserted != len(doctors):
        raise SystemExit("\nnot every row landed. Fix the slugs before deploying.")
    print("\nevery row landed. Compare the source total against the number the "
          "hospital itself publishes before deploying.")


if __name__ == "__main__":
    main()
