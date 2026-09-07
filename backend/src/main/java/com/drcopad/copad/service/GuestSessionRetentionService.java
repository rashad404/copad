package com.drcopad.copad.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Removes anonymous conversations nobody came back to.
 *
 * Nothing expired before this. Guest sessions, their messages and the files
 * attached to them accumulated from the first day the product ran, because no
 * one decided otherwise - which is a decision by default, and the wrong one for
 * medical content. Data that is not held cannot leak.
 *
 * Only sessions with no account behind them, judged on last activity rather than
 * creation, so a conversation someone still returns to is never taken from under
 * them.
 *
 * The deletion order is dictated by six foreign keys pointing at a session, all
 * RESTRICT. Changing it will not fail quietly: it will fail loudly and roll
 * back, which is the right way for this to break.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GuestSessionRetentionService {

    private final JdbcTemplate jdbc;
    private final AttachmentStorageService attachments;

    /**
     * How long an untouched anonymous conversation is kept.
     *
     * Ninety days: long enough that someone returning after a season still finds
     * their history, short enough that a health question asked once does not sit
     * here for years.
     */
    @Value("${retention.guest-session-days:90}")
    private int guestSessionDays;

    @Value("${retention.enabled:true}")
    private boolean enabled;

    /** Nightly, well away from the backup window. */
    @Scheduled(cron = "${retention.cron:0 30 4 * * *}")
    public void scheduled() {
        if (!enabled) return;
        try {
            log.info("Retention removed {}", purgeExpiredGuestSessions(false));
        } catch (Exception e) {
            // A failed cleanup must never take the service down with it.
            log.error("Retention run failed: {}", e.getClass().getSimpleName(), e);
        }
    }

    /**
     * @param dryRun count what would go without removing anything
     */
    @Transactional
    public Map<String, Object> purgeExpiredGuestSessions(boolean dryRun) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(guestSessionDays);

        // Last active, not created. A conversation someone still returns to is
        // theirs, however old it is.
        List<Long> expired = jdbc.queryForList(
                "SELECT id FROM guest_sessions WHERE last_active < ? "
                        + "AND (email IS NULL OR email = '')",
                Long.class, cutoff);

        Map<String, Object> counts = new LinkedHashMap<>();
        counts.put("cutoff", cutoff.toLocalDate().toString());
        counts.put("sessions", expired.size());
        counts.put("dryRun", dryRun);

        if (expired.isEmpty()) return counts;
        if (dryRun) {
            counts.put("files", storageKeysFor(expired).size());
            return counts;
        }

        // The files first. A row removed before its file leaves patient data on
        // disk that nothing points at and nothing will ever clean up.
        int files = 0;
        for (String key : storageKeysFor(expired)) {
            attachments.delete(key);
            files++;
        }
        counts.put("files", files);

        String in = placeholders(expired.size());
        Object[] ids = expired.toArray();

        // A reply carries no session of its own - only the message that
        // prompted it does - so deleting by session alone leaves the assistant
        // side of every conversation behind, and the chat cannot then be
        // removed. Rows are matched by their chat as well.
        //
        // That widening is only safe while a chat belongs to one session. This
        // refuses to run if it ever stops being true, rather than deleting a
        // live conversation because it shared a chat with an expired one.
        Integer shared = jdbc.queryForObject(
                "SELECT COUNT(*) FROM chats c "
                        + "JOIN chat_messages m ON m.chat_id = c.id "
                        + "JOIN guest_sessions live ON live.id = m.guest_session_id "
                        + "WHERE c.guest_session_id IN (" + in + ") "
                        + "AND live.id NOT IN (" + in + ")",
                Integer.class, concat(ids, ids));
        if (shared != null && shared > 0) {
            throw new IllegalStateException(
                    "Refusing to purge: " + shared + " messages from sessions that are still "
                            + "active sit in chats belonging to expired ones. Deleting those "
                            + "chats would remove a live conversation.");
        }

        // Order dictated by the foreign keys. Deepest dependency first.
        counts.put("conversationFiles", jdbc.update(
                "DELETE cf FROM conversation_files cf "
                        + "JOIN conversations c ON c.id = cf.conversation_id "
                        + "WHERE c.guest_session_id IN (" + in + ")", ids));
        counts.put("openaiResponses", jdbc.update(
                "DELETE r FROM openai_responses r "
                        + "JOIN chat_messages m ON m.id = r.chat_message_id "
                        + "LEFT JOIN chats c ON c.id = m.chat_id "
                        + "WHERE m.guest_session_id IN (" + in + ") "
                        + "OR c.guest_session_id IN (" + in + ")", concat(ids, ids)));

        // Usage rows are kept: they are the cost history, hold no patient
        // content, and losing them would make past spend unexplainable. Only
        // the link to the person goes.
        counts.put("usageDetached", jdbc.update(
                "UPDATE usage_metrics SET guest_session_id = NULL, conversation_id = NULL "
                        + "WHERE guest_session_id IN (" + in + ")", ids));

        counts.put("batchUploads", jdbc.update(
                "DELETE FROM batch_file_uploads WHERE guest_session_id IN (" + in + ")", ids));
        counts.put("attachments", jdbc.update(
                "DELETE fa FROM file_attachment fa "
                        + "LEFT JOIN chat_messages m ON m.id = fa.message_id "
                        + "LEFT JOIN chats c ON c.id = m.chat_id "
                        + "WHERE fa.session_id IN (" + in + ") "
                        + "OR m.guest_session_id IN (" + in + ") "
                        + "OR c.guest_session_id IN (" + in + ")", concat(ids, ids, ids)));
        counts.put("messages", jdbc.update(
                "DELETE m FROM chat_messages m "
                        + "LEFT JOIN chats c ON c.id = m.chat_id "
                        + "WHERE m.guest_session_id IN (" + in + ") "
                        + "OR c.guest_session_id IN (" + in + ")", concat(ids, ids)));
        counts.put("chats", jdbc.update(
                "DELETE FROM chats WHERE guest_session_id IN (" + in + ")", ids));
        counts.put("conversations", jdbc.update(
                "DELETE FROM conversations WHERE guest_session_id IN (" + in + ")", ids));
        counts.put("sessionsRemoved", jdbc.update(
                "DELETE FROM guest_sessions WHERE id IN (" + in + ")", ids));

        return counts;
    }

    /**
     * Every file about to lose its row.
     *
     * Matched the same way the delete is, or a file linked through a message
     * rather than directly to the session keeps its bytes on disk after the row
     * pointing at it is gone.
     */
    private List<String> storageKeysFor(List<Long> sessionIds) {
        if (sessionIds.isEmpty()) return List.of();
        String in = placeholders(sessionIds.size());
        Object[] ids = sessionIds.toArray();
        return jdbc.queryForList(
                "SELECT DISTINCT fa.storage_key FROM file_attachment fa "
                        + "LEFT JOIN chat_messages m ON m.id = fa.message_id "
                        + "LEFT JOIN chats c ON c.id = m.chat_id "
                        + "WHERE fa.storage_key IS NOT NULL AND ("
                        + "fa.session_id IN (" + in + ") "
                        + "OR m.guest_session_id IN (" + in + ") "
                        + "OR c.guest_session_id IN (" + in + "))",
                String.class, concat(ids, ids, ids));
    }

    /** The same id list repeated, for a statement that binds it more than once. */
    private Object[] concat(Object[]... groups) {
        int total = 0;
        for (Object[] g : groups) total += g.length;
        Object[] out = new Object[total];
        int at = 0;
        for (Object[] g : groups) {
            System.arraycopy(g, 0, out, at, g.length);
            at += g.length;
        }
        return out;
    }

    private String placeholders(int n) {
        return String.join(",", java.util.Collections.nCopies(n, "?"));
    }
}
