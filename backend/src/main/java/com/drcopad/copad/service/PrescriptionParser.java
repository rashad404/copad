package com.drcopad.copad.service;

import com.drcopad.copad.entity.MedicationRoute;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Reads medications out of a prescription.
 *
 * There is no standard format. An Azerbaijani prescription may be a numbered
 * list, a Latin Rp./D.S. block, or a line per drug with the dose and schedule
 * run together, in Azerbaijani, Russian or English. So this does not try to
 * understand the document; it looks for the three things that identify a
 * medication line - a name, a dose, and how often - and reports what it found
 * and what it did not.
 *
 * Everything it produces is a proposal. A misread dose looks exactly like a
 * correct one, and a medication list is acted on, so the caller stores these
 * unconfirmed and a person accepts each row.
 */
@Slf4j
@Service
public class PrescriptionParser {

    /**
     * A dose: a number and a unit.
     *
     * The comma is a decimal separator here, as it is on Azerbaijani and
     * Russian documents; reading "0,5 g" as "0" would be a tenfold error in the
     * direction that matters.
     */
    private static final Pattern DOSE = Pattern.compile(
            // UNICODE_CHARACTER_CLASS matters here: \\b is ASCII-only by
            // default, so "200 mg" matched and "200 mg" written in Cyrillic did
            // not, silently dropping the dose off any Russian-language line.
            "(?<amount>\\d+(?:[.,]\\d+)?)\\s*"
                    + "(?<unit>mg|mq|q\\.?|g|gr|mcg|mkg|[µu]g|ml|мл|мг|г|IU|BV|TV)\\b",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS);

    /**
     * How often, in the forms that actually appear.
     *
     * "gündə 3 dəfə", "3 dəfə gündə", "3x1", "2 раза", "twice daily", "1-0-1".
     *
     * Written to accept the folded spelling too - "gunde 3 defe" - because
     * text extraction drops diacritics and people type without them, and a
     * frequency that only parses on a perfectly typed document parses on
     * almost none.
     */
    private static final List<Pattern> FREQUENCY = List.of(
            Pattern.compile("g[uü]n(?:d[əe])\\s*(\\d+)\\s*d[əe]f[əe]", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS),
            Pattern.compile("(\\d+)\\s*d[əe]f[əe]\\s*g[uü]n(?:d[əe])", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS),
            Pattern.compile("(\\d+)\\s*раз", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS),
            Pattern.compile("(\\d+)\\s*times?\\s*(?:a\\s*|per\\s*)?day", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS),
            Pattern.compile("(\\d+)\\s*[xх*]\\s*\\d+",
                    Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS));

    /** English prescriptions write the number as a word as often as a digit. */
    private static final Map<Pattern, Integer> WORD_FREQUENCY = Map.of(
            Pattern.compile("\\bonce\\b|\\bod\\b", Pattern.CASE_INSENSITIVE), 1,
            Pattern.compile("\\btwice\\b|\\bbid\\b", Pattern.CASE_INSENSITIVE), 2,
            Pattern.compile("\\bthrice\\b|\\btid\\b", Pattern.CASE_INSENSITIVE), 3);

    /** "1-0-1" means morning and evening: three slots, count the non-zero ones. */
    private static final Pattern SLOTS = Pattern.compile("\\b(\\d)\\s*-\\s*(\\d)\\s*-\\s*(\\d)\\b");

    private static final Pattern DURATION_DAYS = Pattern.compile(
            "(\\d+)\\s*(?:g[uü]n|дней|дня|days?)\\b", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS);

    /** Route, where the form says it plainly. */
    private static final Map<Pattern, MedicationRoute> ROUTES = Map.of(
            Pattern.compile("tablet|tab\\.|kapsul|caps?\\.|h[əe]b|табл", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS),
            MedicationRoute.ORAL,
            Pattern.compile("[şs][əe]rb[əe]t|sirop|suspenziya|syrup", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS),
            MedicationRoute.ORAL,
            Pattern.compile("m[əe]lh[əe]m|krem|gel|maz|ointment|cream", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS),
            MedicationRoute.TOPICAL,
            Pattern.compile("inhal|sprey|aerozol", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS),
            MedicationRoute.INHALED,
            Pattern.compile("inyeksiya|ampul|[şs]prits|укол|injection", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS),
            MedicationRoute.INJECTION,
            Pattern.compile("burun|nazal|nasal", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS),
            MedicationRoute.NASAL,
            Pattern.compile("g[öo]z damc[ıi]|damc[ıi] g[öo]z|eye drop|глазн", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS),
            MedicationRoute.OPHTHALMIC);

    /**
     * Lines that are part of a prescription but never a drug.
     *
     * A header carrying a patient's name would otherwise be proposed as a
     * medication, which is both wrong and a privacy problem in a shared list.
     */
    private static final Pattern NOT_A_DRUG = Pattern.compile(
            // Rp. is not here: it is a marker that introduces a drug, and
            // treating it as a header threw away the only line that mattered.
            "^\\s*(pasiyent|x[əe]st[əe]|h[əe]kim|doctor|klinika|clinic|"
                    + "tarix|date|[üu]nvan|telefon|phone|diaqnoz|diagnos|imza|signature|"
                    + "пациент|врач|дата|диагноз|ə\\.?v\\.?|ya[şs]|age)\\b.*",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS);

