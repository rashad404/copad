package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String specialty;
    private String primaryConcern;
    private String symptoms;
    private String duration;
    private String severity;
    private String treatmentsTried;
    private String notes;
    private LocalDateTime createdAt;
}