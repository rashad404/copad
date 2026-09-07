package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/** A known allergy. Drug allergies gate what the assistant may suggest. */
@Entity
@Table(name = "allergies")
@Getter
@Setter
public class Allergy extends ClinicalRecordBase {

    @Column(nullable = false)
    private String allergen;

    @Enumerated(EnumType.STRING)
    @Column(name = "allergen_type", nullable = false, length = 24)
    private AllergenType allergenType = AllergenType.OTHER;

    @Column(length = 512)
    private String reaction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ClinicalSeverity severity = ClinicalSeverity.UNKNOWN;

    @Column(name = "onset_date")
    private LocalDate onsetDate;

    @Column(nullable = false)
    private boolean active = true;

    /** Severe enough that it must be stated before any related advice. */
    @Transient
    public boolean isCritical() {
        return active && (severity == ClinicalSeverity.SEVERE
                || severity == ClinicalSeverity.LIFE_THREATENING);
    }
}
