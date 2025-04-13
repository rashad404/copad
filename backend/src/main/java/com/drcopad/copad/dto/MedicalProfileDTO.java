package com.drcopad.copad.dto;

import lombok.Data;

@Data
public class MedicalProfileDTO {
    private float height;
    private float weight;
    private String conditions;
    private String allergies;
    private String medications;
    private String lifestyle;
}
