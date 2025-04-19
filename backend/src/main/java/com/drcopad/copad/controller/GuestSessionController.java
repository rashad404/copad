package com.drcopad.copad.controller;

import com.drcopad.copad.dto.GuestSessionDTO;
import com.drcopad.copad.entity.Conversation;
import com.drcopad.copad.service.GuestSessionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guest")
@RequiredArgsConstructor
public class GuestSessionController {
    private final GuestSessionService guestSessionService;

    @PostMapping("/session")
    public ResponseEntity<GuestSessionDTO> createSession(HttpServletRequest request) {
        return ResponseEntity.ok(guestSessionService.createSession(request));
    }

    @PostMapping("/{sessionId}/message")
    public ResponseEntity<Conversation> sendMessage(
            @PathVariable String sessionId,
            @RequestParam String message,
            @RequestParam String specialty) {
        guestSessionService.updateLastActive(sessionId);
        return ResponseEntity.ok(guestSessionService.addMessage(sessionId, message, specialty));
    }

    @GetMapping("/{sessionId}/history")
    public ResponseEntity<List<Conversation>> getConversationHistory(@PathVariable String sessionId) {
        return ResponseEntity.ok(guestSessionService.getConversationHistory(sessionId));
    }
} 