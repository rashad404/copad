#!/usr/bin/env python3
"""Turning scraped Azerbaijani into a SQL string literal, without losing it.

Import these rather than writing the escaping again per source. The first eight
imports each rewrote it, and each one collapsed every newline in a doctor's
biography: normalising whitespace with a single \\s+ -> " " substitution treats
a line break exactly like a double space, so a career of headed sections
arrived as one paragraph of semicolons. V53 had to rewrite 851 biographies to
put the breaks back.

A biography is structured text. Sections are separated by a blank line and
every entry within one sits on its own line, because .prose renders bio with
white-space: pre-line and has since the directory was built - the display was
never the problem.
"""
from __future__ import annotations

import re

TYPOGRAPHY = {
    "“": '"', "”": '"', "‘": "'", "’": "'",
    "—": "-", "–": "-", "…": "...", " ": " ",
}


def tidy(text: str) -> str:
    """Normalise spacing and typography, and keep every newline.

    Collapses runs of spaces and tabs only. This is the whole point of the
    module: re.sub(r"\\s+", " ", text) is the bug it exists to prevent.
    """
    if not text:
        return ""
    for bad, good in TYPOGRAPHY.items():
        text = text.replace(bad, good)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return "\n".join(line.strip() for line in text.split("\n")).strip().strip(",;")


def section(heading: str, items) -> str | None:
    """A headed block: the heading, then one entry per line."""
    kept = [tidy(i) for i in (items or [])]
    kept = [i for i in kept if i]
    return f"{heading}:\n" + "\n".join(kept) if kept else None


def biography(*parts) -> str | None:
    """Join sections with a blank line between them."""
    kept = [p for p in parts if p]
    return "\n\n".join(kept) if kept else None


def sql(value, limit: int | None = None) -> str:
    """A SQL string literal, or NULL. Truncates on a word boundary if asked.

    A truncated field keeps single-line form - qualifications is VARCHAR(512)
    and is the only field this applies to.
    """
    if value is None or value == "":
        return "NULL"
    text = tidy(str(value))
    if not text:
        return "NULL"
    if limit and len(text) > limit:
        text = text[: limit - 3].rstrip(" ,;|") + "..."
    return "'" + text.replace("\\", "\\\\").replace("'", "''") + "'"
