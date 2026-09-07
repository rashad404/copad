package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * A medication the person takes or has taken.
 *
 * Dose is an amount plus a unit, never a string. "500mg" cannot be compared
 * against a maximum, summed across products sharing an ingredient, or checked
 * for a paediatric overdose - and dosing mistakes are a leading cause of
 * avoidable harm.
 */
@Entity
@Table(name = "medications")
@Getter
@Setter
public class Medication extends ClinicalRecordBase {

    @Column(nullable = false)
    private String name;

    /** Catalogue reference, populated once the drug data lands in Phase 3. */
    @Column(name = "medicine_id")
    private Long medicineId;

    @Column(name = "active_ingredient")
    private String activeIngredient;

    @Column(name = "dose_amount", precision = 10, scale = 3)
    private BigDecimal doseAmount;

    @Column(name = "dose_unit", length = 16)
    private String doseUnit;

    @Column(length = 64)
    private String frequency;

    @Enumerated(EnumType.STRING)
    @Column(length = 24)
    private MedicationRoute route;

    @Column(name = "started_on")
    private LocalDate startedOn;

    @Column(name = "ended_on")
    private LocalDate endedOn;

    @Column(nullable = false)
    private boolean active = true;

    private String prescriber;

    @Column(length = 512)
    private String reason;

    /** Human-readable dose, assembled rather than stored, so the parts stay usable. */
    @Transient
    public String getDoseLabel() {
        if (doseAmount == null) return null;
        return doseUnit == null
                ? doseAmount.stripTrailingZeros().toPlainString()
                : doseAmount.stripTrailingZeros().toPlainString() + " " + doseUnit;
    }
}
