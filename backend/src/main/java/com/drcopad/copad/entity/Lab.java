package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** A laboratory people can order a test from. */
@Entity
@Table(name = "lab")
@Getter
@Setter
public class Lab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String slug;

    private String city;
    private String district;
    private String address;
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** Whether they will come to the person rather than the other way round. */
    @Column(name = "home_collection", nullable = false)
    private boolean homeCollection = false;

    @Column(name = "home_collection_fee", precision = 10, scale = 2)
    private BigDecimal homeCollectionFee;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
