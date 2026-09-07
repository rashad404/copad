package com.drcopad.copad.service;

import com.drcopad.copad.entity.FileAttachment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

/**
 * Storage for files attached to a chat.
 *
 * These were written into public_html, which the web server serves directly,
 * so a photo of a rash or a lab report was readable by anyone who had or
 * guessed the URL - no session, no account. Files now live outside the web root
 * and are returned only by an endpoint that checks the owning session.
 *
 * Older rows have no storage key. They resolve against the legacy directory so
 * existing conversations keep working while their files are moved.
 */
@Slf4j
@Service
public class AttachmentStorageService {

    private final FileEncryptionService encryption;

    public AttachmentStorageService(FileEncryptionService encryption) {
        this.encryption = encryption;
    }


    /** Checked against the bytes, never the declared type. */
    private static final Set<String> ALLOWED = Set.of(
            "application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic",
            "image/tiff", "text/plain",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    private static final long MAX_BYTES = 10L * 1024 * 1024;

    @Value("${attachment.storage.root:${user.home}/azdoc-attachments}")
    private String storageRoot;

    /** Where files written before this change still live. */
    @Value("${upload.base-dir:../public_html}")
    private String legacyRoot;

    public record Stored(String storageKey, long size, String detectedType) {
    }

    /**
     * Writes a file and returns its key.
     *
     * Dated folders with random names: a key cannot be guessed, and a single
     * directory never grows to the point where listing it matters.
     */
    public Stored store(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("The file is empty");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException(
                    "The file is larger than " + (MAX_BYTES / 1024 / 1024) + " MB");
        }

        byte[] bytes = file.getBytes();
        String detected = FileTypeDetector.detect(bytes, file.getOriginalFilename());
        if (!ALLOWED.contains(detected)) {
            throw new IllegalArgumentException("Files of type " + detected + " cannot be uploaded");
        }

        LocalDate today = LocalDate.now();
        String key = String.format("chat/%d/%02d/%s", today.getYear(), today.getMonthValue(),
                UUID.randomUUID());

        Path target = resolve(key);
        Files.createDirectories(target.getParent());
        Files.write(target, encryption.encrypt(bytes), StandardOpenOption.CREATE_NEW);
        restrictPermissions(target);

        return new Stored(key, bytes.length, detected);
    }

    /** The file behind an attachment, whether it has been moved yet or not. */
    public Path pathOf(FileAttachment attachment) {
        String key = attachment.getStorageKey();
        return key != null && !key.isBlank()
                ? resolve(key)
                : Paths.get(legacyRoot).toAbsolutePath().normalize()
                        .resolve(sanitiseLegacy(attachment.getFilePath())).normalize();
    }

    /** Decrypted, and passing through a file written before encryption existed. */
    public InputStream read(FileAttachment attachment) throws IOException {
        Path path = pathOf(attachment);
        if (!Files.isRegularFile(path)) {
            throw new IOException("Stored file is missing");
        }
        return new java.io.ByteArrayInputStream(
                encryption.decrypt(Files.readAllBytes(path)));
    }

    /** The decrypted bytes, for callers that need them whole. */
    public byte[] readAllBytes(FileAttachment attachment) throws IOException {
        return encryption.decrypt(Files.readAllBytes(pathOf(attachment)));
    }

    public void delete(String storageKey) {
        if (storageKey == null || storageKey.isBlank()) return;
        try {
            Files.deleteIfExists(resolve(storageKey));
        } catch (IOException e) {
            log.warn("Could not remove stored attachment: {}", e.getMessage());
        }
    }

    /** Resolves inside the storage root, refusing anything that escapes it. */
    private Path resolve(String storageKey) {
        Path root = Paths.get(storageRoot).toAbsolutePath().normalize();
        Path path = root.resolve(storageKey).normalize();
        if (!path.startsWith(root)) {
            throw new IllegalArgumentException("Invalid storage key");
        }
        return path;
    }

    /**
     * Legacy paths come from the database rather than from a request, but they
     * were written by code that never validated a filename, so they are still
     * held to the shape they should have.
     */
    private String sanitiseLegacy(String filePath) {
        if (filePath == null || filePath.contains("..") || filePath.startsWith("/")) {
            throw new IllegalArgumentException("Invalid file path");
        }
        return filePath;
    }

    private void restrictPermissions(Path target) {
        try {
            Files.setPosixFilePermissions(target,
                    java.nio.file.attribute.PosixFilePermissions.fromString("rw-------"));
        } catch (UnsupportedOperationException | IOException ignored) {
            // Not a POSIX filesystem; nothing to tighten.
        }
    }

    /** Exposed for the one-off move of files still sitting in the web root. */
    public String legacyRoot() {
        return legacyRoot;
    }

    public String storageRoot() {
        return storageRoot;
    }

    public static String extensionFor(String contentType) {
        return switch (contentType == null ? "" : contentType.toLowerCase(Locale.ROOT)) {
            case "application/pdf" -> ".pdf";
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "text/plain" -> ".txt";
            default -> "";
        };
    }
}
