package com.drcopad.copad.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * The handoff between a signed-in browser and the app that opened it.
 *
 * Google sends the browser back to us, not to the app, so something has to
 * cross that gap. Putting the session token straight into the app's link would
 * mean handing it to whatever answers that link: on Android any application can
 * claim a custom scheme, and it would be handed a working medical account.
 *
 * So the link carries a code that is worth nothing on its own. The app proves
 * it is the one that started the flow by presenting the secret behind the
 * challenge it sent at the beginning, and only then gets a token. An
 * application that intercepts the redirect never saw that secret.
 *
 * Held in memory rather than a table. A code lives sixty seconds and is good
 * once; the failure mode of a restart during those sixty seconds is that one
 * person signs in again.
 */
@Slf4j
@Service
public class NativeAuthCodes {

    /** Long enough to open a browser and sign in, short enough to be useless later. */
    private static final Duration LIFETIME = Duration.ofMinutes(5);

    /** So a machine that never redeems anything cannot grow the map without bound. */
    private static final int MAX_OUTSTANDING = 500;

    private record Pending(String email, String challenge, Instant expiresAt) {}

    private final Map<String, Pending> pending = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    /**
     * Mints a code for somebody who has just signed in.
     *
     * @param challenge the base64url SHA-256 of the secret the app kept. It is
     *                  compared, never used to derive anything.
     */
    public String issue(String email, String challenge) {
        sweep();
        if (pending.size() >= MAX_OUTSTANDING) {
            throw new IllegalStateException("Too many sign-ins waiting to be collected");
        }
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String code = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        pending.put(code, new Pending(email, challenge, Instant.now().plus(LIFETIME)));
        return code;
    }

    /**
     * Trades a code and the secret behind its challenge for the email that was
     * signed in, or null if anything about it is wrong.
     *
     * Removed on the first attempt whether or not it succeeds, so a wrong
     * verifier cannot be guessed at twice.
     */
    public String redeem(String code, String verifier) {
        if (code == null || verifier == null) return null;
        Pending row = pending.remove(code);
        if (row == null) return null;
        if (Instant.now().isAfter(row.expiresAt())) return null;
        if (!MessageDigest.isEqual(
                challengeFor(verifier).getBytes(StandardCharsets.UTF_8),
                row.challenge().getBytes(StandardCharsets.UTF_8))) {
            log.warn("Native sign-in code presented with the wrong verifier");
            return null;
        }
        return row.email();
    }

    /** What the app should have sent at the start of the flow. */
    public static String challengeFor(String verifier) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(verifier.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }

    private void sweep() {
        Instant now = Instant.now();
        pending.entrySet().removeIf(e -> now.isAfter(e.getValue().expiresAt()));
    }
}
