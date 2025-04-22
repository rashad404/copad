package com.drcopad.copad.controller;

import com.drcopad.copad.dto.GuestSessionDTO;
import com.drcopad.copad.dto.MessageRequest;
import com.drcopad.copad.dto.ChatGPTResponse;
import com.drcopad.copad.exception.RateLimitExceededException;
import com.drcopad.copad.service.GuestSessionService;
import com.drcopad.copad.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/guest")
@RequiredArgsConstructor
public class GuestController {

    private final GuestSessionService guestSessionService;
    private final RateLimiterService rateLimiterService;

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
        log.info("Received chat request for session {} and chat {} with message: {}, specialty: {}, and language: {}", 
                 sessionId, chatId, messageRequest.getMessage(), specialty, messageRequest.getLanguage());
        try {
            String response = guestSessionService.processChat(sessionId, messageRequest.getMessage(), specialty, messageRequest.getLanguage(), chatId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error processing chat request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/chat/{sessionId}/{chatId}/history")
    public ResponseEntity<?> getChatHistory(
            @PathVariable String sessionId,
            @PathVariable String chatId) {
        try {
            var history = guestSessionService.getConversationHistory(sessionId, chatId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error retrieving chat history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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