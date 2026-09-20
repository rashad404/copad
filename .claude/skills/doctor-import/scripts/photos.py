#!/usr/bin/env python3
"""Host the doctor portraits ourselves instead of hotlinking the source.

V22 pointed photo_url at the hospital's own CDN, which made every card in our
directory depend on somebody else's arrangements staying the way they are
today. V24 moved the files here. This does that part of an import up front, so
a listing never ships with a remote URL: photoSrc refuses anything that is not
a same-origin path, and a hotlinked portrait renders as no portrait at all.

  python3 photos.py <map.json> [--overwrite] [--resolve host:ip]

--resolve pins a hostname to an address, like curl's flag of the same name.
Some of these image hosts have a name the system resolver will not answer even
though the record exists; without it every portrait fails as "not known".

map.json is slug to image URL, matching the slugs in the migration:

  {
    "uzm-dr-cavansir-vahabov": "https://example.az/upload/vahabov.jpg",
    "dr-vefa-nesifova": "https://example.az/upload/nesifova.png"
  }

A source that is landscape, or one where the doctor is not in the middle of
the frame, needs to say where they are, or the centre crop takes a desk and
half a face. Give that one an object instead, with the doctor's position in
the source as a fraction across and down:

  {
    "dr-nigar-mehdiyeva": {"url": "https://example.az/x.jpg", "focus_x": 0.72}
  }

Writes next-frontend/public/doctor-photos/<slug>.webp at 561x750, which is what
the existing 112 are. An existing file is left alone unless --overwrite is
passed, so re-running after a partial download costs nothing and cannot clobber
a portrait that is already live.
"""
from __future__ import annotations

import json
import re
import socket
import sys
import urllib.request
from pathlib import Path

from PIL import Image

# Hospitals keep their images on a host that answers A records and SERVFAILs
# on AAAA - three of six sources so far. Python asks for both at once, so one
# failing lookup takes the whole name down and every portrait "fails to
# resolve" while curl fetches it happily. Asking only for IPv4 is what the
# browsers effectively do here.
_getaddrinfo = socket.getaddrinfo


PINNED: dict[str, str] = {}      # filled by --resolve host:ip


def _ipv4_only(host, port, family=0, *args, **kwargs):
    if host in PINNED:
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", (PINNED[host], port))]
    try:
        return _getaddrinfo(host, port, family, *args, **kwargs)
    except socket.gaierror:
        return _getaddrinfo(host, port, socket.AF_INET, *args, **kwargs)


socket.getaddrinfo = _ipv4_only

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
    """The bytes, if they are a picture.

    The content type is not the test. One hospital's API serves every portrait
    as application/octet-stream and another sends them with no type at all,
    and both are perfectly good JPEGs; refusing on the header threw away 23
    photographs that opened without complaint. What is rejected is a body that
    is plainly a web page, which is how these sites answer for a file that has
    moved. Whether the rest is an image is PIL's business, and it raises if it
    is not.
    """
    request = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(request, timeout=60) as response:
        kind = response.headers.get("Content-Type", "")
        body = response.read()
    if kind.startswith(("text/html", "application/json")) or body[:15].lstrip().lower().startswith(b"<!doctype"):
        raise ValueError(f"answered {kind or 'no content type'}, not an image")
    return body


def convert(raw: bytes, focus_x: float = 0.5, focus_y: float | None = None):
    """Flatten onto white, then crop to fill 561x750 without distorting.

    focus_x and focus_y say where the doctor is in the source, as a fraction.
    They matter most for a landscape photograph: scaled to fill a portrait
    frame, most of the width is thrown away, and if the person is not in the
    middle the crop keeps the desk and loses them.
    """
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

    def window(length: int, span: int, fraction: float) -> int:
        return max(0, min(length - span, round(length * fraction - span / 2)))

    left = window(resized.width, WIDTH, focus_x)
    top = (window(resized.height, HEIGHT, focus_y) if focus_y is not None
           else round((resized.height - HEIGHT) * TOP_BIAS))
    return resized.crop((left, top, left + WIDTH, top + HEIGHT)), original


def main() -> None:
    arguments = [a for a in sys.argv[1:] if not a.startswith("--")]
    overwrite = "--overwrite" in sys.argv[1:]
    for flag in sys.argv[1:]:
        if flag.startswith("--resolve="):
            host, _, address = flag[len("--resolve="):].partition(":")
            PINNED[host] = address
            print(f"  pinning {host} to {address}")
    if len(arguments) != 1:
        raise SystemExit(__doc__)

    photos = json.loads(Path(arguments[0]).read_text(encoding="utf-8"))
    if not isinstance(photos, dict) or not photos:
        raise SystemExit("map.json must be a non-empty object of slug to URL")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    written = skipped = failed = 0

    for slug, entry in photos.items():
        if not re.fullmatch(r"[a-z0-9-]+", slug):
            print(f"  {slug}: not a valid slug, skipped")
            failed += 1
            continue

        if isinstance(entry, dict):
            url = entry.get("url")
            focus_x = float(entry.get("focus_x", 0.5))
            focus_y = None if entry.get("focus_y") is None else float(entry["focus_y"])
        else:
            url, focus_x, focus_y = entry, 0.5, None
        if not url:
            print(f"  {slug}: no url")
            failed += 1
            continue

        target = OUT_DIR / f"{slug}.webp"
        if target.exists() and not overwrite:
            print(f"  {slug}: already present, left alone")
            skipped += 1
            continue

        try:
            image, original = convert(fetch(url), focus_x, focus_y)
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
