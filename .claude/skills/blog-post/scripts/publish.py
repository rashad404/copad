#!/usr/bin/env python3
"""Publish a post to production, and check that it is really there.

A post is content, not schema, so it does not belong in a Flyway migration.
This writes the same rows the admin editor would write, over SSH, and then
fetches the live URL to prove the thing exists before saying it does.

  python3 publish.py post.json

post.json:
  {
    "title": "...",
    "slug": "...",
    "summary": "...",                 // <= 500 chars, plain text, no HTML
    "content": "<h2>...</h2><p>...",  // HTML, no <h1>
    "tags": ["...", "..."],
    "featuredImage": "/blog-images/<slug>.webp",
    "language": "az"
  }

Reading time is worked out from the word count at 200 words a minute, which is
what the rest of the product assumes.
"""
import json
import re
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

SSH = ["ssh", "-p", "21098", "root@203.161.35.63"]
SITE = "https://azdoc.ai"
AUTHOR_ID = 1  # rashad404@azdoc.ai, the admin account the posts are written by


def quote(value: str) -> str:
    return "'" + value.replace("\\", "\\\\").replace("'", "''") + "'"


def sql(statements: str) -> str:
    """Runs SQL on production and returns stdout.

    The statements go in on stdin, never inside the command line. Quoting them
    into a shell argument turned every Azerbaijani letter into its escape
    sequence - the first post published this way read "du0259rman" - because
    the escaping survived the shell and the backslash did not survive MySQL.
    """
    done = subprocess.run(
        SSH + ["mysql --default-character-set=utf8mb4 -uroot copad_db -N -B"],
        input=statements if statements.rstrip().endswith(";") else statements + ";",
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if done.returncode != 0:
        raise SystemExit(f"SQL failed: {done.stderr.strip()[:400]}")
    return done.stdout.strip()


def slugify(name: str) -> str:
    table = str.maketrans("əıöüçşğİĞÖÜÇŞ", "eioucsgigoucs")
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", name.lower().translate(table))).strip("-")


def check(post: dict) -> None:
    for field in ("title", "slug", "summary", "content", "featuredImage"):
        if not post.get(field):
            raise SystemExit(f"{field} is required")
    if len(post["summary"]) > 500:
        raise SystemExit(f"summary is {len(post['summary'])} characters; the column holds 500")
    if "<h1" in post["content"].lower():
        raise SystemExit("content must not contain an h1: the page renders the title itself")
    if not re.fullmatch(r"[a-z0-9-]+", post["slug"]):
        raise SystemExit("slug must be lowercase letters, digits and hyphens")
    banned = {"—": "long dash", "–": "en dash", "…": "ellipsis character",
              "“": "curly quote", "”": "curly quote", "’": "curly apostrophe"}
    for text in (post["title"], post["summary"], post["content"]):
        for character, name in banned.items():
            if character in text:
                raise SystemExit(f"{name} found in the text; use plain ASCII punctuation")
    image = post["featuredImage"]
    if image.startswith("/blog-images/"):
        local = Path(__file__).resolve().parents[4] / "next-frontend" / "public" / image.lstrip("/")
        if not local.exists():
            raise SystemExit(f"{local} does not exist; run cover.py first")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    post = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    check(post)

    words = len(re.sub(r"<[^>]+>", " ", post["content"]).split())
    minutes = max(1, round(words / 200))
    language = post.get("language", "az")

    if sql(f"SELECT id FROM blog_post WHERE slug = {quote(post['slug'])}"):
        raise SystemExit(f"A post with slug {post['slug']} already exists")

    sql(
        "INSERT INTO blog_post (title, slug, summary, content, author_id, published, "
        "published_at, featured_image, reading_time_minutes, language, created_at, updated_at) "
        f"VALUES ({quote(post['title'])}, {quote(post['slug'])}, {quote(post['summary'])}, "
        f"{quote(post['content'])}, {AUTHOR_ID}, 1, NOW(), {quote(post['featuredImage'])}, "
        f"{minutes}, {quote(language)}, NOW(), NOW())"
    )
    post_id = sql(f"SELECT id FROM blog_post WHERE slug = {quote(post['slug'])}")

    for tag in post.get("tags", []):
        tag_slug = slugify(tag)
        # A tag may already exist under a different capitalisation; match the
        # slug, which is what the site routes on.
        sql(
            f"INSERT IGNORE INTO tag (name, slug) VALUES ({quote(tag)}, {quote(tag_slug)});"
            f"INSERT IGNORE INTO blog_post_tags (blog_post_id, tag_id) "
            f"SELECT {post_id}, id FROM tag WHERE slug = {quote(tag_slug)}"
        )

    # The page is rendered per request but sits behind a cache, so the first
    # fetch after an insert can still be the old miss. Give it a few tries
    # before calling it a failure.
    url = f"{SITE}/blog/{post['slug']}"
    for attempt in range(6):
        with urllib.request.urlopen(url, timeout=30) as response:
            body = response.read().decode("utf-8", "replace")
        if post["title"][:30] in body:
            break
        time.sleep(5)
    else:
        raise SystemExit(f"{url} answered but does not show the title; check the page")
    print(f"published: {url}")
    print(f"{words} words, {minutes} min, {len(post.get('tags', []))} tags")


if __name__ == "__main__":
    main()
