package com.drcopad.copad.dto;

import lombok.Data;

@Data
public class AppointmentRequestDTO {
    private String specialty;
    private String primaryConcern;
    private String symptoms;
    private String duration;
    private String severity;
    private String treatmentsTried;
    private String notes;
}