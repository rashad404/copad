package com.drcopad.copad.dto;

import lombok.Data;

@Data
public class MedicalSpecialtyDTO {
    private Long id;
    private String name;
    private String code;
    private String systemPrompt;
    private String description;
    private String iconUrl;
    private boolean isActive;
} 