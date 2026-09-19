#!/usr/bin/env python3
"""Check a draft against the rules, before anybody reads it.

The rules in the references are worth nothing if the only thing enforcing them
is the care of whoever wrote the draft that day. Everything here is something a
machine can decide, so it is decided the same way every time.

  python3 check.py post.json          # a draft file
  python3 check.py --slug <slug>      # a post already published

Exit code 1 if anything fails. publish.py runs this first and refuses to
publish a draft that does not pass.

Three kinds of finding:
  FAIL  breaks a rule; publishing is blocked
  WARN  worth a human look; does not block
"""
import json
import re
import statistics
import subprocess
import sys
import unicodedata
import urllib.request
from pathlib import Path

SITE = "https://azdoc.ai"
SSH = ["ssh", "-p", "21098", "root@203.161.35.63"]

fails: list[str] = []
warns: list[str] = []
waived: list[str] = []

# Rules a draft has chosen to override, as {"rule": "why"}. Every rule below
# has an id, and a draft can waive one by giving a reason.
#
# This exists because a list of forbidden words is wrong the day a word is
# right: a post about Turkish medicine names has to write them, and a leaflet
# quote for an over-the-counter drug is allowed to carry a dose. A rule that
# cannot be argued with gets worked around silently, which is worse than a
# rule that asks for a sentence of justification.
overrides: dict = {}


def fail(rule: str, message: str) -> None:
    if rule in overrides:
        waived.append(f"{rule}: {message}  [waived: {overrides[rule]}]")
    else:
        fails.append(f"[{rule}] {message}")


def warn(message: str) -> None:
    warns.append(message)


# --------------------------------------------------------------------------
# Text helpers
# --------------------------------------------------------------------------

def strip_tags(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html)
    text = text.replace("&nbsp;", " ").replace("&amp;", "&")
    return re.sub(r"\s+", " ", text).strip()


def sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?:])\s+", text)
    return [p.strip() for p in parts if len(p.strip()) > 1]


def paragraphs(html: str) -> list[str]:
    return [strip_tags(p) for p in re.findall(r"<p[^>]*>(.*?)</p>", html, re.S)]


def headings(html: str) -> list[str]:
    return [strip_tags(h) for h in re.findall(r"<h[23][^>]*>(.*?)</h[23]>", html, re.S)]


def first_word(sentence: str) -> str:
    match = re.match(r"[\wƏəİıÖöÜüÇçŞşĞğ]+", sentence)
    return match.group(0).lower() if match else ""


# --------------------------------------------------------------------------
# 1. Characters and typography
# --------------------------------------------------------------------------

BANNED_CHARS = {
    "—": "long dash",
    "–": "en dash",
    "…": "ellipsis character",
    "“": "curly quote",
    "”": "curly quote",
    "‘": "curly quote",
    "’": "curly apostrophe",
    " ": "non-breaking space",
}


def check_characters(post: dict) -> None:
    whole = " ".join(str(post.get(k, "")) for k in ("title", "summary", "content"))
    for character, name in BANNED_CHARS.items():
        if character in whole:
            fail("punctuation", f"{name} in the text; this project uses plain ASCII punctuation")
    # The encoding accident that published "du0259rman" once.
    if re.search(r"u0[0-9a-f]{3}", whole):
        fail("encoding", "escaped unicode in the text (u0259 and friends): an encoding bug, not content")
    if "  " in strip_tags(post.get("content", "")):
        warn("double spaces in the body")
    # Azerbaijani letters are the content. A text with none is not Azerbaijani.
    if post.get("language", "az") == "az" and not re.search(r"[əşçğıöüİ]", whole):
        fail("language", "no Azerbaijani letters anywhere; is this actually Azerbaijani?")
    # Dotted and undotted i, the error nobody notices while writing.
    for bad in re.findall(r"\bIl[a-zəçğıöüş]+|\bIs[a-zəçğıöüş]+", whole):
        fail("dotted-i", f"{bad!r} starts with undotted I; Azerbaijani capital of i is İ")


# --------------------------------------------------------------------------
# 2. Structure
# --------------------------------------------------------------------------

ALLOWED_TAGS = {"h2", "h3", "p", "ul", "ol", "li", "strong", "em", "a", "br"}


