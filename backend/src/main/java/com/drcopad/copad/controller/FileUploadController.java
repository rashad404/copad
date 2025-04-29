package com.drcopad.copad.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import com.drcopad.copad.entity.User;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    @Value("${upload.dir}")
    private String uploadDir;

    @PostMapping("/image")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {
        try {
            // Check file content type
            String contentType = file.getContentType();
            if (contentType == null || 
                !(contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("image/webp"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Only JPG, PNG, and WEBP images are allowed.");
            }

            // Create main upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Create thumbs directory if it doesn't exist
            Path thumbsPath = uploadPath.resolve("thumbs");
            if (!Files.exists(thumbsPath)) {
                Files.createDirectories(thumbsPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Save main resized image (800x800 max)
            Path filePath = uploadPath.resolve(uniqueFilename);
            try (var inputStream = file.getInputStream()) {
                Thumbnails.of(inputStream)
                          .size(800, 800)
                          .keepAspectRatio(true)
                          .toFile(filePath.toFile());
            }

            // Save thumbnail (e.g., 300x300 max)
            Path thumbPath = thumbsPath.resolve(uniqueFilename);
            try (var inputStream = file.getInputStream()) { // Need new inputStream
                Thumbnails.of(file.getInputStream())
                          .size(300, 300)
                          .keepAspectRatio(true)
                          .toFile(thumbPath.toFile());
            }

            // Return the URL paths (original and thumbnail)
            String originalUrl = "/uploads/images/" + uniqueFilename;
            String thumbUrl = "/uploads/images/thumbs/" + uniqueFilename;

            return ResponseEntity.ok("{\"original\":\"" + originalUrl + "\",\"thumb\":\"" + thumbUrl + "\"}");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload image: " + e.getMessage());
        }
    }
}
