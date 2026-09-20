package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * One person's opinion of one doctor.
 *
 * The trust level is the part that matters, and it is decided here, never sent
 * by the browser. A reader can tell the difference between somebody who typed
 * a name into a box and somebody who actually attended an appointment, which
 * is the only thing that separates this from the directories full of invented
 * five star ratings.
 */
@Entity
@Table(name = "doctor_review")
@Getter
@Setter
public class DoctorReview {

    /** How much weight a reader should give this. */
    public enum Trust {
        /** Typed by somebody with no account. Held for moderation. */
        GUEST,
        /** An account, but no evidence of a visit. */
        REGISTERED,
        /** Attended an appointment booked through azdoc. */
        VERIFIED
    }

    public enum Status { PENDING, PUBLISHED, REJECTED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(nullable = false)
    private int rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "author_name", nullable = false, length = 120)
    private String authorName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    /** The appointment this review is evidence of, when there is one. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Trust trust = Trust.GUEST;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Status status = Status.PENDING;

    @Column(name = "moderation_note", length = 255)
    private String moderationNote;

    /** A hash of the address, to spot one machine writing many reviews. */
    @Column(name = "reporter_hash", length = 64)
    private String reporterHash;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "published_at")
    private LocalDateTime publishedAt;
}
