package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/** A diagnosis or ongoing health problem. */
@Entity
@Table(name = "medical_conditions")
@Getter
@Setter
public class MedicalCondition extends ClinicalRecordBase {

    @Column(nullable = false)
    private String label;

    /** Populated where known; enables coded checks that free text cannot support. */
    @Column(name = "icd10_code", length = 16)
    private String icd10Code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ConditionStatus status = ConditionStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(length = 16)
    private ClinicalSeverity severity;

    @Column(name = "onset_date")
    private LocalDate onsetDate;

    @Column(name = "resolved_date")
    private LocalDate resolvedDate;

    @Transient
    public boolean isCurrent() {
        return status == ConditionStatus.ACTIVE || status == ConditionStatus.UNCONFIRMED;
    }
}
