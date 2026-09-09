package com.drcopad.copad.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * What stands between an intercepted link and somebody's medical account.
 *
 * On Android any application can claim a custom scheme, so the assumption here
 * is that the code was read by something hostile. Every test is a way that
 * could go wrong.
 */
class NativeAuthCodesTest {

    private final NativeAuthCodes codes = new NativeAuthCodes();

    @Test
    void theAppThatStartedItGetsItsAccount() {
        String verifier = "a-secret-the-app-kept-to-itself";
        String code = codes.issue("nurlan@example.com",
                NativeAuthCodes.challengeFor(verifier));

        assertEquals("nurlan@example.com", codes.redeem(code, verifier));
    }

    @Test
    void interceptingTheCodeIsNotEnough() {
        String code = codes.issue("nurlan@example.com",
                NativeAuthCodes.challengeFor("a-secret-the-app-kept-to-itself"));

        // Everything the intercepting application saw, and a guess.
        assertNull(codes.redeem(code, "a-secret-the-app-kept-to-itself-x"));
        assertNull(codes.redeem(code, ""));
    }

    @Test
    void aWrongGuessBurnsTheCode() {
        String verifier = "a-secret-the-app-kept-to-itself";
        String code = codes.issue("nurlan@example.com",
                NativeAuthCodes.challengeFor(verifier));

        assertNull(codes.redeem(code, "wrong"));
        // The real app has lost this one too. That is the intended trade: a
        // person signs in again, an attacker gets one attempt rather than many.
        assertNull(codes.redeem(code, verifier));
    }

    @Test
    void aCodeIsGoodOnce() {
        String verifier = "a-secret-the-app-kept-to-itself";
        String code = codes.issue("nurlan@example.com",
                NativeAuthCodes.challengeFor(verifier));

        assertEquals("nurlan@example.com", codes.redeem(code, verifier));
        assertNull(codes.redeem(code, verifier));
    }

    @Test
    void nothingIsAcceptedThatWasNeverIssued() {
        assertNull(codes.redeem("made-up", "anything"));
        assertNull(codes.redeem(null, "anything"));
        assertNull(codes.redeem("made-up", null));
    }

    @Test
    void twoSignInsDoNotShareACode() {
        String first = codes.issue("nurlan@example.com",
                NativeAuthCodes.challengeFor("one"));
        String second = codes.issue("sebine@example.com",
                NativeAuthCodes.challengeFor("two"));

        assertNotEquals(first, second);
        // And one person's verifier does not open the other's code.
        assertNull(codes.redeem(first, "two"));
    }
}
