package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

/**
 * A person whose health is tracked.
 *
 * This, not User, is what clinical records point at. A child or an elderly
 * parent has a health record without ever having a login, and one account may
 * manage several such people.
 */
@Entity
@Table(name = "family_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    /** The member's own account, when they have one. Null for dependents. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private Relationship relationship;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "biological_sex", length = 16)
    private BiologicalSex biologicalSex;

    @Column(name = "blood_type", length = 8)
    private String bloodType;

    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;

    @Column(name = "birth_weight_grams")
    private Integer birthWeightGrams;

    @Column(name = "birth_length_cm", precision = 5, scale = 2)
    private BigDecimal birthLengthCm;

    @Column(name = "gestational_age_weeks", precision = 4, scale = 1)
    private BigDecimal gestationalAgeWeeks;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    /** Age in whole years, or null when the date of birth is unknown. */
    @Transient
    public Integer getAgeYears() {
        return dateOfBirth == null ? null : Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    /** Age in months, which is how paediatric guidance is expressed under two. */
    @Transient
    public Integer getAgeMonths() {
        if (dateOfBirth == null) return null;
        Period period = Period.between(dateOfBirth, LocalDate.now());
        return period.getYears() * 12 + period.getMonths();
    }

    /**
     * Corrected age in months for infants born before 37 weeks.
     *
     * A baby born at 30 weeks is developmentally about 10 weeks behind a term
     * baby of the same birthday, and growth and milestones must be read against
     * the corrected figure. Correction conventionally stops at two years.
     */
    @Transient
    public Integer getCorrectedAgeMonths() {
        Integer actual = getAgeMonths();
        if (actual == null || gestationalAgeWeeks == null) return actual;

        BigDecimal termWeeks = BigDecimal.valueOf(40);
        if (gestationalAgeWeeks.compareTo(BigDecimal.valueOf(37)) >= 0 || actual > 24) {
            return actual;
        }

        int weeksEarly = termWeeks.subtract(gestationalAgeWeeks).intValue();
        return Math.max(0, actual - Math.round(weeksEarly / 4.345f));
    }

    @Transient
    public boolean isMinor() {
        Integer age = getAgeYears();
        return age != null && age < 18;
    }

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
