package com.drcopad.copad.entity;

/**
 * Where an order has got to.
 *
 * REQUESTED is what a person can create; everything after it is the
 * laboratory's to say. Nothing here records payment - the product cannot take
 * money, and a status implying otherwise would be a worse lie than none.
 */
public enum LabOrderStatus {
    REQUESTED,
    CONFIRMED,
    SAMPLE_COLLECTED,
    COMPLETED,
    CANCELLED
}
