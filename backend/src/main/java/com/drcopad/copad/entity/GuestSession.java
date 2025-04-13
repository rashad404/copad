package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "guest_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String sessionId;

    @Column(nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime lastActive;

    @OneToMany(mappedBy = "guestSession", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Conversation> conversations = new ArrayList<>();

    @Column
    private String email; // Optional, for users who want to save their session

    @PrePersist
    protected void onCreate() {
        this.sessionId = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.lastActive = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastActive = LocalDateTime.now();
    }
} 