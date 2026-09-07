package com.drcopad.copad.controller;

import com.drcopad.copad.dto.FileAttachmentDTO;
import com.drcopad.copad.dto.GuestSessionDTO;
import com.drcopad.copad.dto.MessageRequest;
import com.drcopad.copad.entity.FileAttachment;
import com.drcopad.copad.service.FileAttachmentService;
import com.drcopad.copad.service.GuestSessionService;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.service.MedicineContextService;
import com.drcopad.copad.service.RedFlagDetector;
import com.drcopad.copad.service.RecordContextService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.drcopad.copad.service.RateLimitPolicy;
import com.drcopad.copad.service.RateLimiterService;
import com.drcopad.copad.util.ClientIpResolver;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final RecordContextService recordContext;
    private final MedicineContextService medicineContext;
    private final RedFlagDetector redFlags;
    
    @PostMapping("/start")
    public ResponseEntity<GuestSessionDTO> startSession(HttpServletRequest request) {
        String ipAddress = ClientIpResolver.resolve(request);
        log.info("Starting new guest session");

        rateLimiterService.require(RateLimitPolicy.SESSION_CREATE, ipAddress);
        
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
        rateLimiterService.require(RateLimitPolicy.GENERAL, sessionId);
        
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
            @RequestParam(defaultValue = "general") String specialty,
            @RequestParam(required = false) Long memberId,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {
        // Never log message content: it is the patient's medical complaint.
        log.info("Chat request for session {} chat {} (specialty: {}, language: {}, attachments: {})",
                 sessionId, chatId, specialty, messageRequest.getLanguage(),
                 messageRequest.getFileIds() == null ? 0 : messageRequest.getFileIds().size());

        // The only endpoint that spends money per call, and it is unauthenticated.
        // Limited by session and by IP, because sessions are free to mint.
        rateLimiterService.requireAll(RateLimitPolicy.AI_CHAT,
                sessionId, ClientIpResolver.resolve(request));

        StringBuilder context = new StringBuilder();

        // Checked first and placed first: if the message describes something
        // that may need emergency care, that has to lead the reply, ahead of
        // anything the record or the drug registry would add.
        String urgent = redFlags.contextFor(messageRequest.getMessage());
        if (!urgent.isBlank()) {
            context.append(urgent);
        }

        // Grounding is opt-in and only for a signed-in caller who can reach the
        // member. An anonymous conversation is unchanged.
        if (memberId != null && user != null) {
            RecordContextService.Context ctx = recordContext.forMember(memberId, user.getId());
            if (!ctx.isEmpty()) {
                context.append(ctx.prompt());
                log.info("Chat grounded in member {} record ({})", memberId, ctx.summary());
            }
        }

        // Local drug prices, for anyone. This is the part a general assistant
        // cannot answer: what a drug actually costs in Azerbaijan, and whether
        // something with the same ingredient costs less. Empty unless the
        // message names a product we carry.
        String drugs = medicineContext.contextFor(messageRequest.getMessage());
        if (!drugs.isBlank()) {
            context.append(drugs);
            log.info("Chat grounded in the drug registry");
        }
        try {
            String response = guestSessionService.processChat(
                sessionId, 
                messageRequest.getMessage(),
                specialty,
                messageRequest.getLanguage(),
                chatId,
                messageRequest.getFileIds(),
                context.isEmpty() ? null : context.toString()
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
        // The filename can identify the patient, so it is not logged.
        log.info("Uploading file for session {} (size: {}, type: {})",
                sessionId, file.getSize(), file.getContentType());

        rateLimiterService.require(RateLimitPolicy.FILE_UPLOAD, sessionId);
        
        try {
            FileAttachment attachment = fileAttachmentService.uploadFile(file, sessionId, file.getContentType());
            log.info("Successfully uploaded file: {}", attachment.getFileId());
            
            // The URL points at the authenticated endpoint and carries the
            // session, which is what that endpoint checks.
            FileAttachmentDTO dto = new FileAttachmentDTO(
                attachment.getFileId(),
                "/api/attachments/" + attachment.getFileId() + "?s=" + sessionId,
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
        log.info("Saving email for session: {}", sessionId);
        
        rateLimiterService.require(RateLimitPolicy.GENERAL, sessionId);
        
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
        // The title is derived from the first message, so it is not logged.
        log.info("Creating new chat for session: {}", sessionId);
        
        rateLimiterService.require(RateLimitPolicy.GENERAL, sessionId);
        
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
        
        rateLimiterService.require(RateLimitPolicy.GENERAL, sessionId);
        
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
        
        rateLimiterService.require(RateLimitPolicy.GENERAL, sessionId);
        
        try {
            guestSessionService.deleteChat(sessionId, chatId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.warn("Failed to delete chat for session: {} - Error: {}", sessionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Chat or session not found.");
        }
    }
}