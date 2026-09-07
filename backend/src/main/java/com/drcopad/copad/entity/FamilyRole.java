package com.drcopad.copad.entity;

/**
 * What a user may do within a family.
 *
 * Deliberately coarse. Fine-grained per-record sharing is a different problem
 * (consented sharing with a doctor, Phase 6) and should not be modelled by
 * multiplying roles here.
 */
public enum FamilyRole {
    /** Manages members and membership; exactly one per family. */
    OWNER,
    /** Full read and write over the family's records. */
    ADULT,
    /** Read-only: a relative who should see but not change a record. */
    VIEWER;

    public boolean canWrite() {
        return this == OWNER || this == ADULT;
    }

    public boolean canManageMembership() {
        return this == OWNER;
    }
}
