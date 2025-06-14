package com.drcopad.copad.controller;

import com.drcopad.copad.dto.FileAttachmentDTO;
import com.drcopad.copad.dto.GuestSessionDTO;
import com.drcopad.copad.dto.MessageRequest;
import com.drcopad.copad.entity.FileAttachment;
import com.drcopad.copad.exception.RateLimitExceededException;
import com.drcopad.copad.service.FileAttachmentService;
import com.drcopad.copad.service.GuestSessionService;
import com.drcopad.copad.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/guest")
@RequiredArgsConstructor
public class GuestController {

    private final GuestSessionService guestSessionService;
    private final RateLimiterService rateLimiterService;
    private final FileAttachmentService fileAttachmentService;
    
    @Value("${upload.public-url:http://localhost:8080}")
    private String publicUrl;

    @PostMapping("/start")
    public ResponseEntity<GuestSessionDTO> startSession(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("Starting new guest session from IP: {}", ipAddress);
        
        if (!rateLimiterService.isAllowed(ipAddress)) {
            log.warn("Rate limit exceeded for IP: {}", ipAddress);
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        
        try {
            GuestSessionDTO session = guestSessionService.createSession(request);
            log.info("Successfully created new guest session with ID: {} for IP: {}", 
                session.getSessionId(), ipAddress);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            log.error("Failed to create guest session for IP: {} - Error: {}", ipAddress, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getSession(@PathVariable String sessionId) {
        if (!rateLimiterService.isAllowed(sessionId)) {
            log.warn("Rate limit exceeded for session: {}", sessionId);
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        
        try {
            GuestSessionDTO session = guestSessionService.getSession(sessionId);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            log.warn("Guest session not found: {} - Error: {}", sessionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Session not found. Please start a new session.");
        }
    }

    @PostMapping("/chat/{sessionId}/{chatId}")
    public ResponseEntity<String> chat(
            @PathVariable String sessionId,
            @PathVariable String chatId,
            @RequestBody MessageRequest messageRequest,
            @RequestParam(defaultValue = "general") String specialty) {
        log.info("Received chat request for session {} and chat {} with message: {}, specialty: {}, language: {}, and fileIds: {}", 
                 sessionId, chatId, messageRequest.getMessage(), specialty, messageRequest.getLanguage(), messageRequest.getFileIds());
        try {
            String response = guestSessionService.processChat(
                sessionId, 
                messageRequest.getMessage(), 
                specialty, 
                messageRequest.getLanguage(), 
                chatId, 
                messageRequest.getFileIds()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing chat request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while processing your message: " + e.getMessage());
        }
    }

    @GetMapping("/chat/{sessionId}/{chatId}/history")
    public ResponseEntity<?> getChatHistory(
            @PathVariable String sessionId,
            @PathVariable String chatId) {
        try {
            var history = guestSessionService.getMessageHistory(sessionId, chatId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error retrieving chat history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while retrieving chat history");
        }
    }
    
    @PostMapping("/upload/{sessionId}")
    public ResponseEntity<?> uploadFile(
            @PathVariable String sessionId,
            @RequestParam("file") MultipartFile file) {
        log.info("Uploading file for session {}: {}, size: {}, type: {}", 
                sessionId, file.getOriginalFilename(), file.getSize(), file.getContentType());
        
        if (!rateLimiterService.isAllowed(sessionId)) {
            log.warn("Rate limit exceeded for session: {}", sessionId);
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        
        try {
            FileAttachment attachment = fileAttachmentService.uploadFile(file, sessionId, file.getContentType());
            log.info("Successfully uploaded file: {}", attachment.getFileId());
            
            // Convert to DTO and add the public URL for proper rendering
            FileAttachmentDTO dto = new FileAttachmentDTO(
                attachment.getFileId(),
                publicUrl + "/" + attachment.getFilePath(),
                attachment.getOriginalFilename(),
                attachment.getFileType(),
                attachment.getFileSize(),
                attachment.getUploadedAt(),
                null,
                attachment.getFileType().startsWith("image/")
            );
            
            return ResponseEntity.ok(dto);
        } catch (IOException e) {
            log.error("Error uploading file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to upload file: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("Invalid file upload: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
        }
    }

    @PostMapping("/save-email/{sessionId}")
    public ResponseEntity<?> saveEmail(
            @PathVariable String sessionId,
            @RequestBody String email) {
        log.info("Saving email for session: {} - Email: {}", sessionId, email);
        
        if (!rateLimiterService.isAllowed(sessionId)) {
            log.warn("Rate limit exceeded for session: {}", sessionId);
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        
        try {
            guestSessionService.saveEmail(sessionId, email);
            log.info("Successfully saved email for session: {}", sessionId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.warn("Failed to save email for session: {} - Error: {}", sessionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Session not found. Please start a new session.");
        }
    }

    // Chat management endpoints
    @PostMapping("/chats/{sessionId}")
    public ResponseEntity<?> createChat(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> request) {
        log.info("Creating new chat for session: {} with title: {}", sessionId, request.get("title"));
        
        if (!rateLimiterService.isAllowed(sessionId)) {
            log.warn("Rate limit exceeded for session: {}", sessionId);
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        
        try {
            Map<String, String> result = guestSessionService.createChat(sessionId, request.get("title"));
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            log.warn("Failed to create chat for session: {} - Error: {}", sessionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Session not found. Please start a new session.");
        }
    }
    
    @PutMapping("/chats/{sessionId}/{chatId}")
    public ResponseEntity<?> updateChat(
            @PathVariable String sessionId,
            @PathVariable String chatId,
            @RequestBody Map<String, String> request) {
        log.info("Updating chat {} for session: {} with title: {}", chatId, sessionId, request.get("title"));
        
        if (!rateLimiterService.isAllowed(sessionId)) {
            log.warn("Rate limit exceeded for session: {}", sessionId);
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        
        try {
            guestSessionService.updateChatTitle(sessionId, chatId, request.get("title"));
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.warn("Failed to update chat for session: {} - Error: {}", sessionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Chat or session not found.");
        }
    }
    
    @DeleteMapping("/chats/{sessionId}/{chatId}")
    public ResponseEntity<?> deleteChat(
            @PathVariable String sessionId,
            @PathVariable String chatId) {
        log.info("Deleting chat {} for session: {}", chatId, sessionId);
        
        if (!rateLimiterService.isAllowed(sessionId)) {
            log.warn("Rate limit exceeded for session: {}", sessionId);
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        
        try {
            guestSessionService.deleteChat(sessionId, chatId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.warn("Failed to delete chat for session: {} - Error: {}", sessionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Chat or session not found.");
        }
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<String> handleRateLimitExceeded(RateLimitExceededException ex) {
        log.warn("Rate limit exceeded: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ex.getMessage());
    }
}