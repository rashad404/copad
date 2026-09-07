package com.drcopad.copad.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Encrypts patient files before they are written to disk.
 *
 * What this protects against: a leaked backup, another account on this shared
 * host reading the files, a disk that leaves the building. Those are the
 * realistic exposures for a cPanel box we do not control.
 *
 * What it does not protect against: someone who is already root on the running
 * server, because the key is in the process environment and they can read it.
 * Saying otherwise would be worse than not encrypting, since it would justify
 * decisions the protection does not actually support.
 *
 * AES-GCM, a fresh random IV per file, and the IV stored in front of the
 * ciphertext. GCM because it authenticates as well as encrypts: a file altered
 * on disk fails to decrypt rather than returning quietly wrong bytes, which for
 * a lab report is the difference that matters.
 */
@Slf4j
@Service
public class FileEncryptionService {

    /** Marks a file as one of ours, so a legacy plaintext file is recognisable. */
    private static final byte[] MAGIC = {'A', 'Z', 'D', 'O', 'C', '1'};
    private static final int IV_BYTES = 12;
    private static final int TAG_BITS = 128;

    @Value("${document.encryption.enabled:true}")
    private boolean enabled;

    /** Base64, 32 bytes. Never in the repository; supplied by the environment. */
    @Value("${document.encryption.key:}")
    private String configuredKey;

    private SecretKey key;
    private final SecureRandom random = new SecureRandom();

    @PostConstruct
    void init() {
        if (!enabled) {
            log.warn("Document encryption is disabled; patient files are stored as plaintext");
            return;
        }
        if (configuredKey == null || configuredKey.isBlank()) {
            // Refusing to start is deliberate. Starting up and quietly writing
            // plaintext while the configuration says files are encrypted is the
            // failure that gets discovered after a breach, not before.
            throw new IllegalStateException(
                    "document.encryption.key is not set. Set DOCUMENT_ENCRYPTION_KEY to a "
                            + "base64-encoded 32-byte key, or set document.encryption.enabled=false "
                            + "to store patient files as plaintext deliberately.");
        }
        byte[] raw = Base64.getDecoder().decode(configuredKey.trim());
        if (raw.length != 32) {
            throw new IllegalStateException(
                    "document.encryption.key must decode to 32 bytes, got " + raw.length);
        }
        key = new SecretKeySpec(raw, "AES");
        log.info("Document encryption is active");
    }

    public boolean isEnabled() {
        return enabled && key != null;
    }

    /** Encrypts, or returns the bytes unchanged when encryption is off. */
    public byte[] encrypt(byte[] plaintext) {
        if (!isEnabled() || plaintext == null) return plaintext;
        try {
            byte[] iv = new byte[IV_BYTES];
            random.nextBytes(iv);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(TAG_BITS, iv));
            byte[] ciphertext = cipher.doFinal(plaintext);

            return ByteBuffer.allocate(MAGIC.length + IV_BYTES + ciphertext.length)
                    .put(MAGIC).put(iv).put(ciphertext).array();
        } catch (Exception e) {
            // Never fall back to writing plaintext: a file believed encrypted
            // and stored in the clear is worse than a failed upload.
            throw new IllegalStateException("Could not encrypt the file", e);
        }
    }

    /**
     * Decrypts, passing through a file written before encryption existed.
     *
     * The magic prefix is what distinguishes them, so the ninety attachments
     * already on disk keep opening while they are migrated.
     */
    public byte[] decrypt(byte[] stored) {
        if (stored == null || !looksEncrypted(stored)) return stored;
        if (key == null) {
            throw new IllegalStateException(
                    "This file is encrypted but no encryption key is configured");
        }
        try {
            byte[] iv = new byte[IV_BYTES];
            System.arraycopy(stored, MAGIC.length, iv, 0, IV_BYTES);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(TAG_BITS, iv));
            return cipher.doFinal(stored, MAGIC.length + IV_BYTES,
                    stored.length - MAGIC.length - IV_BYTES);
        } catch (Exception e) {
            throw new IllegalStateException("Could not decrypt the file", e);
        }
    }

    public boolean looksEncrypted(byte[] stored) {
        if (stored == null || stored.length < MAGIC.length + IV_BYTES) return false;
        for (int i = 0; i < MAGIC.length; i++) {
            if (stored[i] != MAGIC[i]) return false;
        }
        return true;
    }
}
