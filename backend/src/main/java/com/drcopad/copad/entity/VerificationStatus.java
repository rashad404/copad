package com.drcopad.copad.entity;

/**
 * How much is actually known about a doctor listing.
 *
 * The distinction that matters is the first one. A listing seeded from a public
 * source describes somebody who was never asked and has confirmed nothing, and
 * presenting it as though we vouch for them would be a claim we have no basis
 * for. Nothing about an UNCLAIMED entry may read as endorsement.
 */
public enum VerificationStatus {
    /** Listed from a public source. Never asked, never confirmed. */
    UNCLAIMED,
    /** A person has claimed the listing and is awaiting review. */
    PENDING,
    /** Credentials checked. */
    VERIFIED,
    /** A claim was refused. */
    REJECTED
}
