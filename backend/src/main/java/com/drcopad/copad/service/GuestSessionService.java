package com.drcopad.copad.service;

import com.drcopad.copad.dto.ChatDTO;
import com.drcopad.copad.dto.ConversationDTO;
import com.drcopad.copad.dto.GuestSessionDTO;
import com.drcopad.copad.entity.Chat;
import com.drcopad.copad.entity.Conversation;
import com.drcopad.copad.entity.GuestSession;
import com.drcopad.copad.repository.ChatRepository;
import com.drcopad.copad.repository.ConversationRepository;
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
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GuestSessionService {

    private final GuestSessionRepository guestSessionRepository;
    private final ConversationRepository conversationRepository;
    private final ChatRepository chatRepository;
    private final ChatGPTService chatGPTService;

    @Transactional
    public GuestSessionDTO createSession(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        log.info("Creating new guest session for IP: {}", ipAddress);
        
        GuestSession session = GuestSession.builder()
                .ipAddress(ipAddress)
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
        
        // Find the chat or create it if it doesn't exist
        Chat chat = chatRepository.findByChatId(chatId)
                .orElseGet(() -> {
                    Chat newChat = new Chat();
                    newChat.setChatId(chatId);
                    newChat.setTitle("New Chat");
                    newChat.setGuestSession(session);
                    return chatRepository.save(newChat);
                });
        
        // Update the chat's updatedAt timestamp
        chat.setUpdatedAt(LocalDateTime.now());
        chatRepository.save(chat);

        // Get conversation history for this specific chat
        List<Conversation> chatHistory = conversationRepository.findByChatOrderByTimestampAsc(chat);

        // Get AI response with specialty and language
        String response = chatGPTService.getChatResponse(message, chatHistory, specialty, language);

        // Create and save user message
        Conversation userMsg = new Conversation();
        userMsg.setMessage(message);
        userMsg.setSender("USER");
        userMsg.setTimestamp(LocalDateTime.now());
        userMsg.setGuestSession(session);
        userMsg.setChat(chat);
        conversationRepository.save(userMsg);

        // Create and save AI message
        Conversation aiMsg = new Conversation();
        aiMsg.setMessage(response);
        aiMsg.setSender("AI");
        aiMsg.setTimestamp(LocalDateTime.now().plusSeconds(1));
        aiMsg.setGuestSession(session);
        aiMsg.setChat(chat);
        conversationRepository.save(aiMsg);

        // If this is the first message in the chat, set it as the title
        if (chatHistory.isEmpty() && chat.getTitle().equals("New Chat")) {
            String title = message.length() > 50 ? message.substring(0, 47) + "..." : message;
            chat.setTitle(title);
            chatRepository.save(chat);
        }

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
        // Get all chats for this session
        List<Chat> chats = chatRepository.findByGuestSessionOrderByUpdatedAtDesc(session);
        
        List<ChatDTO> chatDTOs = chats.stream()
                .map(chat -> {
                    List<Conversation> messages = conversationRepository.findByChatOrderByTimestampAsc(chat);
                    
                    // Get last message for display in sidebar
                    String lastMessage = null;
                    if (!messages.isEmpty()) {
                        Conversation lastConversation = messages.get(messages.size() - 1);
                        if ("AI".equals(lastConversation.getSender())) {
                            lastMessage = lastConversation.getMessage();
                        }
                    }
                    
                    List<ConversationDTO> messagesDTOs = messages.stream()
                            .map(msg -> ConversationDTO.builder()
                                    .message(msg.getMessage())
                                    .sender(msg.getSender())
                                    .timestamp(msg.getTimestamp())
                                    .build())
                            .collect(Collectors.toList());
                    
                    return ChatDTO.builder()
                            .id(chat.getChatId())
                            .title(chat.getTitle())
                            .messages(messagesDTOs)
                            .timestamp(chat.getUpdatedAt())
                            .lastMessage(lastMessage)
                            .build();
                })
                .collect(Collectors.toList());

        return GuestSessionDTO.builder()
                .sessionId(session.getSessionId())
                .createdAt(session.getCreatedAt())
                .lastActive(session.getLastActive())
                .chats(chatDTOs)
                .email(session.getEmail())
                .build();
    }

    public List<Conversation> getConversationHistory(String sessionId, String chatId) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        
        Optional<Chat> chat = chatRepository.findByChatId(chatId);
        if (chat.isEmpty()) {
            return new ArrayList<>();
        }
        
        return conversationRepository.findByChatOrderByTimestampAsc(chat.get());
    }

    public void updateLastActive(String sessionId) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        session.setLastActive(LocalDateTime.now());
        guestSessionRepository.save(session);
    }

    @Transactional
    public Map<String, String> createChat(String sessionId, String title) {
        log.info("Creating new chat for session: {} with title: {}", sessionId, title);
        
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> {
                    log.warn("Guest session not found for chat creation: {}", sessionId);
                    return new RuntimeException("Session not found");
                });

        // Create a new chat
        Chat chat = new Chat();
        chat.setChatId(UUID.randomUUID().toString());
        chat.setTitle(title);
        chat.setGuestSession(session);
        
        Chat savedChat = chatRepository.save(chat);
        
        log.info("Successfully created new chat with ID: {} for session: {}", chat.getChatId(), sessionId);
        
        // Return the chat ID so the frontend can use it
        Map<String, String> response = new HashMap<>();
        response.put("chatId", chat.getChatId());
        
        return response;
    }
    
    @Transactional
    public void updateChatTitle(String sessionId, String chatId, String title) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
                
        Chat chat = chatRepository.findByChatId(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));
                
        if (!chat.getGuestSession().getSessionId().equals(sessionId)) {
            throw new RuntimeException("Chat does not belong to this session");
        }
        
        chat.setTitle(title);
        chatRepository.save(chat);
    }
    
    @Transactional
    public void deleteChat(String sessionId, String chatId) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
                
        List<Chat> chats = chatRepository.findByGuestSessionAndChatId(session, chatId);
        if (chats.isEmpty()) {
            throw new RuntimeException("Chat not found");
        }
        
        chatRepository.deleteAll(chats);
    }
}