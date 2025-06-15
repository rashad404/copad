package com.drcopad.copad.service;

import com.drcopad.copad.config.OpenAIResponsesConfig;
import com.drcopad.copad.entity.Chat;
import com.drcopad.copad.entity.GuestSession;
import com.drcopad.copad.entity.User;
import com.drcopad.copad.entity.responses.Conversation;
import com.drcopad.copad.entity.responses.OpenAIResponse;
import com.drcopad.copad.entity.responses.UsageMetric;
import com.drcopad.copad.repository.ChatRepository;
import com.drcopad.copad.repository.responses.ConversationRepository;
import com.drcopad.copad.repository.responses.OpenAIResponseRepository;
import com.drcopad.copad.repository.responses.UsageMetricRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@Transactional
public class ConversationManager {
    
    private final ConversationRepository conversationRepository;
    private final OpenAIResponseRepository responseRepository;
    private final UsageMetricRepository usageMetricRepository;
    private final ChatRepository chatRepository;
    private final OpenAIResponsesConfig responsesConfig;
    
    public ConversationManager(ConversationRepository conversationRepository,
                              OpenAIResponseRepository responseRepository,
                              UsageMetricRepository usageMetricRepository,
                              ChatRepository chatRepository,
                              @Qualifier("openAIResponsesConfig") OpenAIResponsesConfig responsesConfig) {
        this.conversationRepository = conversationRepository;
        this.responseRepository = responseRepository;
        this.usageMetricRepository = usageMetricRepository;
        this.chatRepository = chatRepository;
        this.responsesConfig = responsesConfig;
    }
    
    /**
     * Get or create an active conversation for a chat
     */
    public Conversation getOrCreateConversation(String chatId, User user, GuestSession guestSession, 
                                               String specialtyCode, String language) {
        // First check if there's an active conversation for this chat
        Optional<Conversation> existingConversation = conversationRepository
                .findByChatIdAndStatus(chatId, "active");
        
        if (existingConversation.isPresent()) {
            Conversation conversation = existingConversation.get();
            // Update specialty or language if changed
            if (!conversation.getSpecialtyCode().equals(specialtyCode) || 
                !conversation.getLanguage().equals(language)) {
                conversation.setSpecialtyCode(specialtyCode);
                conversation.setLanguage(language);
                return conversationRepository.save(conversation);
            }
            return conversation;
        }
        
        // Create new conversation
        Chat chat = chatRepository.findByChatId(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found: " + chatId));
        
        Conversation conversation = Conversation.builder()
                .conversationId("conv_" + UUID.randomUUID().toString())
                .chatId(chatId)
                .user(user)
                .guestSession(guestSession)
                .model(responsesConfig.getDefaultModel())
                .specialtyCode(specialtyCode)
                .language(language)
                .status("active")
                .expiresAt(LocalDateTime.now().plusDays(responsesConfig.getConversationTtlDays()))
                .build();
        
        Conversation savedConversation = conversationRepository.saveAndFlush(conversation);
        log.info("Created new conversation with ID: {}", savedConversation.getConversationId());
        return savedConversation;
    }
    
    /**
     * Update conversation with latest response ID
     */
    public void updateConversationResponse(String conversationId, String responseId) {
        conversationRepository.findByConversationId(conversationId)
                .ifPresent(conversation -> {
                    conversation.setLastOpenaiResponseId(responseId);
                    conversationRepository.save(conversation);
                });
    }
    
    /**
     * Get the last response ID for a conversation (for chaining)
     */
    public Optional<String> getLastResponseId(String conversationId) {
        return conversationRepository.findByConversationId(conversationId)
                .map(Conversation::getLastOpenaiResponseId);
    }
    
    /**
     * Record a new OpenAI response
     */
    public OpenAIResponse recordResponse(OpenAIResponse response) {
        log.info("About to save OpenAIResponse with responseId: {}", response.getResponseId());
        log.debug("OpenAIResponse details - conversationId: {}, chatMessageId: {}", 
            response.getConversationId(), 
            response.getChatMessage() != null ? response.getChatMessage().getId() : "null");
        
        try {
            OpenAIResponse saved = responseRepository.save(response);
            log.info("Saved OpenAIResponse with responseId: {}", saved.getResponseId());
            
            updateConversationResponse(response.getConversationId(), response.getResponseId());
            log.info("Updated conversation with latest response ID");
            
            return saved;
        } catch (Exception e) {
            log.error("Error saving OpenAIResponse", e);
            throw e;
        }
    }
    
    /**
     * Record usage metrics for a conversation
     */
    public UsageMetric recordUsage(UsageMetric metric) {
        return usageMetricRepository.save(metric);
    }
    
    /**
     * Get conversation history for debugging/analysis
     */
    public List<OpenAIResponse> getConversationHistory(String conversationId) {
        return responseRepository.findByConversationIdOrderByCreatedAt(conversationId);
    }
    
    /**
     * Check if a conversation is expired
     */
    public boolean isConversationExpired(String conversationId) {
        return conversationRepository.findByConversationId(conversationId)
                .map(Conversation::isExpired)
                .orElse(true);
    }
    
    /**
     * Expire a conversation manually
     */
    public void expireConversation(String conversationId) {
        conversationRepository.findByConversationId(conversationId)
                .ifPresent(conversation -> {
                    conversation.expire();
                    conversationRepository.save(conversation);
                });
    }
    
    /**
     * Get active conversations for a user
     */
    public List<Conversation> getActiveConversationsForUser(Long userId) {
        return conversationRepository.findByUser_IdAndStatus(userId, "active");
    }
    
    /**
     * Get active conversations for a guest session
     */
    public List<Conversation> getActiveConversationsForGuest(Long guestSessionId) {
        return conversationRepository.findByGuestSession_IdAndStatus(guestSessionId, "active");
    }
    
    /**
     * Scheduled task to clean up expired conversations
     */
    @Scheduled(cron = "0 0 2 * * ?") // Run at 2 AM daily
    public void cleanupExpiredConversations() {
        log.info("Starting conversation cleanup task");
        int expiredCount = conversationRepository.expireOldConversations(LocalDateTime.now());
        log.info("Expired {} conversations", expiredCount);
    }
    
    /**
     * Get total token usage for a conversation
     */
    public Long getTotalTokensForConversation(String conversationId) {
        return responseRepository.getTotalTokensForConversation(conversationId);
    }
    
    /**
     * Get conversation statistics
     */
    public ConversationStats getConversationStats(String conversationId) {
        List<OpenAIResponse> responses = getConversationHistory(conversationId);
        List<UsageMetric> metrics = usageMetricRepository.findByConversationId(conversationId);
        
        long totalTokens = responses.stream()
                .mapToLong(r -> r.getTotalTokens() != null ? r.getTotalTokens() : 0)
                .sum();
        
        double totalCost = metrics.stream()
                .mapToDouble(m -> m.getTotalCost() != null ? m.getTotalCost().doubleValue() : 0)
                .sum();
        
        Double avgResponseTime = responseRepository.getAverageResponseTime(conversationId);
        
        return ConversationStats.builder()
                .conversationId(conversationId)
                .messageCount(responses.size())
                .totalTokens(totalTokens)
                .totalCost(totalCost)
                .averageResponseTimeMs(avgResponseTime != null ? avgResponseTime : 0)
                .build();
    }
    
    @lombok.Builder
    @lombok.Data
    public static class ConversationStats {
        private String conversationId;
        private int messageCount;
        private long totalTokens;
        private double totalCost;
        private double averageResponseTimeMs;
    }
}