package com.drcopad.copad.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

/**
 * Stores patient files outside the web root.
 *
 * The previous location was public_html, which Apache serves directly, so a
 * lab report was readable by anyone with the URL. Nothing here is reachable
 * over HTTP; files are returned only by an endpoint that checks family access.
 */
@Slf4j
@Service
public class DocumentStorageService {

    /**
     * What a person can upload.
     *
     * Checked against the file's own bytes, not the declared type. A browser
     * sends whatever content type it likes, so trusting the header lets a
     * script arrive labelled as a PDF.
     */
    private static final Set<String> ALLOWED = Set.of(
            "application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic",
            "image/tiff", "text/plain",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    private static final long MAX_BYTES = 25L * 1024 * 1024;

    @Value("${document.storage.root:${user.home}/azdoc-documents}")
    private String storageRoot;

    public record Stored(String storageKey, String checksum, long size, String detectedType) {
    }

    /**
     * Writes a file and returns its key.
     *
     * Keys are member/year/month/uuid: a random name so nothing can be guessed,
     * and dated folders so a directory stays a manageable size and old material
     * can be found without a database.
     */
    public Stored store(Long memberId, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("The file is empty");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException(
                    "The file is larger than " + (MAX_BYTES / 1024 / 1024) + " MB");
        }

        byte[] bytes = file.getBytes();
        String detected = detectType(bytes, file.getOriginalFilename());
        if (!ALLOWED.contains(detected)) {
            throw new IllegalArgumentException(
                    "Files of type " + detected + " cannot be uploaded");
        }

        LocalDate today = LocalDate.now();
        String key = String.format("%d/%d/%02d/%s", memberId, today.getYear(),
                today.getMonthValue(), UUID.randomUUID());

        Path target = resolve(key);
        Files.createDirectories(target.getParent());
        Files.write(target, bytes, StandardOpenOption.CREATE_NEW);

        // Owner-only. On a shared host other accounts must not be able to read
        // patient files off the filesystem.
        try {
            Files.setPosixFilePermissions(target,
                    java.nio.file.attribute.PosixFilePermissions.fromString("rw-------"));
        } catch (UnsupportedOperationException ignored) {
            // Not a POSIX filesystem; nothing to tighten.
        }

        return new Stored(key, sha256(bytes), bytes.length, detected);
    }

    public InputStream read(String storageKey) throws IOException {
        Path path = resolve(storageKey);
        if (!Files.exists(path)) {
            throw new IOException("Stored file is missing");
        }
        return Files.newInputStream(path);
    }

    public byte[] readAllBytes(String storageKey) throws IOException {
        return Files.readAllBytes(resolve(storageKey));
    }

    public void delete(String storageKey) {
        try {
            Files.deleteIfExists(resolve(storageKey));
        } catch (IOException e) {
            // The database row is already soft-deleted, so a stale file is
            // untidy rather than harmful; failing the request would be worse.
            log.warn("Could not remove stored file: {}", e.getMessage());
        }
    }

    /**
     * Resolves a key inside the storage root, refusing anything that escapes it.
     *
     * A key reaching here should always be one we generated, but path traversal
     * is cheap to prevent and expensive to discover later.
     */
    private Path resolve(String storageKey) {
        Path root = Paths.get(storageRoot).toAbsolutePath().normalize();
        Path path = root.resolve(storageKey).normalize();
        if (!path.startsWith(root)) {
            throw new IllegalArgumentException("Invalid storage key");
        }
        return path;
    }

    /**
     * Identifies a file from its leading bytes.
     *
     * Magic numbers, because the declared content type is attacker-controlled.
     */
    private String detectType(byte[] bytes, String filename) {
        if (bytes.length >= 4) {
            if (bytes[0] == 0x25 && bytes[1] == 0x50 && bytes[2] == 0x44 && bytes[3] == 0x46) {
                return "application/pdf";
            }
            if ((bytes[0] & 0xFF) == 0xFF && (bytes[1] & 0xFF) == 0xD8) return "image/jpeg";
            if ((bytes[0] & 0xFF) == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E) return "image/png";
            if (bytes[0] == 0x50 && bytes[1] == 0x4B) {
                // A zip container: docx, or something pretending to be one.
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }
            if (bytes[0] == 0x49 && bytes[1] == 0x49) return "image/tiff";
            if (bytes[0] == 0x4D && bytes[1] == 0x4D) return "image/tiff";
        }
        if (bytes.length >= 12) {
            String riff = new String(bytes, 0, 4);
            String webp = new String(bytes, 8, 4);
            if ("RIFF".equals(riff) && "WEBP".equals(webp)) return "image/webp";
            if ("ftyp".equals(new String(bytes, 4, 4))) return "image/heic";
        }
        // Fall back to the extension only for plain text, where there are no
        // magic bytes to check.
        if (filename != null && filename.toLowerCase(Locale.ROOT).endsWith(".txt")) {
            return "text/plain";
        }
        return "application/octet-stream";
    }

    private String sha256(byte[] bytes) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
        } catch (Exception e) {
            return null;
        }
    }
}
