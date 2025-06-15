package com.drcopad.copad.controller;

import com.drcopad.copad.config.OpenAIResponsesConfig;
import com.drcopad.copad.dto.MessageRequest;
import com.drcopad.copad.dto.BatchFileUploadRequest;
import com.drcopad.copad.dto.ConversationStatsResponse;
import com.drcopad.copad.entity.*;
import com.drcopad.copad.repository.ChatRepository;
import com.drcopad.copad.repository.FileAttachmentRepository;
import com.drcopad.copad.repository.GuestSessionRepository;
import com.drcopad.copad.service.*;
import com.drcopad.copad.repository.MessageRepository;
import com.drcopad.copad.repository.responses.BatchFileUploadRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v2/messages")
public class ResponsesMessageController {
    
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final FileAttachmentRepository fileAttachmentRepository;
    private final GuestSessionRepository guestSessionRepository;
    private final OpenAIResponsesService responsesService;
    private final ChatGPTService chatGPTService;
    private final ConversationManager conversationManager;
    private final FileUploadService fileUploadService;
    private final CostCalculationService costCalculationService;
    private final BatchFileUploadRepository batchFileUploadRepository;
    private final OpenAIResponsesConfig responsesConfig;
    
    public ResponsesMessageController(ChatRepository chatRepository,
                                    MessageRepository messageRepository,
                                    FileAttachmentRepository fileAttachmentRepository,
                                    GuestSessionRepository guestSessionRepository,
                                    OpenAIResponsesService responsesService,
                                    ChatGPTService chatGPTService,
                                    ConversationManager conversationManager,
                                    FileUploadService fileUploadService,
                                    CostCalculationService costCalculationService,
                                    BatchFileUploadRepository batchFileUploadRepository,
                                    @Qualifier("openAIResponsesConfig") OpenAIResponsesConfig responsesConfig) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.fileAttachmentRepository = fileAttachmentRepository;
        this.guestSessionRepository = guestSessionRepository;
        this.responsesService = responsesService;
        this.chatGPTService = chatGPTService;
        this.conversationManager = conversationManager;
        this.fileUploadService = fileUploadService;
        this.costCalculationService = costCalculationService;
        this.batchFileUploadRepository = batchFileUploadRepository;
        this.responsesConfig = responsesConfig;
    }
    
    /**
     * Send a message using either Responses API or ChatGPT API based on configuration
     */
    @PostMapping("/chat/{chatId}")
    public ResponseEntity<?> sendMessage(
            @PathVariable String chatId,
            @RequestBody MessageRequest messageRequest,
            @AuthenticationPrincipal User user,
            @RequestHeader(value = "X-Guest-Session-Id", required = false) String guestSessionId) {
        
        try {
            // Get chat
            Chat chat = chatRepository.findByChatId(chatId)
                    .orElseThrow(() -> new IllegalArgumentException("Chat not found"));
            
            // Get guest session if provided
            GuestSession guestSession = null;
            if (guestSessionId != null && user == null) {
                guestSession = guestSessionRepository.findBySessionId(guestSessionId)
                        .orElse(null);
            }
            
            // Get message history
            List<ChatMessage> history = messageRepository.findByChatOrderByTimestampAsc(chat);
            
            // Get attachments if any
            List<FileAttachment> attachments = new ArrayList<>();
            if (messageRequest.getFileIds() != null && !messageRequest.getFileIds().isEmpty()) {
                attachments = fileAttachmentRepository.findAllByFileIdIn(messageRequest.getFileIds());
            }
            
            // Save user message
            ChatMessage userMessage = new ChatMessage();
            userMessage.setChat(chat);
            userMessage.setSender("USER");
            userMessage.setMessage(messageRequest.getMessage());
            userMessage.setTimestamp(LocalDateTime.now());
            if (!attachments.isEmpty()) {
                attachments.forEach(userMessage::addAttachment);
            }
            messageRepository.save(userMessage);
            
            // Get AI response
            String aiResponse;
            boolean usedResponsesApi = false;
            
            if (responsesConfig.isEnabled()) {
                try {
                    // Use Responses API
                    aiResponse = responsesService.getResponsesAPIResponse(
                        messageRequest.getMessage(),
                        history,
                        messageRequest.getSpecialty(),
                        messageRequest.getLanguage(),
                        attachments,
                        chatId,
                        user,
                        guestSession
                    );
                    usedResponsesApi = true;
                } catch (Exception e) {
                    log.warn("Responses API failed, falling back to ChatGPT API: {}", e.getMessage());
                    // Fallback to ChatGPT API
                    if (responsesConfig.isFallbackToChat()) {
                        aiResponse = chatGPTService.getChatResponse(
                            messageRequest.getMessage(),
                            history,
                            messageRequest.getSpecialty(),
                            messageRequest.getLanguage(),
                            attachments
                        );
                    } else {
                        throw e;
                    }
                }
            } else {
                // Use ChatGPT API directly
                aiResponse = chatGPTService.getChatResponse(
                    messageRequest.getMessage(),
                    history,
                    messageRequest.getSpecialty(),
                    messageRequest.getLanguage(),
                    attachments
                );
            }
            
            // Save AI response only if we didn't use Responses API (which saves internally)
            if (!usedResponsesApi) {
                ChatMessage aiMessage = new ChatMessage();
                aiMessage.setChat(chat);
                aiMessage.setSender("AI");
                aiMessage.setMessage(aiResponse);
                aiMessage.setTimestamp(LocalDateTime.now());
                messageRepository.save(aiMessage);
            }
            
            return ResponseEntity.ok(new MessageResponse(aiResponse, chatId));
            
        } catch (Exception e) {
            log.error("Error processing message", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Upload multiple files for a chat conversation
     */
    @PostMapping("/chat/{chatId}/files/batch")
    public ResponseEntity<?> uploadBatchFiles(
            @PathVariable String chatId,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "category", defaultValue = "general") String category,
            @RequestParam(value = "conversationId", required = false) String conversationId,
            @AuthenticationPrincipal User user,
            @RequestHeader(value = "X-Guest-Session-Id", required = false) String guestSessionId) {
        
        try {
            // Validate chat exists
            Chat chat = chatRepository.findByChatId(chatId)
                    .orElseThrow(() -> new IllegalArgumentException("Chat not found"));
            
            // Check file count
            if (files.length > 10) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Maximum 10 files allowed per batch"));
            }
            
            Long userId = user != null ? user.getId() : null;
            Long sessionId = null;
            
            if (guestSessionId != null && user == null) {
                GuestSession guestSession = guestSessionRepository.findBySessionId(guestSessionId)
                        .orElse(null);
                sessionId = guestSession != null ? guestSession.getId() : null;
            }
            
            // Process files asynchronously
            CompletableFuture<FileUploadService.BatchUploadResult> uploadFuture = 
                fileUploadService.processBatchUpload(
                    List.of(files),
                    chatId,
                    conversationId,
                    category,
                    userId,
                    sessionId
                );
            
            // Return batch ID immediately
            return ResponseEntity.accepted()
                    .body(new BatchUploadResponse(
                        uploadFuture.join().getBatchId(),
                        files.length,
                        "processing"
                    ));
                    
        } catch (Exception e) {
            log.error("Error uploading batch files", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Get batch upload status
     */
    @GetMapping("/files/batch/{batchId}/status")
    public ResponseEntity<?> getBatchUploadStatus(@PathVariable String batchId) {
        return batchFileUploadRepository.findByBatchId(batchId)
                .map(batch -> ResponseEntity.ok(new BatchUploadStatusResponse(
                    batch.getBatchId(),
                    batch.getStatus(),
                    batch.getTotalFiles(),
                    batch.getProcessedFiles(),
                    batch.getFailedFiles(),
                    batch.getProgressPercentage()
                )))
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get files from a batch upload
     */
    @GetMapping("/files/batch/{batchId}/files")
    public ResponseEntity<?> getBatchFiles(@PathVariable String batchId) {
        List<FileAttachment> files = fileAttachmentRepository.findByBatchId(batchId);
        
        List<Map<String, Object>> fileList = files.stream()
                .map(file -> {
                    Map<String, Object> fileInfo = new HashMap<>();
                    fileInfo.put("fileId", file.getFileId());
                    fileInfo.put("filename", file.getOriginalFilename());
                    fileInfo.put("fileType", file.getFileType());
                    fileInfo.put("fileSize", file.getFileSize());
                    fileInfo.put("uploadedAt", file.getUploadedAt());
                    fileInfo.put("url", "/api/guest/files/" + file.getFileId());
                    fileInfo.put("isImage", file.getFileType() != null && file.getFileType().startsWith("image/"));
                    return fileInfo;
                })
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(fileList);
    }
    
    /**
     * Get conversation statistics
     */
    @GetMapping("/chat/{chatId}/stats")
    public ResponseEntity<?> getConversationStats(
            @PathVariable String chatId,
            @AuthenticationPrincipal User user) {
        
        try {
            if (!responsesConfig.isEnabled()) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("Conversation stats only available with Responses API"));
            }
            
            ConversationManager.ConversationStats stats = responsesService.getConversationStats(chatId);
            
            return ResponseEntity.ok(new ConversationStatsResponse(
                stats.getConversationId(),
                stats.getMessageCount(),
                stats.getTotalTokens(),
                stats.getTotalCost(),
                stats.getAverageResponseTimeMs()
            ));
            
        } catch (Exception e) {
            log.error("Error getting conversation stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Get user's daily usage summary
     */
    @GetMapping("/usage/daily")
    public ResponseEntity<?> getDailyUsage(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Authentication required"));
        }
        
        CostCalculationService.DailyUsageSummary summary = 
            costCalculationService.getUserDailyUsage(user.getId());
        
        return ResponseEntity.ok(summary);
    }
    
    @lombok.Data
    @lombok.AllArgsConstructor
    static class MessageResponse {
        private String response;
        private String chatId;
    }
    
    @lombok.Data
    @lombok.AllArgsConstructor
    static class ErrorResponse {
        private String error;
    }
    
    @lombok.Data
    @lombok.AllArgsConstructor
    static class BatchUploadResponse {
        private String batchId;
        private int totalFiles;
        private String status;
    }
    
    @lombok.Data
    @lombok.AllArgsConstructor
    static class BatchUploadStatusResponse {
        private String batchId;
        private String status;
        private int totalFiles;
        private int processedFiles;
        private int failedFiles;
        private double progressPercentage;
    }
    
}