    /**
     * Where a line stops naming a drug and starts saying how to take it.
     *
     * A trailing \\b would not fire after "dəfə", so the boundary is only
     * required at the start.
     */
    private static final Pattern INSTRUCTION_START = Pattern.compile(
            "\\b(g[uü]n(?:d[əe])|d[əe]f[əe]|s\\.|d\\.t\\.d|раз|times?|daily)",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS);

    /** Leading list markers: "1.", "2)", "-", "Rp.:". */
    private static final Pattern LEADING_MARKER = Pattern.compile(
            "^\\s*(?:\\d+\\s*[.)]|[-*•]|rp\\.?\\s*:?)\\s*", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS);

    /**
     * @param name       the drug as written, which is what a reviewer recognises
     * @param doseAmount null when the line gave no dose - common, and not a
     *                   reason to drop the drug
     * @param frequency  a plain label such as "3 times a day", null when absent
     * @param durationDays how long, when the line says
     */
    public record ParsedMedication(String name, BigDecimal doseAmount, String doseUnit,
                                   String frequency, Integer durationDays,
                                   MedicationRoute route, String sourceLine) {
    }

    public List<ParsedMedication> parse(String text) {
        if (text == null || text.isBlank()) return List.of();

        List<ParsedMedication> found = new ArrayList<>();
        Set<String> seen = new HashSet<>();

        for (String raw : text.split("\\R")) {
            String line = raw.trim();
            if (line.length() < 3 || NOT_A_DRUG.matcher(line).matches()) continue;

            String body = LEADING_MARKER.matcher(line).replaceFirst("");
            String name = drugName(body);
            if (name == null) continue;

            // The same drug often appears twice, once named and once in the
            // instruction line beneath it.
            if (!seen.add(name.toLowerCase(Locale.ROOT))) continue;

            Matcher dose = DOSE.matcher(body);
            BigDecimal amount = null;
            String unit = null;
            if (dose.find()) {
                amount = new BigDecimal(dose.group("amount").replace(',', '.'));
                unit = canonicalUnit(dose.group("unit"));
            }

            found.add(new ParsedMedication(name, amount, unit, frequency(body),
                    durationDays(body), route(body), line));
        }

        log.info("Prescription produced {} candidate medications", found.size());
        return found;
    }

    /**
     * The drug name: the words before the dose, or before the instructions.
     *
     * Taken as written rather than matched against the catalogue here. A
     * prescription routinely names a product we do not carry, or spells one
     * differently, and dropping those would silently lose medications from a
     * list whose whole value is being complete.
     */
    private String drugName(String body) {
        Matcher dose = DOSE.matcher(body);
        String candidate = dose.find() ? body.substring(0, dose.start()) : body;

        // Cut at the point instructions begin, for lines with no dose at all.
        candidate = INSTRUCTION_START.split(candidate)[0];

        String name = candidate.replaceAll("[,;:\\-–]+\\s*$", "").trim();
        if (name.length() < 3 || name.length() > 120) return null;
        // A name has to contain letters; "20 N" is a pack size.
        if (!name.matches(".*\\p{L}{3,}.*")) return null;
        return name;
    }

    private String frequency(String body) {
        for (Pattern pattern : FREQUENCY) {
            Matcher m = pattern.matcher(body);
            if (m.find()) {
                int times = Integer.parseInt(m.group(1));
                if (times >= 1 && times <= 12) return label(times);
            }
        }
        for (Map.Entry<Pattern, Integer> entry : WORD_FREQUENCY.entrySet()) {
            if (entry.getKey().matcher(body).find()) return label(entry.getValue());
        }
        Matcher slots = SLOTS.matcher(body);
        if (slots.find()) {
            int times = 0;
            for (int i = 1; i <= 3; i++) {
                if (Integer.parseInt(slots.group(i)) > 0) times++;
            }
            if (times > 0) return label(times);
        }
        return null;
    }

    /** A person reads this, so "1 time a day", not "1 times a day". */
    private String label(int times) {
        return times == 1 ? "1 time a day" : times + " times a day";
    }

    private Integer durationDays(String body) {
        Matcher m = DURATION_DAYS.matcher(body);
        if (!m.find()) return null;
        int days = Integer.parseInt(m.group(1));
        // A year of treatment on a prescription line is a misread, usually a
        // date or a pack count.
        return days >= 1 && days <= 365 ? days : null;
    }

    private MedicationRoute route(String body) {
        for (Map.Entry<Pattern, MedicationRoute> entry : ROUTES.entrySet()) {
            if (entry.getKey().matcher(body).find()) return entry.getValue();
        }
        return null;
    }

    /** One spelling per unit, so doses can be compared later. */
    private String canonicalUnit(String unit) {
        String lower = unit.toLowerCase(Locale.ROOT).replace(".", "");
        return switch (lower) {
            case "mg", "mq", "мг" -> "mg";
            case "g", "gr", "q", "г" -> "g";
            case "mcg", "mkg", "µg", "ug" -> "mcg";
            case "ml", "мл" -> "ml";
            case "iu" -> "IU";
            default -> lower;
        };
    }
}
