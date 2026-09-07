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
    
    /**
     * What the platform has spent since a moment, across everyone.
     *
     * The per-user and per-session totals cannot bound the bill: a session
     * costs nothing to mint, so a thousand fresh ones each stay under their own
     * limit while the total runs away.
     */
    @Query("SELECT COALESCE(SUM(u.totalCost), 0) FROM UsageMetric u WHERE u.createdAt >= :startDate")
    BigDecimal getTotalCostSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT u.model, COUNT(u), SUM(u.totalTokens), SUM(u.totalCost) FROM UsageMetric u " +
           "WHERE u.createdAt >= :startDate GROUP BY u.model")
    List<Object[]> getUsageStatsByModel(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT DATE(u.createdAt), SUM(u.totalTokens), SUM(u.totalCost) FROM UsageMetric u " +
           "WHERE u.createdAt >= :startDate GROUP BY DATE(u.createdAt)")
    List<Object[]> getDailyUsageStats(@Param("startDate") LocalDateTime startDate);

    /** Per day, with the call count the dashboard needs, oldest first. */
    @Query("SELECT DATE(u.createdAt), COUNT(u), COALESCE(SUM(u.totalTokens), 0), " +
           "COALESCE(SUM(u.totalCost), 0) FROM UsageMetric u " +
           "WHERE u.createdAt >= :startDate GROUP BY DATE(u.createdAt) ORDER BY DATE(u.createdAt)")
    List<Object[]> getDailyUsage(@Param("startDate") LocalDateTime startDate);

    /** Per model, over the same window. */
    @Query("SELECT u.model, COUNT(u), COALESCE(SUM(u.totalTokens), 0), " +
           "COALESCE(SUM(u.totalCost), 0) FROM UsageMetric u " +
           "WHERE u.createdAt >= :startDate GROUP BY u.model ORDER BY SUM(u.totalCost) DESC")
    List<Object[]> getUsageByModel(@Param("startDate") LocalDateTime startDate);

    /**
     * Totals over the window.
     *
     * Returned as a list because a single-row aggregate arrives wrapped, and
     * the wrapping differs by provider - taking the first row is unambiguous.
     */
    @Query("SELECT COUNT(u), COALESCE(SUM(u.totalTokens), 0), COALESCE(SUM(u.totalCost), 0) " +
           "FROM UsageMetric u WHERE u.createdAt >= :startDate")
    List<Object[]> getTotalsSince(@Param("startDate") LocalDateTime startDate);
}