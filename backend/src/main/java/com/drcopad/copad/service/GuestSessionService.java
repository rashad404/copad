package com.drcopad.copad.service;

import com.drcopad.copad.dto.ConversationDTO;
import com.drcopad.copad.dto.GuestSessionDTO;
import com.drcopad.copad.entity.Conversation;
import com.drcopad.copad.entity.GuestSession;
import com.drcopad.copad.repository.GuestSessionRepository;
import com.drcopad.copad.repository.ConversationRepository;
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
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class GuestSessionService {

    private final GuestSessionRepository guestSessionRepository;
    private final ConversationRepository conversationRepository;
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
        log.info("Created new guest session with ID: {} - Created at: {} - IP: {}", 
            session.getSessionId(), session.getCreatedAt(), session.getIpAddress());
        
        // Log all existing sessions for debugging
        List<GuestSession> allSessions = guestSessionRepository.findAllSessions();
        log.info("Total sessions in database: {}", allSessions.size());
        allSessions.forEach(s -> 
            log.info("Existing Session - ID: {}, Created: {}, Last Active: {}, IP: {}", 
                s.getSessionId(), s.getCreatedAt(), s.getLastActive(), s.getIpAddress()));
        
        return mapToDTO(session);
    }

    @Transactional
    public GuestSessionDTO getSession(String sessionId) {
        log.info("Retrieving guest session: {}", sessionId);
        
        // Log all existing sessions before retrieval
        List<GuestSession> allSessions = guestSessionRepository.findAllSessions();
        log.info("Total sessions in database before retrieval: {}", allSessions.size());
        allSessions.forEach(s -> 
            log.info("Existing Session - ID: {}, Created: {}, Last Active: {}, IP: {}", 
                s.getSessionId(), s.getCreatedAt(), s.getLastActive(), s.getIpAddress()));
        
        return guestSessionRepository.findBySessionId(sessionId)
                .map(session -> {
                    log.info("Found guest session: {} - Last active: {} - IP: {}", 
                        sessionId, session.getLastActive(), session.getIpAddress());
                    return mapToDTO(session);
                })
                .orElseThrow(() -> {
                    log.warn("Guest session not found: {}", sessionId);
                    return new RuntimeException("Session not found");
                });
    }

    @Transactional
    public String processChat(String sessionId, String message, String specialty) {
        log.info("Processing chat message for session: {} - Message: {}", sessionId, message);
        
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> {
                    log.warn("Guest session not found for chat: {}", sessionId);
                    return new RuntimeException("Session not found");
                });

        log.info("Found session for chat, updating last active timestamp");
        session.setLastActive(LocalDateTime.now());

        // Get AI response with specialty
        String response = chatGPTService.getChatResponse(message, session.getConversations(), specialty);
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
        
        // Delete expired sessions
        guestSessionRepository.deleteExpiredSessions(cutoff);
        
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

    public Conversation addMessage(String sessionId, String message, String specialty) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        
        // Get conversation history
        List<Conversation> history = session.getConversations();

        // Get AI response using the specified specialty
        String aiResponse = chatGPTService.getChatResponse(message, history, specialty);

        // Save user message
        Conversation userMessage = new Conversation();
        userMessage.setGuestSession(session);
        userMessage.setSender("USER");
        userMessage.setMessage(message);
        userMessage.setTimestamp(LocalDateTime.now());
        session.getConversations().add(userMessage);

        // Save AI response
        Conversation aiMessage = new Conversation();
        aiMessage.setGuestSession(session);
        aiMessage.setSender("AI");
        aiMessage.setMessage(aiResponse);
        aiMessage.setTimestamp(LocalDateTime.now());
        session.getConversations().add(aiMessage);
        
        guestSessionRepository.save(session);
        return aiMessage;
    }

    public List<Conversation> getConversationHistory(String sessionId) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        return session.getConversations();
    }

    public void updateLastActive(String sessionId) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        session.setLastActive(LocalDateTime.now());
        guestSessionRepository.save(session);
    }
} 