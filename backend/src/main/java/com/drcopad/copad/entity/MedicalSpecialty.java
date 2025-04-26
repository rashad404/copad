package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "medical_specialties")
public class MedicalSpecialty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String systemPrompt;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String iconUrl;

    private boolean isActive = true;

    public MedicalSpecialty(String code, String description, String iconUrl, boolean isActive, String name, String systemPrompt) {
        this.code = code;
        this.description = description;
        this.iconUrl = iconUrl;
        this.isActive = isActive;
        this.name = name;
        this.systemPrompt = systemPrompt;
    }
}
