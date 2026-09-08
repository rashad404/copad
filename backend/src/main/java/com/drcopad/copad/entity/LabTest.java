package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A test a laboratory offers, at that laboratory's price.
 *
 * Priced per lab rather than centrally because the same test costs different
 * amounts in different places, and being able to compare them is the point.
 */
@Entity
@Table(name = "lab_test")
@Getter
@Setter
public class LabTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lab_id", nullable = false)
    private Lab lab;

    @Column(nullable = false, length = 64)
    private String code;

    @Column(name = "name_az", nullable = false)
    private String nameAz;

    @Column(name = "name_en")
    private String nameEn;

    @Column(name = "name_ru")
    private String nameRu;

    /**
     * The analyte this test produces.
     *
     * Ties an ordered test to the value that comes back, so a result can be
     * recognised rather than re-keyed by hand.
     */
    @Column(name = "analyte_key", length = 120)
    private String analyteKey;

    @Column(name = "loinc_code", length = 32)
    private String loincCode;

    @Column(name = "sample_type", length = 64)
    private String sampleType;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "turnaround_hours")
    private Integer turnaroundHours;

    /** Fasting and the like. Belongs in front of somebody before they order. */
    @Column(name = "preparation_az", columnDefinition = "TEXT")
    private String preparationAz;

    @Column(name = "preparation_en", columnDefinition = "TEXT")
    private String preparationEn;

    @Column(name = "preparation_ru", columnDefinition = "TEXT")
    private String preparationRu;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

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

    /** The name in the language being read, falling back to Azerbaijani. */
    @Transient
    public String nameIn(String language) {
        return switch (language == null ? "az" : language) {
            case "en" -> blankTo(nameEn, nameAz);
            case "ru" -> blankTo(nameRu, nameAz);
            default -> nameAz;
        };
    }

    @Transient
    public String preparationIn(String language) {
        return switch (language == null ? "az" : language) {
            case "en" -> blankTo(preparationEn, preparationAz);
            case "ru" -> blankTo(preparationRu, preparationAz);
            default -> preparationAz;
        };
    }

    private static String blankTo(String preferred, String fallback) {
        return preferred == null || preferred.isBlank() ? fallback : preferred;
    }
}
