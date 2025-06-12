package com.drcopad.copad.service;

import com.drcopad.copad.dto.ChatDTO;
import com.drcopad.copad.dto.FileAttachmentDTO;
import com.drcopad.copad.dto.MessageDTO;
import com.drcopad.copad.dto.GuestSessionDTO;
import com.drcopad.copad.entity.Chat;
import com.drcopad.copad.entity.ChatMessage;
import com.drcopad.copad.entity.FileAttachment;
import com.drcopad.copad.entity.GuestSession;
import com.drcopad.copad.repository.ChatRepository;
import com.drcopad.copad.repository.MessageRepository;
import com.drcopad.copad.repository.GuestSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
    private final MessageRepository MessageRepository;
    private final ChatRepository chatRepository;
    private final ChatGPTService chatGPTService;
    private final FileAttachmentService fileAttachmentService;
    
    @Value("${app.chatgpt.base-url:http://localhost:8080}")
    private String baseUrl;

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
    public String processChat(String sessionId, String message, String specialty, String language, String chatId, List<String> fileIds) {
        log.info("Processing chat message for session: {} - Chat: {} - Message: {} - Specialty: {} - Language: {} - FileIds: {}", 
                sessionId, chatId, message, specialty, language, fileIds);
        
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
                    newChat.setGuestSession(session);
                    return chatRepository.save(newChat);
                });
        
        // Update the chat's updatedAt timestamp
        chat.setUpdatedAt(LocalDateTime.now());
        chatRepository.save(chat);

        // Get message history for this specific chat
        List<ChatMessage> chatHistory = MessageRepository.findByChatOrderByTimestampAsc(chat);
        
        // Create and save user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setMessage(message);
        userMsg.setSender("USER");
        userMsg.setTimestamp(LocalDateTime.now());
        userMsg.setGuestSession(session);
        userMsg.setChat(chat);
        
        // Save message first to get the ID
        ChatMessage savedUserMsg = MessageRepository.save(userMsg);
        
        // Process file attachments if any
        List<FileAttachment> attachments = new ArrayList<>();
        if (fileIds != null && !fileIds.isEmpty()) {
            attachments = fileAttachmentService.linkFilesToMessage(fileIds, savedUserMsg);
            // Append file context to the message if needed
            message = processAttachments(message, fileIds, savedUserMsg);
        }

        // Get AI response with specialty and language
        String response = chatGPTService.getChatResponse(message, chatHistory, specialty, language, attachments);

        // Create and save AI message
        ChatMessage aiMsg = new ChatMessage();
        aiMsg.setMessage(response);
        aiMsg.setSender("AI");
        aiMsg.setTimestamp(LocalDateTime.now().plusSeconds(1));
        aiMsg.setGuestSession(session);
        aiMsg.setChat(chat);
        MessageRepository.save(aiMsg);

        // If this is the first message in the chat, set it as the title
        if (chatHistory.isEmpty() && chat.getTitle() == null) {
            String title = message.length() > 50 ? message.substring(0, 47) + "..." : message;
            chat.setTitle(title);
            chatRepository.save(chat);
        }

        return response;
    }
    
    private String processAttachments(String message, List<String> fileIds, ChatMessage userMsg) {
        // This method would enhance the message with content from the files
        // For example, for images we might want to tell the AI "User uploaded an image"
        // For documents, we might want to extract text and include it
        
        StringBuilder enhancedMessage = new StringBuilder(message);
        
        // If the message doesn't already mention files, add a note
        if (!message.toLowerCase().contains("file") && 
            !message.toLowerCase().contains("image") && 
            !message.toLowerCase().contains("document") && 
            !message.toLowerCase().contains("photo") && 
            !message.toLowerCase().contains("picture")) {
            
            enhancedMessage.append("\n\n[User attached ");
            enhancedMessage.append(fileIds.size() == 1 ? "a file" : fileIds.size() + " files");
            enhancedMessage.append(" with this message]");
        }
        
        // In a more advanced implementation, we would extract text from documents
        // and add it to the message, or use OCR for images
        
        return enhancedMessage.toString();
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
                    List<ChatMessage> messages = MessageRepository.findByChatOrderByTimestampAsc(chat);
                    
                    // Get last message for display in sidebar
                    String lastMessageText = null;
                    if (!messages.isEmpty()) {
                        ChatMessage lastMsg = messages.get(messages.size() - 1);
                        if ("AI".equals(lastMsg.getSender())) {
                            lastMessageText = lastMsg.getMessage();
                        }
                    }
                    
                    List<MessageDTO> messagesDTOs = messages.stream()
                            .map(msg -> {
                                // Convert file attachments to DTOs
                                List<FileAttachmentDTO> attachmentDTOs = msg.getAttachments().stream()
                                        .map(attachment -> {
                                            boolean isImage = attachment.getFileType().startsWith("image/");
                                            return new FileAttachmentDTO(
                                                    attachment.getFileId(),
                                                    baseUrl + "/" + attachment.getFilePath(),
                                                    attachment.getOriginalFilename(),
                                                    attachment.getFileType(),
                                                    attachment.getFileSize(),
                                                    attachment.getUploadedAt(),
                                                    null,
                                                    isImage
                                            );
                                        })
                                        .collect(Collectors.toList());
                                
                                MessageDTO messageDTO = new MessageDTO(msg.getMessage(), msg.getSender(), msg.getTimestamp());
                                messageDTO.setAttachments(attachmentDTOs);
                                return messageDTO;
                            })
                            .collect(Collectors.toList());
                    
                    return ChatDTO.builder()
                            .id(chat.getChatId())
                            .title(chat.getTitle())
                            .messages(messagesDTOs)
                            .timestamp(chat.getUpdatedAt())
                            .lastMessage(lastMessageText)
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

    public List<ChatMessage> getMessageHistory(String sessionId, String chatId) {
        GuestSession session = guestSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        
        Optional<Chat> chat = chatRepository.findByChatId(chatId);
        if (chat.isEmpty()) {
            return new ArrayList<>();
        }
        
        return MessageRepository.findByChatOrderByTimestampAsc(chat.get());
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