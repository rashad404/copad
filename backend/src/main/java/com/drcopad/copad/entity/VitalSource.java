package com.drcopad.copad.entity;

/**
 * Where a reading came from.
 *
 * Recorded because confidence differs and because device sync must never
 * silently overwrite something a person entered by hand.
 */
public enum VitalSource {
    MANUAL,
    DEVICE,
    /** Extracted from an uploaded document, pending confirmation. */
    DOCUMENT,
    LAB,
    IMPORTED
}
