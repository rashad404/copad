package com.drcopad.copad.service;

import com.drcopad.copad.entity.FileAttachment;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.nio.file.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Attachment storage is what stands between a patient's photo and the open
 * web, so the properties that make it safe are pinned here rather than left to
 * review.
 */
class AttachmentStorageServiceTest {

    @TempDir
    Path privateRoot;
    @TempDir
    Path legacyRoot;

    private AttachmentStorageService storage;

    @BeforeEach
    void setUp() {
        storage = new AttachmentStorageService();
        ReflectionTestUtils.setField(storage, "storageRoot", privateRoot.toString());
        ReflectionTestUtils.setField(storage, "legacyRoot", legacyRoot.toString());
    }

    private MockMultipartFile png(String name) {
        byte[] bytes = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 1, 2, 3, 4, 5, 6, 7, 8};
        return new MockMultipartFile("file", name, "image/png", bytes);
    }

    @Test
    void storesOutsideTheWebRoot() throws Exception {
        var stored = storage.store(png("scan.png"));

        Path written = privateRoot.resolve(stored.storageKey());
        assertTrue(Files.isRegularFile(written));
        // Nothing may land where the web server can reach it.
        assertFalse(Files.exists(legacyRoot.resolve(stored.storageKey())));
    }

    @Test
    void keyCarriesNothingFromTheFilename() throws Exception {
        // Filenames routinely contain a patient's name, and the key ends up in
        // a URL.
        var stored = storage.store(png("Aygun Memmedova analiz.png"));
        assertFalse(stored.storageKey().toLowerCase().contains("aygun"));
        assertFalse(stored.storageKey().contains(" "));
    }

    @Test
    void identifiesTypeFromBytesNotFromTheDeclaredType() throws Exception {
        // A browser sends whatever content type it likes.
        var lying = new MockMultipartFile("file", "x.png", "image/png",
                "%PDF-1.4 not an image".getBytes());
        assertEquals("application/pdf", storage.store(lying).detectedType());
    }

    @Test
    void refusesAnExecutable() {
        var script = new MockMultipartFile("file", "run.sh", "image/png",
                "#!/bin/sh\nrm -rf /".getBytes());
        assertThrows(IllegalArgumentException.class, () -> storage.store(script));
    }

    @Test
    void refusesAFileOverTheLimit() {
        var big = new MockMultipartFile("file", "big.png", "image/png",
                new byte[11 * 1024 * 1024]);
        assertThrows(IllegalArgumentException.class, () -> storage.store(big));
    }

    @Test
    void readsRowsThatHaveNotBeenMovedYet() throws Exception {
        // Until the one-off move runs, old rows still point into the web root
        // and their conversations must keep working.
        Path legacy = legacyRoot.resolve("uploads/images/old.png");
        Files.createDirectories(legacy.getParent());
        Files.writeString(legacy, "old");

        FileAttachment attachment = new FileAttachment();
        attachment.setFilePath("uploads/images/old.png");

        assertEquals(legacy, storage.pathOf(attachment));
        try (var in = storage.read(attachment)) {
            assertEquals("old", new String(in.readAllBytes()));
        }
    }

    @Test
    void refusesALegacyPathThatEscapesItsRoot() {
        FileAttachment attachment = new FileAttachment();
        attachment.setFilePath("../../etc/passwd");
        assertThrows(IllegalArgumentException.class, () -> storage.pathOf(attachment));
    }

    @Test
    void refusesAStorageKeyThatEscapesItsRoot() {
        FileAttachment attachment = new FileAttachment();
        attachment.setStorageKey("../../etc/passwd");
        assertThrows(IllegalArgumentException.class, () -> storage.pathOf(attachment));
    }

    @Test
    void deletingIsSafeWhenTheFileIsAlreadyGone() {
        assertDoesNotThrow(() -> storage.delete("chat/2026/09/missing"));
        assertDoesNotThrow(() -> storage.delete(null));
    }
}
