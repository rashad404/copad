package com.drcopad.copad.exception;

/**
 * Thrown when a caller exhausts a {@link com.drcopad.copad.service.RateLimitPolicy}
 * budget. Carries the retry delay so the response can set Retry-After.
 */
public class RateLimitExceededException extends RuntimeException {

    private final long retryAfterSeconds;

    public RateLimitExceededException(String message) {
        this(message, 60);
    }

    public RateLimitExceededException(String message, long retryAfterSeconds) {
        super(message);
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public long getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
}
