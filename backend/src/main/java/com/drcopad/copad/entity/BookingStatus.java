package com.drcopad.copad.entity;

/**
 * Where an appointment stands.
 *
 * REQUESTED and CONFIRMED both hold the slot; everything else releases it. That
 * distinction is enforced by the database rather than remembered here, because
 * two people racing for the last appointment is the ordinary case.
 */
public enum BookingStatus {
    /** Made by a person, not yet accepted by the clinic. */
    REQUESTED,
    CONFIRMED,
    CANCELLED,
    COMPLETED,
    /** Booked and not attended. Kept distinct from a cancellation. */
    NO_SHOW;

    /** Whether this booking still occupies its time. */
    public boolean holdsSlot() {
        return this == REQUESTED || this == CONFIRMED;
    }
}
