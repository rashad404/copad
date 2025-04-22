package com.drcopad.copad.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "medical_profiles")
@NoArgsConstructor
@AllArgsConstructor
public class MedicalProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private float height;
    private float weight;
    private String conditions;
    private String allergies;
    private String medications;
    private String lifestyle;

    @OneToOne(mappedBy = "medicalProfile")
    @JsonBackReference
    private User user;

}
