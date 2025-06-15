package com.drcopad.copad.repository.responses;

import com.drcopad.copad.entity.responses.UsageMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UsageMetricRepository extends JpaRepository<UsageMetric, Long> {
    
    List<UsageMetric> findByConversationId(String conversationId);
    
    List<UsageMetric> findByUser_IdAndCreatedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
    
    List<UsageMetric> findByGuestSession_IdAndCreatedAtBetween(Long guestSessionId, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT SUM(u.totalTokens) FROM UsageMetric u WHERE u.user.id = :userId AND u.createdAt >= :startDate")
    Long getTotalTokensForUser(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(u.totalCost) FROM UsageMetric u WHERE u.user.id = :userId AND u.createdAt >= :startDate")
    BigDecimal getTotalCostForUser(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(u.totalTokens) FROM UsageMetric u WHERE u.guestSession.id = :sessionId AND u.createdAt >= :startDate")
    Long getTotalTokensForGuest(@Param("sessionId") Long sessionId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT u.model, COUNT(u), SUM(u.totalTokens), SUM(u.totalCost) FROM UsageMetric u " +
           "WHERE u.createdAt >= :startDate GROUP BY u.model")
    List<Object[]> getUsageStatsByModel(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT DATE(u.createdAt), SUM(u.totalTokens), SUM(u.totalCost) FROM UsageMetric u " +
           "WHERE u.createdAt >= :startDate GROUP BY DATE(u.createdAt)")
    List<Object[]> getDailyUsageStats(@Param("startDate") LocalDateTime startDate);
}