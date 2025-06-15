package com.drcopad.copad.entity.responses;

import com.drcopad.copad.entity.Chat;
import com.drcopad.copad.entity.GuestSession;
import com.drcopad.copad.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "batch_file_uploads", indexes = {
    @Index(name = "idx_batch_id", columnList = "batchId"),
    @Index(name = "idx_conversation_id", columnList = "conversationId"),
    @Index(name = "idx_chat_id", columnList = "chatId"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchFileUpload {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String batchId;
    
    @Column(name = "conversation_id")
    private String conversationId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", referencedColumnName = "conversationId", 
                insertable = false, updatable = false)
    private Conversation conversation;
    
    @Column(name = "chat_id")
    private String chatId;
    
    // Note: No direct relationship to Chat due to non-unique chatId
    // Use chatId string reference instead
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_session_id")
    private GuestSession guestSession;
    
    @Column(name = "total_files", nullable = false)
    @Builder.Default
    private Integer totalFiles = 0;
    
    @Column(name = "processed_files", nullable = false)
    @Builder.Default
    private Integer processedFiles = 0;
    
    @Column(name = "failed_files", nullable = false)
    @Builder.Default
    private Integer failedFiles = 0;
    
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "pending";
    
    @Column(length = 50)
    private String category;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "LONGTEXT")
    private Map<String, Object> metadata;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @PrePersist
    public void prePersist() {
        if (batchId == null) {
            batchId = "batch_" + UUID.randomUUID().toString();
        }
    }
    
    public void incrementProcessed() {
        this.processedFiles++;
        checkCompletion();
    }
    
    public void incrementFailed() {
        this.failedFiles++;
        checkCompletion();
    }
    
    private void checkCompletion() {
        if (processedFiles + failedFiles >= totalFiles) {
            this.status = failedFiles > 0 ? "partial" : "completed";
            this.completedAt = LocalDateTime.now();
        } else {
            this.status = "processing";
        }
    }
    
    public double getProgressPercentage() {
        if (totalFiles == 0) return 0;
        return ((double) (processedFiles + failedFiles) / totalFiles) * 100;
    }
}