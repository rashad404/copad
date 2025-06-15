package com.drcopad.copad.repository.responses;

import com.drcopad.copad.entity.responses.BatchFileUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatchFileUploadRepository extends JpaRepository<BatchFileUpload, Long> {
    
    Optional<BatchFileUpload> findByBatchId(String batchId);
    
    List<BatchFileUpload> findByChatId(String chatId);
    
    List<BatchFileUpload> findByConversationId(String conversationId);
    
    List<BatchFileUpload> findByUser_IdOrderByCreatedAtDesc(Long userId);
    
    List<BatchFileUpload> findByGuestSession_IdOrderByCreatedAtDesc(Long guestSessionId);
    
    List<BatchFileUpload> findByStatus(String status);
    
    @Query("SELECT b FROM BatchFileUpload b WHERE b.status IN ('pending', 'processing') " +
           "AND b.createdAt < :timeout")
    List<BatchFileUpload> findStalledUploads(@Param("timeout") java.time.LocalDateTime timeout);
    
    @Query("SELECT COUNT(b), SUM(b.totalFiles), SUM(b.processedFiles), SUM(b.failedFiles) " +
           "FROM BatchFileUpload b WHERE b.user.id = :userId")
    Object[] getUserUploadStatistics(@Param("userId") Long userId);
}