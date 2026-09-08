package com.drcopad.copad.entity;

/** Where synced readings come from. */
public enum HealthProvider {
    APPLE_HEALTH,
    HEALTH_CONNECT,
    /** A file somebody exported from a device that speaks neither. */
    FILE
}
