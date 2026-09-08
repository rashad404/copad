package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * A specialty a doctor can be listed under.
 *
 * Deliberately separate from medical_specialties, which is the assistant's own
 * small vocabulary of chat personas. This table is the directory's, and it is
 * long because it has to match what hospitals actually publish. The two meet at
 * aiSpecialtyCode: a doctor listed under pediatric-neurology here is a
 * "pediatric" doctor as far as the assistant is concerned.
 */
@Entity
@Table(name = "specialty")
@Getter
@Setter
public class Specialty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String code;

    @Column(name = "name_az", nullable = false)
    private String nameAz;

    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @Column(name = "name_ru")
    private String nameRu;

    /**
     * Whether a person would ever be told to go and see one.
     *
     * A radiologist, an anaesthetist or a microbiologist is a real doctor with
     * a real listing, but nobody books one. False here keeps them in the
     * directory while keeping them out of the assistant's referrals.
     */
    @Column(name = "patient_facing", nullable = false)
    private boolean patientFacing = true;

    /** The assistant's coarser code this maps onto. Null when it maps onto none. */
    @Column(name = "ai_specialty_code", length = 64)
    private String aiSpecialtyCode;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(nullable = false)
    private boolean active = true;
}
