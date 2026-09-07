package com.drcopad.copad.service;

import com.drcopad.copad.entity.Document;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.*;
import java.util.regex.Pattern;

/**
 * Finds the passages of a person's documents that bear on their question.
 *
 * Lab values already reach the assistant because they are structured. A
 * discharge summary is not: it is a page of prose that was stored, read and
 * then never seen again. Someone can upload a hospital letter and have the
 * assistant answer as though it does not exist.
 *
 * Deliberately not embeddings. A person holds tens of documents, not millions,
 * so term overlap over their own small collection finds the right page without
 * a vector store, an embedding bill, or a second copy of patient text living
 * somewhere else. If this stops being good enough the answer is a better ranker,
 * not more infrastructure.
 *
 * Everything it returns is attributed. An answer drawn from a document has to
 * name the document, or it is an unverifiable claim about a person's own records
 * - the failure the confirmation step exists to prevent, arriving by another
 * route.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentRetrievalService {

    /** Enough for an answer, short of crowding out the question. */
    private static final int MAX_PASSAGES = 4;
    private static final int PASSAGE_CHARS = 700;
    private static final int MIN_TERM_LENGTH = 4;

    /**
     * Added to every passage of a document whose title the question names.
     *
     * Enough to carry a passage over the threshold on its own, because someone
     * who names the document has already said which one they want. A discharge
     * summary talks about ceftriaxone, not about "medication", so its contents
     * may share no words at all with the question that is plainly about it.
     */
    private static final double TITLE_BONUS = 1.5;

    /**
     * Below this, the match is coincidence rather than relevance.
     *
     * Set so that one distinctive word is enough - "qlukoza" alone should find
     * the glucose result - while one short word is not, because short words are
     * common words. Two terms of any length clear it comfortably.
     */
    private static final double MIN_SCORE = 2.0;

    private static final Pattern WORD = Pattern.compile(
            "[\\p{L}\\p{N}]{2,}", Pattern.UNICODE_CHARACTER_CLASS);

    /**
     * Words too common to indicate anything, in the three languages people
     * write questions in here.
     */
    private static final Set<String> STOP = Set.of(
            "nedir", "ne", "olan", "üçün", "ucun", "haqqinda", "haqqında", "mene", "mənə",
            "menim", "mənim", "idi", "var", "yox", "bunu", "bunun", "hansi", "hansı",
            "what", "when", "where", "which", "that", "this", "have", "with", "from",
            "about", "should", "would", "could", "does", "did", "was", "were",
            "что", "как", "мой", "моя", "это", "был", "была", "для", "про");

    private final FamilyService familyService;
    private final DocumentService documents;
    private final Deidentifier deidentifier;

    /**
     * @param document the document a passage came from, so the answer can point
     *                 at something the person can open
     */
    public record Passage(Long documentId, String title, String date, String text, double score) {
    }

    /**
     * The context block, empty when nothing in the person's documents bears on
     * the question - which is most of the time, and must cost nothing.
     */
    @Transactional(readOnly = true)
    public String contextFor(Long memberId, Long userId, String question) {
        List<Passage> passages = retrieve(memberId, userId, question);
        if (passages.isEmpty()) return "";

        StringBuilder block = new StringBuilder("""

                FROM THIS PERSON'S OWN DOCUMENTS
                Passages from documents they uploaded, found by matching their question.

                Rules:
                - Cite the document by name when you use it, so they can open it and check.
                - These are extracts, not the whole document. If a passage does not answer
                  the question, say so rather than filling the gap.
                - A document records what was true when it was written. Say when it is from.
                """);

        for (Passage p : passages) {
            block.append("\n[").append(p.title());
            if (p.date() != null) block.append(", ").append(p.date());
            block.append("]\n").append(p.text()).append("\n");
        }

        log.info("Chat grounded in {} document passages for member {}", passages.size(), memberId);
        return block.toString();
    }

    @Transactional(readOnly = true)
    public List<Passage> retrieve(Long memberId, Long userId, String question) {
        Set<String> terms = terms(question);
        if (terms.isEmpty()) return List.of();

        List<Document> all;
        try {
            all = documents.list(memberId, userId);
        } catch (RuntimeException e) {
            // Retrieval failing must never cost the person their answer.
            log.warn("Document retrieval unavailable for member {}: {}",
                    memberId, e.getClass().getSimpleName());
            return List.of();
        }

        List<Passage> scored = new ArrayList<>();
        for (Document document : all) {
            String text = document.getExtractedText();
            if (text == null || text.isBlank()) continue;

            // Naming the document is itself a strong signal. Someone asking
            // "what does my discharge summary say" has told us exactly which
            // document they mean, and its contents may share no words with the
            // question at all - a summary talks about ceftriaxone, not about
            // "medication".
            double titleBonus = score(document.getTitle() == null ? "" : document.getTitle(),
                    terms) > 0 ? TITLE_BONUS : 0;

            // De-identified here, not at the point of sending, so a passage
            // cannot reach the prompt with a letterhead attached.
            for (String passage : split(deidentifier.clean(text))) {
                double score = score(passage, terms) + titleBonus;
                if (score >= MIN_SCORE) {
                    scored.add(new Passage(document.getId(),
                            document.getTitle() == null ? "Document" : document.getTitle(),
                            document.getDocumentDate() == null
                                    ? null : document.getDocumentDate().toString(),
                            passage.strip(), score));
                }
            }
        }

        scored.sort(Comparator.comparingDouble(Passage::score).reversed());
        return scored.stream().limit(MAX_PASSAGES).toList();
    }

    /**
     * Splits on blank lines, then on length.
     *
     * A report is laid out in blocks and a blank line is where one subject ends.
     * Cutting purely by character count would split a result from its reference
     * range, which is the pair that carries the meaning.
     */
    private List<String> split(String text) {
        List<String> passages = new ArrayList<>();
        for (String block : text.split("\\n\\s*\\n")) {
            String trimmed = block.strip();
            if (trimmed.isEmpty()) continue;

            while (trimmed.length() > PASSAGE_CHARS) {
                int cut = trimmed.lastIndexOf('\n', PASSAGE_CHARS);
                if (cut < PASSAGE_CHARS / 2) cut = PASSAGE_CHARS;
                passages.add(trimmed.substring(0, cut));
                trimmed = trimmed.substring(cut).strip();
            }
            if (!trimmed.isEmpty()) passages.add(trimmed);
        }
        return passages;
    }

    /**
     * How well a passage answers the question.
     *
     * Distinct terms matched, not total occurrences: a page that repeats one
     * word twenty times is not more relevant than a page that mentions four of
     * them once. Longer terms count for more, being the ones that carry meaning.
     */
    private double score(String passage, Set<String> terms) {
        String haystack = fold(passage);
        double score = 0;
        for (String term : terms) {
            if (haystack.contains(term)) {
                // Longer words carry the meaning. A seven-letter term reaches
                // the threshold alone; a four-letter one needs company.
                score += 1.0 + Math.min(term.length() - MIN_TERM_LENGTH, 6) * 0.35;
            } else {
                String stem = stem(term);
                // Worth slightly less than an exact hit, because a shared stem
                // is weaker evidence than a shared word.
                if (stem != null && haystack.contains(stem)) {
                    score += 0.8 + Math.min(stem.length() - MIN_TERM_LENGTH, 6) * 0.35;
                }
            }
        }
        return score;
    }

    /**
     * The front of a word, for matching across its endings.
     *
     * Azerbaijani builds meaning by suffix: a person asks about their
     * "epikrizimde" and the document says "epikrizi". Turkish, Russian and
     * Azerbaijani all inflect this way, so exact matching misses the ordinary
     * case rather than an edge one.
     *
     * A prefix is a crude stemmer and deliberately so. Anything cleverer needs
     * a morphological analyser per language, and getting a stem slightly wrong
     * costs a passage that was already only a candidate.
     */
    private String stem(String term) {
        return term.length() >= 7 ? term.substring(0, Math.max(6, term.length() - 4)) : null;
    }

    /** The words in a question worth matching on. */
    private Set<String> terms(String question) {
        if (question == null || question.isBlank()) return Set.of();

        Set<String> terms = new LinkedHashSet<>();
        var matcher = WORD.matcher(question);
        while (matcher.find()) {
            String word = fold(matcher.group());
            if (word.length() >= MIN_TERM_LENGTH && !STOP.contains(word)) {
                terms.add(word);
            }
        }
        return terms;
    }

    /**
     * Lowercased and accent-folded.
     *
     * A person types "qlukoza" and the report prints "Qlükoza". Matching them as
     * different words would make the whole feature miss on its commonest case.
     */
    private String fold(String value) {
        String s = value.toLowerCase(Locale.ROOT)
                .replace("ə", "e").replace("ı", "i").replace("ğ", "g")
                .replace("ş", "s").replace("ç", "c").replace("ö", "o").replace("ü", "u");
        return Normalizer.normalize(s, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
    }
}
