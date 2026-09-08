package com.drcopad.copad.service.notification;

import com.drcopad.copad.entity.Booking;
import com.drcopad.copad.entity.Clinic;
import com.drcopad.copad.entity.Notification;
import com.drcopad.copad.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Sends one message.
 *
 * Its own bean so the transaction is real. The dispatcher used to call this as
 * its own method, which never goes through the proxy: there was no transaction,
 * and reading the booking behind the message threw LazyInitializationException
 * on every attempt. Nothing was ever delivered.
 *
 * One transaction per message also means a single bad address cannot roll back
 * everything queued behind it.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationSender {

    private final NotificationRepository notifications;
    private final JavaMailSender mailSender;

    @Value("${app.notifications.from:info@azdoc.ai}")
    private String from;

    @Value("${app.public-url:https://azdoc.ai}")
    private String publicUrl;

    /** Attempts one queued message and records what happened. */
    @Transactional
    public void deliver(Long id) {
        Notification row = notifications.findById(id).orElse(null);
        if (row == null || row.getStatus() != Notification.Status.PENDING) return;

        row.setAttempts(row.getAttempts() + 1);
        try {
            NotificationTemplates.Message message = NotificationTemplates.render(
                    row.getKind(), row.getLanguage(), contextFor(row));

            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(from);
            mail.setTo(row.getUser().getEmail());
            mail.setSubject(message.subject());
            mail.setText(message.body());
            mailSender.send(mail);

            row.setStatus(Notification.Status.SENT);
            row.setSentAt(LocalDateTime.now());
            // The address is not logged: it identifies the person.
            log.info("Notification {} sent for booking {}", row.getKind(),
                    row.getBooking() == null ? null : row.getBooking().getId());
        } catch (RuntimeException e) {
            row.setLastError(e.getClass().getSimpleName());
            if (row.getAttempts() >= NotificationDispatcher.MAX_ATTEMPTS) {
                row.setStatus(Notification.Status.FAILED);
            }
            log.warn("Notification {} attempt {} failed: {}", row.getKind(),
                    row.getAttempts(), e.getClass().getSimpleName());
        }
        notifications.save(row);
    }

    private NotificationTemplates.Context contextFor(Notification row) {
        Booking booking = row.getBooking();
        Clinic clinic = booking == null ? null : booking.getClinic();
        String doctorName = booking == null || booking.getDoctor() == null
                ? "" : booking.getDoctor().getFullName();
        String patientName = booking == null || booking.getFamilyMember() == null
                ? "" : booking.getFamilyMember().getFullName();
        boolean toDoctor = row.getKind() == Notification.Kind.BOOKING_REQUESTED_DOCTOR
                || row.getKind() == Notification.Kind.BOOKING_CANCELLED_DOCTOR;

        return new NotificationTemplates.Context(
                row.getUser().getName() == null ? "" : row.getUser().getName(),
                doctorName,
                patientName,
                clinic == null ? null : clinic.getName(),
                clinic == null ? null : clinic.getAddress(),
                booking == null ? LocalDateTime.now() : booking.getStartsAt(),
                publicUrl + (toDoctor ? "/hekim-panel" : "/randevularim"));
    }
}
