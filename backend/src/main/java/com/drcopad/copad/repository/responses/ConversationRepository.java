package com.drcopad.copad.repository.responses;

import com.drcopad.copad.entity.responses.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    Optional<Conversation> findByConversationId(String conversationId);
    
    Optional<Conversation> findByChatIdAndStatus(String chatId, String status);
    
    List<Conversation> findByUser_IdAndStatus(Long userId, String status);
    
    List<Conversation> findByGuestSession_IdAndStatus(Long guestSessionId, String status);
    
    @Query("SELECT c FROM Conversation c WHERE c.expiresAt < :now AND c.status = 'active'")
    List<Conversation> findExpiredConversations(@Param("now") LocalDateTime now);
    
    @Modifying
    @Query("UPDATE Conversation c SET c.status = 'expired' WHERE c.expiresAt < :now AND c.status = 'active'")
    int expireOldConversations(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(c) FROM Conversation c WHERE c.createdAt >= :startDate AND c.createdAt < :endDate")
    long countConversationsInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT c FROM Conversation c WHERE c.chatId = :chatId ORDER BY c.createdAt DESC")
    List<Conversation> findByChatIdOrderByCreatedAtDesc(@Param("chatId") String chatId);
}