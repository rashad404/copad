package com.drcopad.copad.controller;

import com.drcopad.copad.dto.GuestSessionDTO;
import com.drcopad.copad.exception.RateLimitExceededException;
import com.drcopad.copad.service.GuestSessionService;
import com.drcopad.copad.service.RateLimiterService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/guest")
@RequiredArgsConstructor
public class GuestController {

    private final GuestSessionService guestSessionService;
    private final RateLimiterService rateLimiterService;

    @PostMapping("/start")
    public ResponseEntity<GuestSessionDTO> startSession(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        if (!rateLimiterService.isAllowed(ipAddress)) {
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        return ResponseEntity.ok(guestSessionService.createSession(request));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<GuestSessionDTO> getSession(@PathVariable String sessionId) {
        if (!rateLimiterService.isAllowed(sessionId)) {
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        return ResponseEntity.ok(guestSessionService.getSession(sessionId));
    }

    @PostMapping("/chat/{sessionId}")
    public ResponseEntity<String> chat(
            @PathVariable String sessionId,
            @RequestBody String message) {
        if (!rateLimiterService.isAllowed(sessionId)) {
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        return ResponseEntity.ok(guestSessionService.processChat(sessionId, message));
    }

    @PostMapping("/save-email/{sessionId}")
    public ResponseEntity<Void> saveEmail(
            @PathVariable String sessionId,
            @RequestBody String email) {
        if (!rateLimiterService.isAllowed(sessionId)) {
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
        guestSessionService.saveEmail(sessionId, email);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<String> handleRateLimitExceeded(RateLimitExceededException ex) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ex.getMessage());
    }
} 