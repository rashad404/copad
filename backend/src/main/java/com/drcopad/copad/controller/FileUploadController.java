package com.drcopad.copad.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.drcopad.copad.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    @Value("${upload.dir}")
    private String uploadDir;
    
    @Value("${upload.docs.dir:uploads/documents}")
    private String documentsDir;
    
    private final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
    
    @PostMapping("/document")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {
        try {
            // Check file size
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("File size exceeds the maximum limit of 10MB.");
            }
            
            // Check file content type
            String contentType = file.getContentType();
            if (contentType == null || 
                !(contentType.equals("application/pdf") || 
                  contentType.equals("application/msword") || 
                  contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                  contentType.equals("text/plain"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Only PDF, DOC, DOCX, and TXT files are allowed.");
            }

            // Create documents directory if it doesn't exist
            Path documentsPath = Paths.get(documentsDir);
            if (!Files.exists(documentsPath)) {
                Files.createDirectories(documentsPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Save the document
            Path filePath = documentsPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath);

            // Return the document URL and metadata
            Map<String, String> response = new HashMap<>();
            response.put("url", "/uploads/documents/" + uniqueFilename);
            response.put("filename", originalFilename);
            response.put("fileType", contentType);
            response.put("fileSize", String.valueOf(file.getSize()));

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Failed to upload document", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload document: " + e.getMessage());
        }
    }
    
    @PostMapping("/chat/image")
    public ResponseEntity<?> uploadChatImage(@RequestParam("file") MultipartFile file) {
        try {
            // Check file size
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("File size exceeds the maximum limit of 10MB.");
            }
            
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

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Save the image
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath);

            // Return the URL path and metadata
            Map<String, String> response = new HashMap<>();
            response.put("url", "/uploads/images/" + uniqueFilename);
            response.put("filename", originalFilename);
            response.put("fileType", contentType);
            response.put("fileSize", String.valueOf(file.getSize()));

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Failed to upload chat image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload image: " + e.getMessage());
        }
    }
    
    @PostMapping("/chat/document")
    public ResponseEntity<?> uploadChatDocument(@RequestParam("file") MultipartFile file) {
        try {
            // Check file size
            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("File size exceeds the maximum limit of 10MB.");
            }
            
            // Check file content type
            String contentType = file.getContentType();
            if (contentType == null || 
                !(contentType.equals("application/pdf") || 
                  contentType.equals("application/msword") || 
                  contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                  contentType.equals("text/plain"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Only PDF, DOC, DOCX, and TXT files are allowed.");
            }

            // Create documents directory if it doesn't exist
            Path documentsPath = Paths.get(documentsDir);
            if (!Files.exists(documentsPath)) {
                Files.createDirectories(documentsPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Save the document
            Path filePath = documentsPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath);

            // Return the document URL and metadata
            Map<String, String> response = new HashMap<>();
            response.put("url", "/uploads/documents/" + uniqueFilename);
            response.put("filename", originalFilename);
            response.put("fileType", contentType);
            response.put("fileSize", String.valueOf(file.getSize()));

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Failed to upload chat document", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload document: " + e.getMessage());
        }
    }
}
