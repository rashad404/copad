package com.drcopad.copad.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

/**
 * Removes who a document is about before its text is sent for processing.
 *
 * The assistant needs the clinical content of a report - the values, the units,
 * the ranges - and none of the letterhead. A lab report carries the patient's
 * name, often their national ID, a phone number and the doctor's name, and all
 * of it travels to a processor abroad while contributing nothing to the answer.
 *
 * Consent covers that transfer. This reduces what is actually in it, which is
 * worth doing whatever the legal position turns out to be.
 *
 * It removes lines rather than guessing at names inside prose. A name detector
 * over Azerbaijani free text would both miss real names and delete clinical
 * words that happen to look like one - "Qlükoza" is a plausible surname to a
 * regex. Administrative header lines are structured, recognisable, and never
 * where the medical content is.
 */
@Slf4j
@Service
public class Deidentifier {

    /**
     * Header lines naming a person or a way to reach them.
     *
     * Tolerant of missing diacritics, because extraction drops them and people
     * type without them.
     */
    private static final Pattern IDENTIFYING_LINE = Pattern.compile(
            "^\\s*(pasiyent|x[əe]st[əe]|h[əe]kim|doctor|patient|physician|"
                    + "ad[ıi]|soyad|f\\.?i\\.?[şs]\\.?|full\\s*name|name|"
                    + "telefon|phone|mobil|e-?mail|e-?po[çc]t|"
                    + "[üu]nvan|address|adres|"
                    + "fin|[şs][əe]xsiyy[əe]t|passport|pasport|id\\s*n[oó]?|"
                    + "пациент|врач|телефон|адрес|фамилия|имя)"
                    + "\\s*[:\\-№].*$",
            Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CHARACTER_CLASS
                    | Pattern.MULTILINE);

    /** Azerbaijani national ID: seven characters, letters and digits. */
    private static final Pattern FIN_CODE = Pattern.compile(
            "\\b[0-9A-Z]{7}\\b(?=.*(?i:fin|[şs][əe]xsiyy[əe]t))");

    private static final Pattern PHONE = Pattern.compile(
            "(\\+994|0)\\s?\\(?\\d{2}\\)?\\s?\\d{3}\\s?\\d{2}\\s?\\d{2}");

    private static final Pattern EMAIL = Pattern.compile(
            "[\\w.+-]+@[\\w-]+\\.[\\w.]+");

    private static final String REMOVED = "[removed]";

    /**
     * The clinical content of a document, without who it is about.
     *
     * Null and blank pass through: there is nothing to protect and nothing to
     * send.
     */
    public String clean(String text) {
        if (text == null || text.isBlank()) return text;

        String cleaned = IDENTIFYING_LINE.matcher(text).replaceAll(REMOVED);
        cleaned = PHONE.matcher(cleaned).replaceAll(REMOVED);
        cleaned = EMAIL.matcher(cleaned).replaceAll(REMOVED);
        cleaned = FIN_CODE.matcher(cleaned).replaceAll(REMOVED);

        if (log.isDebugEnabled()) {
            // Lengths only. Logging either version would defeat the exercise.
            log.debug("De-identified document text: {} -> {} characters",
                    text.length(), cleaned.length());
        }
        return cleaned;
    }

    /**
     * A label for an attached file.
     *
     * Never the original filename. People name files after the patient, and the
     * name told the model nothing it could use - the content follows
     * immediately after.
     */
    public String labelFor(String contentType, int index) {
        String kind = contentType != null && contentType.startsWith("image/")
                ? "image" : "document";
        return kind + " " + index;
    }
}
