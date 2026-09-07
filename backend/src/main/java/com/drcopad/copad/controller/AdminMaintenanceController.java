package com.drcopad.copad.controller;

import com.drcopad.copad.service.FileEncryptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.*;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Stream;

/**
 * One-off maintenance that has to run with the application's own key.
 *
 * Encrypting the files written before encryption existed could have been a
 * script, but the key lives in this process and the encryption is already
 * implemented and tested here. Reimplementing it in a shell script would mean a
 * second implementation of the thing that must not be got wrong.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/maintenance")
@RequiredArgsConstructor
public class AdminMaintenanceController {

    private final FileEncryptionService encryption;

    @Value("${attachment.storage.root:${user.home}/azdoc-attachments}")
    private String attachmentRoot;

    @Value("${document.storage.root:${user.home}/azdoc-documents}")
    private String documentRoot;

    /**
     * Encrypts stored files that are still plaintext.
     *
     * Idempotent: a file already carrying our header is left alone, so running
     * it twice is harmless. Each file is decrypted back and compared before the
     * original is replaced - an unreadable medical record is worse than a
     * plaintext one, so a file that does not round-trip is left exactly as it
     * was and counted as a failure.
     */
    @PostMapping("/encrypt-stored-files")
    public Map<String, Object> encryptStoredFiles(
            @RequestParam(defaultValue = "true") boolean dryRun) {

        if (!encryption.isEnabled()) {
            return Map.of("error", "Encryption is not enabled; nothing would be written");
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("dryRun", dryRun);
        result.put("attachments", walk(Paths.get(attachmentRoot), dryRun));
        result.put("documents", walk(Paths.get(documentRoot), dryRun));
        return result;
    }

    private Map<String, Object> walk(Path root, boolean dryRun) {
        Map<String, Object> counts = new LinkedHashMap<>();
        int encrypted = 0, already = 0, failed = 0;

        if (!Files.isDirectory(root)) {
            counts.put("root", root + " (not present)");
            return counts;
        }

        try (Stream<Path> files = Files.walk(root)) {
            for (Path path : files.filter(Files::isRegularFile).toList()) {
                try {
                    byte[] data = Files.readAllBytes(path);
                    if (encryption.looksEncrypted(data)) {
                        already++;
                        continue;
                    }
                    if (dryRun) {
                        encrypted++;
                        continue;
                    }

                    byte[] blob = encryption.encrypt(data);
                    // Proven readable before the original is replaced.
                    if (!java.util.Arrays.equals(encryption.decrypt(blob), data)) {
                        log.error("Round trip failed; leaving file untouched");
                        failed++;
                        continue;
                    }

                    Path tmp = path.resolveSibling(path.getFileName() + ".enc");
                    Files.write(tmp, blob, StandardOpenOption.CREATE_NEW);
                    try {
                        Files.setPosixFilePermissions(tmp,
                                java.nio.file.attribute.PosixFilePermissions.fromString("rw-------"));
                    } catch (UnsupportedOperationException ignored) {
                        // Not a POSIX filesystem.
                    }
                    Files.move(tmp, path, StandardCopyOption.REPLACE_EXISTING,
                            StandardCopyOption.ATOMIC_MOVE);
                    encrypted++;

                } catch (Exception e) {
                    // The path is not logged: it identifies a patient's file.
                    log.error("Could not encrypt a stored file: {}", e.getClass().getSimpleName());
                    failed++;
                }
            }
        } catch (IOException e) {
            counts.put("error", e.getClass().getSimpleName());
        }

        counts.put("encrypted", encrypted);
        counts.put("alreadyEncrypted", already);
        counts.put("failed", failed);
        return counts;
    }
}
