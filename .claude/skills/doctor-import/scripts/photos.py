#!/usr/bin/env python3
"""Host the doctor portraits ourselves instead of hotlinking the source.

V22 pointed photo_url at the hospital's own CDN, which made every card in our
directory depend on somebody else's arrangements staying the way they are
today. V24 moved the files here. This does that part of an import up front, so
a listing never ships with a remote URL: photoSrc refuses anything that is not
a same-origin path, and a hotlinked portrait renders as no portrait at all.

  python3 photos.py <map.json> [--overwrite]

map.json is slug to image URL, matching the slugs in the migration:

  {
    "uzm-dr-cavansir-vahabov": "https://example.az/upload/vahabov.jpg",
    "dr-vefa-nesifova": "https://example.az/upload/nesifova.png"
  }

Writes next-frontend/public/doctor-photos/<slug>.webp at 561x750, which is what
the existing 112 are. An existing file is left alone unless --overwrite is
passed, so re-running after a partial download costs nothing and cannot clobber
a portrait that is already live.
"""
from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
OUT_DIR = ROOT / "next-frontend" / "public" / "doctor-photos"

WIDTH, HEIGHT = 561, 750
QUALITY = 80

# Heads sit near the top of a portrait. Cropping from the centre takes the chin
# off a tall photograph, so keep more of the top than the bottom.
TOP_BIAS = 0.35

# Some of these sites refuse a request without one.
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=60) as response:
        kind = response.headers.get("Content-Type", "")
        body = response.read()
    if not kind.startswith("image/"):
        raise ValueError(f"answered {kind or 'no content type'}, not an image")
    return body


def convert(raw: bytes) -> tuple[Image.Image, tuple[int, int]]:
    """Flatten onto white, then crop to fill 561x750 without distorting."""
    source = Image.open(__import__("io").BytesIO(raw))
    original = source.size

    # A PNG portrait with a transparent background turns black on a dark card
    # otherwise. White matches what the profile pages already assume.
    if source.mode in ("RGBA", "LA", "P"):
        source = source.convert("RGBA")
        white = Image.new("RGB", source.size, (255, 255, 255))
        white.paste(source, mask=source.split()[-1])
        source = white
    else:
        source = source.convert("RGB")

    scale = max(WIDTH / source.width, HEIGHT / source.height)
    resized = source.resize(
        (max(WIDTH, round(source.width * scale)), max(HEIGHT, round(source.height * scale))),
        Image.LANCZOS,
    )

    left = (resized.width - WIDTH) // 2
    top = round((resized.height - HEIGHT) * TOP_BIAS)
    return resized.crop((left, top, left + WIDTH, top + HEIGHT)), original


def main() -> None:
    arguments = [a for a in sys.argv[1:] if not a.startswith("--")]
    overwrite = "--overwrite" in sys.argv[1:]
    if len(arguments) != 1:
        raise SystemExit(__doc__)

    photos = json.loads(Path(arguments[0]).read_text(encoding="utf-8"))
    if not isinstance(photos, dict) or not photos:
        raise SystemExit("map.json must be a non-empty object of slug to URL")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    written = skipped = failed = 0

    for slug, url in photos.items():
        if not re.fullmatch(r"[a-z0-9-]+", slug):
            print(f"  {slug}: not a valid slug, skipped")
            failed += 1
            continue

        target = OUT_DIR / f"{slug}.webp"
        if target.exists() and not overwrite:
            print(f"  {slug}: already present, left alone")
            skipped += 1
            continue

        try:
            image, original = convert(fetch(url))
        except Exception as error:  # a dead URL is ordinary here, not a crash
            print(f"  {slug}: {error}")
            failed += 1
            continue

        image.save(target, "WEBP", quality=QUALITY, method=6)
        size = target.stat().st_size

        # Upscaling a thumbnail produces a portrait that looks wrong next to
        # the others. Worth knowing before it is committed.
        warning = ""
        if original[0] < WIDTH or original[1] < HEIGHT:
            warning = f"  (source was only {original[0]}x{original[1]}, upscaled)"
        print(f"  {slug}: {size // 1024} KB{warning}")
        written += 1

    print(f"\n{written} written, {skipped} already present, {failed} failed")
    print(f"into {OUT_DIR}")
    if failed:
        raise SystemExit("some portraits failed; fix the URLs or set photo_url NULL for those rows")


if __name__ == "__main__":
    main()
