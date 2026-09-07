package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * One measurement at one moment.
 *
 * Both the canonical value and what the person actually typed are kept: the
 * former is what everything compares, the latter is what they should see back,
 * and keeping it makes a conversion bug diagnosable after the fact.
 */
@Entity
@Table(name = "vital_readings")
@Getter
@Setter
public class VitalReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "family_member_id", nullable = false)
    private FamilyMember familyMember;

    @Enumerated(EnumType.STRING)
    @Column(name = "vital_type", nullable = false, length = 32)
    private VitalType vitalType;

    @Column(name = "value_canonical", nullable = false, precision = 12, scale = 4)
    private BigDecimal valueCanonical;

    @Column(name = "unit_canonical", nullable = false, length = 16)
    private String unitCanonical;

    @Column(name = "value_entered", precision = 12, scale = 4)
    private BigDecimal valueEntered;

    @Column(name = "unit_entered", length = 16)
    private String unitEntered;

    @Column(name = "measured_at", nullable = false)
    private LocalDateTime measuredAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private VitalSource source = VitalSource.MANUAL;

    @Column(name = "source_ref")
    private String sourceRef;

    @Enumerated(EnumType.STRING)
    @Column(name = "abnormal_flag", length = 16)
    private AbnormalFlag abnormalFlag;

    @Column(length = 512)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by_user_id")
    private User recordedBy;

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
        if (measuredAt == null) measuredAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
