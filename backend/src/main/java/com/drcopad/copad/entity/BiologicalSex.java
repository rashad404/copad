package com.drcopad.copad.entity;

/**
 * Sex assigned at birth, recorded because it changes clinical reference ranges
 * (haemoglobin, creatinine, growth charts). This is not gender identity, which
 * is a separate field on the user profile and must not be conflated with it.
 */
public enum BiologicalSex {
    MALE,
    FEMALE,
    INTERSEX,
    UNDISCLOSED
}
