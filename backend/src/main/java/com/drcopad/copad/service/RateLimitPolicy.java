package com.drcopad.copad.service;

import java.time.Duration;

/**
 * Request budgets per class of endpoint.
 *
 * These are deliberately not one shared number. An AI chat turn costs a paid
 * OpenAI call, while listing blog tags costs a cheap query, so they cannot
 * share a budget: a limit loose enough for browsing leaves the expensive
 * endpoint wide open.
 */
public enum RateLimitPolicy {

    /**
     * Creating guest sessions. Keyed by IP, because a session id cannot exist
     * yet - and because this is the endpoint an abuser calls repeatedly to mint
     * fresh identities and reset every other per-session budget.
     */
    SESSION_CREATE(20, Duration.ofHours(1)),

    /**
     * AI chat turns. The only endpoint that spends money on every call, so it
     * is checked against both the session and the originating IP.
     */
    AI_CHAT(30, Duration.ofHours(1)),

    /** File uploads: storage plus extraction work. */
    FILE_UPLOAD(20, Duration.ofHours(1)),

    /** Everything else: reads and small writes. */
    GENERAL(100, Duration.ofHours(1));

    private final int maxRequests;
    private final Duration window;

    RateLimitPolicy(int maxRequests, Duration window) {
        this.maxRequests = maxRequests;
        this.window = window;
    }

    public int maxRequests() {
        return maxRequests;
    }

    public Duration window() {
        return window;
    }
}
