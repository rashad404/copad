#!/usr/bin/env python3
"""Make the featured image for a post.

An image is required: featured_image is NOT NULL, and a post without one looks
broken in the list and shares with no card.

The prompt is built to produce a photograph of ordinary objects, not a medical
stock illustration. What gives AI images away is faces, hands, readable text
and the glossy blue-gradient healthcare look, so all four are excluded by
construction rather than by hoping the model behaves.

  python3 cover.py <slug> "<subject, in English, concrete and ordinary>"

Writes next-frontend/public/blog-images/<slug>.webp at 1200x630.
"""
import base64
import io
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
OUT_DIR = ROOT / "next-frontend" / "public" / "blog-images"

STYLE = (
    "Documentary photograph taken on a 35mm lens in available light. "
    "Slightly off-centre composition, shallow depth of field, honest colours, "
    "a little wear and imperfection. "
    "No people, no faces, no hands, no readable text, no logos, no brand names. "
    "Not a medical stock photo: no blue gradients, no stethoscope on a desk, "
    "no smiling staff, no glossy studio lighting, no illustration, no 3D render."
)


def api_key() -> str:
    key = os.environ.get("OPENAI_API_KEY")
    if key:
        return key
    # The same key the product uses. Kept out of the repo, so it is read from
    # the backend env file rather than duplicated here.
    env = ROOT / "backend" / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("OPENAI_API_KEY="):
                return line.split("=", 1)[1].strip()
    raise SystemExit("OPENAI_API_KEY is not set and backend/.env has none")


def generate(subject: str) -> bytes:
    body = {
        "model": "gpt-image-1",
        "prompt": f"{subject.strip().rstrip('.')}. {STYLE}",
        "size": "1536x1024",
        "quality": "medium",
        "n": 1,
    }
    request = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {api_key()}",
            "Content-Type": "application/json",
        },
    )
    answer = json.load(urllib.request.urlopen(request, timeout=300))
    return base64.b64decode(answer["data"][0]["b64_json"])


def main() -> None:
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    slug = sys.argv[1]
    if not re.fullmatch(r"[a-z0-9-]+", slug):
        raise SystemExit(f"Slug {slug!r} must be lowercase letters, digits and hyphens")
    subject = " ".join(sys.argv[2:])

    image = Image.open(io.BytesIO(generate(subject))).convert("RGB")
    # 1200x630 is what the share card reads, cropped from the centre.
    target = 1200 / 630
    width, height = image.size
    if width / height > target:
        crop = int(height * target)
        image = image.crop(((width - crop) // 2, 0, (width - crop) // 2 + crop, height))
    else:
        crop = int(width / target)
        image = image.crop((0, (height - crop) // 2, width, (height - crop) // 2 + crop))
    image = image.resize((1200, 630), Image.LANCZOS)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{slug}.webp"
    image.save(out, "WEBP", quality=82)
    print(f"{out} ({out.stat().st_size // 1024} KB)")
    print(f"featured image path for the post: /blog-images/{slug}.webp")
    # Committed like the doctor photos: the images belong with the code that
    # serves them, not on a server nobody has a copy of.
    subprocess.run(["git", "-C", str(ROOT), "add", str(out)], check=False)


if __name__ == "__main__":
    main()
