package com.drcopad.copad.entity;

/**
 * What a person is agreeing to.
 *
 * Separate purposes, because they are separate decisions. Someone may well want
 * their record kept here and not want its contents sent to a company abroad, and
 * a single acceptance covering both would record an agreement they never made.
 */
public enum ConsentType {
    /** Holding a health record here at all. */
    RECORD_STORAGE,

    /**
     * Sending message and document content to the AI provider for processing.
     *
     * Named separately because the processing happens outside Azerbaijan, which
     * is the part a person is least likely to assume.
     */
    CROSS_BORDER_AI,

    /**
     * A claim to be entitled to make decisions for another person's record.
     *
     * A child cannot consent, so the basis for holding their record is the
     * guardian's. Recorded as an attestation against a specific member.
     */
    GUARDIAN
}
