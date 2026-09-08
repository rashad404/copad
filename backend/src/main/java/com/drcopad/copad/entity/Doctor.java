package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * A doctor people can find, and eventually book.
 *
 * A listing may exist before the doctor does anything, because a directory has
 * to start somewhere. That makes verification the most important field here:
 * an entry created from a public source describes somebody who never agreed to
 * be listed, and must never be shown as though we vouch for them.
 */
@Entity
@Table(name = "doctor")
@Getter
@Setter
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Set when a doctor claims the listing. Null while nobody has. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String slug;

    /** Matches specialty.code, so the assistant and the directory agree. */
    @Column(name = "specialty_code", length = 64)
    private String specialtyCode;

    private String qualifications;

    @Column(name = "license_number", length = 128)
    private String licenseNumber;

    @Column(name = "years_experience")
    private Integer yearsExperience;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "photo_url", length = 512)
    private String photoUrl;

    /** Comma-separated codes, "az,ru,en". Decides who this doctor can treat. */
    @Column(length = 64)
    private String languages;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private VerificationStatus verification = VerificationStatus.UNCLAIMED;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    /** Where the listing came from, so a seeded entry stays recognisable. */
    private String source;

    @Column(name = "consultation_fee", precision = 10, scale = 2)
    private BigDecimal consultationFee;

    /**
     * Whether appointments made here are real.
     *
     * Off by default and deliberately separate from active. A listing can be in
     * the directory while taking no bookings, which is the normal state for one
     * nobody has claimed. Turning it on asserts that somebody is watching.
     */
    @Column(name = "accepts_bookings", nullable = false)
    private boolean acceptsBookings = false;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "doctor_clinic",
            joinColumns = @JoinColumn(name = "doctor_id"),
            inverseJoinColumns = @JoinColumn(name = "clinic_id"))
    private Set<Clinic> clinics = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

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

    /**
     * Whether this listing may be presented as checked.
     *
     * Used wherever a badge or a claim of trust might appear, so the question is
     * asked in one place rather than re-derived at each call site.
     */
    @Transient
    public boolean isVouchedFor() {
        return verification == VerificationStatus.VERIFIED;
    }

    /** Whether an appointment made here would be a real appointment. */
    @Transient
    public boolean isBookable() {
        return active && acceptsBookings && deletedAt == null;
    }
}