def check_structure(post: dict) -> None:
    html = post["content"]
    for tag in set(re.findall(r"<\s*([a-zA-Z0-9]+)", html)):
        if tag.lower() not in ALLOWED_TAGS:
            fail("tags", f"<{tag}> is not allowed in post content")
    if re.search(r"<h1", html, re.I):
        fail("h1", "content has an h1; the page renders the title itself")
    if not headings(html):
        fail("headings", "no h2 headings")

    words = len(strip_tags(html).split())
    if words < 700:
        fail("length", f"{words} words; under 700 is too thin to rank or to be worth reading")
    elif words < 900:
        warn(f"{words} words; the target is 900-1500")
    elif words > 1700:
        warn(f"{words} words; over the 1500 target, check nothing is padding")

    body = paragraphs(html)
    if not body:
        fail("structure", "no paragraphs")
        return
    long_paragraphs = [p for p in body if len(sentences(p)) > 5]
    if long_paragraphs:
        warn(f"{len(long_paragraphs)} paragraph(s) longer than 5 sentences")
    if not any(len(sentences(p)) == 1 for p in body):
        fail("paragraph-variety", "no single-sentence paragraph; every paragraph the same weight reads as machine-written")

    links = re.findall(r'<a\s+href="([^"]+)"', html)
    internal = [l for l in links if l.startswith("/")]
    if len(internal) < 2:
        fail("links", f"{len(internal)} internal links; 2-4 are expected")
    if len(internal) > 6:
        warn(f"{len(internal)} internal links; that is a lot")
    if any(not l.startswith("/") for l in links):
        warn("external links present; check each one is worth sending a reader to")

    bold = len(re.findall(r"<strong>", html))
    if bold > len(body):
        warn(f"{bold} bold phrases for {len(body)} paragraphs; bolding in every paragraph is a tell")


# --------------------------------------------------------------------------
# 3. Rhythm: the part detectors actually measure
# --------------------------------------------------------------------------

def check_rhythm(post: dict) -> None:
    text = strip_tags(post["content"])
    lengths = [len(s.split()) for s in sentences(text)]
    if len(lengths) < 10:
        return
    spread = statistics.pstdev(lengths)
    short = sum(1 for n in lengths if n < 8) / len(lengths)
    average = statistics.mean(lengths)

    if spread < 5:
        fail("rhythm", f"sentence-length spread {spread:.1f}; under 5 is the flat rhythm detectors look for")
    elif spread < 6.5:
        warn(f"sentence-length spread {spread:.1f}; aim above 6.5")
    if short < 0.12:
        fail("short-sentences", f"only {short:.0%} of sentences are under 8 words; at least 12 percent should be")
    if average > 20:
        warn(f"average sentence {average:.1f} words; long and even is the machine default")

    # Consecutive sentences opening the same way.
    starts = [first_word(s) for s in sentences(text)]
    for i in range(len(starts) - 1):
        if starts[i] and starts[i] == starts[i + 1]:
            warn(f"two sentences in a row start with {starts[i]!r}")

    # The rule of three inside one sentence: the same word opening three
    # clauses. This is what read as a story told to a child.
    for sentence in sentences(text):
        clauses = [c.strip() for c in sentence.split(",") if c.strip()]
        if len(clauses) >= 3:
            openings = [first_word(c) for c in clauses]
            for word in set(openings):
                if word and openings.count(word) >= 3:
                    fail("rule-of-three", f"{word!r} opens three clauses in one sentence: {sentence[:70]}...")

    if len(headings(post["content"])) >= 3:
        shapes = [h.strip().endswith("?") for h in headings(post["content"])]
        if all(shapes):
            warn("every heading is a question")
        first_words = [first_word(h) for h in headings(post["content"])]
        if len(set(first_words)) == 1:
            fail("headings", "every heading starts with the same word")


# --------------------------------------------------------------------------
# 4. Azerbaijani: Turkish, Russian calques, translated English
# --------------------------------------------------------------------------

TURKISH = {
    "doktor": "həkim", "ilaç": "dərman", "hastalık": "xəstəlik", "hasta": "xəstə",
    "tedavi": "müalicə", "sağlık": "sağlamlıq", "kalp": "ürək", "kan": "qan",
    "çocuk": "uşaq", "bebek": "körpə", "acil": "təcili", "tansiyon": "təzyiq",
    "durum": "vəziyyət", "yapmaq": "etmək", "kullanmaq": "istifadə etmək",
    "önemli": "vacib", "hızlı": "sürətli", "gerçəkləşmək": "baş vermək",
    "fakat": "amma", "ilgili": "aid",
}

