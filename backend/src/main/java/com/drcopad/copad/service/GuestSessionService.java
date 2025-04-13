package com.drcopad.copad.service;

import com.drcopad.copad.dto.ConversationDTO;
import com.drcopad.copad.dto.GuestSessionDTO;
import com.drcopad.copad.entity.Conversation;
import com.drcopad.copad.entity.GuestSession;
import com.drcopad.copad.repository.GuestSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GuestSessionService {

    private final GuestSessionRepository guestSessionRepository;
    private final ChatGPTService chatGPTService;

    @Transactional
    public GuestSessionDTO createSession(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        
        GuestSession session = GuestSession.builder()
                .ipAddress(ipAddress)
                .conversations(new ArrayList<>())
                .build();
        
        session = guestSessionRepository.save(session);
        return mapToDTO(session);
    }

    @Transactional
    public GuestSessionDTO getSession(String sessionId) {
        return guestSessionRepository.findBySessionId(sessionId)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    @Transactional
    public String processChat(String sessionId, String message) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Update last active timestamp
        session.setLastActive(LocalDateTime.now());

        // Get AI response
        String response = chatGPTService.getChatResponse(message, session.getConversations());

        // Create and save user message
        Conversation userMsg = new Conversation();
        userMsg.setMessage(message);
        userMsg.setSender("USER");
        userMsg.setTimestamp(LocalDateTime.now());
        userMsg.setGuestSession(session);
        session.getConversations().add(userMsg);

        // Create and save AI message
        Conversation aiMsg = new Conversation();
        aiMsg.setMessage(response);
        aiMsg.setSender("AI");
        aiMsg.setTimestamp(LocalDateTime.now().plusSeconds(1));
        aiMsg.setGuestSession(session);
        session.getConversations().add(aiMsg);

        guestSessionRepository.save(session);
        return response;
    }

    @Transactional
    public void saveEmail(String sessionId, String email) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        session.setEmail(email);
        guestSessionRepository.save(session);
    }

    @Scheduled(fixedRate = 3600000) // Run every hour
    @Transactional
    public void cleanupExpiredSessions() {
        LocalDateTime cutoff = LocalDateTime.now().minus(24, ChronoUnit.HOURS);
        guestSessionRepository.deleteExpiredSessions(cutoff);
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