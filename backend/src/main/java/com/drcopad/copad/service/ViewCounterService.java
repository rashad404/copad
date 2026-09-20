package com.drcopad.copad.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

/**
 * Counting how many times a listing was opened.
 *
 * One statement, straight to the database, deliberately not through JPA: the
 * page is served inside a read-only transaction, and a counter must neither
 * join it nor be able to roll it back. Calling a @Transactional method on this
 * same bean would not have worked anyway - a self-invocation never goes
 * through the proxy, which is how the notification writer silently did nothing
 * for a week.
 *
 * Three things this deliberately does not do.
 *
 * It does not count crawlers. Eight hundred doctor pages and ten thousand drug
 * pages are crawled constantly, and a number made mostly of Googlebot answers
 * no question anybody has.
 *
 * It does not count the same reader twice in a row. A page that reloads, or a
 * person who goes back and forth between two pages, would otherwise inflate
 * the only number we have.
 *
 * It does not record who read what. A counter on the row answers "how many",
 * which is the question; a table of events would answer "who read about which
 * drug", which is not something a health site should be able to answer.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ViewCounterService {

    /** The same reader opening the same page again inside this window is one view. */
    private static final Duration SAME_READER = Duration.ofMinutes(30);

    /** Enough for a busy hour; oldest entries are swept as it fills. */
    private static final int MAX_TRACKED = 20_000;

    private static final Pattern CRAWLER = Pattern.compile(
            "bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram"
                    + "|yandex|baidu|duckduck|applebot|lighthouse|pagespeed|headless|curl|wget",
            Pattern.CASE_INSENSITIVE);

    private final JdbcTemplate jdbcTemplate;

    /** key is "kind:id:reader", value is when it last counted. */
    private final Map<String, Instant> recent = new ConcurrentHashMap<>();

    public void doctorViewed(Long doctorId, String userAgent, String reader) {
        if (doctorId == null || !shouldCount("doctor", doctorId, userAgent, reader)) return;
        try {
            jdbcTemplate.update(
                    "UPDATE doctor SET view_count = view_count + 1 WHERE id = ?", doctorId);
        } catch (RuntimeException e) {
            // A counter is never a reason to fail the page it counts.
            log.debug("Doctor view not counted: {}", e.getClass().getSimpleName());
        }
    }

    public void medicineViewed(Long medicineId, String userAgent, String reader) {
        if (medicineId == null || !shouldCount("medicine", medicineId, userAgent, reader)) return;
        try {
            jdbcTemplate.update(
                    "UPDATE medicine SET view_count = view_count + 1 WHERE id = ?", medicineId);
        } catch (RuntimeException e) {
            log.debug("Medicine view not counted: {}", e.getClass().getSimpleName());
        }
    }

    private boolean shouldCount(String kind, Long id, String userAgent, String reader) {
        if (userAgent != null && CRAWLER.matcher(userAgent).find()) return false;

        String key = kind + ":" + id + ":" + (reader == null ? "?" : reader);
        Instant now = Instant.now();
        Instant last = recent.get(key);
        if (last != null && last.isAfter(now.minus(SAME_READER))) return false;

        if (recent.size() > MAX_TRACKED) {
            recent.entrySet().removeIf(e -> e.getValue().isBefore(now.minus(SAME_READER)));
        }
        recent.put(key, now);
        return true;
    }
}
