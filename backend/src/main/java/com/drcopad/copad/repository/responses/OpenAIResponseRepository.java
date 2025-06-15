package com.drcopad.copad.repository.responses;

import com.drcopad.copad.entity.responses.OpenAIResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OpenAIResponseRepository extends JpaRepository<OpenAIResponse, Long> {
    
    Optional<OpenAIResponse> findByResponseId(String responseId);
    
    List<OpenAIResponse> findByConversationIdOrderByCreatedAt(String conversationId);
    
    Optional<OpenAIResponse> findTopByConversationIdOrderByCreatedAtDesc(String conversationId);
    
    @Query("SELECT r FROM OpenAIResponse r WHERE r.chatMessage.id = :messageId")
    Optional<OpenAIResponse> findByChatMessageId(@Param("messageId") Long messageId);
    
    @Query("SELECT AVG(r.responseTimeMs) FROM OpenAIResponse r WHERE r.conversationId = :conversationId")
    Double getAverageResponseTime(@Param("conversationId") String conversationId);
    
    @Query("SELECT SUM(r.totalTokens) FROM OpenAIResponse r WHERE r.conversationId = :conversationId")
    Long getTotalTokensForConversation(@Param("conversationId") String conversationId);
}