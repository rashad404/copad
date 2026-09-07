package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * One analyte from one laboratory report.
 *
 * Separate from VitalReading on purpose: a vital is something a person measures
 * about themselves, a lab result comes from a laboratory with its own method
 * and reference range, and averaging the two onto one chart would be wrong.
 *
 * Values extracted from a document start unconfirmed. Writing a parsed number
 * straight into a medical record makes an OCR error indistinguishable from a
 * real result.
 */
@Entity
@Table(name = "lab_result")
@Getter
@Setter
public class LabResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "family_member_id", nullable = false)
    private FamilyMember familyMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @Column(nullable = false)
    private String analyte;

    /** Normalised name, so HGB and Hemoglobin chart together. */
    @Column(name = "analyte_key", nullable = false, length = 128)
    private String analyteKey;

    @Column(name = "loinc_code", length = 32)
    private String loincCode;

    @Column(name = "value_numeric", precision = 14, scale = 4)
    private BigDecimal valueNumeric;

    /** For results that are not numbers: negative, trace, not detected. */
    @Column(name = "value_text")
    private String valueText;

    @Column(length = 64)
    private String unit;

    @Column(name = "reference_low", precision = 14, scale = 4)
    private BigDecimal referenceLow;

    @Column(name = "reference_high", precision = 14, scale = 4)
    private BigDecimal referenceHigh;

    @Column(name = "reference_text", length = 128)
    private String referenceText;

    @Enumerated(EnumType.STRING)
    @Column(name = "abnormal_flag", length = 16)
    private AbnormalFlag abnormalFlag;

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;

    @Column(nullable = false)
    private boolean confirmed = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "confirmed_by_user_id")
    private User confirmedBy;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    /** The value as it should be shown, numeric or not. */
    @Transient
    public String getDisplayValue() {
        if (valueNumeric != null) {
            String v = valueNumeric.stripTrailingZeros().toPlainString();
            return unit == null ? v : v + " " + unit;
        }
        return valueText;
    }

    @Transient
    public String getReferenceLabel() {
        if (referenceText != null) return referenceText;
        if (referenceLow != null && referenceHigh != null) {
            return referenceLow.stripTrailingZeros().toPlainString() + " - "
                    + referenceHigh.stripTrailingZeros().toPlainString();
        }
        return null;
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
