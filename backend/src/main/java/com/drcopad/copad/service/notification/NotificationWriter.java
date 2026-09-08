package com.drcopad.copad.service.notification;

import com.drcopad.copad.entity.Booking;
import com.drcopad.copad.entity.Notification;
import com.drcopad.copad.entity.Notification.Kind;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.repository.NotificationRepository;
import com.drcopad.copad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * The insert, in a transaction of its own.
 *
 * Its own bean because the caller runs inside afterCommit, and a call to a
 * method on the same object never goes through the proxy - so REQUIRES_NEW was
 * ignored, the save joined the transaction that had just finished committing,
 * and the row was never flushed. Nothing failed and nothing was written.
 *
 * A separate transaction is also the behaviour wanted: failing to record a
 * message must not be able to undo the appointment that prompted it.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationWriter {

    private final NotificationRepository notifications;
    private final UserRepository users;
    private final SmsSender sms;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void write(Long recipientId, Kind kind, Booking booking,
                      String language, LocalDateTime scheduled) {
        try {
            User recipient = users.getReferenceById(recipientId);
            Notification row = new Notification();
            row.setUser(recipient);
            row.setChannel(channelFor(recipient));
            row.setKind(kind);
            row.setBooking(booking);
            row.setLanguage(language);
            row.setScheduledFor(scheduled);
            notifications.saveAndFlush(row);
        } catch (DataIntegrityViolationException alreadyQueued) {
            // The unique key did its job. Saying it twice is worse than not at
            // all, so this is the expected outcome, not a failure.
            log.debug("Notification {} already queued for booking {}", kind,
                    booking == null ? null : booking.getId());
        } catch (RuntimeException e) {
            // Never let a missing message take the appointment with it.
            log.warn("Could not queue notification {}: {}", kind,
                    e.getClass().getSimpleName());
        }
    }

    /**
     * Where this one goes.
     *
     * A text if there is a provider, a number, and somebody who asked to be
     * texted. Otherwise the email we have always sent - never nothing, because
     * a person who turned SMS on and then gave a number the gateway rejects
     * should still hear that their appointment was confirmed.
     */
    private Notification.Channel channelFor(User recipient) {
        if (!sms.available()) return Notification.Channel.EMAIL;
        if (!recipient.isSmsEnabled()) return Notification.Channel.EMAIL;
        String phone = recipient.getPhone();
        if (phone == null || phone.isBlank()) return Notification.Channel.EMAIL;
        return Notification.Channel.SMS;
    }
}
