package com.drcopad.copad.entity;

/** How a reading sits against the reference range for this person. */
public enum AbnormalFlag {
    NORMAL,
    LOW,
    HIGH,
    /** Far enough outside the range to warrant prompt attention. */
    CRITICAL_LOW,
    CRITICAL_HIGH;

    public boolean isCritical() {
        return this == CRITICAL_LOW || this == CRITICAL_HIGH;
    }

    public boolean isAbnormal() {
        return this != NORMAL;
    }
}
