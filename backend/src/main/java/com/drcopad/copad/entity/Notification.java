package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * One message we owe somebody.
 *
 * A row exists before anything is sent, so a mail server that is slow or down
 * cannot roll back the appointment that caused it, and a failure can be tried
 * again rather than lost. It also makes "was this person told?" answerable.
 *
 * It carries no clinical content on purpose - only what kind of message it is
 * and what it refers to. Why somebody wanted to be seen is their account of
 * their own symptoms, and it belongs neither in this table nor in an email.
 */
@Entity
@Table(name = "notification")
@Getter
@Setter
public class Notification {

    public enum Channel { EMAIL }

    public enum Status { PENDING, SENT, FAILED, SKIPPED }

    /** What happened. The template and the recipient follow from this. */
    public enum Kind {
        BOOKING_REQUESTED_PATIENT,
        BOOKING_REQUESTED_DOCTOR,
        BOOKING_CONFIRMED_PATIENT,
        BOOKING_DECLINED_PATIENT,
        BOOKING_CANCELLED_DOCTOR,
        BOOKING_REMINDER_PATIENT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Channel channel = Channel.EMAIL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 48)
    private Kind kind;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(nullable = false, length = 8)
    private String language = "az";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Status status = Status.PENDING;

    @Column(nullable = false)
    private int attempts = 0;

    /** The exception class only; a provider message can quote the recipient. */
    @Column(name = "last_error", length = 64)
    private String lastError;

    /** When it may go out. A reminder is written now and sent the day before. */
    @Column(name = "scheduled_for", nullable = false)
    private LocalDateTime scheduledFor;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (scheduledFor == null) scheduledFor = createdAt;
    }
}
