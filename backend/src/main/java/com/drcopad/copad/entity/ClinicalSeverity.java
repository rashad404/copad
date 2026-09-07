package com.drcopad.copad.entity;

/**
 * Shared severity scale.
 *
 * UNKNOWN is a distinct value rather than null: "we never asked" and "it is
 * mild" must not look the same when deciding whether to warn.
 */
public enum ClinicalSeverity {
    UNKNOWN,
    MILD,
    MODERATE,
    SEVERE,
    /** Anaphylaxis or equivalent: must be surfaced before any other advice. */
    LIFE_THREATENING
}
