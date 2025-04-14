package com.drcopad.copad.controller;

import com.drcopad.copad.dto.GuestSessionDTO;
import com.drcopad.copad.exception.RateLimitExceededException;
import com.drcopad.copad.service.GuestSessionService;
import com.drcopad.copad.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        log.info("Getting guest session: {}", sessionId);
        
        if (!rateLimiterService.isAllowed(sessionId)) {
            log.warn("Rate limit exceeded for session: {}", sessionId);
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        
        try {
            GuestSessionDTO session = guestSessionService.getSession(sessionId);
            log.info("Found guest session: {}", sessionId);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            log.warn("Guest session not found: {} - Error: {}", sessionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Session not found. Please start a new session.");
        }
    }

    @PostMapping("/chat/{sessionId}")
    public ResponseEntity<?> chat(
            @PathVariable String sessionId,
            @RequestBody String message) {
        log.info("Processing chat message for session: {} - Message: {}", sessionId, message);
        
        if (!rateLimiterService.isAllowed(sessionId)) {
            log.warn("Rate limit exceeded for session: {}", sessionId);
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        
        try {
            String response = guestSessionService.processChat(sessionId, message);
            log.info("Successfully processed chat message for session: {}", sessionId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.warn("Failed to process chat message for session: {} - Error: {}", sessionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Session not found. Please start a new session.");
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

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<String> handleRateLimitExceeded(RateLimitExceededException ex) {
        log.warn("Rate limit exceeded: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ex.getMessage());
    }
} 