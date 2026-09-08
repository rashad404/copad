package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * A source of readings a family member has connected.
 *
 * Held per member rather than per account: a parent syncing their own watch
 * must not have those readings land in their child's record.
 */
@Entity
@Table(name = "health_connection")
@Getter
@Setter
public class HealthConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "family_member_id", nullable = false)
    private FamilyMember familyMember;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private HealthProvider provider;

    /** What the person would recognise it as. */
    @Column(name = "device_label", length = 120)
    private String deviceLabel;

    @Column(nullable = false)
    private boolean enabled = true;

    /**
     * The furthest point already taken.
     *
     * Lets a phone resume rather than resend its whole history each time. It is
     * a hint, not a guarantee: the unique key on the reading is what actually
     * makes a repeat harmless.
     */
    @Column(name = "synced_through")
    private LocalDateTime syncedThrough;

    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

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