CALQUES = {
    "olaraq": "Turkish; use kimi, or restructure",
    "hansı ki": "calque of который; use a participle (-an/-ən, -dığı)",
    "mümkündür ki": "use ola bilər",
    "həyata keçir": "bureaucratic; use etmək or aparmaq",
    "yerinə yetir": "bureaucratic; use etmək",
    "qeyd etmək lazımdır": "delete it and say the thing",
    "nəticə etibarilə": "delete",
    "bu kontekstdə": "delete",
    "bir sözlə": "delete",
    "ümumiyyətlə": "usually deletable",
    "təşkil edir": "a plain number reads better",
}

# Writing about the writing. Nobody does this outside a school essay.
META = [
    "bu məqalədə", "bu yazıda", "gəlin nəzər sal", "gəlin baxaq", "nəzər salaq",
    "yuxarıda qeyd etdiyimiz", "aşağıda nəzərdən keçir", "dürüst qeyd",
    "açıq deyim", "yazmasam", "qeyd edək ki", "vurğulamaq istərdik",
    "sonda qeyd", "yekunda", "xülasə olaraq",
]

SCENE_OPENERS = ["təsəvvür edin", "fikirləşin ki", "gözünüzü açırsınız"]


def check_azerbaijani(post: dict) -> None:
    if post.get("language", "az") != "az":
        return
    text = strip_tags(post["content"]) + " " + post["title"] + " " + post["summary"]
    lowered = text.lower()

    for wrong, right in TURKISH.items():
        if re.search(rf"\b{wrong}\w*\b", lowered):
            fail(f"turkish:{wrong}", f"Turkish {wrong!r}; Azerbaijani is {right!r}")
    # ates means fire here. Fever is qizdirma.
    if re.search(r"\bateş(i|in|dən|lə)?\b", lowered) and "qızdırma" not in lowered:
        fail("turkish:ates", "'ateş' means fire in Azerbaijani; fever is 'qızdırma'")

    for phrase, why in CALQUES.items():
        count = lowered.count(phrase)
        if count and phrase == "ümumiyyətlə" and count == 1:
            continue
        if count:
            fail(f"calque:{phrase.split()[0]}", f"{phrase!r} x{count}: {why}")

    if lowered.count("əlbəttə") > 1:
        warn("'əlbəttə' more than once")

    for phrase in META:
        if phrase in lowered:
            fail("meta-writing", f"{phrase!r}: writing about the article instead of writing the article")

    # sizin/bizim where the possessive suffix already carries it.
    for match in re.finditer(r"\b(sizin|bizim)\s+(\w+?(ınız|iniz|unuz|ünüz|ımız|imiz|umuz|ümüz))\b", lowered):
        fail("redundant-pronoun", f"{match.group(0)!r}: the suffix already says it, drop {match.group(1)!r}")

    # Numbered chains as a frame.
    if "birincisi" in lowered and "ikincisi" in lowered:
        warn("birincisi/ikincisi chain; vary how the points are introduced")

    # Decimal points instead of commas, in a language that uses commas.
    for match in re.findall(r"\b\d+\.\d+\b", text):
        fail("decimal", f"{match}: Azerbaijani uses a comma as the decimal mark")

    # A number joined to a suffix needs a hyphen: 2026-cı, 19-cu.
    for match in re.findall(r"\b\d+(?:ci|cı|cu|cü|də|da|dən|dan|lik|lıq)\b", lowered):
        fail("number-suffix", f"{match!r}: a suffix on a number needs a hyphen")

    opening = " ".join(sentences(strip_tags(post["content"]))[:2]).lower()
    for phrase in SCENE_OPENERS:
        if phrase in opening:
            fail("scene-opening", f"opens with an imagined scene ({phrase!r}); open with the fact")
    if not re.search(r"\d", opening):
        warn("no number in the first two sentences; the opening should carry the fact")

    # A number in the title has to say what it does.
    title = post["title"].lower()
    if re.search(r"\d+\s*(dəfə|faiz)", title) and not re.search(
            r"(baha|ucuz|çox|az|artıq|aşağı|yüksək)", title):
        fail("title-number", "a number in the title without a word saying what it means")


# --------------------------------------------------------------------------
# 5. Medical safety
# --------------------------------------------------------------------------

DOSE = re.compile(r"\d+\s*(mq|mg|ml|qram|gram)\b[^.]{0,40}\b(gündə|saatda|dəfə|hər)\b", re.I)


def check_safety(post: dict) -> None:
    text = strip_tags(post["content"])
    for match in DOSE.finditer(text):
        fail("dosing", f"reads as a dosing instruction: {match.group(0)!r}. "
             "No doses for prescription medicines; over the counter only as the leaflet states.")
    lowered = text.lower()
    if "diaqnoz qoy" in lowered and "qoymur" not in lowered:
        warn("check the text does not offer a diagnosis")
    if "həkimə müraciət edin" in lowered and lowered.count("həkimə müraciət edin") > 2:
        warn("'həkimə müraciət edin' repeated; say specifically when and why instead")


