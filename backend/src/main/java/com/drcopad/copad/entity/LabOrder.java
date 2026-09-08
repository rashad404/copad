package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * A request to have tests done.
 *
 * Belongs to a family member, like every other clinical record here, so a
 * parent ordering for a child is the ordinary case rather than an exception.
 *
 * It is a request, not a booking: the laboratory still has to accept it, and
 * nothing about it is paid.
 */
@Entity
@Table(name = "lab_order")
@Getter
@Setter
public class LabOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lab_id", nullable = false)
    private Lab lab;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "family_member_id", nullable = false)
    private FamilyMember familyMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordered_by_user_id")
    private User orderedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private LabOrderStatus status = LabOrderStatus.REQUESTED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private LabCollection collection = LabCollection.LAB;

    /** Only for home collection, and only what is needed to arrive. */
    private String address;

    @Column(name = "contact_phone", length = 64)
    private String contactPhone;

    @Column(name = "preferred_at")
    private LocalDateTime preferredAt;

    /**
     * The total as it stood when ordered.
     *
     * Copied rather than recomputed: a laboratory repricing a test later must
     * not silently change what somebody agreed to.
     */
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(length = 512)
    private String note;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true,
            fetch = FetchType.LAZY)
    private List<LabOrderItem> items = new ArrayList<>();

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

    /** Whether this order can still be called off by the person who made it. */
    @Transient
    public boolean isCancellable() {
        return status == LabOrderStatus.REQUESTED || status == LabOrderStatus.CONFIRMED;
    }
}
