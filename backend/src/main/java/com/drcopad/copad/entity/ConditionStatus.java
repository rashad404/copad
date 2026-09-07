package com.drcopad.copad.entity;

/** Where a condition stands. */
public enum ConditionStatus {
    ACTIVE,
    RESOLVED,
    IN_REMISSION,
    /** Recorded but not confirmed by a clinician - e.g. imported or self-reported. */
    UNCONFIRMED
}
