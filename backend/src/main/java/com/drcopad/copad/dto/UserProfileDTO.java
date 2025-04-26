package com.drcopad.copad.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private int age;
    private String gender;
    private String fullName;
    private MedicalProfileDTO medicalProfile;
}
