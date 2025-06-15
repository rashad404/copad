package com.drcopad.copad.service;

import com.drcopad.copad.config.OpenAIResponsesConfig;
import com.drcopad.copad.entity.FileAttachment;
import com.drcopad.copad.entity.responses.BatchFileUpload;
import com.drcopad.copad.repository.FileAttachmentRepository;
import com.drcopad.copad.repository.responses.BatchFileUploadRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FileUploadService {
    
    private final FileAttachmentRepository fileAttachmentRepository;
    private final BatchFileUploadRepository batchFileUploadRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${app.chatgpt.openai.key}")
    private String openaiApiKey;
    
    @Value("${upload.base-dir}")
    private String uploadBaseDir;
    
    @Value("${upload.max-batch-size:10}")
    private int maxBatchSize;
    
    private static final String OPENAI_FILES_API = "https://api.openai.com/v1/files";
    
    /**
     * Upload a single file to OpenAI
     */
    public String uploadToOpenAI(FileAttachment attachment) throws IOException {
        Path filePath = Paths.get(uploadBaseDir, attachment.getFilePath());
        File file = filePath.toFile();
        
        if (!file.exists()) {
            throw new IOException("File not found: " + filePath);
        }
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openaiApiKey);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(file));
        body.add("purpose", "file_inputs"); // Files for Responses API use file_inputs purpose
        
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                OPENAI_FILES_API, requestEntity, String.class
            );
            
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            String fileId = jsonResponse.get("id").asText();
            
            log.info("Successfully uploaded file to OpenAI: {} -> {}", attachment.getOriginalFilename(), fileId);
            return fileId;
            
        } catch (Exception e) {
            log.error("Failed to upload file to OpenAI: {}", attachment.getOriginalFilename(), e);
            throw new IOException("Failed to upload file to OpenAI", e);
        }
    }
    
    /**
     * Process multiple file uploads in batch
     */
    @Async
    public CompletableFuture<BatchUploadResult> processBatchUpload(
            List<MultipartFile> files, String chatId, String conversationId, 
            String category, Long userId, Long guestSessionId) {
        
        // Create batch upload record
        BatchFileUpload batch = BatchFileUpload.builder()
                .chatId(chatId)
                .category(category)
                .totalFiles(files.size())
                .status("processing")
                .build();
        
        // Only set conversationId if it exists and is not empty
        if (conversationId != null && !conversationId.trim().isEmpty()) {
            // For now, we'll skip setting conversationId to avoid FK constraint issues
            // In a real implementation, we'd check if the conversation exists first
            log.info("ConversationId provided but not set to avoid FK constraint: {}", conversationId);
        }
        
        // Store user and guest session IDs in metadata for reference
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("chatId", chatId);
        if (userId != null) {
            metadata.put("userId", userId);
        }
        if (guestSessionId != null) {
            metadata.put("guestSessionId", guestSessionId);
        }
        batch.setMetadata(metadata);
        
        batch = batchFileUploadRepository.save(batch);
        final String batchId = batch.getBatchId();
        
        // Process files in parallel
        List<CompletableFuture<FileUploadResult>> uploadFutures = files.stream()
                .limit(maxBatchSize)
                .map(file -> processFileAsync(file, batchId, category))
                .collect(Collectors.toList());
        
        // Wait for all uploads to complete
        CompletableFuture<Void> allUploads = CompletableFuture.allOf(
                uploadFutures.toArray(new CompletableFuture[0])
        );
        
        return allUploads.thenApply(v -> {
            List<FileUploadResult> results = uploadFutures.stream()
                    .map(CompletableFuture::join)
                    .collect(Collectors.toList());
            
            // Update batch status
            updateBatchStatus(batchId, results);
            
            return BatchUploadResult.builder()
                    .batchId(batchId)
                    .totalFiles(files.size())
                    .successfulUploads(results.stream().filter(FileUploadResult::isSuccess).count())
                    .failedUploads(results.stream().filter(r -> !r.isSuccess()).count())
                    .fileResults(results)
                    .build();
        });
    }
    
    @Async
    private CompletableFuture<FileUploadResult> processFileAsync(MultipartFile file, 
                                                                 String batchId, String category) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Validate file
                validateMedicalFile(file, category);
                
                // Save file locally
                FileAttachment attachment = saveFileLocally(file, batchId);
                
                // Upload to OpenAI
                String openaiFileId = uploadToOpenAI(attachment);
                attachment.setOpenaiFileId(openaiFileId);
                fileAttachmentRepository.save(attachment);
                
                return FileUploadResult.builder()
                        .filename(file.getOriginalFilename())
                        .fileId(attachment.getFileId())
                        .openaiFileId(openaiFileId)
                        .success(true)
                        .build();
                        
            } catch (Exception e) {
                log.error("Failed to process file: {}", file.getOriginalFilename(), e);
                return FileUploadResult.builder()
                        .filename(file.getOriginalFilename())
                        .success(false)
                        .error(e.getMessage())
                        .build();
            }
        });
    }
    
    private void validateMedicalFile(MultipartFile file, String category) throws IllegalArgumentException {
        // Check file size
        long maxSize = getMaxFileSize(category);
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds limit: " + file.getSize() + " > " + maxSize);
        }
        
        // Check file type
        String contentType = file.getContentType();
        if (!isAllowedMedicalFileType(contentType, category)) {
            throw new IllegalArgumentException("File type not allowed: " + contentType);
        }
        
        // Additional medical file validations
        String filename = file.getOriginalFilename();
        if (filename == null || filename.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid filename");
        }
    }
    
    private FileAttachment saveFileLocally(MultipartFile file, String batchId) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        
        // Determine subdirectory based on file type
        String subDir = file.getContentType().startsWith("image/") ? "uploads/images" : "uploads/documents";
        Path uploadPath = Paths.get(uploadBaseDir, subDir);
        
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);
        
        // Extract text if it's a document
        String extractedText = null;
        if (!file.getContentType().startsWith("image/")) {
            // Text extraction logic here (using existing DocumentExtractionService)
        }
        
        FileAttachment attachment = FileAttachment.builder()
                .fileId(UUID.randomUUID().toString())
                .filePath(subDir + "/" + uniqueFilename)
                .originalFilename(originalFilename)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .batchId(batchId)
                .extractedText(extractedText)
                .build();
        
        return fileAttachmentRepository.save(attachment);
    }
    
    private void updateBatchStatus(String batchId, List<FileUploadResult> results) {
        batchFileUploadRepository.findByBatchId(batchId).ifPresent(batch -> {
            long successCount = results.stream().filter(FileUploadResult::isSuccess).count();
            long failCount = results.stream().filter(r -> !r.isSuccess()).count();
            
            batch.setProcessedFiles((int) successCount);
            batch.setFailedFiles((int) failCount);
            batch.setStatus(failCount > 0 ? "partial" : "completed");
            batch.setCompletedAt(java.time.LocalDateTime.now());
            
            batchFileUploadRepository.save(batch);
        });
    }
    
    private long getMaxFileSize(String category) {
        // Medical file size limits
        return switch (category) {
            case "imaging" -> 50 * 1024 * 1024; // 50MB for imaging
            case "lab-results", "clinical-notes" -> 10 * 1024 * 1024; // 10MB for documents
            case "prescriptions" -> 5 * 1024 * 1024; // 5MB for prescriptions
            default -> 10 * 1024 * 1024; // 10MB default
        };
    }
    
    private boolean isAllowedMedicalFileType(String contentType, String category) {
        if (contentType == null) return false;
        
        Set<String> allowedTypes = switch (category) {
            case "imaging" -> Set.of("image/jpeg", "image/png", "image/webp", "application/dicom");
            case "lab-results" -> Set.of("application/pdf", "text/plain", "text/csv");
            case "clinical-notes" -> Set.of("application/pdf", "text/plain", 
                    "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            case "prescriptions" -> Set.of("application/pdf", "image/jpeg", "image/png");
            default -> Set.of("application/pdf", "text/plain", "image/jpeg", "image/png");
        };
        
        return allowedTypes.contains(contentType);
    }
    
    @lombok.Builder
    @lombok.Data
    public static class BatchUploadResult {
        private String batchId;
        private int totalFiles;
        private long successfulUploads;
        private long failedUploads;
        private List<FileUploadResult> fileResults;
    }
    
    @lombok.Builder
    @lombok.Data
    public static class FileUploadResult {
        private String filename;
        private String fileId;
        private String openaiFileId;
        private boolean success;
        private String error;
    }
}