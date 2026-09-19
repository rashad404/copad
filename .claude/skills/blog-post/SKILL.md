---
name: blog-post
description: Write and publish an Azerbaijani blog post on azdoc.ai. Use when asked for a blog post, an article, blog content, SEO content, or to fill the blog. Produces one post that reads as written by an Azerbaijani who knows the subject, grounded in azdoc's own drug prices, laboratory prices and doctor directory, then publishes it live and verifies the URL.
---

# Writing a blog post for azdoc

One post at a time, published live, in Azerbaijani.

The bar is not "an article about the topic". It is: **an Azerbaijani reader
finds a real number they could not get anywhere else, and never wonders who or
what wrote it.**

Read `references/azerbaijani.md` before writing a word, and
`references/human-texture.md` before deciding the shape. They are the substance
of this skill; everything here is the procedure around them.

## What azdoc has that no other Azerbaijani health site has

This decides the topic, so it comes first.

- **10,738 registered drugs with 16,106 published pack prices**, and cheaper
  same-ingredient alternatives, queryable per product.
- **Two laboratories with comparable prices**, 19 analytes priced at both.
- **112 doctors** with specialties and clinics.

A post that uses none of this is a post anybody could have written, and it will
rank like one. A post that says what ibuprofen actually costs in Baku this
month, and which pack is cheapest, cannot be produced by a competitor or a
chatbot.

## Step 1 - do not repeat a topic

```bash
curl -s "https://azdoc.ai/api/blog?size=100" | python3 -c "import json,sys;[print(p['title']) for p in json.load(sys.stdin)['content']]"
```

Pick something a person in Azerbaijan actually types into Google. Prefer
questions with a local answer: prices, what a test result means, when to go to
a doctor, what is sold without a prescription.

## Step 2 - get the real numbers

Never quote a price from memory. Ours are the point.

```bash
# What a drug costs, and the cheaper equivalents
curl -s "https://azdoc.ai/api/medicines?q=ibuprofen&size=5" | python3 -m json.tool | head -40
curl -s "https://azdoc.ai/api/medicines/<slug>/alternatives" | python3 -m json.tool | head -30

# Laboratory prices for the same test, cheapest first
curl -s "https://azdoc.ai/api/labs/comparable?lang=az" | python3 -m json.tool | head -30
curl -s "https://azdoc.ai/api/labs/compare/<analyte>?lang=az" | python3 -m json.tool

# Doctors, if the post sends somebody to one
curl -s "https://azdoc.ai/api/doctors?specialty=<code>&size=5" | python3 -m json.tool | head -30
```

Write the figures into the draft exactly as returned. If a price is quoted,
say once that pharmacies charge differently.

## Step 3 - write it

**Shape**

- 1200-1800 words.
- Starts at `<h2>`. The page renders the title itself, so the content has no
  `<h1>`.
- HTML: `<h2>`, `<h3>`, `<p>`, `<ul>`, `<li>`, `<strong>`, `<a>`. Nothing else.
- Headings in sentence case, and not all the same grammatical shape.
- Answer the question the title asks in the first two sentences. Do not open
  with background.

**Language** - `references/azerbaijani.md`. The short version: no `olaraq`,
no `hansı ki`, no Turkish medical vocabulary, no `sizin` where the suffix
already says it, `İ` and `ı` correct everywhere.

**Texture** - `references/human-texture.md`. The short version: vary sentence
length hard, one very short paragraph, no rule of three everywhere, no
summarising conclusion, at least one honest uncertainty.

**Internal links**, 2-4 of them, where they genuinely help:
`/dermanlar/<slug>`, `/laboratoriyalar/muqayise`, `/hekimler`, `/chat`.

**SEO**

- The phrase a person would search goes in the title, in the first 100 words,
  and in at least two `<h2>`s. Nowhere else on purpose.
- Title about 60 characters. It is also the `<title>` tag.
- `summary` is the meta description: 150-160 characters, plain text, no HTML,
  and it must read as a sentence rather than a keyword list. Hard limit 500
  characters in the database.
- Slug: short, Azerbaijani words, transliterated ASCII, no stop words.

## Step 4 - medical safety, non-negotiable

This is a health site under a real doctor's name, and it is also what keeps the
app in the stores.

- **No doses for anything sold on prescription.** Not even a typical range, not
  even when the reader asks. Say what the medicine is for and that the amount
  is set by whoever prescribes it.
- **Over-the-counter doses only as the registered leaflet states them**, and
  say that is where they come from.
- **No diagnosis.** Describe what a symptom can mean, not what the reader has.
- **Emergency signs come first**, in their own short section, with 103, if the
  topic has any.
- **Do not write "consult your doctor" as padding.** Say specifically when a
  doctor is needed and why.
- Nothing invented: no fake patients, no made-up studies, no statistics that
  did not come from a real source.
- `azdoc` is not a medical device and does not diagnose. Do not imply it does.

## Step 5 - the featured image

```bash
python3 .claude/skills/blog-post/scripts/cover.py <slug> "<what to photograph, in English>"
```

Describe an **ordinary object scene** connected to the topic: blister packs on
a kitchen table, a thermometer beside a glass of water, a pharmacy shelf from
the side, a lab request form on a counter. The script forbids people, faces,
hands, readable text, logos and the glossy blue healthcare look, which is where
AI images give themselves away.

Look at the result before using it. If anything is deformed, if there is text
that resolves into letters, or if it looks like stock photography, run it again
with a different scene.

## Step 6 - publish

```bash
python3 .claude/skills/blog-post/scripts/publish.py /tmp/post.json
```

It refuses a duplicate slug, a summary over 500 characters, an `<h1>`, a
missing image file, and any long dash, ellipsis character or curly quote. Then
it writes the post live and fetches the URL to prove it renders.

Commit the image afterwards, and deploy so it is served:

```bash
git add next-frontend/public/blog-images && git commit && ./deploy.sh
```

## Step 7 - read it back as a reader

Open the live URL. Read the first three sentences aloud.

- Does it sound like a person, or like a form?
- Is there a number in it that only we have?
- Would an Azerbaijani say it this way?

If any answer is no, edit the post in `/admin/posts` rather than leaving it.

## Cadence

Three posts in fifteen months is why the blog ranks for nothing. But volume
without care is what Google's scaled-content rules exist to punish, and sites
that published bulk AI pages lost 50-80 percent of their traffic in the 2026
core updates. One genuinely useful post a week beats thirty thin ones, and it
is the only rate this skill is meant to be run at.
