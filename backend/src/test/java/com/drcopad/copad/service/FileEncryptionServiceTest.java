package com.drcopad.copad.service;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The properties encryption at rest is supposed to have.
 *
 * Worth pinning because the failure is invisible: a file written in the clear
 * while the configuration says otherwise looks exactly like a working system
 * until somebody reads the disk.
 */
class FileEncryptionServiceTest {

    private FileEncryptionService withKey(String base64Key) {
        FileEncryptionService service = new FileEncryptionService();
        ReflectionTestUtils.setField(service, "enabled", true);
        ReflectionTestUtils.setField(service, "configuredKey", base64Key);
        service.init();
        return service;
    }

    private String aKey(byte fill) {
        byte[] raw = new byte[32];
        java.util.Arrays.fill(raw, fill);
        return Base64.getEncoder().encodeToString(raw);
    }

    @Test
    void aRoundTripReturnsTheOriginal() {
        FileEncryptionService service = withKey(aKey((byte) 7));
        byte[] original = "Hemoqlobin 9,1 q/dL".getBytes(StandardCharsets.UTF_8);

        byte[] encrypted = service.encrypt(original);
        assertArrayEquals(original, service.decrypt(encrypted));
    }

    @Test
    void theContentIsNotVisibleInTheCiphertext() {
        FileEncryptionService service = withKey(aKey((byte) 7));
        byte[] encrypted = service.encrypt("Hemoqlobin".getBytes(StandardCharsets.UTF_8));
        assertFalse(new String(encrypted, StandardCharsets.ISO_8859_1).contains("Hemoqlobin"));
    }

    @Test
    void theSameFileTwiceProducesDifferentCiphertext() {
        // A fresh IV each time, so identical reports are not identifiable as
        // identical from the disk alone.
        FileEncryptionService service = withKey(aKey((byte) 7));
        byte[] plaintext = "same report".getBytes(StandardCharsets.UTF_8);
        assertFalse(java.util.Arrays.equals(
                service.encrypt(plaintext), service.encrypt(plaintext)));
    }

    @Test
    void anAlteredFileFailsRatherThanDecryptingToSomethingElse() {
        FileEncryptionService service = withKey(aKey((byte) 7));
        byte[] encrypted = service.encrypt("Xolesterin 7,2".getBytes(StandardCharsets.UTF_8));
        encrypted[encrypted.length - 2] ^= 0x01;

        assertThrows(IllegalStateException.class, () -> service.decrypt(encrypted));
    }

    @Test
    void anotherKeyCannotRead() {
        byte[] encrypted = withKey(aKey((byte) 7))
                .encrypt("private".getBytes(StandardCharsets.UTF_8));
        assertThrows(IllegalStateException.class, () -> withKey(aKey((byte) 9)).decrypt(encrypted));
    }

    @Test
    void aFileWrittenBeforeEncryptionStillReads() {
        // The ninety attachments already on disk have to keep opening while
        // they are migrated.
        FileEncryptionService service = withKey(aKey((byte) 7));
        byte[] legacy = "%PDF-1.4 plain".getBytes(StandardCharsets.UTF_8);

        assertFalse(service.looksEncrypted(legacy));
        assertArrayEquals(legacy, service.decrypt(legacy));
    }

    @Test
    void aKeyOfTheWrongLengthIsRejectedAtStartup() {
        // Silently accepting a short key would weaken every file written after
        // it, with nothing to show that it happened.
        FileEncryptionService service = new FileEncryptionService();
        ReflectionTestUtils.setField(service, "enabled", true);
        ReflectionTestUtils.setField(service, "configuredKey",
                Base64.getEncoder().encodeToString(new byte[16]));

        assertThrows(IllegalStateException.class, service::init);
    }

    @Test
    void refusesToStartWithNoKey() {
        FileEncryptionService service = new FileEncryptionService();
        ReflectionTestUtils.setField(service, "enabled", true);
        ReflectionTestUtils.setField(service, "configuredKey", "");

        assertThrows(IllegalStateException.class, service::init);
    }

    @Test
    void whenDeliberatelyDisabledItPassesBytesThrough() {
        FileEncryptionService service = new FileEncryptionService();
        ReflectionTestUtils.setField(service, "enabled", false);
        service.init();

        byte[] plaintext = "plain".getBytes(StandardCharsets.UTF_8);
        assertArrayEquals(plaintext, service.encrypt(plaintext));
        assertArrayEquals(plaintext, service.decrypt(plaintext));
    }
}
