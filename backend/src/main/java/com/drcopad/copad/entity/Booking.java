package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * An appointment with a doctor, at a time.
 *
 * Distinct from the older Appointment, which is an intake form: symptoms and
 * severity, no doctor and no time.
 *
 * Whose appointment it is and who made it are separate people. A parent books
 * for a child, and both facts matter - one for the record, the other for who to
 * contact.
 */
@Entity
@Table(name = "booking")
@Getter
@Setter
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinic_id")
    private Clinic clinic;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "family_member_id", nullable = false)
    private FamilyMember familyMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booked_by_user_id")
    private User bookedBy;

    @Column(name = "starts_at", nullable = false)
    private LocalDateTime startsAt;

    @Column(name = "ends_at", nullable = false)
    private LocalDateTime endsAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private BookingStatus status = BookingStatus.REQUESTED;

    @Column(length = 512)
    private String reason;

    /**
     * Whether the person chose to share their record with this doctor.
     *
     * Per booking, never an account setting. "I will show this doctor my
     * allergies" must not quietly become "every doctor sees everything".
     */
    @Column(name = "shared_record", nullable = false)
    private boolean sharedRecord = false;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "reminder_sent_at")
    private LocalDateTime reminderSentAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * The generated column the unique constraint is built on.
     *
     * The database computes it; this is read-only here so JPA never tries to
     * write it. It holds starts_at while the booking occupies the time and null
     * once it does not, which is what frees a cancelled slot for somebody else.
     */
    @Column(name = "held_slot", insertable = false, updatable = false)
    private LocalDateTime heldSlot;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
