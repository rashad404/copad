package com.drcopad.copad.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Long id;
    private String specialty;
    private String primaryConcern;
    private String symptoms;
    private String duration;
    private String severity;
    private String treatmentsTried;
    private String notes;
    private LocalDateTime createdAt;
}
