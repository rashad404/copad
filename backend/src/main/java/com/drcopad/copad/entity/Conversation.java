package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    private String sender; // "USER" or "AI"
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDateTime timestamp;
    
    @ManyToOne
    private GuestSession guestSession;
}
