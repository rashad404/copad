package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/** A vaccination. Childhood schedules make next_due_on worth storing. */
@Entity
@Table(name = "immunizations")
@Getter
@Setter
public class Immunization extends ClinicalRecordBase {

    @Column(nullable = false)
    private String vaccine;

    @Column(name = "dose_number")
    private Integer doseNumber;

    @Column(name = "administered_on")
    private LocalDate administeredOn;

    private String provider;

    @Column(name = "lot_number", length = 64)
    private String lotNumber;

    @Column(name = "next_due_on")
    private LocalDate nextDueOn;

    @Transient
    public boolean isOverdue() {
        return nextDueOn != null && nextDueOn.isBefore(LocalDate.now());
    }
}
