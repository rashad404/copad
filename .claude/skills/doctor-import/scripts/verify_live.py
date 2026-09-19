#!/usr/bin/env python3
"""Check that an imported source really is on the live site.

deploy.sh proves the site is up and its chunks resolve. It says nothing about
whether the doctors arrived, whether their portraits were part of the frontend
build, or whether a profile page renders. This opens every one of them.

  python3 verify_live.py <source domain> [expected count]

The expected count is the number the hospital itself publishes, from step 1 of
the skill. Pass it: the whole reason V39 exists is that 42 doctors were missing
and nothing compared the totals.
"""
from __future__ import annotations

import json
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from subprocess import run

SITE = "https://azdoc.ai"
SSH = ["ssh", "-p", "21098", "-o", "BatchMode=yes", "root@203.161.35.63"]


def prod_sql(statement: str) -> list[str]:
    done = run(SSH + ["mysql --default-character-set=utf8mb4 -uroot copad_db -N -B"],
               input=statement + ";", capture_output=True, text=True,
               encoding="utf-8", timeout=60)
    if done.returncode != 0:
        raise SystemExit(f"could not read production: {done.stderr.strip()[:300]}")
    return [line for line in done.stdout.splitlines() if line]


def status(url: str) -> tuple[str, int, str]:
    """Fetch one URL, retrying a network failure before believing it.

    Eight at a time was enough to make this host time out its own TLS
    handshakes, and the run then reported four perfectly good portraits as
    broken. A verifier that cries wolf is worse than none, so a connection
    that fails is tried again, twice, before it counts.
    """
    request = urllib.request.Request(url, headers={"User-Agent": "azdoc-verify"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return url, response.status, response.headers.get("Content-Type", "")
        except urllib.error.HTTPError as error:
            return url, error.code, ""          # a real answer, not a fault
        except Exception as error:
            if attempt == 2:
                return url, 0, str(error)[:60]
            time.sleep(2 * (attempt + 1))
    return url, 0, "unreachable"


def main() -> None:
    if not 2 <= len(sys.argv) <= 3:
        raise SystemExit(__doc__)
    source = sys.argv[1]
    expected = int(sys.argv[2]) if len(sys.argv) == 3 else None
    escaped = source.replace("'", "''")

    rows = prod_sql(
        f"SELECT slug, COALESCE(photo_url, ''), active, unlisted, verification, "
        f"user_id IS NOT NULL "
        f"FROM doctor WHERE source = '{escaped}' AND deleted_at IS NULL"
    )
    if not rows:
        raise SystemExit(f"production holds no doctors with source = {source!r}. "
                         "Did the backend restart apply the migration?")

    listings = [line.split("\t") for line in rows]
    print(f"{len(listings)} listings on production for {source}")

    if expected is not None and len(listings) != expected:
        print(f"  MISMATCH: the source publishes {expected}, "
              f"we hold {len(listings)}")

    # A doctor who claimed their own listing is the claim flow working, and an
    # import may be months old by the time this runs again. What would be wrong
    # is a listing that nobody claimed sitting in some state other than
    # UNCLAIMED, because a seed must never assert that we checked anything.
    claimed = [r[0] for r in listings if r[4] != "UNCLAIMED" and r[5] == "1"]
    wrong_state = [r[0] for r in listings if r[4] != "UNCLAIMED" and r[5] != "1"]
    if claimed:
        print(f"  claimed by their own doctor since the import: {', '.join(claimed[:10])}")
    if wrong_state:
        print(f"  not UNCLAIMED and never claimed by anyone: {', '.join(wrong_state[:10])}")
    hidden = [r[0] for r in listings if r[2] != "1" or r[3] != "0"]
    if hidden:
        print(f"  inactive or unlisted, so invisible in search: {', '.join(hidden[:10])}")

    urls = [f"{SITE}/hekimler/{r[0]}" for r in listings]
    urls += [f"{SITE}{r[1]}" for r in listings if r[1]]

    print(f"\nfetching {len(urls)} URLs")
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(status, urls))

    broken = [(u, c, n) for u, c, n in results if c != 200]
    photos = [(u, c, n) for u, c, n in results if "/doctor-photos/" in u]
    wrong_type = [(u, c, n) for u, c, n in photos if c == 200 and "image" not in n]

    print(f"  profiles and portraits answering 200: {len(results) - len(broken)}/{len(results)}")
    for url, code, note in broken[:20]:
        print(f"    {code or 'error'}  {url}  {note}")
    for url, _, note in wrong_type[:10]:
        print(f"    served as {note!r}, not an image: {url}")

    # The public API is what the directory page actually reads, so a listing
    # that is in the table but not in this answer is still missing to a patient.
    with urllib.request.urlopen(f"{SITE}/api/doctors?page=0&size=1", timeout=30) as response:
        total = json.load(response)["totalElements"]
    print(f"\n  public directory now shows {total} doctors in total")

    if broken or wrong_type or wrong_state or (expected is not None and len(listings) != expected):
        raise SystemExit("\nverification failed.")
    print("\nverified.")


if __name__ == "__main__":
    main()
