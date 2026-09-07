package com.drcopad.copad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * The only thing kept after a deletion.
 *
 * A pseudonymous id, a time, and counts. Enough to answer "was this deleted, and
 * when", never enough to reconstruct what was deleted.
 */
@Entity
@Table(name = "deletion_record")
@Getter
@Setter
public class DeletionRecord {

    public enum SubjectType { MEMBER, ACCOUNT }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "subject_type", nullable = false, length = 16)
    private SubjectType subjectType;

    /** The former member or user id. No foreign key: the row is gone. */
    @Column(name = "subject_ref", nullable = false)
    private Long subjectRef;

    @Column(name = "requested_by")
    private Long requestedBy;

    /** Counts only, as JSON. Never what was removed. */
    @Column(name = "removed_counts", columnDefinition = "TEXT")
    private String removedCounts;

    @Column(name = "deleted_at", nullable = false)
    private LocalDateTime deletedAt;

    @PrePersist
    void onCreate() {
        if (deletedAt == null) deletedAt = LocalDateTime.now();
    }
}
