package com.drcopad.copad.service.notification;

import com.drcopad.copad.entity.Booking;
import com.drcopad.copad.entity.Notification;
import com.drcopad.copad.entity.Notification.Kind;
import com.drcopad.copad.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;

/**
 * Queues messages. Sending is somebody else's job.
 *
 * Writing a row is all that happens inside the transaction that caused it: a
 * mail server that is slow or refusing must never roll back an appointment.
 * The dispatcher picks the row up afterwards and can try again if it fails.
 *
 * Nothing here reads or stores why somebody wanted to be seen.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationWriter writer;

    @Value("${app.notifications.enabled:true}")
    private boolean enabled;

    /**
     * Records that somebody should be told something.
     *
     * Written after the caller's transaction commits, never inside it. The row
     * points at the booking that caused it, so writing it first meant inserting
     * a child of a row nobody else can see yet: the foreign key check waited on
     * a lock the outer transaction was still holding, and the appointment timed
     * out and rolled back. Queueing a message must not be able to lose the
     * thing it is announcing.
     */
    public void queue(User recipient, Kind kind, Booking booking, LocalDateTime when) {
        if (!enabled) return;
        if (recipient == null || recipient.getId() == null) return;
        if (!recipient.isNotificationsEnabled()) {
            log.debug("Notification {} skipped: recipient has them off", kind);
            return;
        }
        if (recipient.getEmail() == null || recipient.getEmail().isBlank()) return;

        Long recipientId = recipient.getId();
        String language = languageOf(recipient);
        LocalDateTime scheduled = when == null ? LocalDateTime.now() : when;

        // isActualTransactionActive, not isSynchronizationActive: open-in-view
        // binds a session and turns synchronization on for every request, so
        // the weaker check passed even where there was no transaction to
        // commit - the callback was registered and then never ran.
        if (TransactionSynchronizationManager.isActualTransactionActive()
                && TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            writer.write(recipientId, kind, booking, language, scheduled);
                        }
                    });
        } else {
            writer.write(recipientId, kind, booking, language, scheduled);
        }
    }
    /** The common case: tell them now. */
    public void queueNow(User recipient, Kind kind, Booking booking) {
        queue(recipient, kind, booking, LocalDateTime.now());
    }

    private static String languageOf(User user) {
        String chosen = user.getPreferredLanguage();
        if (chosen == null || chosen.isBlank()) return "az";
        return switch (chosen.toLowerCase().split("-")[0]) {
            case "en" -> "en";
            case "ru" -> "ru";
            default -> "az";
        };
    }
}
