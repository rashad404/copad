package com.drcopad.copad.service;

import com.drcopad.copad.exception.RateLimitExceededException;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.EnumMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Fixed-window rate limiting, one window per {@link RateLimitPolicy} and key.
 *
 * State is in-process. That is adequate while the backend runs as a single
 * JVM, but it means counters reset on restart and would not be shared across
 * instances; moving to Redis is the change to make before running more than
 * one node.
 */
@Slf4j
@Service
public class RateLimiterService {

    /** A counter plus the instant its window opened. */
    private static final class Window {
        private final Instant startedAt = Instant.now();
        private final AtomicInteger count = new AtomicInteger();
    }

    private final Map<RateLimitPolicy, Cache<String, Window>> caches = new EnumMap<>(RateLimitPolicy.class);

    public RateLimiterService() {
        for (RateLimitPolicy policy : RateLimitPolicy.values()) {
            caches.put(policy, Caffeine.newBuilder()
                    // Expire on the window length measured from creation, not
                    // from last write: expireAfterWrite would keep pushing the
                    // window out under sustained traffic and never let a
                    // limited caller recover.
                    .expireAfterAccess(policy.window().multipliedBy(2))
                    .maximumSize(100_000)
                    .build());
        }
    }

    /**
     * Records one request and reports whether it is within budget.
     *
     * @return seconds until the window resets, or 0 when the request is allowed
     */
    public long consume(RateLimitPolicy policy, String key) {
        if (key == null || key.isBlank()) {
            // No usable identity: fail open rather than lock everyone out of a
            // shared bucket, but say so, because it means a caller is missing
            // an id we expected.
            log.warn("Rate limit check skipped for {}: no key supplied", policy);
            return 0;
        }

        Cache<String, Window> cache = caches.get(policy);
        Window window = cache.get(key, k -> new Window());

        long elapsed = Duration.between(window.startedAt, Instant.now()).getSeconds();
        if (elapsed >= policy.window().getSeconds()) {
            // Window has rolled over; start a fresh one.
            window = new Window();
            cache.put(key, window);
            elapsed = 0;
        }

        if (window.count.incrementAndGet() > policy.maxRequests()) {
            return Math.max(1, policy.window().getSeconds() - elapsed);
        }
        return 0;
    }

    /**
     * Enforces a budget, throwing when it is exhausted.
     */
    public void require(RateLimitPolicy policy, String key) {
        long retryAfter = consume(policy, key);
        if (retryAfter > 0) {
            // The key can be a session id or an IP, so it is not logged.
            log.warn("Rate limit exceeded for policy {} (retry in {}s)", policy, retryAfter);
            throw new RateLimitExceededException(
                    "Rate limit exceeded. Please try again later.", retryAfter);
        }
    }

    /** Enforces the same policy against several keys, e.g. session and IP. */
    public void requireAll(RateLimitPolicy policy, String... keys) {
        for (String key : keys) {
            require(policy, key);
        }
    }

    public void resetLimit(RateLimitPolicy policy, String key) {
        caches.get(policy).invalidate(key);
    }
}
