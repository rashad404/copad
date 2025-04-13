package com.drcopad.copad.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private String name;
    private String email;
    private int age;
    private String gender;
    private MedicalProfileDTO medicalProfile;
}
