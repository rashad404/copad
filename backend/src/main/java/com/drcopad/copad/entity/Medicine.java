package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** A product in the Azerbaijani drug registry, mirrored from bugun.az. */
@Entity
@Table(name = "medicine")
@Getter
@Setter
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Primary key in the source catalogue, used to match rows on re-sync. */
    @Column(name = "source_id")
    private Long sourceId;

    @Column(nullable = false, length = 512)
    private String name;

    @Column(nullable = false, length = 512)
    private String slug;

    @Column(name = "active_ingredient", columnDefinition = "TEXT")
    private String activeIngredient;

    @Column(name = "atc_code", length = 64)
    private String atcCode;

    @Column(columnDefinition = "TEXT")
    private String manufacturer;

    @Column(name = "release_form", columnDefinition = "TEXT")
    private String releaseForm;

    @Column(name = "prescription_status", columnDefinition = "TEXT")
    private String prescriptionStatus;

    @Column(name = "medicine_type")
    private String medicineType;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "description_az", columnDefinition = "TEXT")
    private String descriptionAz;

    @Column(name = "usage_az", columnDefinition = "TEXT")
    private String usageAz;

    @Column(name = "side_effects_az", columnDefinition = "TEXT")
    private String sideEffectsAz;

    @Column(name = "contraindications_az", columnDefinition = "TEXT")
    private String contraindicationsAz;

    @Column(name = "interactions_az", columnDefinition = "TEXT")
    private String interactionsAz;

    @Column(name = "storage_az", columnDefinition = "TEXT")
    private String storageAz;

    @OneToMany(mappedBy = "medicine", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicineIngredient> ingredients = new ArrayList<>();

    @Column(name = "synced_at")
    private LocalDateTime syncedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    /** Prescription-only products need different wording in any suggestion. */
    @Transient
    public boolean isPrescriptionOnly() {
        if (prescriptionStatus == null) return false;
        String s = prescriptionStatus.toLowerCase();
        return s.contains("reseptl") || s.contains("prescription");
    }
}
