package com.drcopad.copad.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Pattern;

/**
 * Real Azerbaijani drug prices, for questions that mention a drug.
 *
 * This is the part a general assistant cannot do. Asked what Nurofen costs, or
 * whether there is a cheaper equivalent, a model can only generalise; the
 * registry here holds 10,738 products and 16,106 published pack prices, so the
 * answer can name the pack and the manat figure.
 *
 * Matching is deliberately strict. A word is looked up as a whole product name
 * or a whole active ingredient, never as a substring: a fuzzy match over ten
 * thousand rows would attach prices to a question that was not about a drug at
 * all, and a confidently wrong price is worse than none.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MedicineContextService {

    /** Enough to answer a question, not enough to crowd out the record. */
    private static final int MAX_MEDICINES = 3;
    private static final int MAX_PACKS = 4;

    /** Letters only, Azerbaijani included; a dosage or a date is not a name. */
    private static final Pattern WORD = Pattern.compile(
            "[\\p{L}][\\p{L}\\-]{2,}", Pattern.UNICODE_CHARACTER_CLASS);

    /**
     * Words that are a drug name or ingredient and also ordinary language, so a
     * bare mention says nothing about intent.
     *
     * Kept short on purpose. The strict matching does most of the work.
     */
    private static final Set<String> TOO_COMMON = Set.of(
            "su", "water", "oksigen", "oxygen", "hava", "qan", "blood");

    private final JdbcTemplate jdbcTemplate;

    private record Priced(String name, String slug, String ingredient, String prescriptionStatus,
                          String usage, BigDecimal lowest, BigDecimal highest, int packCount) {
    }

    /**
     * Whether the registry sells this on prescription.
     *
     * The status is free text as published, so it is read rather than trusted
     * to be one of a fixed set. Anything unrecognised is treated as
     * prescription-only, because being wrong in that direction costs a person
     * an answer and being wrong in the other costs them a dose.
     */
    private static String supplyRule(String status) {
        if (status == null || status.isBlank()) return "PRESCRIPTION OR UNKNOWN";
        String lower = status.toLowerCase(Locale.ROOT);
        // "Reseptsiz" is without a prescription; "Reseptle" is with one. The
        // first check has to come first, since one contains the other.
        if (lower.startsWith("reseptsiz") && !lower.contains("resept ilə")
                && !lower.contains("reseptlə")) {
            return "OVER THE COUNTER";
        }
        return "PRESCRIPTION OR UNKNOWN";
    }

    /**
     * The context block, or empty when the message does not name a drug we
     * carry - which is the common case, and must cost nothing.
     */
    @Transactional(readOnly = true)
    public String contextFor(String message) {
        List<String> candidates = candidates(message);
        if (candidates.isEmpty()) return "";

        List<Priced> found = lookup(candidates);
        if (found.isEmpty()) return "";

        StringBuilder block = new StringBuilder("""

                AZERBAIJANI DRUG REGISTRY - prices published in Azerbaijan, in manat (AZN).
                Use these figures when the person asks about cost or availability. They are
                real and local; do not replace them with a general estimate, and do not
                convert them to another currency.

                Each entry says how it is supplied. Where that is PRESCRIPTION OR UNKNOWN,
                give no dose, no strength and no schedule for it. Where it is OVER THE
                COUNTER, use only the dosing printed under "registered use" below, and say
                it comes from the registered leaflet; if there is none, say the pack
                leaflet carries it rather than supplying one.
                """);

        for (Priced p : found) {
            block.append("\n- ").append(p.name());
            if (p.ingredient() != null && !p.ingredient().isBlank()) {
                block.append(" (").append(trim(p.ingredient(), 120)).append(")");
            }
            block.append("\n  price: ").append(priceRange(p));
            block.append("\n  supply: ").append(supplyRule(p.prescriptionStatus()));
            if (p.prescriptionStatus() != null && !p.prescriptionStatus().isBlank()) {
                block.append(" (as published: ").append(trim(p.prescriptionStatus(), 80)).append(")");
            }

            // The leaflet's own words, and only for something a person can buy
            // without being told how much to take by whoever prescribed it.
            if ("OVER THE COUNTER".equals(supplyRule(p.prescriptionStatus()))
                    && p.usage() != null && !p.usage().isBlank()) {
                block.append("\n  registered use: ").append(trim(p.usage(), 600));
            }

            List<String> packs = packs(p.slug());
            if (!packs.isEmpty()) {
                block.append("\n  packs: ").append(String.join("; ", packs));
            }

            List<String> cheaper = cheaperEquivalents(p.slug());
            if (!cheaper.isEmpty()) {
                // The reason someone asks about price at all.
                block.append("\n  same ingredient, cheaper: ").append(String.join("; ", cheaper));
            }
        }

        block.append("\nPrices come from the published registry and a pharmacy may charge ")
                .append("differently. Say so once if you quote a figure.\n");

        return block.toString();
    }

    private String priceRange(Priced p) {
        if (p.lowest() == null) return "not published";
        if (p.highest() == null || p.lowest().compareTo(p.highest()) == 0) {
            return p.lowest().stripTrailingZeros().toPlainString() + " AZN";
        }
        return p.lowest().stripTrailingZeros().toPlainString() + " - "
                + p.highest().stripTrailingZeros().toPlainString() + " AZN across "
                + p.packCount() + " packs";
    }

    /** Words worth a lookup. */
    private List<String> candidates(String message) {
        if (message == null || message.isBlank()) return List.of();

        Set<String> seen = new LinkedHashSet<>();
        var matcher = WORD.matcher(message);
        while (matcher.find() && seen.size() < 12) {
            String word = matcher.group().toLowerCase(Locale.ROOT);
            if (!TOO_COMMON.contains(word)) seen.add(word);
        }
        return new ArrayList<>(seen);
    }

    /**
     * Whole-word lookup against product names and ingredients.
     *
     * A product name is often "Nurofen 200 mg tablet", so the name is matched on
     * its first word as well as in full - but still as a whole word, not as a
     * substring.
     */
    private List<Priced> lookup(List<String> words) {
        String placeholders = String.join(",", Collections.nCopies(words.size(), "?"));

        Object[] args = new Object[words.size() * 3 + 1];
        for (int i = 0; i < words.size(); i++) {
            args[i] = words.get(i);
            args[words.size() + i] = words.get(i);
            args[words.size() * 2 + i] = words.get(i);
        }
        args[args.length - 1] = MAX_MEDICINES;

        return jdbcTemplate.query("""
                SELECT m.name, m.slug, m.active_ingredient, m.prescription_status, m.usage_az,
                       MIN(p.retail_price) AS lowest,
                       MAX(p.retail_price) AS highest,
                       COUNT(p.id)         AS pack_count
                FROM medicine m
                LEFT JOIN medicine_price p
                       ON p.medicine_id = m.id AND p.retail_price IS NOT NULL
                WHERE LOWER(m.name) IN (%s)
                   OR LOWER(SUBSTRING_INDEX(m.name, ' ', 1)) IN (%s)
                   OR EXISTS (SELECT 1 FROM medicine_ingredient i
                               WHERE i.medicine_id = m.id AND i.normalised IN (%s))
                GROUP BY m.id, m.name, m.slug, m.active_ingredient, m.prescription_status, m.usage_az
                -- A product with published prices is the useful one to quote.
                ORDER BY (MIN(p.retail_price) IS NULL), COUNT(p.id) DESC, m.name
                LIMIT ?
                """.formatted(placeholders, placeholders, placeholders),
                (rs, rowNum) -> new Priced(
                        rs.getString("name"), rs.getString("slug"),
                        rs.getString("active_ingredient"), rs.getString("prescription_status"),
                        rs.getString("usage_az"),
                        rs.getBigDecimal("lowest"), rs.getBigDecimal("highest"),
                        rs.getInt("pack_count")),
                args);
    }

    private List<String> packs(String slug) {
        return jdbcTemplate.query("""
                SELECT p.trade_name, p.packaging, p.retail_price
                FROM medicine_price p
                JOIN medicine m ON m.id = p.medicine_id
                WHERE m.slug = ? AND p.retail_price IS NOT NULL
                ORDER BY p.retail_price
                LIMIT ?
                """,
                (rs, rowNum) -> {
                    String label = rs.getString("packaging");
                    if (label == null || label.isBlank()) label = rs.getString("trade_name");
                    return trim(label, 60) + " "
                            + rs.getBigDecimal("retail_price").stripTrailingZeros().toPlainString()
                            + " AZN";
                },
                slug, MAX_PACKS);
    }

    /**
     * Products sharing an ingredient that cost less.
     *
     * Generic substitution is the single most useful thing this data supports,
     * and nobody can work it out from a pharmacy shelf.
     */
    private List<String> cheaperEquivalents(String slug) {
        return jdbcTemplate.query("""
                SELECT other.name, MIN(op.retail_price) AS price
                FROM medicine m
                JOIN medicine_ingredient mine ON mine.medicine_id = m.id
                JOIN medicine_ingredient theirs ON theirs.normalised = mine.normalised
                JOIN medicine other ON other.id = theirs.medicine_id AND other.id <> m.id
                JOIN medicine_price op ON op.medicine_id = other.id AND op.retail_price IS NOT NULL
                WHERE m.slug = ?
                  AND op.retail_price < (SELECT MIN(p2.retail_price) FROM medicine_price p2
                                          WHERE p2.medicine_id = m.id AND p2.retail_price IS NOT NULL)
                GROUP BY other.id, other.name
                ORDER BY price
                LIMIT 3
                """,
                (rs, rowNum) -> trim(rs.getString("name"), 60) + " "
                        + rs.getBigDecimal("price").stripTrailingZeros().toPlainString() + " AZN",
                slug);
    }

    private String trim(String value, int max) {
        if (value == null) return "";
        String single = value.replaceAll("\\s+", " ").trim();
        return single.length() <= max ? single : single.substring(0, max - 3) + "...";
    }
}
