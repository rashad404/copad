package com.drcopad.copad.service;

import com.drcopad.copad.entity.AbnormalFlag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Pulls analyte values out of the text of a laboratory report.
 *
 * Azerbaijani labs issue PDFs as tables, and once a PDF is flattened to text a
 * row looks roughly like:
 *
 *   Hemoglobin        14.2    g/dL     12.0 - 16.0
 *   Qlükoza           5,4     mmol/L   3,9-6,1
 *   HGB               14.2 g/dL        (12-16)
 *
 * There is no standard layout, so this recognises a shape rather than a format:
 * a label, a number, an optional unit, and an optional range. Anything it
 * cannot read confidently is skipped - a missed value costs a person one manual
 * entry, while a misread one puts a wrong number in a medical record.
 *
 * Everything it produces is unconfirmed until a person accepts it.
 */
@Slf4j
@Component
public class LabReportParser {

    /**
     * Label, value, optional unit, optional reference range.
     *
     * Decimal commas are normalised first, so only the dot form appears here.
     */
    private static final Pattern ROW = Pattern.compile(
            "^\\s*([\\p{L}][\\p{L}0-9 ()/%.,'-]{1,60}?)\\s*[:\\t ]\\s*"
            + "(-?\\d+(?:\\.\\d+)?)\\s*"
            + "([\\p{L}%/µ^0-9.]{1,20})?\\s*"
            + "(?:[(\\[]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*[-–—]\\s*(-?\\d+(?:\\.\\d+)?)\\s*[)\\]]?)?\\s*$");

    /** Words that appear at the start of a line but never name an analyte. */
    private static final List<String> NOT_ANALYTES = List.of(
            "tarix", "date", "sehife", "page", "hesab", "invoice", "telefon", "phone",
            "unvan", "address", "hekim", "doctor", "pasiyent", "patient", "ad soyad",
            "name", "yas", "age", "cins", "sex", "laboratoriya", "laboratory",
            "netice", "result", "reference", "istinad", "vahid", "unit", "total",
            "cem", "qiymet", "price", "azn", "usd");

    /** Common aliases, so one analyte does not become several charts. */
    private static final Map<String, String> ALIASES = Map.ofEntries(
            Map.entry("hgb", "hemoglobin"),
            Map.entry("hb", "hemoglobin"),
            Map.entry("hemoqlobin", "hemoglobin"),
            Map.entry("wbc", "leukocytes"),
            Map.entry("leykosit", "leukocytes"),
            Map.entry("leykositler", "leukocytes"),
            Map.entry("rbc", "erythrocytes"),
            Map.entry("eritrosit", "erythrocytes"),
            Map.entry("plt", "platelets"),
            Map.entry("trombosit", "platelets"),
            Map.entry("qlukoza", "glucose"),
            Map.entry("qan sekeri", "glucose"),
            Map.entry("xolesterin", "cholesterol"),
            Map.entry("kreatinin", "creatinine"),
            Map.entry("sidik covheri", "urea"),
            Map.entry("bilirubin umumi", "bilirubin total"),
            Map.entry("alt", "alanine aminotransferase"),
            Map.entry("ast", "aspartate aminotransferase"),
            Map.entry("tsh", "thyroid stimulating hormone"),
            Map.entry("d vitamini", "vitamin d"),
            Map.entry("b12 vitamini", "vitamin b12"),
            Map.entry("demir", "iron"),
            Map.entry("ferritin", "ferritin"));

    public record ParsedResult(String analyte, String analyteKey, BigDecimal value,
                               String unit, BigDecimal referenceLow, BigDecimal referenceHigh,
                               AbnormalFlag flag) {
    }

    public List<ParsedResult> parse(String text) {
        List<ParsedResult> results = new ArrayList<>();
        if (text == null || text.isBlank()) return results;

        for (String rawLine : text.split("\\r?\\n")) {
            // Azerbaijani and Russian reports use a decimal comma; a value read
            // as 5 instead of 5,4 is wrong by an order of magnitude.
            String line = rawLine.replaceAll("(\\d),(\\d)", "$1.$2").trim();
            if (line.length() < 4 || line.length() > 200) continue;

            Matcher m = ROW.matcher(line);
            if (!m.matches()) continue;

            String label = m.group(1).trim().replaceAll("[.:,\\s]+$", "");
            String key = normaliseKey(label);
            if (key.isBlank() || key.length() < 2) continue;
            if (NOT_ANALYTES.stream().anyMatch(key::startsWith)) continue;
            // A label that is mostly digits is a row number or a date fragment.
            if (label.replaceAll("[^\\p{L}]", "").length() < 2) continue;

            BigDecimal value = new BigDecimal(m.group(2));
            String unit = m.group(3) == null ? null : m.group(3).trim();
            // A bare number in the unit position is the next column, not a unit.
            if (unit != null && (unit.isBlank() || unit.matches("[0-9.]+"))) unit = null;

            BigDecimal low = m.group(4) == null ? null : new BigDecimal(m.group(4));
            BigDecimal high = m.group(5) == null ? null : new BigDecimal(m.group(5));

            results.add(new ParsedResult(label, ALIASES.getOrDefault(key, key),
                    value, unit, low, high, flagFor(value, low, high)));
        }

        log.info("Parsed {} candidate lab values", results.size());
        return results;
    }

    /**
     * Flags against the laboratory's own range only.
     *
     * No range on the report means no flag: ranges differ by lab and method,
     * and substituting a generic one would produce confident wrong answers.
     */
    private AbnormalFlag flagFor(BigDecimal value, BigDecimal low, BigDecimal high) {
        if (value == null || low == null || high == null) return null;
        if (value.compareTo(low) < 0) return AbnormalFlag.LOW;
        if (value.compareTo(high) > 0) return AbnormalFlag.HIGH;
        return AbnormalFlag.NORMAL;
    }

    /** Lowercase, accent-folded, punctuation-stripped, so aliases can match. */
    String normaliseKey(String label) {
        String s = label.toLowerCase(Locale.ROOT)
                .replace("ə", "e").replace("ı", "i").replace("ğ", "g")
                .replace("ş", "s").replace("ç", "c").replace("ö", "o").replace("ü", "u");
        s = Normalizer.normalize(s, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        return s.replaceAll("[^a-z0-9 ]", " ").replaceAll("\\s+", " ").trim();
    }
}