# --------------------------------------------------------------------------
# 6. The numbers have to be ours
# --------------------------------------------------------------------------

def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "azdoc-blog-check"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", "replace")


def check_facts(post: dict) -> None:
    """Every manat figure must appear in what our own API returns.

    This is the check that makes the post trustworthy rather than plausible.
    `sources` in the draft lists the API paths the figures came from; each is
    fetched and every price in the text must be found in one of them.
    """
    text = strip_tags(post["content"])
    # Whole manats as well as decimals: laboratory prices are written "22 manat".
    prices = sorted(set(re.findall(r"\b(\d+(?:,\d{1,2})?)\s*(?:manat|AZN)", text)))
    if not prices:
        warn("no prices in the post; our own data is the reason to read it")
        return

    sources = post.get("sources", [])
    if not sources:
        # A published post carries no sources: the draft held them. Checking a
        # live post can confirm everything else, but not where a figure came
        # from, and pretending otherwise would make this a failure nobody can
        # act on.
        if post.get("_published"):
            warn(f"{len(prices)} price(s) here cannot be traced from the published row; "
                 "the draft's `sources` are what verify them")
        else:
            fail("sources", f"{len(prices)} price(s) in the text and no `sources` listed to verify them against")
        return

    corpus = ""
    for path in sources:
        url = path if path.startswith("http") else f"{SITE}{path}"
        try:
            corpus += fetch(url)
        except Exception as error:
            fail("sources", f"source {url} could not be read: {error}")

    allowed = set(post.get("unverified", []))
    for price in prices:
        plain = price.replace(",", ".")
        # 2,32 -> 2.32, and the API may render it as 2.3 or 2.30
        variants = {plain, plain.rstrip("0").rstrip("."), f"{float(plain):g}"}
        if any(v in corpus for v in variants):
            continue
        if price in allowed:
            warn(f"{price} manat is not in the sources, allowed by hand")
        else:
            fail("price-unverified", f"{price} manat does not appear in any listed source; "
                 "quote figures from the API, never from memory")


def check_links(post: dict) -> None:
    for href in sorted(set(re.findall(r'<a\s+href="(/[^"]*)"', post["content"]))):
        try:
            request = urllib.request.Request(
                SITE + href, headers={"User-Agent": "azdoc-blog-check"}, method="HEAD")
            urllib.request.urlopen(request, timeout=20)
        except Exception:
            fail("dead-link", f"internal link {href} does not resolve")


# --------------------------------------------------------------------------

def load_published(slug: str) -> dict:
    # JSON out of MySQL, so a tab or newline inside the body cannot split a
    # field and the text arrives exactly as stored.
    query = (
        "SELECT JSON_OBJECT('title', title, 'summary', summary, "
        f"'language', language, 'content', content) FROM blog_post WHERE slug = '{slug}'"
    )
    done = subprocess.run(
        SSH + ["mysql --default-character-set=utf8mb4 -uroot copad_db -N -B --raw"],
        input=query, capture_output=True, text=True, encoding="utf-8")
    if done.returncode != 0 or not done.stdout.strip():
        raise SystemExit(f"could not read post {slug}: {done.stderr.strip()[:300]}")
    post = json.loads(done.stdout.strip())
    post["_published"] = True
    return post


def main() -> None:
    if len(sys.argv) == 3 and sys.argv[1] == "--slug":
        post = load_published(sys.argv[2])
    elif len(sys.argv) == 2:
        post = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    else:
        raise SystemExit(__doc__)

    for name in ("title", "summary", "content"):
        if not post.get(name):
            raise SystemExit(f"{name} is missing")
    post["content"] = unicodedata.normalize("NFC", post["content"])
    # {"waive": {"turkish:doktor": "the article is about the Turkish name"}}
    overrides.update(post.get("waive", {}))

    check_characters(post)
    check_structure(post)
    check_rhythm(post)
    check_azerbaijani(post)
    check_safety(post)
    check_links(post)
    check_facts(post)

    for message in waived:
        print(f"WAIVED {message}")
    for message in warns:
        print(f"WARN  {message}")
    for message in fails:
        print(f"FAIL  {message}")
    words = len(strip_tags(post["content"]).split())
    print(f"\n{words} words, {len(fails)} failures, {len(warns)} warnings, "
          f"{len(waived)} waived")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
