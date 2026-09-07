package com.drcopad.copad.entity;

/**
 * Where a lab value came from.
 *
 * The record has to be able to say this. An extracted value was read by a
 * machine and then accepted by a person; a manual one was typed from a report
 * nobody could read automatically. Both are usable, they are not equally
 * certain, and a clinician looking at the record deserves to know which is
 * which.
 */
public enum LabResultSource {
    /** Read from an uploaded document, then confirmed by a person. */
    EXTRACTED,
    /** Typed in by a person, usually because extraction found no text. */
    MANUAL
}
