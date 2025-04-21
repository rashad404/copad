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
import java.util.stream.Collectors;

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
        
        return mapToDTO(session);
    }

    @Transactional
    public GuestSessionDTO getSession(String sessionId) {
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
    public String processChat(String sessionId, String message, String specialty, String language, String chatId) {
        log.info("Processing chat message for session: {} - Chat: {} - Message: {} - Specialty: {} - Language: {}", 
                sessionId, chatId, message, specialty, language);
        
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> {
                    log.warn("Guest session not found for chat: {}", sessionId);
                    return new RuntimeException("Session not found");
                });

        log.info("Found session for chat, updating last active timestamp");
        session.setLastActive(LocalDateTime.now());

        // Get conversation history for this specific chat
        List<Conversation> chatHistory = session.getConversations().stream()
                .filter(conv -> conv.getChatId().equals(chatId))
                .collect(Collectors.toList());

        // Get AI response with specialty and language
        String response = chatGPTService.getChatResponse(message, chatHistory, specialty, language);

        // Create and save user message
        Conversation userMsg = new Conversation();
        userMsg.setMessage(message);
        userMsg.setSender("USER");
        userMsg.setTimestamp(LocalDateTime.now());
        userMsg.setGuestSession(session);
        userMsg.setChatId(chatId);

        // If this is the first message in the chat, set it as the title
        if (chatHistory.isEmpty()) {
            String title = message.length() > 50 ? message.substring(0, 47) + "..." : message;
            userMsg.setTitle(title);
        } else {
            userMsg.setTitle(chatHistory.get(0).getTitle());
        }

        session.getConversations().add(userMsg);

        // Create and save AI message
        Conversation aiMsg = new Conversation();
        aiMsg.setMessage(response);
        aiMsg.setSender("AI");
        aiMsg.setTimestamp(LocalDateTime.now().plusSeconds(1));
        aiMsg.setGuestSession(session);
        aiMsg.setChatId(chatId);
        aiMsg.setTitle(userMsg.getTitle()); // Use the same title as the user message
        session.getConversations().add(aiMsg);

        guestSessionRepository.save(session);
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
        LocalDateTime cutoff = LocalDateTime.now().minus(48, ChronoUnit.HOURS);
        log.info("Cleaning up expired guest sessions before: {}", cutoff);
        
        guestSessionRepository.deleteExpiredSessions(cutoff);
        
        List<GuestSession> remainingSessions = guestSessionRepository.findAll();
        log.info("Total sessions after cleanup: {}", remainingSessions.size());
    }

    private GuestSessionDTO mapToDTO(GuestSession session) {
        return GuestSessionDTO.builder()
                .sessionId(session.getSessionId())
                .createdAt(session.getCreatedAt())
                .lastActive(session.getLastActive())
                .conversations(session.getConversations().stream()
                        .map(conv -> ConversationDTO.builder()
                                .message(conv.getMessage())
                                .sender(conv.getSender())
                                .timestamp(conv.getTimestamp())
                                .chatId(conv.getChatId())
                                .title(conv.getTitle())
                                .build())
                        .toList())
                .email(session.getEmail())
                .build();
    }

    public List<Conversation> getConversationHistory(String sessionId, String chatId) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        return session.getConversations().stream()
                .filter(conv -> conv.getChatId().equals(chatId))
                .collect(Collectors.toList());
    }

    public void updateLastActive(String sessionId) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        session.setLastActive(LocalDateTime.now());
        guestSessionRepository.save(session);
    }

    @Transactional
    public void createChat(String sessionId, String title) {
        log.info("Creating new chat for session: {} with title: {}", sessionId, title);
        
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> {
                    log.warn("Guest session not found for chat creation: {}", sessionId);
                    return new RuntimeException("Session not found");
                });

        // Create a new chat with the given title
        Conversation chat = new Conversation();
        chat.setGuestSession(session);
        chat.setChatId(UUID.randomUUID().toString());
        chat.setSender("SYSTEM");
        chat.setMessage("Chat created: " + title);
        chat.setTimestamp(LocalDateTime.now());
        chat.setTitle(title);
        
        session.getConversations().add(chat);
        guestSessionRepository.save(session);
        
        log.info("Successfully created new chat for session: {}", sessionId);
    }
} 