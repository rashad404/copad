package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * One active ingredient of a product.
 *
 * Split out of the catalogue's free-text field so an allergen can be matched
 * against it. "Amoxicillin trihydrate - 500 mg (eq. to Amoxicillin 500 mg)"
 * only becomes comparable once it is normalised.
 */
@Entity
@Table(name = "medicine_ingredient")
@Getter
@Setter
public class MedicineIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(nullable = false)
    private String normalised;

    @Column(length = 512)
    private String raw;
}
