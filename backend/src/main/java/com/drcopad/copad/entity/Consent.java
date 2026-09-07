package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * One agreement, to one purpose, at one point in time.
 *
 * Withdrawal sets a timestamp rather than deleting the row: that a person once
 * agreed, and later changed their mind, is itself part of the record, and
 * deleting it would leave no way to show what processing was lawful when.
 */
@Entity
@Table(name = "consent")
@Getter
@Setter
public class Consent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "consent_type", nullable = false, length = 32)
    private ConsentType consentType;

    /** The member a guardian attestation concerns. Null for the others. */
    @Column(name = "family_member_id")
    private Long familyMemberId;

    /** Consent is to a specific text; a rewritten one cannot show what was agreed. */
    @Column(name = "policy_version", nullable = false, length = 32)
    private String policyVersion;

    @Column(name = "granted_at")
    private LocalDateTime grantedAt;

    @Column(name = "withdrawn_at")
    private LocalDateTime withdrawnAt;

    @PrePersist
    void onCreate() {
        // A first refusal has no grant. Never manufacture agreement.
        if (grantedAt == null && withdrawnAt == null) grantedAt = LocalDateTime.now();
    }

    @Transient
    public boolean isActive() {
        return withdrawnAt == null;
    }
}
