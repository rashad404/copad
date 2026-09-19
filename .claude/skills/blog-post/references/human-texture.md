# Writing that does not read as machine-written

Two different audiences judge this, and they judge different things.

- **A reader** decides in about three sentences, on rhythm and on whether the
  text knows anything specific.
- **Google** does not run a detector and has never said AI writing is banned.
  What it penalises is *scaled content abuse*: many pages produced mainly to
  rank, with nothing original in them. Sites that published volume without
  editorial care lost heavily in the 2026 core updates. So the defence is not
  disguise. It is being worth reading.

Everything below serves one of those two.

---

## What detectors actually measure

Stylometric work on this is consistent, and it names two things.

**Perplexity** - how predictable each next word is. Machine text picks the
likeliest continuation over and over.

**Burstiness** - variation in sentence length and complexity. Humans swing
wildly: a nine-word sentence, then a thirty-word one that doubles back on
itself, then three words. Models hold a steady 15-22 words per sentence for
whole paragraphs. Burstiness is the single strongest signal, and it is also
the easiest to get right on purpose.

Function-word bigrams and average sentence length carry most of the
classification weight in published feature-based detectors. All three are
rhythm, not vocabulary.

### So: rhythm rules

- Vary sentence length on purpose. Every paragraph should contain at least one
  sentence under eight words, and the article should contain several.
- At least one paragraph of a single sentence.
- Paragraphs of 2-4 sentences, but not uniformly. One of six is fine.
- Never start two consecutive sentences with the same word or shape.
- Do not end every section the same way (a summarising sentence each time is a
  tell).

---

## Phrases that mark the text immediately

The overused-word lists move with each model generation - `delve`, `tapestry`,
`meticulous`, then `fostering`, `showcasing`, `align with`, then `emphasizing`,
`enhancing`, `highlighting`. Chasing the current list is a losing game. The
structures below are the durable ones.

**In any language:**

- The rule of three, everywhere. "Sürətli, təhlükəsiz və effektiv." Real
  writers list two things, or four, or one.
- Balanced contrast as a habit: "It is not X, it is Y." Once in an article is
  style. Four times is a machine.
- A closing section that restates the article.
- Every section the same length.
- Hedging everything. Some claims are simply true; say them flat.
- Bolding a phrase in every paragraph.
- Emoji. Never here.

**In Azerbaijani specifically:**

- `Qeyd etmək lazımdır ki`
- `Ümumiyyətlə`
- `Bir sözlə`
- `Əlbəttə ki` more than once
- `Nəticə etibarilə`
- `Bu kontekstdə`
- `Yekun olaraq` (and `olaraq` at all - see the language reference)
- `birincisi... ikincisi... üçüncüsü` as a running frame

**Punctuation this project bans anyway:** long dashes, the single-character
ellipsis, curly quotes. Use `-`, `...`, `"` and `'`. This is a repo rule, and
it happens to remove one of the most reliable machine fingerprints, because
models emit the typographic forms and Azerbaijani keyboards do not.

---

## What makes text unmistakably human: specifics

This matters more than every rhythm rule combined, and it is where azdoc has a
real advantage. We hold data nobody else writing Azerbaijani health content
has.

- **Real prices from our own catalogue.** 10,738 registered products, 16,106
  published pack prices. "Nurofen 200 mq, 12 tablet - 6,80 manat, eyni tərkibli
  ibuprofen 2,40 manat" cannot be produced by a model guessing.
- **Real laboratory prices, compared.** Two laboratories, 19 analytes priced at
  both. A named test with two manat figures and the difference between them.
- **Real doctors and departments.** 112 listings, with specialties.
- **Local facts.** 103 for emergencies. Pharmacy chains people know. Which
  season the pollen comes.

Rules for using them:

1. At least one concrete, verifiable, local number per article, taken from our
   database - never from memory.
2. Name things. "Bir ağrıkəsici" is filler; "Nurofen" is information.
3. If a price is quoted, say prices vary by pharmacy, once.
4. Link the claim to the page that proves it: `/dermanlar/<slug>`,
   `/laboratoriyalar`, `/hekimler`.

## Admitting limits

Human experts say "I don't know", "it depends on the child", "this is
argued about". Machines smooth it over. One honest uncertainty per article,
where a real one exists, does more for credibility than any amount of polish.

## What not to fake

Do not invent personal anecdotes, patients, or a clinic visit that never
happened. This is a health site under a real person's name. Texture comes from
real specifics, not invented ones.
