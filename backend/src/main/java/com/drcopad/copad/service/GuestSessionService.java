package com.drcopad.copad.service;

import com.drcopad.copad.dto.ConversationDTO;
import com.drcopad.copad.dto.GuestSessionDTO;
import com.drcopad.copad.entity.Conversation;
import com.drcopad.copad.entity.GuestSession;
import com.drcopad.copad.repository.GuestSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GuestSessionService {

    private final GuestSessionRepository guestSessionRepository;
    private final ChatGPTService chatGPTService;

    @Transactional
    public GuestSessionDTO createSession(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("Creating new guest session for IP: {}", ipAddress);
        
        GuestSession session = GuestSession.builder()
                .ipAddress(ipAddress)
                .conversations(new ArrayList<>())
                .build();
        
        session = guestSessionRepository.save(session);
        log.info("Created new guest session with ID: {} - Created at: {}", session.getSessionId(), session.getCreatedAt());
        return mapToDTO(session);
    }

    @Transactional
    public GuestSessionDTO getSession(String sessionId) {
        log.info("Retrieving guest session: {}", sessionId);
        return guestSessionRepository.findBySessionId(sessionId)
                .map(session -> {
                    log.info("Found guest session: {} - Last active: {}", sessionId, session.getLastActive());
                    return mapToDTO(session);
                })
                .orElseThrow(() -> {
                    log.warn("Guest session not found: {}", sessionId);
                    return new RuntimeException("Session not found");
                });
    }

    @Transactional
    public String processChat(String sessionId, String message) {
        log.info("Processing chat message for session: {} - Message: {}", sessionId, message);
        
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> {
                    log.warn("Guest session not found for chat: {}", sessionId);
                    return new RuntimeException("Session not found");
                });

        log.info("Found session for chat, updating last active timestamp");
        session.setLastActive(LocalDateTime.now());

        // Get AI response
        String response = chatGPTService.getChatResponse(message, session.getConversations());
        log.info("Received AI response for session: {}", sessionId);

        // Create and save user message
        Conversation userMsg = new Conversation();
        userMsg.setMessage(message);
        userMsg.setSender("USER");
        userMsg.setTimestamp(LocalDateTime.now());
        userMsg.setGuestSession(session);
        session.getConversations().add(userMsg);
        log.info("Saved user message for session: {}", sessionId);

        // Create and save AI message
        Conversation aiMsg = new Conversation();
        aiMsg.setMessage(response);
        aiMsg.setSender("AI");
        aiMsg.setTimestamp(LocalDateTime.now().plusSeconds(1));
        aiMsg.setGuestSession(session);
        session.getConversations().add(aiMsg);
        log.info("Saved AI message for session: {}", sessionId);

        guestSessionRepository.save(session);
        log.info("Successfully saved conversation for session: {}", sessionId);
        return response;
    }

    @Transactional
    public void saveEmail(String sessionId, String email) {
        log.info("Saving email for session: {} - Email: {}", sessionId, email);
        
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> {
                    log.warn("Guest session not found for email save: {}", sessionId);
                    return new RuntimeException("Session not found");
                });
        
        session.setEmail(email);
        guestSessionRepository.save(session);
        log.info("Successfully saved email for session: {}", sessionId);
    }

    @Scheduled(fixedRate = 3600000) // Run every hour
    @Transactional
    public void cleanupExpiredSessions() {
        // Increase session expiration time to 48 hours
        LocalDateTime cutoff = LocalDateTime.now().minus(48, ChronoUnit.HOURS);
        log.info("Cleaning up expired guest sessions before: {}", cutoff);
        
        // Log all sessions before cleanup
        List<GuestSession> allSessions = guestSessionRepository.findAll();
        log.info("Total sessions before cleanup: {}", allSessions.size());
        allSessions.forEach(session -> 
            log.info("Session ID: {}, Created: {}, Last Active: {}", 
                session.getSessionId(), session.getCreatedAt(), session.getLastActive()));
        
        int deleted = guestSessionRepository.deleteExpiredSessions(cutoff);
        log.info("Deleted {} expired guest sessions", deleted);
        
        // Log remaining sessions after cleanup
        List<GuestSession> remainingSessions = guestSessionRepository.findAll();
        log.info("Total sessions after cleanup: {}", remainingSessions.size());
        remainingSessions.forEach(session -> 
            log.info("Remaining Session ID: {}, Created: {}, Last Active: {}", 
                session.getSessionId(), session.getCreatedAt(), session.getLastActive()));
    }

    private GuestSessionDTO mapToDTO(GuestSession session) {
        return GuestSessionDTO.builder()
                .sessionId(session.getSessionId())
                .createdAt(session.getCreatedAt())
                .lastActive(session.getLastActive())
                .conversations(session.getConversations().stream()
                        .map(conv -> new ConversationDTO(conv.getMessage(), conv.getSender()))
                        .toList())
                .email(session.getEmail())
                .build();
    }
} 